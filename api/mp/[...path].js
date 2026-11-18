// Streaming proxy for the games imported from hfmanor.com.
//
// The real game files live on games.mathpapers.org, which only answers requests
// whose Referer is its own domain (anything else gets a 301 to its activities
// page). A plain rewrite in vercel.json cannot change that header, so this
// function asks for the file with the Referer the host expects and streams the
// response straight back. Games then load from /api/mp/... on this origin, which
// keeps relative asset paths (Build/..., js/...) working and means a network that
// blocks mathpapers.org can still play them.
//
// The response is streamed rather than buffered so files over Vercel's 4.5 MB
// response limit (Unity payloads are up to ~15 MB) still come through.

const UPSTREAM_ORIGIN = "https://games.mathpapers.org";
const UPSTREAM_REFERER = "https://mathpapers.org/";
const PREFIX = "/api/mp/";

// Header the game host checks, plus a normal browser identity so it serves the
// same files it would serve a visitor.
const UPSTREAM_HEADERS = {
  Referer: UPSTREAM_REFERER,
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
};

const PASS_THROUGH = [
  "content-type",
  "content-length",
  "content-range",
  "accept-ranges",
  "last-modified",
  "etag",
];

function upstreamPath(req) {
  const url = req.url || "";
  const query = url.indexOf("?");
  const pathname = query === -1 ? url : url.slice(0, query);
  const search = query === -1 ? "" : url.slice(query);
  if (!pathname.startsWith(PREFIX)) return null;

  const segments = pathname
    .slice(PREFIX.length)
    .split("/")
    .filter(Boolean)
    .map((segment) => {
      let decoded = segment;
      try {
        decoded = decodeURIComponent(segment);
      } catch {}
      if (decoded === ".." || decoded === ".") return null;
      return encodeURIComponent(decoded);
    });

  if (!segments.length || segments.some((segment) => segment === null)) return null;
  return `/${segments.join("/")}${search}`;
}

module.exports = async function handler(req, res) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.setHeader("Allow", "GET, HEAD");
    return res.status(405).json({ ok: false, error: "Use GET to load a game file." });
  }

  const target = upstreamPath(req);
  if (!target) {
    return res.status(400).json({ ok: false, error: "Missing game file path." });
  }

  let upstream;
  try {
    upstream = await fetch(`${UPSTREAM_ORIGIN}${target}`, {
      headers: {
        ...UPSTREAM_HEADERS,
        Accept: req.headers.accept || "*/*",
        "Accept-Encoding": "identity",
        ...(req.headers.range ? { Range: req.headers.range } : {}),
      },
      redirect: "manual",
    });
  } catch {
    res.setHeader("Cache-Control", "no-store");
    return res.status(502).json({ ok: false, error: "The game host did not respond." });
  }

  // The host redirects anything it does not want to serve to its activities page;
  // report that as a missing file instead of bouncing the browser off-site.
  if (upstream.status >= 300 && upstream.status < 400) {
    res.setHeader("Cache-Control", "no-store");
    return res.status(404).json({ ok: false, error: "That game file is not available." });
  }

  res.statusCode = upstream.status;
  for (const header of PASS_THROUGH) {
    const value = upstream.headers.get(header);
    if (value) res.setHeader(header, value);
  }
  res.setHeader(
    "Cache-Control",
    /\.html?$/i.test(target.split("?")[0]) ? "public, max-age=300" : "public, max-age=86400",
  );

  if (req.method === "HEAD" || !upstream.body) {
    return res.end();
  }

  const { Readable } = require("node:stream");
  const body = Readable.fromWeb(upstream.body);
  body.on("error", () => res.destroy());
  res.on("close", () => body.destroy());
  body.pipe(res);
};

module.exports.config = { maxDuration: 60 };
