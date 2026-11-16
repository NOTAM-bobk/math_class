// Cloudflare Turnstile verification.
// GET  -> the public site key, so the static bundle does not need a rebuild.
// POST -> verifies the widget token with Cloudflare using the secret key.
const SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

// A short in-memory throttle: serverless instances are short lived, so this only
// softens bursts. Cloudflare's own quotas do the real work.
const attempts = new Map();
const WINDOW_MS = 60_000;
const MAX_ATTEMPTS = 15;

function clientIp(req) {
  const header = req.headers?.["x-forwarded-for"] ?? req.headers?.["X-Forwarded-For"];
  const value = Array.isArray(header) ? header[0] : header;
  return typeof value === "string" ? value.split(",")[0].trim() : "";
}

function isThrottled(ip) {
  if (!ip) return false;
  const now = Date.now();
  const recent = (attempts.get(ip) ?? []).filter((stamp) => now - stamp < WINDOW_MS);
  recent.push(now);
  attempts.set(ip, recent);
  if (attempts.size > 5000) attempts.clear();
  return recent.length > MAX_ATTEMPTS;
}

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method === "GET") {
    const siteKey = process.env.TURNSTILE_SITE_KEY;
    if (!siteKey) {
      res.status(503).json({ error: "Turnstile is not configured" });
      return;
    }
    res.status(200).json({ siteKey });
    return;
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "GET, POST");
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    res.status(503).json({ verified: false, error: "Turnstile is not configured" });
    return;
  }

  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      body = {};
    }
  }
  const token = body && typeof body.token === "string" ? body.token.slice(0, 4096) : "";
  if (!token) {
    res.status(400).json({ verified: false, error: "Missing verification token" });
    return;
  }

  const ip = clientIp(req);
  if (isThrottled(ip)) {
    res.status(429).json({ verified: false, error: "Too many verification attempts. Try again in a minute." });
    return;
  }

  try {
    const params = new URLSearchParams({ secret, response: token });
    if (ip) params.set("remoteip", ip);
    const response = await fetch(SITEVERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });
    const data = await response.json().catch(() => ({}));
    const verified = data.success === true;
    res.status(verified ? 200 : 403).json({
      verified,
      errors: Array.isArray(data["error-codes"]) ? data["error-codes"] : [],
    });
  } catch {
    res.status(502).json({ verified: false, error: "Verification service unavailable" });
  }
};
