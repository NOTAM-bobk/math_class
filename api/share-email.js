// Sends a page link to a friend through EmailJS. The browser never sees the
// EmailJS keys: set EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID and
// EMAILJS_PUBLIC_KEY (plus EMAILJS_PRIVATE_KEY when the account uses strict
// mode) in the deployment environment.
//
// The recipient travels as the template's {{to_email}} variable, and the link
// has to point at this same site, so the endpoint cannot be used as an open
// mail relay for arbitrary addresses and links.

const EMAILJS_ENDPOINT = "https://api.emailjs.com/api/v1.0/email/send";

const IP_WINDOW_MS = 10 * 60 * 1000;
const IP_SEND_LIMIT = 5;
const RECIPIENT_WINDOW_MS = 60 * 60 * 1000;
const RECIPIENT_SEND_LIMIT = 3;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const ipSends = new Map();
const recipientSends = new Map();

function peekLimit(store, key, limit, windowMs) {
  const now = Date.now();
  const record = store.get(key);
  if (!record || now - record.firstSeen > windowMs) {
    return { allowed: true, resetIn: Math.ceil(windowMs / 1000) };
  }
  const resetIn = Math.max(1, Math.ceil((windowMs - (now - record.firstSeen)) / 1000));
  return { allowed: record.count < limit, resetIn };
}

// Drop expired buckets on warm instances so one-off addresses cannot grow the map.
function prune(store, windowMs) {
  const cutoff = Date.now() - windowMs;
  for (const [key, record] of store) {
    if (record.firstSeen < cutoff) store.delete(key);
  }
  if (store.size > 2000) store.clear();
}

function recordSend(store, key, windowMs) {
  const now = Date.now();
  const record = store.get(key);
  if (!record || now - record.firstSeen > windowMs) {
    store.set(key, { count: 1, firstSeen: now });
  } else {
    record.count += 1;
  }
  prune(store, windowMs);
}

function cleanString(value, maxLength) {
  return String(value == null ? "" : value).replace(/\s+/g, " ").trim().slice(0, maxLength);
}

function hostFrom(value) {
  try {
    return new URL(value).host.toLowerCase();
  } catch {
    return "";
  }
}

function requestHost(req) {
  const raw = req.headers["x-forwarded-host"] || req.headers.host || "";
  return String(raw).split(",")[0].trim().toLowerCase();
}

function clientIp(req) {
  const raw = req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "unknown";
  return String(raw).split(",")[0].trim();
}

// Only links on the site serving this request are emailed.
function shareUrlFor(rawUrl, req) {
  const host = requestHost(req);
  if (!host) return "";
  try {
    const parsed = new URL(cleanString(rawUrl, 500));
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return "";
    if (parsed.host.toLowerCase() !== host) return "";
    parsed.hash = "";
    return parsed.toString();
  } catch {
    return "";
  }
}

function readBody(req) {
  if (typeof req.body === "string") {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }
  return req.body && typeof req.body === "object" ? req.body : {};
}

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Use POST to share by email." });
  }

  const host = requestHost(req);
  const origin = req.headers.origin;
  if (origin && hostFrom(origin) !== host) {
    return res.status(403).json({ ok: false, error: "This share request came from another site." });
  }

  const serviceId = process.env.EMAILJS_SERVICE_ID;
  const templateId = process.env.EMAILJS_TEMPLATE_ID;
  const publicKey = process.env.EMAILJS_PUBLIC_KEY;

  if (!serviceId || !templateId || !publicKey) {
    // A missing key is a setup state, not an outage: the dialog shows a calm note.
    return res.status(503).json({
      ok: false,
      configured: false,
      error: "Email sharing isn't set up on this site yet.",
    });
  }

  const body = readBody(req);
  const email = cleanString(body.email, 254);
  const shareUrl = shareUrlFor(body.url, req);

  if (!EMAIL_PATTERN.test(email)) {
    return res.status(400).json({ ok: false, error: "Enter a valid email address." });
  }

  if (!shareUrl) {
    return res.status(400).json({ ok: false, error: "That share link does not belong to this site." });
  }

  const ipLimit = peekLimit(ipSends, clientIp(req), IP_SEND_LIMIT, IP_WINDOW_MS);
  if (!ipLimit.allowed) {
    res.setHeader("Retry-After", String(ipLimit.resetIn));
    return res.status(429).json({
      ok: false,
      error: `Too many emails sent. Try again in ${Math.ceil(ipLimit.resetIn / 60)} minute(s).`,
      resetIn: ipLimit.resetIn,
    });
  }

  const recipientLimit = peekLimit(
    recipientSends,
    email.toLowerCase(),
    RECIPIENT_SEND_LIMIT,
    RECIPIENT_WINDOW_MS
  );
  if (!recipientLimit.allowed) {
    res.setHeader("Retry-After", String(recipientLimit.resetIn));
    return res.status(429).json({
      ok: false,
      error: "That address has already received a few shares. Please try again later.",
      resetIn: recipientLimit.resetIn,
    });
  }

  recordSend(ipSends, clientIp(req), IP_WINDOW_MS);
  recordSend(recipientSends, email.toLowerCase(), RECIPIENT_WINDOW_MS);

  const payload = {
    service_id: serviceId,
    template_id: templateId,
    user_id: publicKey,
    template_params: {
      to_email: email,
      share_url: shareUrl,
      page_title: cleanString(body.title, 120) || "math_games",
      site_name: "math_games",
    },
  };

  if (process.env.EMAILJS_PRIVATE_KEY) {
    payload.accessToken = process.env.EMAILJS_PRIVATE_KEY;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const upstream = await fetch(EMAILJS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    if (!upstream.ok) {
      if (upstream.status === 429) {
        return res.status(429).json({
          ok: false,
          error: "Email sending is busy right now. Please try again shortly.",
        });
      }
      return res.status(502).json({
        ok: false,
        error: "The email service could not send this share. Please try again.",
      });
    }

    return res.status(200).json({ ok: true });
  } catch {
    return res.status(502).json({
      ok: false,
      error: "The email service took too long to respond. Please try again.",
    });
  } finally {
    clearTimeout(timeout);
  }
};
