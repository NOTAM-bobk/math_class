// Server-side catalog search. The client used to filter the whole catalog in the
// browser; now the query goes to this route, which filters the same JSON catalog
// the bundle is built from and lets the CDN cache the response.
const catalog = require("./_catalog.json");

const MAX_RESULTS = 120;

function terms(query) {
  return String(query || "")
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

function searchableText(game) {
  return [game.name, game.description, ...(Array.isArray(game.tags) ? game.tags : [])]
    .join(" ")
    .toLowerCase();
}

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  // Search is stable for a short while and safe to serve from the edge cache.
  res.setHeader("Cache-Control", "public, max-age=0, s-maxage=60, stale-while-revalidate=300");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({ ok: false, error: "Use GET to search the catalog." });
  }

  const url = new URL(req.url || "/api/search", "https://polytrack.local");
  const query = url.searchParams.get("q") || "";
  const limit = Math.min(Math.max(Number(url.searchParams.get("limit")) || MAX_RESULTS, 1), MAX_RESULTS);
  const words = terms(query);

  const matches = words.length
    ? catalog.filter((game) => {
        const text = searchableText(game);
        return words.every((word) => text.includes(word));
      })
    : catalog;

  return res.status(200).json({
    ok: true,
    query,
    total: matches.length,
    games: matches.slice(0, limit),
  });
};
