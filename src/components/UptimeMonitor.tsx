import * as React from "react";
import { Activity, AlertTriangle, ExternalLink, Link2, RefreshCw, ShieldCheck } from "lucide-react";

// The live timeline is rendered from /api/uptime, which talks to UptimeRobot
// server-side so the API key never reaches the browser.
const INTEGRATIONS_URL = "https://dashboard.uptimerobot.com/integrations";

type MonitorStatus = "up" | "down" | "paused" | "pending";

interface UptimeEvent {
  id: string;
  name: string;
  from: string;
  to: string;
  seconds: number;
}

interface UptimeDay {
  date: string;
  uptime: number | null;
  downSeconds: number;
  events: UptimeEvent[];
}

interface UptimeMonitor {
  id: string;
  name: string;
  status: MonitorStatus;
  uptime: number | null;
  days: UptimeDay[];
}

interface UptimePayload {
  ok?: boolean;
  configured?: boolean;
  days?: number;
  updatedAt?: string;
  monitors?: UptimeMonitor[];
  error?: string;
}

const STATUS_META: Record<MonitorStatus, { label: string; dot: string; text: string }> = {
  up: { label: "Operational", dot: "#22c55e", text: "text-emerald-300" },
  down: { label: "Down", dot: "#ef4444", text: "text-red-300" },
  paused: { label: "Paused", dot: "#a1a1aa", text: "text-zinc-300" },
  pending: { label: "Pending", dot: "#eab308", text: "text-amber-300" },
};

const PANEL_STYLE: React.CSSProperties = {
  borderRadius: 14,
  background: "rgba(0, 0, 0, 0.3)",
  boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.04)",
};

function dayLabel(iso: string, long = false) {
  const date = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    ...(long ? { year: "numeric" as const } : {}),
    timeZone: "UTC",
  });
}

function timeLabel(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
}

function formatDuration(seconds: number) {
  if (!Number.isFinite(seconds) || seconds <= 0) return "0m";
  if (seconds < 60) return `${Math.max(1, Math.round(seconds))}s`;
  const totalMinutes = Math.round(seconds / 60);
  if (totalMinutes < 60) return `${totalMinutes}m`;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours < 24) return minutes ? `${hours}h ${minutes}m` : `${hours}h`;
  const days = Math.floor(hours / 24);
  const rest = hours % 24;
  return rest ? `${days}d ${rest}h` : `${days}d`;
}

function uptimeLabel(value: number | null) {
  return value == null ? "—" : `${value.toFixed(2)}%`;
}

function dayColor(day: UptimeDay) {
  if (day.uptime == null) return "rgba(255, 255, 255, 0.09)";
  if (day.uptime >= 99.9) return "#22c55e";
  if (day.uptime >= 99) return "#eab308";
  return "#ef4444";
}

function uptimeTone(value: number | null) {
  if (value == null) return "text-zinc-400";
  if (value >= 99.9) return "text-emerald-300";
  if (value >= 99) return "text-amber-300";
  return "text-red-300";
}

