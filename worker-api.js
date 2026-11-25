// The hub's /api routes that used to exist only as Vercel functions in api/ or
// as vercel.json rewrites. Cloudflare runs neither, so worker.js calls this
// module before falling back to static assets.
//
// Everything the hub's own backend already serves on Cloudflare (messages,
// views, clicks, bug reports) stays in the /api/hub/* proxy in worker.js; this
// file covers the rest of what the app asks for:
//
//   /api/search                         the built catalog.json
//   /api/flags (GET/POST), /api/games/flags
//   /api/admin                          bug admin + badge changes
//   /api/submissions, /api/hub/submit-game
//   /api/turnstile                      Cloudflare Turnstile siteverify
//   /api/avatar                         DiceBear proxy with an SVG fallback
//   /api/editor-picks, /api/share-email, /api/uptime, /api/bidvertiser
//                                       proxied to the Vercel deployment, which
//                                       owns those integrations' keys
//
// Secrets and vars this expects on the Worker:
//   ADMIN_PASSWORD             gates /api/admin and badge writes
//   TURNSTILE_SITE_KEY         public, also in wrangler.jsonc vars
//   TURNSTILE_SECRET_KEY       secret, `wrangler secret put`
//   TURNSTILE_ALLOWED_HOSTNAMES  comma separated, optional
//   VERCEL_ORIGIN              optional, the Vercel deployment serving api/
const HUB_ORIGIN = "https://polytrack-hub-api.sawyerbobk563.workers.dev";
const SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const SUBMISSION_PREFIX = "__POLYTRACK_GAME_SUBMISSION__";
const MAX_RESULTS = 120;
const VERCEL_ROUTES = new Set(["/api/editor-picks", "/api/share-email", "/api/uptime", "/api/bidvertiser"]);

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });

const fail = (error, status = 400, extra = {}) => json({ ok: false, error, ...extra }, status);

const host = (value) => String(value || "").trim().replace(/\/+$/, "");

function safeEqual(a, b) {
  if (typeof a !== "string" || typeof b !== "string") return false;
  const x = new TextEncoder().encode(a);
  const y = new TextEncoder().encode(b);
  let diff = x.length ^ y.length;
  for (let i = 0; i < Math.max(x.length, y.length); i++) diff |= (x[i] || 0) ^ (y[i] || 0);
  return diff === 0;
}

const clean = (value, max) => String(value == null ? "" : value).replace(/\s+/g, " ").trim().slice(0, max);

