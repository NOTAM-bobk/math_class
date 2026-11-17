import { coverSvg, slugKey } from "./covers.js";

const grid = document.getElementById("grid");
const countLabel = document.getElementById("count");
const continueRow = document.getElementById("continue");
const randomButton = document.getElementById("random-btn");
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
  notMobile: new Set()
};

// Favorites and recently played tiles are remembered on this device only.
const FAVORITES_KEY = "polytrack_test_favorites";
const RECENT_KEY = "polytrack_test_recent";
const MAX_RECENT = 12;
const CONTINUE_LIMIT = 6;

const PLAY_ICON =
  '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.2v13.6L19 12z"/></svg>';

const CHECK_ICON =
  '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.8 12.7l4.5 4.5L19.2 7" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

// The hub's own status chips, in the order the hub shows them.
const FLAGS = {
  verified: { key: "verified", className: "verified", label: "Verified", icon: CHECK_ICON, title: "Verified working" },
  editorsPick: { key: "editorsPick", className: "editor", label: "Editor's Pick", title: "Editor's Pick" },
  notMobile: { key: "notMobile", className: "mobile", label: "no mobile", title: "Not optimized for mobile — best played on desktop" }
};

const STATUS_FILTERS = [
  { id: "verified", label: "Verified" },
  { id: "notMobile", label: "No mobile" }
];

// Filters backed by this device's saved history rather than the catalog flags.
const SAVED_FILTERS = [
  { id: "favorites", label: "★ Favorites" },
  { id: "recent", label: "Recently played" }
];

const STAR_ICON =
  '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.6l2.6 5.3 5.9.8-4.3 4.1 1 5.8-5.2-2.8-5.2 2.8 1-5.8L3.5 9.7l5.9-.8z"/></svg>';

// Seven hero tiles spread across the catalog break up the grid without
// cropping art: both sizes keep the cover's 4:3 frame, and both span a
// multiple of three grid rows, so the dense packing never leaves a hole.
const HERO_INDICES = new Set([1, 8, 15, 22, 29, 36, 43]);

const state = {
  games: [],
  meta: new Map(),
  flags: EMPTY_FLAGS,
  favorites: new Set(readList(FAVORITES_KEY)),
  recent: readList(RECENT_KEY),
  visible: [],
  query: "",
  status: null,
  genre: null
};

function readList(key) {
  try {
    const raw = localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((value) => typeof value === "string") : [];
  } catch {
    return [];
  }
}

function writeList(key, values) {
  try {
    localStorage.setItem(key, JSON.stringify(values));
  } catch {
    // Private mode can block storage; the page still works without the memory.
  }
}

function tileKey(game, entry = entryFor(game)) {
  return (entry && entry.hubId) || game.subdomain || game.url || game.name;
}

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
  if (hit(state.flags.notMobile)) active.push(FLAGS.notMobile);
  return active;
}

function tagsFor(game, entry) {
  return (entry && entry.tags && entry.tags.length ? entry.tags : [game.category || "Catalog"]).slice(0, 3);
}

