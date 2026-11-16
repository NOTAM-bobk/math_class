const WORKER_ORIGIN = "https://polytrack-hub-api.sawyerbobk563.workers.dev";

// Submissions ride the existing bug-report store so the admin panel can read them,
// but they carry a title prefix so they never show up as regular bug reports.
const SUBMISSION_PREFIX = "__POLYTRACK_GAME_SUBMISSION__";

const rateLimitMap = new Map();

function checkRateLimit(ip, maxAttempts = 5, windowMs = 10 * 60 * 1000) {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  if (!record || now - record.firstSeen > windowMs) {
    return { allowed: true, count: 0, resetIn: Math.ceil(windowMs / 1000) };
  }
  if (record.count >= maxAttempts) {
    const remainingSec = Math.max(1, Math.ceil((windowMs - (now - record.firstSeen)) / 1000));
    return { allowed: false, count: record.count, resetIn: remainingSec };
  }
  return { allowed: true, count: record.count, resetIn: Math.max(1, Math.ceil((windowMs - (now - record.firstSeen)) / 1000)) };
}

function recordAttempt(ip, windowMs = 10 * 60 * 1000) {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  if (!record || now - record.firstSeen > windowMs) {
    rateLimitMap.set(ip, { count: 1, firstSeen: now });
  } else {
    record.count += 1;
  }
}

function cleanString(value, maxLength) {
  return String(value == null ? "" : value).replace(/\s+/g, " ").trim().slice(0, maxLength);
}

function normaliseUrl(value) {
  const raw = cleanString(value, 500);
  if (!raw) return "";
  if (raw.startsWith("/")) return raw;
  try {
    const parsed = new URL(raw);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return "";
    return parsed.toString();
  } catch {
    return "";
  }
}

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Cache-Control", "no-store");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Use POST to submit a game." });
  }

  const rawIp = req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "unknown";
  const clientIp = String(rawIp).split(",")[0].trim();

  const rl = checkRateLimit(clientIp);
  if (!rl.allowed) {
    return res.status(429).json({
      ok: false,
      error: `Too many submissions. Please wait ${Math.ceil(rl.resetIn / 60)} minute(s) before trying again.`,
      resetIn: rl.resetIn,
    });
  }

  let body = {};
  if (typeof req.body === "string") {
    try {
      body = JSON.parse(req.body);
    } catch {
      body = {};
    }
  } else if (req.body && typeof req.body === "object") {
    body = req.body;
  }

  if (cleanString(body.website, 100)) {
    // Honeypot field: silently accept so bots do not retry.
    recordAttempt(clientIp);
    return res.status(200).json({ ok: true });
  }

  const name = cleanString(body.name, 120);
  const url = normaliseUrl(body.url);
  const category = cleanString(body.category, 40);
  const description = cleanString(body.description, 1000);
  const submittedBy = cleanString(body.submittedBy, 60);

  if (name.length < 2) {
    return res.status(400).json({ ok: false, error: "Enter the name of the game." });
  }
  if (!url) {
    return res.status(400).json({ ok: false, error: "Enter a valid http(s) link or a path like /games/my-game.html." });
  }

  recordAttempt(clientIp);

  const payload = {
    title: `${SUBMISSION_PREFIX} ${name}`,
    description: JSON.stringify({ name, url, category, description, submittedBy }),
    gameUrl: url,
    pageUrl: cleanString(body.pageUrl, 200) || "/",
    browserInfo: "Game submission form",
  };

  try {
    const upstream = await fetch(new URL("/api/bugs", WORKER_ORIGIN).toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      },
      body: JSON.stringify(payload),
    });

    const data = await upstream.json().catch(() => ({}));

    if (!upstream.ok) {
      return res.status(upstream.status === 429 ? 429 : 502).json({
        ok: false,
        error: data.error || "Could not save the submission right now. Please try again.",
        resetIn: data.resetIn,
      });
    }

    return res.status(200).json({ ok: true });
  } catch {
    return res.status(502).json({ ok: false, error: "Could not reach the submissions backend." });
  }
};
