// Imports games from the GameMonetize feed into the catalog.
//
// The feed is the one the site asks for ("format=0&num=50&page=1" returns every
// game, newest first). Each game keeps its own html5.gamemonetize.co player URL,
// so nothing is copied into this repo, and its thumbnail is saved under ./covers
// so the cards keep working when the image host is blocked.
//
// GameMonetize tags the games it built for phones with "Mobile"; portrait
// games are treated as mobile too. The catalog's Mobile filter reads that flag.
//
// Usage: node scripts/import-gamemonetize.mjs
//   GM_START=4 GM_PAGES=5   fetch pages 4-8 and append them to the current list
//   GM_PAGES=2              fetch pages 1-2 from scratch
//   GM_REFRESH=1            rebuild the whole list from the fetched pages
//
// Runs are incremental: the entries already in src/data/gamemonetizeGames.ts
// are kept (and skipped by name, URL and id), so a new range of pages can be
// imported without refetching the earlier ones.

import fs from "node:fs";
import path from "node:path";

const FEED_BASE = "https://gamemonetize.com/feed.php?format=0&num=50&page=";
const START_PAGE = Math.max(1, Number(process.env.GM_START) || 1);
const PAGES = Math.max(1, Number(process.env.GM_PAGES) || 3);
const END_PAGE = START_PAGE + PAGES - 1;
const REFRESH = process.env.GM_REFRESH === "1";
const CATALOG_PATH = "catalog.json";
const OUT_PATH = "src/data/gamemonetizeGames.ts";
const COVER_DIR = "covers";
const COVER_CONCURRENCY = 4;
const FEED_DELAY_MS = 20_000;
const DESCRIPTION_LIMIT = 220;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const normalize = (value) => String(value || "").toLowerCase().replace(/[^a-z0-9]/g, "");

function decodeEntities(value) {
  return String(value || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&apos;|&#0?39;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&hellip;/gi, "…")
    .replace(/&mdash;/gi, "—")
    .replace(/&ndash;/gi, "–")
    .replace(/&rsquo;|&lsquo;/gi, "'")
    .replace(/&ldquo;|&rdquo;/gi, '"')
    .replace(/&middot;/gi, "·")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/\s+/g, " ")
    .trim();
}

function trimDescription(value) {
  const text = decodeEntities(value);
  if (text.length <= DESCRIPTION_LIMIT) return text;
  const cut = text.slice(0, DESCRIPTION_LIMIT);
  const lastSpace = cut.lastIndexOf(" ");
  return `${cut.slice(0, lastSpace > 80 ? lastSpace : DESCRIPTION_LIMIT).replace(/[.,;:\s]+$/, "")}…`;
}

function slugFor(title) {
  return String(title || "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/['’]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

function tagsFor(entry, mobile) {
  const category = decodeEntities(entry.category);
  const tags = [];
  const add = (tag) => {
    const clean = String(tag || "").trim();
    if (!clean) return;
    const key = clean.toLowerCase();
    if (key === "html5" || tags.some((existing) => existing.toLowerCase() === key)) return;
    tags.push(clean);
  };

  if (category) add(category);
  if (/hypercasual/i.test(category)) add("Casual");
  if (/clicker/i.test(category)) add("Idle");

  for (const tag of String(entry.tags || "").split(",")) {
    const clean = decodeEntities(tag);
    if (!clean || clean.length > 28) continue;
    if (/gamemonetize|html5|mobile$/i.test(clean) && !/^mobile$/i.test(clean)) continue;
    add(clean.charAt(0).toUpperCase() + clean.slice(1));
    if (tags.length >= 6) break;
  }
  if (mobile) add("Mobile");
  return tags.slice(0, 7);
}

function isMobile(entry, feedTags) {
  if (feedTags.some((tag) => tag.trim().toLowerCase() === "mobile")) return true;
  return Number(entry.height) > Number(entry.width);
}

async function fetchPage(page) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    const response = await fetch(`${FEED_BASE}${page}`, {
      headers: { Accept: "application/json", "User-Agent": "polytrack-catalog-import/1.0" },
    });
    if (response.ok) return await response.json();
    if (response.status !== 429) throw new Error(`Feed page ${page} returned ${response.status}`);
    const wait = Math.max(Number(response.headers.get("retry-after")) || 30, 15);
    console.warn(`  feed page ${page} rate-limited; waiting ${wait}s`);
    await sleep(wait * 1000);
  }
  throw new Error(`Feed page ${page} stayed rate-limited`);
}

