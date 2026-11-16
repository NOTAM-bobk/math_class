module.exports = async function handler(req, res) {
  try {
    const host = req.headers["x-forwarded-host"] || req.headers.host || "localhost";
    const url = new URL(req.url, `https://${host}`);
    const seed = url.searchParams.get("seed") || "Racer";
    const style = url.searchParams.get("style") || "bottts";

    // Sanitize style to alphanumeric and hyphens
    const safeStyle = /^[a-z0-9-]+$/i.test(style) ? style : "bottts";
    const dicebearUrl = `https://api.dicebear.com/9.x/${encodeURIComponent(safeStyle)}/svg?seed=${encodeURIComponent(seed)}`;

    const upstream = await fetch(dicebearUrl, {
      headers: {
        "User-Agent": "PolyTrack-Hub/1.0",
        "Accept": "image/svg+xml",
      },
    });

    if (upstream.ok) {
      const svg = await upstream.text();
      res.setHeader("Content-Type", "image/svg+xml; charset=utf-8");
      res.setHeader("Cache-Control", "public, max-age=86400, s-maxage=604800, stale-while-revalidate=2592000");
      return res.status(200).send(svg);
    }
  } catch (err) {
    console.error("Avatar proxy error:", err);
  }

  // Graceful fallback SVG if upstream is unreachable or times out
  const seed = (req.query && req.query.seed) ? String(req.query.seed) : "R";
  const initial = seed.charAt(0).toUpperCase() || "R";
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colors = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#06b6d4"];
  const bg = colors[Math.abs(hash) % colors.length];
  const fallbackSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><rect width="100" height="100" rx="50" fill="${bg}"/><text x="50" y="63" font-size="44" font-weight="bold" fill="#ffffff" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif">${initial}</text></svg>`;

  res.setHeader("Content-Type", "image/svg+xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  return res.status(200).send(fallbackSvg);
};
