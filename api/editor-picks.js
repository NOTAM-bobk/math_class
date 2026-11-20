// Editor's picks, stored next to the game flags in the hub worker's bug store.
// The list has to be public (every visitor reads it), but the worker's admin
// listing needs a password, so this small proxy reads it server-side and only
// exposes the picks themselves.

const WORKER_ORIGIN = "https://polytrack-hub-api.sawyerbobk563.workers.dev";
const RECORD_TITLE = "__POLYTRACK_EDITOR_PICKS__";

const internalKey = () => process.env.HUB_INTERNAL_KEY || "";
const adminPassword = () =>
  process.env.ADMIN_PASSWORD || process.env.ADMIN_SECRET || process.env.VERCEL_ADMIN_PASSWORD || "";

const authHeaders = () => ({
  "X-Vercel-Admin-Verified": "1",
  ...(internalKey() ? { "X-Hub-Internal-Key": internalKey() } : {}),
  ...(adminPassword() ? { "X-Admin-Password": adminPassword() } : {}),
});

async function cfFetch(path, options = {}) {
  const url = new URL(path, WORKER_ORIGIN);
  return fetch(url.toString(), {
    ...options,
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      ...(options.headers || {}),
    },
  });
}

function cleanPicks(value) {
  if (!Array.isArray(value)) return [];
  return Array.from(
    new Set(value.filter((id) => typeof id === "string" && id.length > 0))
  );
}

async function readPicks() {
  try {
    const res = await cfFetch("/api/admin/bugs", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify({ action: "list" }),
    });
    if (!res.ok) return null;

    const data = await res.json();
    const items = Array.isArray(data.items) ? data.items : Array.isArray(data.bugs) ? data.bugs : [];
    const records = items.filter((item) => item && item.title === RECORD_TITLE);
    if (records.length === 0) return { configured: false, picks: [], oldIds: [] };

    const latest = records[0];
    const oldIds = records.map((item) => item.id);
    try {
      const parsed = JSON.parse(latest.description);
      return { configured: true, picks: cleanPicks(parsed?.picks), oldIds };
    } catch {
      return { configured: true, picks: [], oldIds };
    }
  } catch {
    return null;
  }
}

async function writePicks(picks, oldIds) {
  try {
    const postRes = await cfFetch("/api/bugs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: RECORD_TITLE,
        description: JSON.stringify({ picks }),
        gameUrl: "https://polytrack.internal/editor-picks",
        pageUrl: "/editor-picks",
        browserInfo: "Vercel Proxy Sync",
      }),
    });
    if (!postRes.ok) return false;

    // Only remove the previous records once the new one is stored, so a failed
    // save cannot wipe the picks.
    for (const id of Array.isArray(oldIds) ? oldIds : []) {
      if (!id) continue;
      try {
        await cfFetch("/api/admin/bugs", {
          method: "POST",
          headers: { "Content-Type": "application/json", ...authHeaders() },
          body: JSON.stringify({ action: "delete", id }),
        });
      } catch {}
    }
    return true;
  } catch {
    return false;
  }
}

function safeEqual(a, b) {
  if (typeof a !== "string" || typeof b !== "string") return false;
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, X-Admin-Password");
  res.setHeader("Cache-Control", "no-store");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method === "GET") {
    const data = await readPicks();
    if (!data) {
      return res.status(503).json({
        ok: false,
        error: "Editor's picks are temporarily unavailable.",
      });
    }
    return res.status(200).json({
      ok: true,
      configured: data.configured,
      picks: data.picks,
    });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
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

  const configuredPassword = adminPassword();
  const givenPassword = String(req.headers["x-admin-password"] || body.password || "");
  if (!configuredPassword) {
    return res.status(503).json({
      ok: false,
      needsSetup: true,
      error: "ADMIN_PASSWORD is not configured in the environment yet.",
    });
  }
  if (!givenPassword || !safeEqual(givenPassword, configuredPassword)) {
    return res.status(401).json({ ok: false, error: "Incorrect admin password." });
  }

  if (!Array.isArray(body.picks)) {
    return res.status(400).json({ ok: false, error: "Picks must be a list of game ids." });
  }

  const current = await readPicks();
  if (!current) {
    return res.status(503).json({
      ok: false,
      error: "Could not read the current picks, so nothing was changed.",
    });
  }

  const picks = cleanPicks(body.picks);
  const saved = await writePicks(picks, current.oldIds);
  if (!saved) {
    return res.status(502).json({
      ok: false,
      error: "Could not save Editor's picks. Please try again.",
      picks: current.picks,
      configured: current.configured,
    });
  }

  return res.status(200).json({ ok: true, configured: true, picks });
};
