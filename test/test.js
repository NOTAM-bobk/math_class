import { coverSvg, slugKey } from "./covers.js";

const grid = document.getElementById("grid");
const countLabel = document.getElementById("count");
const flagNote = document.getElementById("flag-note");

// /test runs both from the deployed site (where /api/flags is same-origin) and
// from a plain static preview, so the Cloudflare flag list is fetched from the
// first origin that answers.
const FLAG_ORIGINS = ["", "https://poly2.benlaunches.icu"];

const EMPTY_FLAGS = {
  verified: new Set(),
  buggy: new Set(),
  notMobile: new Set(),
  blocked: new Set()
};

const PLAY_ICON =
  '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.2v13.6L19 12z"/></svg>';

// The hub's own status chips, in the order the hub shows them.
const FLAGS = {
  verified: { className: "verified", label: "✅ Verified", title: "Verified working" },
  editorsPick: { className: "editor", label: "Editor's Pick", title: "Editor's Pick" },
  buggy: { className: "bug", label: "error:bug", title: "Known bug or issue reported for this game" },
  notMobile: { className: "mobile", label: "no mobile", title: "Not optimized for mobile — best played on desktop" },
  blocked: { className: "blocked", label: "Blocked:😿", title: "Blocked site or game" }
};

// Seven hero tiles spread across the catalog break up the grid without
// cropping art: both sizes keep the cover's 4:3 frame, and both span a
// multiple of three grid rows, so the dense packing never leaves a hole.
const HERO_INDICES = new Set([1, 8, 15, 22, 29, 36, 43]);

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function flagsFor(entry, ids) {
  const active = [];
  const hit = (set) => ids.some((id) => set.has(id));
  if (hit(flags.verified) || (entry && entry.verified)) active.push(FLAGS.verified);
  if (entry && entry.editorsPick) active.push(FLAGS.editorsPick);
  if (hit(flags.buggy) || (entry && entry.errorBug)) active.push(FLAGS.buggy);
  if (hit(flags.notMobile)) active.push(FLAGS.notMobile);
  if (hit(flags.blocked)) active.push(FLAGS.blocked);
  return active;
}

function flagMarkup(list) {
  if (!list.length) return "";
  return `<span class="tile-flags">${list
    .map((flag) => `<span class="badge badge--${flag.className}" title="${escapeHtml(flag.title)}">${escapeHtml(flag.label)}</span>`)
    .join("")}</span>`;
}

function tagMarkup(tags) {
  if (!tags || !tags.length) return "";
  return `<span class="tile-tags">${tags
    .map((tag) => `<span class="tile-tag">${escapeHtml(tag)}</span>`)
    .join("")}</span>`;
}

function tileMarkup(game, entry, index, total) {
  const name = game.name || "Game";
  const url = game.url && game.url !== "#" ? game.url : "/";
  const description = game.description || "";
  // The tail of the catalog stays single-column so the mosaic ends in even rows
  // instead of a wide notch under the last large tile.
  const size = index >= total - 3 || !HERO_INDICES.has(index) ? "std" : "hero";
  const ids = [entry && entry.hubId, entry && entry.cfgId, game.id, `cfg-${game.subdomain ?? index}`].filter(Boolean);
  const activeFlags = flagsFor(entry, ids);
  const tags = (entry && entry.tags && entry.tags.length ? entry.tags : [game.category || "Catalog"]).slice(0, 3);
  const label = description ? `${name} — ${description}` : name;

  return `<a class="tile" data-size="${size}" href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer" aria-label="${escapeHtml(label)}">
      <span class="tile-art" aria-hidden="true">${coverSvg(game)}</span>
      <span class="tile-shade" aria-hidden="true"></span>
      <span class="tile-overlay" aria-hidden="true">
        ${description ? `<span class="tile-desc">${escapeHtml(description)}</span>` : ""}
        <span class="tile-cta">${PLAY_ICON}Play</span>
      </span>
      ${flagMarkup(activeFlags)}
      <span class="tile-foot">
        <span class="tile-title">${escapeHtml(name)}</span>
        ${tagMarkup(tags)}
      </span>
    </a>`;
}

function render(games, meta) {
  grid.innerHTML = games
    .map((game, index) => tileMarkup(game, meta.get(slugKey(game.name)), index, games.length))
    .join("");
  countLabel.textContent = `${games.length} game${games.length === 1 ? "" : "s"}`;
}

async function loadFlags() {
  for (const origin of FLAG_ORIGINS) {
    try {
      const response = await fetch(`${origin}/api/flags`, { cache: "no-store" });
      if (!response.ok) continue;
      const data = await response.json();
      if (!data || typeof data !== "object") continue;
      return {
        source: origin || "this site",
        flags: {
          verified: new Set(data.verified || []),
          buggy: new Set(data.buggy || []),
          notMobile: new Set(data.notMobile || []),
          blocked: new Set(data.blocked || [])
        }
      };
    } catch {
      // Try the next origin.
    }
  }
  return { source: null, flags: EMPTY_FLAGS };
}

async function loadMeta() {
  const response = await fetch("/test/catalog-meta.json", { cache: "no-store" });
  if (!response.ok) throw new Error(`Tag data responded ${response.status}`);
  const data = await response.json();
  return new Map(Object.entries(data && data.games ? data.games : data || {}));
}

async function start() {
  try {
    const [response, match] = await Promise.all([
      fetch("/games/config.json", { cache: "no-store" }),
      Promise.all([loadMeta(), loadFlags()])
    ]);
    if (!response.ok) throw new Error(`Catalog responded ${response.status}`);
    const data = await response.json();
    const games = Array.isArray(data) ? data : data && Array.isArray(data.games) ? data.games : [];
    if (!games.length) throw new Error("Catalog is empty");

    const [meta, flagState] = match;
    flags = flagState.flags;
    if (flagNote) {
      flagNote.textContent = flagState.source
        ? `tags + flags from Cloudflare · ${flagState.source}`
        : "tags from the hub · flags unavailable";
    }
    render(games, meta);
  } catch (error) {
    countLabel.textContent = "unavailable";
    grid.innerHTML = `<p class="grid-message">Could not load the game catalog. <a href="/">Back to the hub</a> — ${escapeHtml(
      error instanceof Error ? error.message : String(error)
    )}</p>`;
  }
}

let flags = EMPTY_FLAGS;

start();
