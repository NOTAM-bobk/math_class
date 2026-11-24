const HUB_ORIGIN = "https://polytrack-hub-api.sawyerbobk563.workers.dev";
const THUM_BASE = "https://image.thum.io/get/width/800/crop/800/";
const MAX_COVER_BYTES = 4_000_000;

const PROXY_ORIGINS = {
  og: "https://www.onlinegames.io",
  ogc: "https://cloud.onlinegames.io",
};

function withCors(response, cacheControl = "no-store") {
  const headers = new Headers(response.headers);
  headers.set("Access-Control-Allow-Origin", "*");
  headers.set("Access-Control-Allow-Methods", "GET, HEAD, POST, OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type, X-Admin-Password");
  headers.set("Cache-Control", cacheControl);
  return new Response(response.body, { status: response.status, headers });
}

function forwardedRequest(request, target, extraHeaders = {}) {
  const headers = new Headers(request.headers);
  headers.delete("host");
  headers.delete("content-length");
  for (const [key, value] of Object.entries(extraHeaders)) headers.set(key, value);
  const body = request.method === "GET" || request.method === "HEAD" ? undefined : request.body;
  return new Request(target, {
    method: request.method,
    headers,
    body,
    redirect: "manual",
  });
}

async function proxyHub(request, pathname) {
  const suffix = pathname.slice("/api/hub".length) || "/";
  return fetch(forwardedRequest(request, `${HUB_ORIGIN}/api${suffix}${new URL(request.url).search}`));
}

function safeExternalPath(pathname, prefix) {
  const raw = pathname.slice(prefix.length);
  if (!raw || raw.includes("..")) return null;
  return raw;
}

async function proxyExternalGame(request, pathname) {
  const match = pathname.match(/^\/api\/proxy\/(ogc|og)(\/.*)$/);
  if (!match || match[2].includes("..")) return null;
  const target = `${PROXY_ORIGINS[match[1]]}${match[2]}${new URL(request.url).search}`;
  return fetch(forwardedRequest(request, target));
}

async function proxyMathpapers(request, pathname) {
  const suffix = safeExternalPath(pathname, "/api/mp/");
  if (!suffix || (request.method !== "GET" && request.method !== "HEAD")) {
    return new Response(JSON.stringify({ ok: false, error: "Use GET or HEAD to load a game file." }), {
      status: suffix ? 405 : 400,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
    });
  }
  const url = new URL(request.url);
  const target = `https://games.mathpapers.org/${suffix}${url.search}`;
  const headers = new Headers({
    Referer: "https://mathpapers.org/",
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/131.0.0.0 Safari/537.36",
    Accept: request.headers.get("Accept") || "*/*",
    "Accept-Encoding": "identity",
  });
  const range = request.headers.get("Range");
  if (range) headers.set("Range", range);
  const upstream = await fetch(new Request(target, { method: request.method, headers, redirect: "manual" }));
  if (upstream.status >= 300 && upstream.status < 400) {
    return new Response(JSON.stringify({ ok: false, error: "That game file is not available." }), {
      status: 404,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
    });
  }
  const output = new Response(upstream.body, upstream);
  output.headers.set("Cache-Control", /\.html?$/i.test(suffix) ? "public, max-age=300" : "public, max-age=86400");
  return output;
}

async function coverResponse(request) {
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: { "Access-Control-Allow-Origin": "*" } });
  if (request.method !== "GET" && request.method !== "HEAD") {
    return new Response(JSON.stringify({ ok: false, error: "Use GET for a game cover." }), { status: 405, headers: { "Content-Type": "application/json" } });
  }
  const target = new URL(request.url).searchParams.get("url") || "";
  let parsed;
  try {
    parsed = new URL(target);
  } catch {
    parsed = null;
  }
  if (!parsed || !/^https?:$/.test(parsed.protocol) || !parsed.hostname || parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1") {
    return new Response(JSON.stringify({ ok: false, error: "A public http(s) game page is required." }), { status: 400, headers: { "Content-Type": "application/json" } });
  }
  try {
    const upstream = await fetch(`${THUM_BASE}${target}`, { headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)", Accept: "image/*" } });
    const type = (upstream.headers.get("content-type") || "").split(";", 1)[0].trim().toLowerCase();
    if (!upstream.ok || !type.startsWith("image/")) return new Response(JSON.stringify({ ok: false, error: "That cover could not be captured." }), { status: 502, headers: { "Content-Type": "application/json" } });
    const bytes = await upstream.arrayBuffer();
    if (!bytes.byteLength || bytes.byteLength > MAX_COVER_BYTES) return new Response(JSON.stringify({ ok: false, error: "The cover was empty or too large." }), { status: 502, headers: { "Content-Type": "application/json" } });
    return new Response(request.method === "HEAD" ? null : bytes, { status: 200, headers: { "Content-Type": type, "Access-Control-Allow-Origin": "*", "Cache-Control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400" } });
  } catch {
    return new Response(JSON.stringify({ ok: false, error: "The cover service did not answer." }), { status: 504, headers: { "Content-Type": "application/json" } });
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const { pathname } = url;

    if (pathname === "/api/cover") return coverResponse(request);
    if (pathname === "/api/version" || pathname === "/api/version/") {
      return env.ASSETS.fetch(new Request(new URL("/version.json", request.url), request));
    }
    if (pathname === "/api/flags" && request.method === "GET") {
      return withCors(await fetch(`${HUB_ORIGIN}/api/games/flags`, { headers: { Accept: "application/json" } }));
    }
    if (pathname.startsWith("/api/hub/")) {
      if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET, HEAD, POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type, X-Admin-Password" } });
      return withCors(await proxyHub(request, pathname));
    }
    if (pathname.startsWith("/api/mp/")) return proxyMathpapers(request, pathname);
    if (pathname.startsWith("/api/proxy/og/") || pathname.startsWith("/api/proxy/ogc/")) return proxyExternalGame(request, pathname);

    const asset = await env.ASSETS.fetch(request);
    return asset;
  },
};