// Read once: the body is forwarded to the hub backend as well, so it cannot be
// consumed by the password check and then read again.
function parse(text) {
  if (!text) return {};
  try {
    const parsed = JSON.parse(text);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

// Only the headers that describe the caller matter upstream, not Cloudflare's
// own request markers.
function forwarded(request, extra = {}) {
  const headers = new Headers(request.headers);
  for (const name of ["host", "cf-connecting-ip", "cf-ipcountry", "cf-ray", "cf-visitor", "x-forwarded-host", "x-forwarded-proto"]) {
    headers.delete(name);
  }
  for (const [name, value] of Object.entries(extra)) if (value) headers.set(name, value);
  return headers;
}

async function toHub(request, path, extraHeaders = {}, text = "") {
  const init = { method: request.method, headers: forwarded(request, extraHeaders), cf: { cacheTtl: 0 } };
  if (request.method !== "GET" && request.method !== "HEAD") init.body = text;
  try {
    const response = await fetch(HUB_ORIGIN + path, init);
    if (!(response.headers.get("content-type") || "").includes("application/json")) {
      return fail("The hub backend returned an unexpected response.", 502);
    }
    return new Response(response.body, {
      status: response.status,
      headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", "access-control-allow-origin": "*" },
    });
  } catch {
    return fail("Could not reach the hub backend.", 502);
  }
}

function requireAdmin(request, payload, env) {
  const given = request.headers.get("x-admin-password") || (typeof payload.password === "string" ? payload.password : "");
  if (!env.ADMIN_PASSWORD) {
    return { error: fail("ADMIN_PASSWORD is not configured on this Worker yet.", 503, { needsSetup: true }) };
  }
  if (!safeEqual(given, env.ADMIN_PASSWORD)) return { error: fail("Incorrect admin password.", 401) };
  return { given };
}

let catalogCache = null;

async function search(request, url, env) {
  if (request.method !== "GET") return fail("Use GET to search the catalog.", 405);

  if (!catalogCache) {
    try {
      const response = await env.ASSETS.fetch(new Request(new URL("/catalog.json", url.origin), request));
      const parsed = await response.json();
      catalogCache = Array.isArray(parsed) ? parsed : Array.isArray(parsed?.games) ? parsed.games : null;
    } catch {
      catalogCache = null;
    }
  }
  if (!catalogCache) return fail("The catalog is unavailable right now.", 503);

  const query = url.searchParams.get("q") || "";
  const limit = Math.min(Math.max(Number(url.searchParams.get("limit")) || MAX_RESULTS, 1), MAX_RESULTS);
  const words = String(query).toLowerCase().trim().split(/\s+/).filter(Boolean);
  const matches = words.length
    ? catalogCache.filter((game) => {
        const text = [game.name, game.description, ...(Array.isArray(game.tags) ? game.tags : [])].join(" ").toLowerCase();
        return words.every((word) => text.includes(word));
      })
    : catalogCache;

  return new Response(JSON.stringify({ ok: true, query, total: matches.length, games: matches.slice(0, limit) }), {
    status: 200,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "public, max-age=0, s-maxage=60, stale-while-revalidate=300",
      "access-control-allow-origin": "*",
    },
  });
}

async function avatar(url) {
  const seed = url.searchParams.get("seed") || "Racer";
  const style = url.searchParams.get("style") || "bottts";
  const safeStyle = /^[a-z0-9-]+$/i.test(style) ? style : "bottts";

  try {
    const response = await fetch(
      `https://api.dicebear.com/9.x/${encodeURIComponent(safeStyle)}/svg?seed=${encodeURIComponent(seed)}`,
      { headers: { accept: "image/svg+xml", "user-agent": "PolyTrack-Hub/1.0" } },
    );
    if (response.ok) {
      return new Response(await response.text(), {
        status: 200,
        headers: {
          "content-type": "image/svg+xml; charset=utf-8",
          "cache-control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=2592000",
        },
      });
    }
  } catch {}

  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  const colors = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#06b6d4"];
  const bg = colors[Math.abs(hash) % colors.length];
  const initial = seed.charAt(0).toUpperCase() || "R";
  return new Response(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><rect width="100" height="100" rx="50" fill="${bg}"/><text x="50" y="63" font-size="44" font-weight="bold" fill="#ffffff" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif">${initial}</text></svg>`,
    { status: 200, headers: { "content-type": "image/svg+xml; charset=utf-8", "cache-control": "public, max-age=3600" } },
  );
}

const attempts = new Map();

async function turnstile(request, env) {
  if (request.method === "GET") {
    if (!env.TURNSTILE_SITE_KEY) return fail("Turnstile is not configured", 503);
    return json({ siteKey: env.TURNSTILE_SITE_KEY });
  }
  if (request.method !== "POST") return fail("Method not allowed", 405);
  if (!env.TURNSTILE_SECRET_KEY) return json({ verified: false, error: "Turnstile is not configured" }, 503);

  const payload = parse(await request.text());
  const token = typeof payload.token === "string" ? payload.token.slice(0, 2048) : "";
  if (!token) return json({ verified: false, error: "Missing verification token" }, 400);

  const ip = request.headers.get("cf-connecting-ip") || "";
  if (ip) {
    const now = Date.now();
    const recent = (attempts.get(ip) || []).filter((stamp) => now - stamp < 60_000);
    recent.push(now);
    attempts.set(ip, recent);
    if (attempts.size > 5000) attempts.clear();
    if (recent.length > 15) return json({ verified: false, error: "Too many verification attempts. Try again in a minute." }, 429);
  }

  const params = new URLSearchParams({ secret: env.TURNSTILE_SECRET_KEY, response: token });
  if (ip) params.set("remoteip", ip);

  try {
    const response = await fetch(SITEVERIFY_URL, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });
    const data = await response.json().catch(() => ({}));
    const expectedAction = typeof payload.action === "string" ? payload.action : "";
    const allowedHostnames = String(env.TURNSTILE_ALLOWED_HOSTNAMES || "")
      .split(",")
      .map((hostname) => hostname.trim().toLowerCase())
      .filter(Boolean);
    const actionMatches = !expectedAction || data.action === expectedAction;
    const hostnameMatches =
      allowedHostnames.length === 0 ||
      (typeof data.hostname === "string" && allowedHostnames.includes(data.hostname.toLowerCase()));
    const verified = data.success === true && actionMatches && hostnameMatches;
    return json(
      {
        verified,
        errors: [
          ...(Array.isArray(data["error-codes"]) ? data["error-codes"] : []),
          ...(actionMatches ? [] : ["action-mismatch"]),
          ...(hostnameMatches ? [] : ["hostname-mismatch"]),
        ],
      },
      verified ? 200 : 403,
    );
  } catch {
    return json({ verified: false, error: "Verification service unavailable" }, 502);
  }
}

async function flags(request, env, method) {
  if (method === "GET") {
    try {
      const response = await fetch(`${HUB_ORIGIN}/api/games/flags`, {
        headers: { accept: "application/json", "user-agent": "PolyTrack-Hub/1.0" },
      });
      const data = await response.json().catch(() => null);
      if (!response.ok || !data) return fail("Game badges are temporarily unavailable.", 503);
      return json({
        ok: true,
        verified: Array.isArray(data.verified) ? data.verified : [],
        buggy: Array.isArray(data.buggy) ? data.buggy : [],
        notMobile: Array.isArray(data.notMobile) ? data.notMobile : [],
        blocked: Array.isArray(data.blocked) ? data.blocked : [],
      });
    } catch {
      return fail("Game badges are temporarily unavailable.", 503);
    }
  }
  if (method !== "POST") return fail("Method not allowed.", 405);

  const text = await request.text();
  const payload = parse(text);
  const auth = requireAdmin(request, payload, env);
  if (auth.error) return auth.error;

  return toHub(
    request,
    "/api/admin/flags",
    { "content-type": "application/json", "x-admin-password": auth.given, "x-vercel-admin-verified": "1" },
    text,
  );
}

