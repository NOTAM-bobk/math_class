// BidVertiser XML feed (pid 945850, bid 2108662). The feed needs the visitor's IP,
// user agent and page URL to match the click, so the request is built here on the
// server from the visitor's own headers, then the XML is turned into JSON for the page.
const FEED = "http://2108662.bdv-w.bidvertiser.com/BidVertiser.dbm";

function first(v) {
  return Array.isArray(v) ? v[0] : v || "";
}

function tag(block, name) {
  const m = block.match(new RegExp("<" + name + ">\\s*(?:<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>|([\\s\\S]*?))\\s*</" + name + ">", "i"));
  return m ? (m[1] ?? m[2] ?? "").trim() : "";
}

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "GET") return res.status(405).json({ ok: false, error: "Use GET." });

  const url = new URL(req.url || "/api/bidvertiser", "https://local");
  const h = req.headers;
  const ip = first(h["x-forwarded-for"]).split(",")[0].trim() || first(h["x-real-ip"]) || (req.socket && req.socket.remoteAddress) || "";
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
};
