// BidVertiser, both halves of it.
//
// The default response is the XML ad feed (pid 945850, bid 2108662) turned into
// JSON. The feed needs the visitor's IP, user agent and page URL to match the
// click, so the request is built here on the server from the visitor's headers.
//
// The widget tag (account 2108105) is the other half. Left alone it loads its
// loader from cdn.hyperpromote.com and then asks bidvjs.bidvertiser.com and a
// CloudFront host for the ad itself; a filtered network blocks those, so the
// slot stays an empty hole. With ?what=… this function serves the whole chain
// from this origin instead:
//
//   ?what=bdvws   the loader, rewritten so every request it makes is same-origin
//   ?what=data    its JSONP ad data
//   ?what=markup  the native ad markup
//   ?what=asset   a creative image (allowlisted hosts only)
//
// Nothing the widget needs leaves the visitor's browser for an ad domain.
const FEED = "http://2108662.bdv-w.bidvertiser.com/BidVertiser.dbm";
const WIDGET_JS = "https://cdn.hyperpromote.com/bidvertiser/tags/active/bdvws.js";
// bidvjs.bidvertiser.com serves an incomplete TLS chain, which a browser can
// usually paper over with a cached intermediate but a server-side fetch cannot,
// so the plain-HTTP origin is the fallback for it. Nothing sensitive is sent.
const DATA_URLS = [
  "https://bdvjs.bidvertiser.com/bidvertiser.dbm",
  "http://bdvjs.bidvertiser.com/bidvertiser.dbm",
];
const MARKUP_URL = "https://d2b9l3u54v5v39.cloudfront.net/active/bdvw.html";

// ?what=asset only fetches these, so the endpoint is not an open proxy.
const ASSET_HOSTS = ["bidvertiser.com", "hyperpromote.com", "cloudfront.net", "amazonaws.com"];
const ASSET_MAX_BYTES = 1.5 * 1024 * 1024;

// The loader changes rarely; holding it in memory keeps a warm function from
// asking the ad CDN for the same file on every impression.
const WIDGET_TTL_MS = 6 * 60 * 60 * 1000;
let widgetCache = null;

const BROWSER_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

function first(v) {
  return Array.isArray(v) ? v[0] : v || "";
}

function visitorIp(req) {
  const h = req.headers;
  return (
    first(h["x-forwarded-for"]).split(",")[0].trim() ||
    first(h["x-real-ip"]) ||
    (req.socket && req.socket.remoteAddress) ||
    ""
  );
}

function fetchHeaders(req) {
  const h = req.headers;
  const headers = { "User-Agent": first(h["user-agent"]) || BROWSER_UA };
  const referer = first(h.referer);
  if (referer) headers.Referer = referer;
  const lang = first(h["accept-language"]);
  if (lang) headers["Accept-Language"] = lang;
  for (const name of [
    "sec-ch-ua",
    "sec-ch-ua-mobile",
    "sec-ch-ua-platform",
    "sec-ch-ua-platform-version",
    "sec-ch-ua-full-version-list",
  ]) {
    const value = first(h[name]);
    if (value) headers[name] = value;
  }
  return headers;
}

function hostAllowed(value) {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" && url.protocol !== "http:") return false;
    const host = url.hostname.toLowerCase();
    return ASSET_HOSTS.some((allowed) => host === allowed || host.endsWith("." + allowed));
  } catch {
    return false;
  }
}

// Injected at the top of the loader. Creatives live on the ad CDNs, so the img
// src it sets is pointed back at ?what=asset whenever the proxy can reach that
// host; any other host is left exactly as the ad network asked for.
const PROXY_HELPER = [
  "",
  "// Added by the hub's proxy: keep creatives on this origin when their host is",
  "// one the proxy can fetch, so a blocked CDN shows the ad, not a broken image.",
  "function bvProxyUrl(u) {",
  "  if (typeof u !== 'string' || !/^https?:\\/\\//i.test(u)) return u;",
  "  var host = u.replace(/^https?:\\/\\//i, '').split('/')[0].toLowerCase();",
  "  var hosts = " + JSON.stringify(ASSET_HOSTS) + ";",
  "  for (var i = 0; i < hosts.length; i += 1) {",
  "    var h = hosts[i];",
  "    if (host === h || host.slice(-(h.length + 1)) === '.' + h) {",
  "      return '/api/bidvertiser?what=asset&u=' + encodeURIComponent(u);",
  "    }",
  "  }",
  "  return u;",
  "}",
  "",
].join("\n");

