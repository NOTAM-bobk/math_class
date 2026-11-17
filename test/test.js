import { coverSvg, slugKey } from "./covers.js";

const grid = document.getElementById("grid");
const countLabel = document.getElementById("count");
const flagNote = document.getElementById("flag-note");
const searchInput = document.getElementById("search");
const filterToggle = document.getElementById("filter-toggle");
const filterMenu = document.getElementById("filter-menu");
const filterDot = document.getElementById("filter-dot");

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
  verified: { key: "verified", className: "verified", label: "✅ Verified", title: "Verified working" },
  editorsPick: { key: "editorsPick", className: "editor", label: "Editor's Pick", title: "Editor's Pick" },
  buggy: { key: "buggy", className: "bug", label: "error:bug", title: "Known bug or issue reported for this game" },
  notMobile: { key: "notMobile", className: "mobile", label: "no mobile", title: "Not optimized for mobile — best played on desktop" },
  blocked: { key: "blocked", className: "blocked", label: "Blocked:😿", title: "Blocked site or game" }
};

const STATUS_FILTERS = [
  { id: "verified", label: "Verified" },
  { id: "buggy", label: "Error: bug" },
  { id: "notMobile", label: "No mobile" },
  { id: "blocked", label: "Blocked" }
];

// Seven hero tiles spread across the catalog break up the grid without
// cropping art: both sizes keep the cover's 4:3 frame, and both span a
// multiple of three grid rows, so the dense packing never leaves a hole.
const HERO_INDICES = new Set([1, 8, 15, 22, 29, 36, 43]);

const state = {
  games: [],
  meta: new Map(),
  flags: EMPTY_FLAGS,
  query: "",
  status: null,
  genre: null
};

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function entryFor(game) {
  return state.meta.get(slugKey(game.name));
}

function idsFor(game, entry, index) {
  return [entry && entry.hubId, entry && entry.cfgId, game.id, `cfg-${game.subdomain ?? index}`].filter(Boolean);
}

function statusFlagsFor(game, entry, index) {
  const ids = idsFor(game, entry, index);
  const hit = (set) => ids.some((id) => set.has(id));
  const active = [];
  if (hit(state.flags.verified) || (entry && entry.verified)) active.push(FLAGS.verified);
  if (entry && entry.editorsPick) active.push(FLAGS.editorsPick);
  if (hit(state.flags.buggy) || (entry && entry.errorBug)) active.push(FLAGS.buggy);
  if (hit(state.flags.notMobile)) active.push(FLAGS.notMobile);
  if (hit(state.flags.blocked)) active.push(FLAGS.blocked);
  return active;
}

function tagsFor(game, entry) {
  return (entry && entry.tags && entry.tags.length ? entry.tags : [game.category || "Catalog"]).slice(0, 3);
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
  const label = description ? `${name} — ${description}` : name;

  return `<a class="tile" data-size="${size}" href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer" aria-label="${escapeHtml(label)}">
      <span class="tile-art" aria-hidden="true">${coverSvg(game)}</span>
      <span class="tile-shade" aria-hidden="true"></span>
      <span class="tile-overlay" aria-hidden="true">
        ${description ? `<span class="tile-desc">${escapeHtml(description)}</span>` : ""}
        <span class="tile-cta">${PLAY_ICON}Play</span>
      </span>
      ${flagMarkup(statusFlagsFor(game, entry, index))}
      <span class="tile-foot">
        <span class="tile-title">${escapeHtml(name)}</span>
        ${tagMarkup(tagsFor(game, entry))}
      </span>
    </a>`;
}

function matchesFilters(item) {
  const { game, entry, index } = item;
  if (state.status && !statusFlagsFor(game, entry, index).some((flag) => flag.key === state.status)) return false;
  if (state.genre && !tagsFor(game, entry).includes(state.genre)) return false;
  const query = state.query.trim().toLowerCase();
  if (!query) return true;
  const haystack = [game.name, game.description, game.category, ...tagsFor(game, entry), ...(entry ? [entry.hubName] : [])]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return haystack.includes(query);
}

