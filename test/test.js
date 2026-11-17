import { coverSvg } from "./covers.js";

const grid = document.getElementById("grid");
const countLabel = document.getElementById("count");

// Real captures live in test/covers and are listed in manifest.json; anything
// missing from it falls back to the generated cover art.
let realCovers = new Map();

const BADGE_ICONS = {
  featured:
    '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.4l2.8 6.1 6.7.8-5 4.5 1.4 6.6-5.9-3.3-5.9 3.3 1.4-6.6-5-4.5 6.7-.8z"/></svg>',
  trending:
    '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13.4 2c.4 3.1-.9 4.7-2.3 6.2-1.3 1.4-2.7 2.8-2.7 5.3a5.6 5.6 0 0011.2.3c0-2.3-1-4.4-2.6-6.2-.3 1.6-1 2.4-1.9 2.8.6-3.4-.3-6.4-1.7-8.4z"/><path d="M9 15.4c0 2.9 1.9 4.9 4.4 4.9 2.6 0 4.4-1.9 4.4-4.6 0-1.1-.3-2-1-3.1-.4 1.4-1.2 2.1-2.2 2.3.2-1.8-.3-3.3-1.3-4.6-.2 2.6-1.4 3.4-2.6 4.4-.9.8-1.7 1.6-1.7 3.1z" opacity=".55"/></svg>',
  fresh:
    '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2l2 7.4L21 12l-7 2.6L12 22l-2-7.4L3 12l7-2.6z"/></svg>'
};

const BADGES = {
  featured: { className: "featured", label: "Featured", icon: BADGE_ICONS.featured },
  trending: { className: "trending", label: "Trending", icon: BADGE_ICONS.trending },
  fresh: { className: "fresh", label: "Fresh", icon: BADGE_ICONS.fresh }
};

// A repeating size rhythm keeps the mosaic dense without random gaps.
// Every size spans a multiple of three grid rows, so a tall tile beside a
// normal one leaves a gap the next tile can still fill instead of a dead hole.
const SIZE_CYCLE = [
  "std",
  "hero",
  "std",
  "tall",
  "std",
  "std",
  "hero",
  "std",
  "std",
  "std",
  "tall",
  "std",
  "std",
  "hero",
  "std",
  "std"
];

const PLAY_ICON =
  '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.2v13.6L19 12z"/></svg>';

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function hashString(value) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function badgeFor(game, seed) {
  if (game.disabled) return null;
  if (game.editorsPick) return BADGES.featured;
  if (/polytrack/i.test(game.name)) return BADGES.trending;
  const pick = seed % 7;
  if (pick === 0 || pick === 1) return BADGES.fresh;
  if (pick === 3) return BADGES.trending;
  return null;
}

function tileMarkup(game, index, total) {
  const name = game.name || "Game";
  const url = game.url && game.url !== "#" ? game.url : "/";
  const description = game.description || "";
  // The tail of the catalog stays single-column so the mosaic ends in even rows
  // instead of a wide notch under the last large tile.
  const size = index >= total - 3 ? "std" : SIZE_CYCLE[index % SIZE_CYCLE.length];
  const badge = badgeFor(game, hashString(name));
  const label = description ? `${name} — ${description}` : name;
  const realCover = realCovers.get(url);
  const art = realCover
    ? `<img src="/test/covers/${realCover}" alt="" loading="lazy" decoding="async">`
    : coverSvg(game, index);

  return `<a class="tile" data-size="${size}"${realCover ? ' data-real="true"' : ''} href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer" aria-label="${escapeHtml(label)}">
      <span class="tile-art" aria-hidden="true">${art}</span>
      <span class="tile-shade" aria-hidden="true"></span>
      ${badge ? `<span class="badge badge--${badge.className}">${badge.icon}${badge.label}</span>` : ""}
      <span class="tile-title">${escapeHtml(name)}</span>
      <span class="tile-overlay">
        <span class="tile-name">${escapeHtml(name)}</span>
        ${description ? `<span class="tile-desc">${escapeHtml(description)}</span>` : ""}
        <span class="tile-cta">${PLAY_ICON}Play</span>
      </span>
    </a>`;
}

function render(games) {
  grid.innerHTML = games.map((game, index) => tileMarkup(game, index, games.length)).join("");
  countLabel.textContent = `${games.length} game${games.length === 1 ? "" : "s"}`;
}

async function start() {
  try {
    const [response, coversResponse] = await Promise.all([
      fetch("/games/config.json", { cache: "no-store" }),
      fetch("/test/covers/manifest.json", { cache: "no-store" }).catch(() => null)
    ]);
    if (!response.ok) throw new Error(`Catalog responded ${response.status}`);
    const data = await response.json();
    const games = Array.isArray(data) ? data : data && Array.isArray(data.games) ? data.games : [];
    if (!games.length) throw new Error("Catalog is empty");
    if (coversResponse && coversResponse.ok) {
      const covers = await coversResponse.json().catch(() => []);
      if (Array.isArray(covers)) {
        realCovers = new Map(covers.filter((entry) => entry && entry.url && entry.file).map((entry) => [entry.url, entry.file]));
      }
    }
    render(games);
  } catch (error) {
    countLabel.textContent = "unavailable";
    grid.innerHTML = `<p class="grid-message">Could not load the game catalog. <a href="/">Back to the hub</a> — ${escapeHtml(
      error instanceof Error ? error.message : String(error)
    )}</p>`;
  }
}

start();