function rewriteWidget(js) {
  return js
    // Ad data, loaded as JSONP. The loader finds the widget by looking for a
    // script whose src holds "bidvertiser" and "bvwidgetid", and this URL still
    // carries both, so the lookup keeps working.
    .replace(
      /\/\/bdvjs\.bidvertiser\.com\/bidvertiser\.dbm\?pid=/i,
      "/api/bidvertiser?what=data&pid="
    )
    // The native markup, fetched with XHR from the ad CDN.
    .replace(
      /pcol\s*\+\s*':\/\/d2b9l3u54v5v39\.cloudfront\.net\/active\/bdvw\.html\?cb='/i,
      "location.origin + '/api/bidvertiser?what=markup&cb='"
    )
    // The creative image, plus the placeholder used when an ad has no image.
    .replace(
      /imageElement\.src\s*=\s*bv_ad_adsource;/i,
      "imageElement.src = bvProxyUrl(bv_ad_adsource);"
    )
    .replace(
      /"https:\/\/d2b9l3u54v5v39\.cloudfront\.net\/images\/get50\.png"/i,
      "bvProxyUrl('https://d2b9l3u54v5v39.cloudfront.net/images/get50.png')"
    )
    // The helper has to exist before the IIFE body runs.
    .replace(/\(\s*function\s*\(\s*\)\s*\{/, (open) => open + PROXY_HELPER);
}

async function loadWidget() {
  if (widgetCache && Date.now() - widgetCache.at < WIDGET_TTL_MS) return widgetCache.body;
  const res = await fetch(WIDGET_JS, { headers: { "User-Agent": BROWSER_UA } });
  if (!res.ok) throw new Error("BidVertiser widget returned " + res.status);
  const body = rewriteWidget(await res.text());
  widgetCache = { at: Date.now(), body };
  return body;
}

async function serveWidget(res) {
  try {
    const body = await loadWidget();
    res.setHeader("Content-Type", "application/javascript; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=600, s-maxage=3600");
    return res.status(200).send(body);
  } catch {
    return res.status(502).send("/* BidVertiser widget unavailable */");
  }
}

async function serveData(req, res) {
  const url = new URL(req.url || "/api/bidvertiser", "https://local");
  const params = new URLSearchParams(url.search);
  params.delete("what");
  // The loader hardcodes an old cip; the real visitor IP belongs here so the
  // feed targets the device that will see the ad.
  params.set("cip", visitorIp(req));

  const headers = fetchHeaders(req);
  let body = null;
  for (const url of DATA_URLS) {
    try {
      const upstream = await fetch(url + "?" + params.toString(), { headers });
      if (!upstream.ok) continue;
      body = await upstream.text();
      break;
    } catch {
      // Try the next origin; a TLS refusal on one says nothing about the other.
    }
  }
  if (body === null) return res.status(502).send("/* BidVertiser data unavailable */");
  res.setHeader("Content-Type", "application/javascript; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  return res.status(200).send(body);
}

async function serveMarkup(req, res) {
  const url = new URL(req.url || "/api/bidvertiser", "https://local");
  const cb = (url.searchParams.get("cb") || "").replace(/\D/g, "").slice(0, 20) || String(Date.now());

  try {
    const upstream = await fetch(MARKUP_URL + "?cb=" + cb, { headers: fetchHeaders(req) });
    const body = await upstream.text();
    if (!upstream.ok) return res.status(502).end();
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("X-Content-Type-Options", "nosniff");
    return res.status(200).send(body);
  } catch {
    return res.status(502).end();
  }
}

async function serveAsset(req, res) {
  const url = new URL(req.url || "/api/bidvertiser", "https://local");
  const target = url.searchParams.get("u") || "";
  if (!hostAllowed(target)) return res.status(400).send("Unsupported asset host.");

  try {
    const upstream = await fetch(target, { headers: fetchHeaders(req) });
    if (!upstream.ok) return res.status(502).end();
    const type = upstream.headers.get("content-type") || "image/png";
    if (!/^image\//i.test(type)) return res.status(415).end();
    const body = Buffer.from(await upstream.arrayBuffer());
    if (body.length > ASSET_MAX_BYTES) return res.status(413).end();
    res.setHeader("Content-Type", type);
    res.setHeader("Cache-Control", "public, max-age=86400, s-maxage=604800, immutable");
    res.setHeader("X-Content-Type-Options", "nosniff");
    return res.status(200).send(body);
  } catch {
    return res.status(502).end();
  }
}

function tag(block, name) {
  const m = block.match(new RegExp("<" + name + ">\\s*(?:<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>|([\\s\\S]*?))\\s*</" + name + ">", "i"));
  return m ? (m[1] ?? m[2] ?? "").trim() : "";
}

async function serveFeed(req, res) {
  res.setHeader("Cache-Control", "no-store");

  const url = new URL(req.url || "/api/bidvertiser", "https://local");
  const h = req.headers;
  const ip = visitorIp(req);
  const max = Math.min(Math.max(Number(url.searchParams.get("max")) || 5, 1), 10);
  const keywords = (url.searchParams.get("q") || "games").slice(0, 100);
  const ref = (url.searchParams.get("ref") || first(h.referer)).slice(0, 500);
  const subid = (url.searchParams.get("subid") || "xml1").replace(/[^\w-]/g, "").slice(0, 40) || "xml1";

  const p = new URLSearchParams({
    pid: "945850", bid: "2108662", xml: "1", czero: "4", dlt: "0",
    maxcount: String(max), ownid: subid, Kterm: keywords, cip: ip, bvref: ref,
    u_agnt: first(h["user-agent"]), bvlang: first(h["accept-language"]).split(",")[0],
    "ch-ua": first(h["sec-ch-ua"]), "ch-ua-mobile": first(h["sec-ch-ua-mobile"]),
    "ch-ua-platform": first(h["sec-ch-ua-platform"]),
    "ch-ua-platform-version": first(h["sec-ch-ua-platform-version"]),
    "ch-ua-full-version-list": first(h["sec-ch-ua-full-version-list"]),
  });
  const userId = (url.searchParams.get("user_id") || "").replace(/[^\w-]/g, "").slice(0, 64);
  if (userId) p.set("user_id", userId);

  try {
    const r = await fetch(FEED + "?" + p.toString(), { headers: { "User-Agent": first(h["user-agent"]) } });
    const xml = await r.text();
    if (!r.ok) return res.status(502).json({ ok: false, error: "BidVertiser returned " + r.status, ads: [] });
    const ads = [...xml.matchAll(/<adcontent>([\s\S]*?)<\/adcontent>/gi)].map((m) => ({
      title: tag(m[1], "title"),
      description: tag(m[1], "description"),
      displayURL: tag(m[1], "displayURL"),
      redirect: tag(m[1], "redirect"),
      image: tag(m[1], "image"),
    })).filter((a) => /^https?:\/\//i.test(a.redirect));
    return res.status(200).json({ ok: true, ads });
  } catch (e) {
    return res.status(502).json({ ok: false, error: "Could not reach BidVertiser.", ads: [] });
  }
}

module.exports = async function handler(req, res) {
  if (req.method !== "GET" && req.method !== "HEAD") return res.status(405).json({ ok: false, error: "Use GET." });

  const url = new URL(req.url || "/api/bidvertiser", "https://local");
  switch ((url.searchParams.get("what") || "").toLowerCase()) {
    case "bdvws":
      return serveWidget(res);
    case "data":
      return serveData(req, res);
    case "markup":
      return serveMarkup(req, res);
    case "asset":
      return serveAsset(req, res);
    default:
      return serveFeed(req, res);
  }
};