function flagMarkup(list) {
  if (!list.length) return "";
  return `<span class="tile-flags">${list
    .map(
      (flag) =>
        `<span class="badge badge--${flag.className}" title="${escapeHtml(flag.title)}">${flag.icon || ""}${escapeHtml(
          flag.label
        )}</span>`
    )
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
  const key = tileKey(game, entry);
  const isFavorite = state.favorites.has(key);

  return `<div class="tile" data-size="${size}" data-key="${escapeHtml(key)}">
      <a class="tile-link" href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer" aria-label="${escapeHtml(label)}">
        <span class="tile-art" aria-hidden="true">${coverSvg(game)}</span>
        <span class="tile-shade" aria-hidden="true"></span>
        <span class="tile-overlay" aria-hidden="true">
          ${description ? `<span class="tile-desc">${escapeHtml(description)}</span>` : ""}
          <span class="tile-cta">${PLAY_ICON}Play</span>
        </span>
        <span class="tile-foot">
          <span class="tile-title">${escapeHtml(name)}</span>
          ${tagMarkup(tagsFor(game, entry))}
        </span>
      </a>
      ${flagMarkup(statusFlagsFor(game, entry, index))}
      <button class="tile-fav${isFavorite ? " is-on" : ""}" type="button" data-key="${escapeHtml(key)}" data-name="${escapeHtml(
        name
      )}" aria-pressed="${isFavorite}" aria-label="${isFavorite ? "Remove" : "Add"} ${escapeHtml(name)} ${
        isFavorite ? "from" : "to"
      } favorites" title="${isFavorite ? "Remove from favorites" : "Add to favorites"}">${STAR_ICON}</button>
    </div>`;
}

function syncFavoriteButton(button, on) {
  const name = button.dataset.name || "this game";
  button.classList.toggle("is-on", on);
  button.setAttribute("aria-pressed", String(on));
  button.setAttribute("aria-label", `${on ? "Remove" : "Add"} ${name} ${on ? "from" : "to"} favorites`);
  button.title = on ? "Remove from favorites" : "Add to favorites";
}

function toggleFavorite(button) {
  const key = button.dataset.key;
  if (!key) return;
  if (state.favorites.has(key)) state.favorites.delete(key);
  else state.favorites.add(key);
  writeList(FAVORITES_KEY, [...state.favorites]);
  syncFavoriteButton(button, state.favorites.has(key));
  if (state.status === "favorites") render();
  else if (!filterMenu.hidden) buildFilterMenu();
}

function rememberPlayed(key) {
  if (!key) return;
  const next = [key, ...state.recent.filter((entry) => entry !== key)].slice(0, MAX_RECENT);
  state.recent = next;
  writeList(RECENT_KEY, next);
  renderContinue();
}

function recentItems() {
  const byKey = new Map(state.games.map((game) => [tileKey(game), { game, entry: entryFor(game) }]));
  return state.recent
    .map((key) => byKey.get(key))
    .filter((item) => item && !item.game.disabled && item.game.url && item.game.url !== "#")
    .slice(0, CONTINUE_LIMIT);
}

// A shortcut row above the mosaic: the last few games, ready to resume.
function renderContinue() {
  if (!continueRow) return;
  const items = recentItems();
  if (!items.length) {
    continueRow.hidden = true;
    continueRow.innerHTML = "";
    return;
  }
  continueRow.hidden = false;
  continueRow.innerHTML = `<h2 class="continue-title">Continue playing</h2>
    <div class="continue-row">${items
      .map(
        ({ game, entry }) => `<a class="continue-card" href="${escapeHtml(game.url)}" target="_blank" rel="noopener noreferrer" data-key="${escapeHtml(
          tileKey(game, entry)
        )}">
          <span class="continue-art" aria-hidden="true">${coverSvg(game)}</span>
          <span class="continue-name">${escapeHtml(game.name || "Game")}</span>
          ${PLAY_ICON}
        </a>`
      )
      .join("")}</div>`;
}

function openRandomGame() {
  const pool = (state.visible.length ? state.visible : state.games.map((game, index) => ({ game, entry: entryFor(game), index }))).filter(
    (item) => !item.game.disabled && item.game.url && item.game.url !== "#"
  );
  if (!pool.length) return;
  const pick = pool[Math.floor(Math.random() * pool.length)];
  rememberPlayed(tileKey(pick.game, pick.entry));
  window.open(pick.game.url, "_blank", "noopener");
}

function matchesFilters(item) {
  const { game, entry, index } = item;
  if (state.status === "favorites" && !state.favorites.has(tileKey(game, entry))) return false;
  if (state.status === "recent" && !state.recent.includes(tileKey(game, entry))) return false;
  if (
    state.status &&
    state.status !== "favorites" &&
    state.status !== "recent" &&
    !statusFlagsFor(game, entry, index).some((flag) => flag.key === state.status)
  ) {
    return false;
  }
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

  // The recently played filter follows play order, newest first.
  if (state.status === "recent") {
    matches.sort(
      (a, b) =>
        state.recent.indexOf(tileKey(a.game, a.entry)) - state.recent.indexOf(tileKey(b.game, b.entry))
    );
  }

  state.visible = matches;

  if (!matches.length) {
    const what = state.query.trim() ? `“${escapeHtml(state.query.trim())}”` : "this filter";
    const emptyLead =
      !state.query.trim() && state.status === "favorites"
        ? "No favorites yet — tap the star on a tile."
        : !state.query.trim() && state.status === "recent"
          ? "Nothing played yet — open a game and it will show up here."
          : `No games match ${what}.`;
    grid.innerHTML = `<p class="grid-message">${emptyLead} <button class="grid-reset" type="button" id="grid-reset">Clear filters</button></p>`;
    const reset = document.getElementById("grid-reset");
    if (reset) reset.addEventListener("click", clearFilters);
  } else {
    grid.innerHTML = matches
      .map((item) => tileMarkup(item.game, item.entry, item.index, state.games.length))
      .join("");
  }

  renderContinue();

  countLabel.textContent = filtering
    ? `${matches.length} of ${state.games.length} games`
    : `${state.games.length} game${state.games.length === 1 ? "" : "s"}`;

  if (filterDot) filterDot.hidden = !(state.status || state.genre);
}

function countFor(kind, id) {
  return state.games.reduce((total, game, index) => {
    const entry = entryFor(game);
    if (kind === "status") {
      if (id === "favorites") return total + (state.favorites.has(tileKey(game, entry)) ? 1 : 0);
      if (id === "recent") return total + (state.recent.includes(tileKey(game, entry)) ? 1 : 0);
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
  const statusOptions = [...SAVED_FILTERS, ...STATUS_FILTERS]
    .map((filter) =>
      optionMarkup({
        label: filter.label,
        checked: state.status === filter.id,
        count: countFor("status", filter.id),
        action: "status",
        value: filter.id
      })
    )
    .join("");

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

if (continueRow) {
  continueRow.addEventListener("click", (event) => {
    const card = event.target.closest(".continue-card");
    if (card) rememberPlayed(card.dataset.key);
  });
}

if (randomButton) {
  randomButton.addEventListener("click", openRandomGame);
}

// "/" jumps to search, the usual shortcut in a game library.
document.addEventListener("keydown", (event) => {
  if (event.key !== "/" || event.metaKey || event.ctrlKey || event.altKey) return;
  const target = event.target;
  if (target && (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName))) return;
  event.preventDefault();
  closeMenu();
  searchInput.focus();
  searchInput.select();
});

// One delegated handler covers both the star on a tile and the play itself.
grid.addEventListener("click", (event) => {
  const favoriteButton = event.target.closest(".tile-fav");
  if (favoriteButton) {
    event.preventDefault();
    toggleFavorite(favoriteButton);
    return;
  }
  const tile = event.target.closest(".tile");
  if (tile) rememberPlayed(tile.dataset.key);
});

const dockGames = document.getElementById("dock-games");
const dockSearch = document.getElementById("dock-search");

if (dockGames) {
  dockGames.addEventListener("click", () => {
    closeMenu();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

if (dockSearch) {
  dockSearch.addEventListener("click", () => {
    closeMenu();
    window.scrollTo({ top: 0, behavior: "smooth" });
    searchInput.focus({ preventScroll: true });
    searchInput.select();
  });
}

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
        verified: new Set(data.verified || []),
        notMobile: new Set(data.notMobile || [])
      };
    } catch {
      // Try the next origin.
    }
  }
  return EMPTY_FLAGS;
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

    const [meta, flags] = match;
    state.games = games;
    state.meta = meta;
    state.flags = flags;
    render();
  } catch (error) {
    countLabel.textContent = "unavailable";
    grid.innerHTML = `<p class="grid-message">Could not load the game catalog. <a href="/">Back to the hub</a> — ${escapeHtml(
      error instanceof Error ? error.message : String(error)
    )}</p>`;
  }
}

start();