function render() {
  const items = state.games.map((game, index) => ({ game, entry: entryFor(game), index }));
  const matches = items.filter(matchesFilters);
  const filtering = Boolean(state.query.trim() || state.status || state.genre);

  if (!matches.length) {
    const what = state.query.trim() ? `“${escapeHtml(state.query.trim())}”` : "this filter";
    grid.innerHTML = `<p class="grid-message">No games match ${what}. <button class="grid-reset" type="button" id="grid-reset">Clear filters</button></p>`;
    const reset = document.getElementById("grid-reset");
    if (reset) reset.addEventListener("click", clearFilters);
  } else {
    grid.innerHTML = matches
      .map((item) => tileMarkup(item.game, item.entry, item.index, state.games.length))
      .join("");
  }

  countLabel.textContent = filtering
    ? `${matches.length} of ${state.games.length} games`
    : `${state.games.length} game${state.games.length === 1 ? "" : "s"}`;

  if (filterDot) filterDot.hidden = !(state.status || state.genre);
}

function countFor(kind, id) {
  return state.games.reduce((total, game, index) => {
    const entry = entryFor(game);
    if (kind === "status") {
      return total + (statusFlagsFor(game, entry, index).some((flag) => flag.key === id) ? 1 : 0);
    }
    return total + (tagsFor(game, entry).includes(id) ? 1 : 0);
  }, 0);
}

function topGenres(limit = 7) {
  const counts = new Map();
  for (const game of state.games) {
    for (const tag of tagsFor(game, entryFor(game))) {
      counts.set(tag, (counts.get(tag) || 0) + 1);
    }
  }
  return [...counts.entries()]
    .filter(([, count]) => count >= 3)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([tag]) => tag);
}

function optionMarkup({ label, checked, count, action, value }) {
  return `<button class="filter-option" type="button" role="menuitemradio" aria-checked="${checked}" data-action="${action}" data-value="${escapeHtml(value ?? "")}">
      <span>${escapeHtml(label)}</span>
      <span class="filter-count">${count}</span>
    </button>`;
}

function buildFilterMenu() {
  const statusOptions = STATUS_FILTERS.map((filter) =>
    optionMarkup({
      label: filter.label,
      checked: state.status === filter.id,
      count: countFor("status", filter.id),
      action: "status",
      value: filter.id
    })
  ).join("");

  const genreOptions = topGenres()
    .map((genre) =>
      optionMarkup({
        label: genre,
        checked: state.genre === genre,
        count: countFor("genre", genre),
        action: "genre",
        value: genre
      })
    )
    .join("");

  filterMenu.innerHTML = `
    <div class="filter-group" role="group" aria-label="Status">
      <p class="filter-label">Status</p>
      ${optionMarkup({ label: "All games", checked: !state.status, count: state.games.length, action: "status", value: "" })}
      ${statusOptions}
    </div>
    <div class="filter-group" role="group" aria-label="Genre">
      <p class="filter-label">Genre</p>
      ${optionMarkup({ label: "Any genre", checked: !state.genre, count: state.games.length, action: "genre", value: "" })}
      ${genreOptions}
    </div>`;
}

function openMenu() {
  buildFilterMenu();
  filterMenu.hidden = false;
  filterToggle.setAttribute("aria-expanded", "true");
}

function closeMenu() {
  filterMenu.hidden = true;
  filterToggle.setAttribute("aria-expanded", "false");
}

function clearFilters() {
  state.query = "";
  state.status = null;
  state.genre = null;
  searchInput.value = "";
  render();
  buildFilterMenu();
}

filterToggle.addEventListener("click", () => {
  if (filterMenu.hidden) openMenu();
  else closeMenu();
});

filterMenu.addEventListener("click", (event) => {
  const option = event.target.closest(".filter-option");
  if (!option) return;
  const { action, value } = option.dataset;
  const next = value || null;
  if (action === "status") state.status = state.status === next ? null : next;
  else state.genre = state.genre === next ? null : next;
  render();
  buildFilterMenu();
});

searchInput.addEventListener("input", () => {
  state.query = searchInput.value;
  render();
});

searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    state.query = "";
    searchInput.value = "";
    render();
  }
});

document.addEventListener("click", (event) => {
  if (filterMenu.hidden) return;
  if (filterToggle.contains(event.target) || filterMenu.contains(event.target)) return;
  closeMenu();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !filterMenu.hidden) {
    closeMenu();
    filterToggle.focus();
  }
});

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
    state.games = games;
    state.meta = meta;
    state.flags = flagState.flags;

    if (flagNote) {
      flagNote.textContent = flagState.source
        ? `tags + flags from Cloudflare · ${flagState.source}`
        : "tags from the hub · flags unavailable";
    }
    render();
  } catch (error) {
    countLabel.textContent = "unavailable";
    grid.innerHTML = `<p class="grid-message">Could not load the game catalog. <a href="/">Back to the hub</a> — ${escapeHtml(
      error instanceof Error ? error.message : String(error)
    )}</p>`;
  }
}

start();