async function admin(request, env) {
  if (request.method === "OPTIONS") return new Response(null, { status: 204 });
  if (request.method !== "POST") return fail("Use POST for the admin API.", 405);

  const text = await request.text();
  const payload = parse(text);
  const auth = requireAdmin(request, payload, env);
  if (auth.error) return auth.error;

  const action = typeof payload.action === "string" ? payload.action : "";
  const isFlags =
    payload.target === "flags" ||
    action.includes("flag") ||
    /verified|buggy|blocked|not_mobile/.test(action);

  return toHub(
    request,
    isFlags ? "/api/admin/flags" : "/api/admin/bugs",
    { "content-type": "application/json", "x-admin-password": auth.given, "x-vercel-admin-verified": "1" },
    text,
  );
}

const submissions = new Map();

async function submit(request, env) {
  if (request.method === "OPTIONS") return new Response(null, { status: 204 });
  if (request.method !== "POST") return fail("Use POST to submit a game.", 405);

  const ip = request.headers.get("cf-connecting-ip") || "unknown";
  const now = Date.now();
  const recent = (submissions.get(ip) || []).filter((stamp) => now - stamp < 600_000);
  recent.push(now);
  submissions.set(ip, recent);
  if (submissions.size > 5000) submissions.clear();
  if (recent.length > 5) {
    return fail(`Too many submissions. Please wait ${Math.ceil((600_000 - (now - recent[0])) / 60_000)} minute(s) before trying again.`, 429);
  }

  const payload = parse(await request.text());
  if (clean(payload.website, 100)) return json({ ok: true }); // honeypot: accept silently

  const name = clean(payload.name, 120);
  if (name.length < 2) return fail("Enter the name of the game.", 400);

  const raw = clean(payload.url, 500);
  let url = "";
  if (raw) {
    if (raw.startsWith("/")) {
      url = raw;
    } else {
      try {
        const parsed = new URL(raw);
        if (parsed.protocol === "http:" || parsed.protocol === "https:") url = parsed.toString();
      } catch {}
    }
  }
  if (!url) return fail("Enter a valid http(s) link or a path like /games/my-game.html.", 400);

  try {
    const response = await fetch(`${HUB_ORIGIN}/api/bugs`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      },
      body: JSON.stringify({
        title: `${SUBMISSION_PREFIX} ${name}`,
        description: JSON.stringify({
          name,
          url,
          category: clean(payload.category, 40),
          description: clean(payload.description, 1000),
          submittedBy: clean(payload.submittedBy, 60),
        }),
        gameUrl: url,
        pageUrl: clean(payload.pageUrl, 200) || "/",
        browserInfo: "Game submission form (Cloudflare)",
      }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      return fail(data.error || "Could not save the submission right now. Please try again.", response.status === 429 ? 429 : 502, {
        resetIn: data.resetIn,
      });
    }
    return json({ ok: true });
  } catch {
    return fail("Could not reach the submissions backend.", 502);
  }
}

// These integrations hold their keys in Vercel's environment, so the Worker
// forwards to that deployment instead of carrying a second copy of the logic.
async function toVercel(request, url, env) {
  const origin = host(env.VERCEL_ORIGIN);
  if (!origin) {
    return fail("This integration is not configured on the Cloudflare deployment yet.", 503, { needsSetup: true });
  }
  const init = { method: request.method, headers: forwarded(request, { accept: "*/*" }) };
  if (request.method !== "GET" && request.method !== "HEAD") init.body = await request.arrayBuffer();
  try {
    const response = await fetch(origin + url.pathname + url.search, init);
    const headers = new Headers(response.headers);
    headers.delete("set-cookie");
    return new Response(request.method === "HEAD" ? null : response.body, { status: response.status, headers });
  } catch {
    return fail("The integration backend did not answer.", 502);
  }
}

/**
 * Returns a Response for a route this module owns, or null so worker.js can
 * keep looking (the /api/hub proxy, game proxies, static assets).
 */
export async function handleSiteApi(request, url, env) {
  const path = url.pathname.replace(/\/+$/, "") || "/";

  switch (path) {
    case "/api/search":
      return search(request, url, env);
    case "/api/turnstile":
      return turnstile(request, env);
    case "/api/admin":
      return admin(request, env);
    case "/api/submissions":
    case "/api/hub/submit-game":
      return submit(request, env);
    case "/api/flags":
    case "/api/games/flags":
    case "/api/hub/games/flags":
      return flags(request, env, request.method);
    case "/api/hub/admin/flags":
      return flags(request, env, request.method === "GET" ? "GET" : request.method);
    case "/api/avatar":
      return avatar(url);
    default:
      break;
  }

  if (path.startsWith("/api/avatar/")) return avatar(url);
  if (VERCEL_ROUTES.has(path)) return toVercel(request, url, env);
  return null;
}
