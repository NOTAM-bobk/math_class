// Server-side bridge to UptimeRobot. The browser never sees the API key: set
// UPTIMEROBOT_API_KEY (a read-only key) in the deployment environment.
//
// UptimeRobot keeps monitor logs for about two months, which is enough for the
// 45-day timeline shown in Settings > Change log.

const ENDPOINT = "https://api.uptimerobot.com/v2/getMonitors";
const DAYS = 45;
const DAY_SECONDS = 86_400;
const MAX_MONITORS = 6;

const STATUS_NAMES = {
  0: "paused",
  1: "pending",
  2: "up",
  8: "down",
  9: "down",
};

function isoDay(seconds) {
  return new Date(seconds * 1000).toISOString().slice(0, 10);
}

function isoTime(seconds) {
  return new Date(seconds * 1000).toISOString();
}

function reasonName(log) {
  const detail = log && log.reason && log.reason.detail;
  if (typeof detail === "string" && detail.trim()) return detail.trim().slice(0, 120);
  const code = log && log.reason && log.reason.code;
  if (code) return `Downtime (${code})`;
  return "Downtime detected";
}

function customUptime(monitor) {
  const raw = monitor.custom_uptime_ratio;
  if (raw == null || raw === "") return null;
  const values = String(raw)
    .split("-")
    .map((value) => Number(value))
    .filter((value) => Number.isFinite(value));
  if (values.length === 0) return null;
  // The request asks for 1-7-30-45 day ratios; the last one is the longest.
  return Math.max(0, Math.min(100, values[values.length - 1]));
}

function buildDays(monitor, nowSeconds) {
  const todayStart = Math.floor(nowSeconds / DAY_SECONDS) * DAY_SECONDS;
  const firstDay = todayStart - (DAYS - 1) * DAY_SECONDS;
  const created = Number(monitor.create_datetime) || 0;

  const days = Array.from({ length: DAYS }, (_, index) => {
    const start = firstDay + index * DAY_SECONDS;
    const end = start + DAY_SECONDS;
    const available = Math.max(
      0,
      Math.min(end, nowSeconds) - Math.max(start, created)
    );
    return {
      date: isoDay(start),
      start,
      end,
      available,
      downSeconds: 0,
      events: [],
    };
  });

  const logs = Array.isArray(monitor.logs) ? [...monitor.logs] : [];
  logs
    .filter((log) => log && Number(log.type) === 1)
    .sort((a, b) => Number(a.datetime) - Number(b.datetime))
    .forEach((log) => {
      const downStart = Number(log.datetime) || 0;
      const duration = Math.max(0, Number(log.duration) || 0);
      const downEnd = duration > 0 ? downStart + duration : nowSeconds;
      if (downStart >= nowSeconds || downEnd <= firstDay) return;

      const clippedStart = Math.max(downStart, firstDay);
      const clippedEnd = Math.min(downEnd, nowSeconds);
      let cursor = clippedStart;

      while (cursor < clippedEnd) {
        const bucketStart = Math.floor(cursor / DAY_SECONDS) * DAY_SECONDS;
        const bucketEnd = bucketStart + DAY_SECONDS;
        const segmentEnd = Math.min(clippedEnd, bucketEnd);
        const index = Math.floor((bucketStart - firstDay) / DAY_SECONDS);
        const day = days[index];
        if (day && segmentEnd > cursor) {
          day.downSeconds += segmentEnd - cursor;
          day.events.push({
            id: `${monitor.id}-${log.datetime}-${index}`,
            name: reasonName(log),
            from: isoTime(cursor),
            to: isoTime(segmentEnd),
            seconds: segmentEnd - cursor,
          });
        }
        cursor = segmentEnd;
      }
    });

  let totalAvailable = 0;
  let totalDown = 0;
  const result = days.map((day) => {
    if (day.available <= 0) {
      return { date: day.date, uptime: null, downSeconds: 0, events: [] };
    }
    totalAvailable += day.available;
    totalDown += day.downSeconds;
    const uptime = Math.max(
      0,
      Math.min(100, 100 * (1 - day.downSeconds / day.available))
    );
    return {
      date: day.date,
      uptime: Math.round(uptime * 100) / 100,
      downSeconds: Math.round(day.downSeconds),
      events: day.events,
    };
  });

  return {
    days: result,
    fallbackUptime:
      totalAvailable > 0
        ? Math.max(0, Math.min(100, 100 * (1 - totalDown / totalAvailable)))
        : null,
  };
}

function buildMonitor(monitor, nowSeconds) {
  const { days, fallbackUptime } = buildDays(monitor, nowSeconds);
  let uptime = customUptime(monitor);

  if (uptime == null) uptime = fallbackUptime;

  return {
    id: String(monitor.id),
    name: monitor.friendly_name || "Monitored site",
    status: STATUS_NAMES[Number(monitor.status)] || "pending",
    uptime: uptime == null ? null : Math.round(uptime * 100) / 100,
    days,
  };
}

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ ok: false, error: "Use GET for uptime data." });
  }

  const key = process.env.UPTIMEROBOT_API_KEY;
  if (!key) {
    // A missing key is a setup state, not an outage. The client shows how to
    // connect UptimeRobot instead of an error.
    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json({ ok: true, configured: false, days: DAYS, monitors: [] });
  }

  const nowSeconds = Math.floor(Date.now() / 1000);
  const body = new URLSearchParams({
    api_key: key,
    format: "json",
    logs: "1",
    log_types: "1-2",
    logs_start_date: String(nowSeconds - DAYS * DAY_SECONDS),
    logs_end_date: String(nowSeconds),
    logs_limit: "1000",
    custom_uptime_ratios: "1-7-30-45",
    response_times: "0",
  });

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const upstream = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
        "User-Agent": "polytrack-hub-uptime/1.0",
      },
      body: body.toString(),
      signal: controller.signal,
    });

    const payload = await upstream.json().catch(() => null);

    if (!upstream.ok || !payload || payload.stat !== "ok") {
      const message =
        (payload && payload.error && payload.error.message) ||
        `UptimeRobot request failed (${upstream.status}).`;
      res.setHeader("Cache-Control", "no-store");
      return res.status(502).json({ ok: false, configured: true, error: message });
    }

    const monitors = (Array.isArray(payload.monitors) ? payload.monitors : [])
      .slice(0, MAX_MONITORS)
      .map((monitor) => buildMonitor(monitor, nowSeconds));

    res.setHeader(
      "Cache-Control",
      "public, max-age=0, s-maxage=60, stale-while-revalidate=300"
    );
    return res.status(200).json({
      ok: true,
      configured: true,
      days: DAYS,
      updatedAt: new Date(nowSeconds * 1000).toISOString(),
      monitors,
    });
  } catch (error) {
    res.setHeader("Cache-Control", "no-store");
    return res.status(502).json({
      ok: false,
      configured: true,
      error:
        error && error.name === "AbortError"
          ? "UptimeRobot took too long to respond."
          : "UptimeRobot could not be reached.",
    });
  } finally {
    clearTimeout(timeout);
  }
};

module.exports.buildMonitor = buildMonitor;
module.exports.buildDays = buildDays;