async function downloadCover(game) {
  const thumb = game.thumb;
  if (!thumb) return "";
  fs.mkdirSync(COVER_DIR, { recursive: true });
  const existing = fs.readdirSync(COVER_DIR).find((file) => file.startsWith(`${game.id}.`));
  if (existing) return `/covers/${existing}`;
  try {
    const response = await fetch(thumb, { headers: { Accept: "image/*" } });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const buffer = Buffer.from(await response.arrayBuffer());
    if (buffer.length < 1024) throw new Error("file too small");
    const type = response.headers.get("content-type") || "";
    const extension = type.includes("png") ? "png" : type.includes("webp") ? "webp" : "jpg";
    const file = `${game.id}.${extension}`;
    fs.writeFileSync(path.join(COVER_DIR, file), buffer);
    return `/covers/${file}`;
  } catch (error) {
    console.warn(`  ! cover for ${game.name}: ${error.message}`);
    return "";
  }
}

// The generated file is the running list this script appends to.
function loadExistingGames() {
  if (!fs.existsSync(OUT_PATH)) return [];
  const source = fs.readFileSync(OUT_PATH, "utf8");
  const match = source.match(/GAMEMONETIZE_GAMES[^=]*=\s*(\[[\s\S]*\]);\s*$/);
  if (!match) return [];
  try {
    const parsed = JSON.parse(match[1]);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function main() {
  const catalog = fs.existsSync(CATALOG_PATH) ? JSON.parse(fs.readFileSync(CATALOG_PATH, "utf8")) : [];
  const existing = REFRESH ? [] : loadExistingGames();
  const seenNames = new Set();
  const seenUrls = new Set();
  const seenIds = new Set();

  for (const game of Array.isArray(catalog) ? catalog : []) {
    // The GameMonetize entries are the ones this script owns, so they are
    // deduped through `existing` below instead of skipping everything.
    if (typeof game?.id === "string" && game.id.startsWith("gm-")) continue;
    seenIds.add(game?.id);
    seenNames.add(normalize(game?.name));
    seenUrls.add(String(game?.url || "").replace(/\/+$/, ""));
  }
  for (const game of existing) {
    seenIds.add(game?.id);
    seenNames.add(normalize(game?.name));
    seenUrls.add(String(game?.url || "").replace(/\/+$/, ""));
  }

  const imported = [];
  for (let page = START_PAGE; page <= END_PAGE; page++) {
    if (page > START_PAGE) await sleep(FEED_DELAY_MS);
    console.log(`Fetching feed page ${page} (${page - START_PAGE + 1}/${PAGES})…`);
    const entries = await fetchPage(page);
    for (const entry of Array.isArray(entries) ? entries : []) {
      const name = decodeEntities(entry.title);
      const url = String(entry.url || "");
      if (!name || !url) continue;
      if (seenNames.has(normalize(name)) || seenUrls.has(url.replace(/\/+$/, ""))) continue;

      const feedTags = String(entry.tags || "").split(",");
      const mobile = isMobile(entry, feedTags);
      let id = `gm-${slugFor(name)}`;
      if (!slugFor(name) || seenIds.has(id)) id = `gm-${slugFor(name) || "game"}-${entry.id}`;
      if (seenIds.has(id)) continue;

      const game = {
        id,
        name,
        url,
        description: trimDescription(entry.description),
        tags: tagsFor(entry, mobile),
        mobile,
        thumb: entry.thumb,
      };
      seenIds.add(id);
      seenNames.add(normalize(name));
      seenUrls.add(url.replace(/\/+$/, ""));
      imported.push(game);
    }
  }

  if (imported.length === 0) throw new Error("No new games found in the GameMonetize feed");

  const games = [];
  for (let index = 0; index < imported.length; index += COVER_CONCURRENCY) {
    const batch = imported.slice(index, index + COVER_CONCURRENCY);
    const covers = await Promise.all(batch.map(downloadCover));
    batch.forEach((game, offset) => {
      const { thumb, ...entry } = game;
      if (!covers[offset]) entry.coverless = true;
      games.push(entry);
    });
  }
  for (const game of games) delete game.coverless;

  const combined = [...existing, ...games];
  const date = new Date().toISOString().slice(0, 10);
  const mobileCount = combined.filter((game) => game.mobile).length;
  const source = `import type { GameItem } from "./gameItem";

// Games from the GameMonetize feed
// (https://gamemonetize.com/feed.php?format=0&num=50&page=1), imported on
// ${date} in batches (this run: pages ${START_PAGE}-${END_PAGE}). Each entry keeps the feed's own player URL, so
// the games load from html5.gamemonetize.co instead of being copied into this
// repo. Entries the feed tags as "Mobile" (or that ship a portrait player) carry
// \`mobile: true\`, which is what the catalog's Mobile filter selects. Their
// thumbnails are saved under ./covers so the cards survive the image host being
// blocked. Re-run scripts/import-gamemonetize.mjs to refresh the list.
export const GAMEMONETIZE_GAMES: GameItem[] = ${JSON.stringify(combined, null, 2)};
`;

  fs.writeFileSync(OUT_PATH, source);
  console.log(
    `Wrote ${OUT_PATH} (${games.length} new, ${combined.length} total, ${mobileCount} mobile)`
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