function useUptime() {
  const [state, setState] = React.useState<{
    status: "loading" | "ready" | "error";
    data?: UptimePayload;
    message?: string;
  }>({ status: "loading" });
  const [reloadKey, setReloadKey] = React.useState(0);

  React.useEffect(() => {
    const controller = new AbortController();
    let active = true;
    setState({ status: "loading" });

    fetch("/api/uptime", {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    })
      .then(async (response) => {
        // A static preview has no serverless route; that is the same setup
        // state as a deployment without an UptimeRobot key.
        if (response.status === 404) {
          return { ok: true, configured: false, days: 45, monitors: [] } as UptimePayload;
        }
        const payload = (await response.json().catch(() => null)) as UptimePayload | null;
        if (!response.ok) {
          throw new Error(payload?.error || `Uptime request failed (${response.status}).`);
        }
        if (!payload) throw new Error("Uptime returned an empty response.");
        return payload;
      })
      .then((payload) => {
        if (!active) return;
        setState({ status: "ready", data: payload });
      })
      .catch((error: unknown) => {
        if (!active || controller.signal.aborted) return;
        setState({
          status: "error",
          message: error instanceof Error ? error.message : "Uptime data is unavailable.",
        });
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [reloadKey]);

  return { ...state, reload: () => setReloadKey((value) => value + 1) };
}

function StatusTimeline({ monitor }: { monitor: UptimeMonitor }) {
  const days = monitor.days;
  const [selected, setSelected] = React.useState<number | null>(null);
  const [pinned, setPinned] = React.useState(false);
  const buttonRefs = React.useRef<Array<HTMLButtonElement | null>>([]);

  const selectedIndex =
    selected != null && selected >= 0 && selected < days.length ? selected : null;
  const selectedDay = selectedIndex == null ? null : days[selectedIndex];
  const lastIndex = days.length - 1;

  const clearSelection = () => {
    if (pinned) return;
    setSelected(null);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key === "Escape") {
      event.preventDefault();
      setPinned(false);
      setSelected(null);
      buttonRefs.current[index]?.blur();
      return;
    }

    let next: number | null = null;
    if (event.key === "ArrowRight") next = index === lastIndex ? 0 : index + 1;
    if (event.key === "ArrowLeft") next = index === 0 ? lastIndex : index - 1;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = lastIndex;

    if (next != null) {
      event.preventDefault();
      buttonRefs.current[next]?.focus();
    }
  };

  return (
    <div
      className="relative"
      data-uptime-timeline
      onMouseLeave={clearSelection}
    >
      <div
        role="group"
        aria-label={`Daily uptime for ${monitor.name}`}
        className="flex h-[50px] w-full items-stretch gap-px"
      >
        {days.map((day, index) => {
          const active = selectedIndex === index;
          const label =
            day.uptime == null ? "no data" : `${uptimeLabel(day.uptime)} uptime`;
          return (
            <button
              key={day.date}
              ref={(element) => {
                buttonRefs.current[index] = element;
              }}
              type="button"
              tabIndex={active || (selectedIndex == null && index === lastIndex) ? 0 : -1}
              aria-label={`${dayLabel(day.date, true)}: ${label}`}
              aria-pressed={active && pinned}
              onMouseEnter={() => {
                if (!pinned) setSelected(index);
              }}
              onFocus={() => setSelected(index)}
              onBlur={(event) => {
                const next = event.relatedTarget as HTMLElement | null;
                if (next?.closest("[data-uptime-timeline]")) return;
                if (!pinned) setSelected(null);
              }}
              onClick={() => {
                if (pinned && active) {
                  setPinned(false);
                  setSelected(null);
                } else {
                  setPinned(true);
                  setSelected(index);
                }
              }}
              onKeyDown={(event) => handleKeyDown(event, index)}
              className="group min-w-0 flex-1 cursor-pointer rounded-[3px] outline-none focus-visible:ring-2 focus-visible:ring-white/70"
              title={`${dayLabel(day.date, true)} · ${label}`}
            >
              <span
                aria-hidden="true"
                className="block h-full w-full rounded-[3px] transition-opacity group-hover:opacity-75"
                style={{ backgroundColor: dayColor(day) }}
              />
            </button>
          );
        })}
      </div>

      <div className="mt-1.5 flex items-center justify-between text-[11px] text-zinc-500">
        <span>{days[0] ? dayLabel(days[0].date) : ""}</span>
        <span>Today</span>
      </div>

      {selectedDay && (
        <div
          className="absolute left-1/2 top-[64px] z-30 w-64 max-w-[calc(100vw-3rem)] -translate-x-1/2 rounded-xl border border-white/[0.1] bg-[#232326] p-2.5 shadow-[0_18px_40px_rgba(0,0,0,0.65)]"
          role="status"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-semibold text-zinc-100">
              {dayLabel(selectedDay.date, true)}
            </span>
            <span className="text-[11px] text-zinc-500">
              {selectedDay.uptime == null ? "No checks" : uptimeLabel(selectedDay.uptime)}
            </span>
          </div>

          <div className="mt-2 space-y-1.5 text-[11px]">
            <div className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-1.5 text-zinc-300">
                <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
                Uptime
              </span>
              <span className="font-mono text-[11px] text-zinc-400">
                {selectedDay.uptime == null ? "No data" : uptimeLabel(selectedDay.uptime)}
              </span>
            </div>
            {selectedDay.downSeconds > 0 && (
              <div className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-1.5 text-zinc-300">
                  <span className="h-2 w-2 rounded-full bg-red-500" aria-hidden="true" />
                  Downtime
                </span>
                <span className="font-mono text-[11px] text-zinc-400">
                  {formatDuration(selectedDay.downSeconds)}
                </span>
              </div>
            )}
          </div>

          {selectedDay.events.length > 0 && (
            <div className="mt-2 space-y-1.5 border-t border-white/[0.08] pt-2">
              {selectedDay.events.slice(0, 3).map((event) => (
                <div key={event.id} className="min-w-0">
                  <div className="truncate text-[11px] text-zinc-300">{event.name}</div>
                  <div className="text-[11px] text-zinc-500">
                    {timeLabel(event.from)}–{timeLabel(event.to)} · {formatDuration(event.seconds)}
                  </div>
                </div>
              ))}
              {selectedDay.events.length > 3 && (
                <div className="text-[11px] text-zinc-500">
                  +{selectedDay.events.length - 3} more
                </div>
              )}
            </div>
          )}

          {pinned && (
            <div className="mt-2 border-t border-white/[0.08] pt-1.5 text-[11px] text-zinc-500">
              Click the day again to unpin
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Skeleton() {
  return (
    <div className="flex flex-col gap-2" aria-hidden="true">
      <div className="flex h-[50px] items-stretch gap-px">
        {Array.from({ length: 45 }, (_, index) => (
          <span
            key={index}
            className="flex-1 animate-pulse rounded-[3px] bg-white/[0.06]"
            style={{ animationDelay: `${index * 12}ms` }}
          />
        ))}
      </div>
      <div className="flex items-center justify-between">
        <span className="h-2 w-16 animate-pulse rounded-full bg-white/[0.06]" />
        <span className="h-2 w-10 animate-pulse rounded-full bg-white/[0.06]" />
      </div>
    </div>
  );
}

export function UptimeMonitor() {
  const { status, data, message, reload } = useUptime();
  const monitors = data?.monitors ?? [];
  const configured = data?.configured !== false;

  return (
    <section
      aria-labelledby="uptime-heading"
      style={PANEL_STYLE}
      className="flex flex-col gap-3 p-3"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div
            style={{ borderRadius: 36, background: "rgba(34, 197, 94, 0.12)" }}
            className="p-1.5 text-emerald-400"
          >
            <Activity aria-hidden="true" className="h-3.5 w-3.5" />
          </div>
          <div>
            <h3 id="uptime-heading" className="text-xs font-semibold text-zinc-100">
              Uptime monitor
            </h3>
            <p className="text-[11px] text-zinc-500">
              Live checks from UptimeRobot · {data?.days ?? 45} days
            </p>
          </div>
        </div>

        {status === "ready" && configured && data?.updatedAt && (
          <span className="inline-flex items-center gap-1 text-[11px] text-zinc-500">
            <ShieldCheck aria-hidden="true" className="h-3 w-3 text-emerald-400/80" />
            {monitors.length} {monitors.length === 1 ? "monitor" : "monitors"}
          </span>
        )}
      </div>

      {status === "loading" && <Skeleton />}

      {status === "error" && (
        <div
          role="alert"
          className="flex flex-wrap items-center gap-2 rounded-xl border border-amber-500/25 bg-amber-500/[0.07] px-3 py-2 text-[11px] text-amber-200"
        >
          <AlertTriangle aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
          <span className="min-w-0 flex-1">{message || "Uptime data is unavailable."}</span>
          <button
            type="button"
            onClick={reload}
            className="inline-flex h-6 cursor-pointer items-center gap-1 rounded-full border border-amber-400/30 px-2 text-[11px] font-medium text-amber-200 transition-colors hover:bg-amber-400/10"
          >
            <RefreshCw aria-hidden="true" className="h-3 w-3" />
            Try again
          </button>
        </div>
      )}

      {status === "ready" && !configured && (
        <div className="flex flex-col gap-2 rounded-xl border border-white/[0.07] bg-white/[0.025] px-3 py-2.5 sm:flex-row sm:items-center">
          <Link2 aria-hidden="true" className="h-4 w-4 shrink-0 text-zinc-400" />
          <p className="min-w-0 flex-1 text-[11px] leading-relaxed text-zinc-400">
            UptimeRobot is not connected yet. Add a read-only API key as{" "}
            <code className="rounded bg-white/[0.06] px-1 py-0.5 font-mono text-[11px] text-zinc-300">
              UPTIMEROBOT_API_KEY
            </code>{" "}
            to the deployment to show live checks here.
          </p>
          <a
            href={INTEGRATIONS_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-6 shrink-0 items-center gap-1 self-start rounded-full border border-white/15 px-2.5 text-[11px] font-medium text-zinc-200 transition-colors hover:bg-white/[0.08] sm:self-auto"
          >
            Integrations
            <ExternalLink aria-hidden="true" className="h-2.5 w-2.5" />
          </a>
        </div>
      )}

      {status === "ready" && configured && monitors.length === 0 && (
        <p className="text-[11px] text-zinc-500">
          No monitors were returned by this UptimeRobot account.
        </p>
      )}

      {status === "ready" &&
        configured &&
        monitors.map((monitor) => {
          const meta = STATUS_META[monitor.status];
          return (
            <div key={monitor.id} className="flex flex-col gap-1.5">
              <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                <div className="flex min-w-0 items-center gap-1.5">
                  <span
                    aria-hidden="true"
                    className="h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ backgroundColor: meta.dot }}
                  />
                  <span className="truncate text-xs font-medium text-zinc-200">
                    {monitor.name}
                  </span>
                  <span className={`shrink-0 text-[11px] ${meta.text}`}>{meta.label}</span>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className={`font-mono text-xs tabular-nums ${uptimeTone(monitor.uptime)}`}>
                    {uptimeLabel(monitor.uptime)}
                  </span>
                  <span className="text-[11px] uppercase tracking-[0.12em] text-zinc-500">
                    45d
                  </span>
                </div>
              </div>
              <StatusTimeline monitor={monitor} />
            </div>
          );
        })}
    </section>
  );
}
