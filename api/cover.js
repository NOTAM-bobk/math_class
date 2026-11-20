// Game covers are live screenshots of the game page. The screenshot service
// lives on its own host, which school filters block, so the image is fetched
// here and streamed from the site's own domain instead.
const SHOT_BASE = "https://image.thum.io/get/width/800/crop/800/";
const MAX_BYTES = 4_000_000;

function isPublicPage(value) {
  if (!/^https?:\/\//i.test(value)) return false;
  try {
    const host = new URL(value).hostname;
    if (!host || host === "localhost" || host === "127.0.0.1") return false;
    return host.includes(".");
  } catch {
    return false;
  }
}

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "GET" && req.method !== "HEAD") {
    return res.status(405).json({ ok: false, error: "Use GET for a game cover." });
  }

  const url = new URL(req.url || "/api/cover", "https://polytrack.local");
  const target = url.searchParams.get("url") || "";
  if (!isPublicPage(target)) {
    return res.status(400).json({ ok: false, error: "A public http(s) game page is required." });
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20_000);
  try {
    const response = await fetch(`${SHOT_BASE}${target}`, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        Accept: "image/*",
      },
    });
    if (!response.ok) {
      return res.status(response.status === 404 ? 404 : 502).json({
        ok: false,
        error: "That cover could not be captured.",
      });
    }
    const type = (response.headers.get("content-type") || "").split(";")[0].trim().toLowerCase();
    if (!type.startsWith("image/")) {
      return res.status(502).json({ ok: false, error: "The cover service sent no image." });
    }
    const bytes = Buffer.from(await response.arrayBuffer());
    if (bytes.length === 0 || bytes.length > MAX_BYTES) {
      return res.status(502).json({ ok: false, error: "The cover was empty or too large." });
    }
    res.setHeader("Content-Type", type);
    // Covers change rarely, so the edge keeps them for a week.
    res.setHeader("Cache-Control", "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400");
    return res.status(200).send(bytes);
  } catch {
    return res.status(504).json({ ok: false, error: "The cover service did not answer." });
  } finally {
    clearTimeout(timer);
  }
};
