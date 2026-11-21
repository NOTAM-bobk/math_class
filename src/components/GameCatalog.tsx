import * as React from "react";
import { createPortal } from "react-dom";
import { Play, Gamepad2, Clock3, RotateCcw, X, Flame, Sparkles, SlidersHorizontal, Check, Heart, Bug, BadgeCheck, Ban, Star, Smartphone, ArrowLeft, ExternalLink, EyeOff, ShieldCheck, WifiOff, ChevronLeft, ChevronRight, LayoutGrid, Zap, Car, Trophy, Puzzle, Coffee, Users, Crosshair, Swords, Hourglass, Wrench, Layers } from "lucide-react";
import { loadBuggyGameIds, onBuggyGamesChange, saveBuggyGameIds } from "@/lib/buggyGames";
import { loadVerifiedGameIds, onVerifiedGamesChange, saveVerifiedGameIds } from "@/lib/verifiedGames";
import { loadNotMobileGameIds, onNotMobileGamesChange, saveNotMobileGameIds } from "@/lib/notMobileGames";
import { loadBlockedGameIds, onBlockedGamesChange, saveBlockedGameIds, getRandomBlockedEmoji } from "@/lib/blockedGames";
import { loadGameStats, recordGameClick, loadGameFlags } from "@/lib/hubApi";
import {
  loadHiddenGames,
  onHiddenGamesChange,
  hideGame,
  restoreGame,
  type HiddenGameEntry,
  type HiddenGameReason,
} from "@/lib/hiddenGames";
import { finalizePlaySession, noteGamePlayed } from "@/lib/playStats";
import { formatPlays, totalPlays } from "@/lib/playCounts";
import { loadGameCardLayout, onGameCardLayoutChange, type GameCardLayout } from "@/lib/gameCardLayout";
import { loadGameOfTheDayId, onGameOfTheDayChange } from "@/lib/gameOfTheDay";
import { loadEditorPicks, onEditorPicksChange, fetchEditorPicks } from "@/lib/editorPicks";
import { GameCoverArt } from "./GameCoverArt";
import { BidvertiserAd } from "./BidvertiserAd";
import { PanicButton } from "./PanicButton";
import { RANDOM_GAME_EVENT } from "./RandomGameButton";
import { CONTINUE_GAME_EVENT } from "./NotificationsButton";
import { useDialogFocus } from "@/lib/dialogFocus";
import { testFrameLoad } from "@/lib/frameReachability";
import { loadCatalog } from "@/lib/catalog";
import { markFeedbackPromptSeen, recordGameFeedback, shouldPromptFeedback } from "@/lib/gameFeedback";
import { detectOffline, loadDownloadedPackIds, onDownloadedPacksChange } from "@/lib/gamePacks";
import type { GameItem } from "@/data/gameItem";
import { posthog } from "@/lib/posthog";

export type { GameItem } from "@/data/gameItem";

const RECENT_GAMES_KEY = "polytrack_recent_games";
const RECENT_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;
const MAX_RECENT_GAMES = 6;
const SEARCH_PARAM = "q";
const CATEGORY_PARAM = "c";
// The catalog scrolls inside its own panel, so remember where it was left when a
// game takes over the screen.
const CATALOG_SCROLL_KEY = "polytrack_catalog_scroll_top";

const CHIP_STYLE: React.CSSProperties = {
  borderRadius: 999,
  background: "rgba(255, 255, 255, 0.04)",
  boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.02), inset 0 1px 0 0 rgba(255, 255, 255, 0.04)",
};

const FAVORITES_GAMES_KEY = "polytrack_favorite_games";

// The blocked check opens a hidden frame per game, a few at a time. A frame
// that has not loaded in this long is treated as blocked.
const BLOCKED_CHECK_TIMEOUT_MS = 5000;
const BLOCKED_CHECK_CONCURRENCY = 8;

function loadFavorites(): string[] {
  try {
    const raw = localStorage.getItem(FAVORITES_GAMES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((id) => typeof id === "string") : [];
  } catch {
    return [];
  }
}

export const CATEGORY_FILTERS = [
  { id: "all", label: "All Games" },
  { id: "recent", label: "Recently played" },
  { id: "favorites", label: "Favorites" },
  { id: "editors", label: "Editor's picks" },
  { id: "verified", label: "Verified" },
  { id: "hidden", label: "Hidden" },
  { id: "trending", label: "Trending" },
  { id: "offline", label: "Offline" },
  { id: "flash", label: "Flash" },
  { id: "action", label: "Action" },
  { id: "driving", label: "Driving" },
  { id: "sports", label: "Sports" },
  { id: "arcade", label: "Arcade" },
  { id: "puzzle", label: "Puzzle" },
  { id: "casual", label: "Casual" },
  { id: "multiplayer", label: "Multiplayer" },
  { id: "shooting", label: "Shooting" },
  { id: "strategy", label: "Strategy" },
  { id: "idle", label: "Idle" },
  { id: "tools", label: "Tools" },
] as const;

// The home catalog is a stack of genre shelves. Each shelf shows one row on
// phones and two rows on wide screens, and both rows scroll sideways together.
const SHELF_GAME_LIMIT = 24;
const GENRE_SHELVES = [
  "action",
  "driving",
  "sports",
  "arcade",
  "puzzle",
  "casual",
  "multiplayer",
  "shooting",
  "strategy",
  "idle",
  "flash",
] as const;

// Each genre gets its own accent colour so cards and chips read as distinct categories.
const CATEGORY_ACCENTS: Record<string, string> = {
  flash: "#f97316",
  action: "#ef4444",
  driving: "#eab308",
  sports: "#22c55e",
  arcade: "#a855f7",
  puzzle: "#06b6d4",
  casual: "#ec4899",
  multiplayer: "#3b82f6",
  shooting: "#f43f5e",
  strategy: "#14b8a6",
  idle: "#8b5cf6",
  tools: "#84cc16",
};

// Each genre's heading carries its line icon instead of an emoji, which keeps
// the shelves on the same drawing system as the rest of the chrome.
const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  flash: Layers,
  action: Zap,
  driving: Car,
  sports: Trophy,
  arcade: Gamepad2,
  puzzle: Puzzle,
  casual: Coffee,
  multiplayer: Users,
  shooting: Crosshair,
  strategy: Swords,
  idle: Hourglass,
  tools: Wrench,
};

// The cover layout mixes wide, tall and square boxes; dense flow fills the gaps.
const MOSAIC_SPAN_PATTERN = [
  "col-span-2 row-span-2",
  "col-span-1 row-span-1",
  "col-span-1 row-span-1",
  "col-span-1 row-span-2",
  "col-span-1 row-span-1",
  "col-span-1 row-span-1",
  "col-span-1 row-span-1",
];

const MOSAIC_GRID_CLASS =
  "grid grid-flow-row-dense auto-rows-[148px] grid-cols-2 gap-3 sm:auto-rows-[168px] sm:grid-cols-3 xl:grid-cols-4";
const CLASSIC_GRID_CLASS = "grid grid-cols-1 gap-3 xl:grid-cols-2 2xl:grid-cols-3";

function mosaicSpan(index: number) {
  return MOSAIC_SPAN_PATTERN[index % MOSAIC_SPAN_PATTERN.length];
}

function gameAccent(game: GameItem) {
  return (
    CATEGORY_FILTERS.map((cat) => cat.id)
      .filter((id) => CATEGORY_ACCENTS[id] && matchesCategory(game, id as CategoryId))
      .map((id) => CATEGORY_ACCENTS[id])[0] ?? "#6366f1"
  );
}

/** Soft blur over both clipped edges of a sideways scroller. */
function ScrollEdgeBlur() {
  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-6 backdrop-blur-[2px] [mask-image:linear-gradient(to_right,black,transparent)] [-webkit-mask-image:linear-gradient(to_right,black,transparent)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-6 backdrop-blur-[2px] [mask-image:linear-gradient(to_left,black,transparent)] [-webkit-mask-image:linear-gradient(to_left,black,transparent)]"
      />
    </>
  );
}

// The same ranked row backs the Trending page and the home-page chart.
function TopTenChart({
  games,
  onLaunch,
}: {
  games: GameItem[];
  onLaunch: (game: GameItem, event: React.MouseEvent) => void;
}) {
  return (
    <section aria-labelledby="top-ten-heading" className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <h3
          id="top-ten-heading"
          className="flex items-center gap-1.5 text-xs font-semibold text-zinc-200"
        >
          <Flame aria-hidden="true" className="h-3.5 w-3.5 text-amber-300" />
          Top 10 today
        </h3>
        <span aria-hidden="true" className="h-px flex-1 bg-white/[0.07]" />
        <span className="rounded-full bg-amber-400/15 px-2 py-0.5 text-[11px] font-semibold text-amber-300">
          Most played
        </span>
      </div>
      <div className="relative">
      <div className="-mx-1 flex snap-x gap-1.5 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {games.map((game, index) => (
          <a
            key={game.id}
            href={game.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(event) => onLaunch(game, event)}
            aria-label={`Number ${index + 1}: ${game.name}`}
            className="group flex shrink-0 snap-start items-stretch gap-1 rounded-xl transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
                          <span
                aria-hidden="true"
                className="flex w-11 items-end justify-center pb-6 text-4xl font-semibold leading-none tabular-nums text-white/20 transition-colors group-hover:text-amber-300/80"
              >
              {index + 1}
            </span>
            <span className="relative block aspect-[3/4] w-24 overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.03] transition-colors group-hover:border-amber-300/40">
              <GameCoverArt game={game} accent={gameAccent(game)} compact />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/75 to-transparent px-1.5 pb-1.5 pt-5">
                <span className="line-clamp-2 text-[11px] font-semibold leading-tight text-white">
                  {game.name}
                </span>
              </span>
            </span>
          </a>
        ))}
      </div>
      <ScrollEdgeBlur />
      </div>
    </section>
  );
}

/** One genre shelf: a heading, a See all link, and cards that scroll sideways. */
function GameRail({
  id,
  title,
  icon,
  total,
  games,
  onSeeAll,
  renderGame,
}: {
  id: string;
  title: string;
  icon?: React.ComponentType<{ className?: string }>;
  total: number;
  games: GameItem[];
  onSeeAll: () => void;
  renderGame: (game: GameItem) => React.ReactNode;
}) {
  const scrollerRef = React.useRef<HTMLDivElement>(null);
  const [edges, setEdges] = React.useState({ left: false, right: false });

  const updateEdges = React.useCallback(() => {
    const element = scrollerRef.current;
    if (!element) return;
    setEdges({
      left: element.scrollLeft > 4,
      right: element.scrollLeft + element.clientWidth < element.scrollWidth - 4,
    });
  }, []);

  React.useEffect(() => {
    updateEdges();
    const element = scrollerRef.current;
    let observer: ResizeObserver | undefined;
    if (element && typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver(updateEdges);
      observer.observe(element);
    }
    window.addEventListener("resize", updateEdges);
    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", updateEdges);
    };
  }, [updateEdges, games.length]);

  const scrollShelf = (direction: 1 | -1) => {
    const element = scrollerRef.current;
    if (!element) return;
    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    element.scrollBy({
      left: direction * Math.max(element.clientWidth * 0.8, 240),
      behavior: reduceMotion ? "auto" : "smooth",
    });
  };

  const headingId = `catalog-shelf-${id}`;
  const Icon = icon;

  return (
    <section aria-labelledby={headingId} className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <h3
          id={headingId}
          className="flex min-w-0 items-center gap-1.5 text-xs font-semibold text-zinc-200"
        >
          {Icon && <Icon aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-zinc-400" />}
          <span className="truncate">{title}</span>
        </h3>
        <span className="rounded-full bg-white/[0.05] px-1.5 py-0.5 font-mono text-[11px] tabular-nums text-zinc-400">
          {total}
        </span>
        <span aria-hidden="true" className="h-px flex-1 bg-white/[0.07]" />
        <button
          type="button"
          onClick={onSeeAll}
          aria-label={`See all ${total} ${title} games`}
          className="inline-flex shrink-0 cursor-pointer items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[11px] font-medium text-zinc-400 transition-colors hover:bg-white/[0.06] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
        >
          See all
          <ChevronRight aria-hidden="true" className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="relative">
        <div
          ref={scrollerRef}
          role="region"
          aria-label={`${title} games`}
          tabIndex={0}
          onScroll={updateEdges}
          className="-mx-1 grid snap-x snap-mandatory auto-cols-[9.5rem] auto-rows-[13.5rem] grid-flow-col gap-3 overflow-x-auto px-1 pb-2 [scrollbar-width:none] [-ms-overflow-style:none] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:auto-cols-[11rem] sm:auto-rows-[15rem] lg:auto-cols-[12rem] lg:auto-rows-[16rem] xl:auto-cols-[10.5rem] xl:grid-rows-[repeat(2,14rem)] 2xl:auto-cols-[11.5rem] 2xl:grid-rows-[repeat(2,15rem)] [&::-webkit-scrollbar]:hidden"
        >
          {games.map((game) => (
            <div key={game.id} className="h-full min-w-0 snap-start">
              {renderGame(game)}
            </div>
          ))}
        </div>

        <ScrollEdgeBlur />

        {edges.left && (
          <>
            <button
              type="button"
              aria-label={`Scroll ${title} left`}
              onClick={() => scrollShelf(-1)}
              className="absolute left-1 top-1/2 z-20 hidden h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-zinc-900/95 text-zinc-200 shadow-lg backdrop-blur transition hover:bg-zinc-800 sm:flex"
            >
              <ChevronLeft aria-hidden="true" className="h-4 w-4" />
            </button>
          </>
        )}

        {edges.right && (
          <>
            <button
              type="button"
              aria-label={`Scroll ${title} right`}
              onClick={() => scrollShelf(1)}
              className="absolute right-1 top-1/2 z-20 hidden h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-zinc-900/95 text-zinc-200 shadow-lg backdrop-blur transition hover:bg-zinc-800 sm:flex"
            >
              <ChevronRight aria-hidden="true" className="h-4 w-4" />
            </button>
          </>
        )}
      </div>
    </section>
  );
}

export type SpecialFilterId = "buggy" | "blocked";
export type CategoryId = (typeof CATEGORY_FILTERS)[number]["id"] | SpecialFilterId;

// Readable names for the catalog heading, e.g. "82 games in Driving".
const CATEGORY_NAMES: Record<CategoryId, string> = {
  all: "All Games",
  recent: "Recently played",
  favorites: "Favorites",
  editors: "Editor's picks",
  verified: "Verified",
  hidden: "Hidden games",
  trending: "Trending",
  offline: "Offline",
  flash: "Flash",
  action: "Action",
  driving: "Driving",
  sports: "Sports",
  arcade: "Arcade",
  puzzle: "Puzzle",
  casual: "Casual",
  multiplayer: "Multiplayer",
  shooting: "Shooting",
  strategy: "Strategy",
  idle: "Idle",
  tools: "Tools",
  buggy: "Error: bug",
  blocked: "Blocked",
};

type SortOption = "popular" | "featured" | "recent" | "az" | "default";

const DEFAULT_SORT: SortOption = "popular";

const TAG_FILTERS = [
  { id: "editors", icon: Star, label: "Editor's picks" },
  { id: "verified", icon: BadgeCheck, label: "Verified" },
  { id: "hidden", icon: EyeOff, label: "Hidden" },
  { id: "buggy", icon: Bug, label: "Error: bug" },
  { id: "blocked", icon: Ban, label: "Blocked" },
] as const satisfies readonly {
  id: CategoryId;
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  label: string;
}[];

type TagFilterId = (typeof TAG_FILTERS)[number]["id"];

const SORT_OPTIONS: { id: SortOption; label: string }[] = [
  { id: "popular", label: "Most played" },
  { id: "featured", label: "Featured first" },
  { id: "recent", label: "Recently played" },
  { id: "az", label: "Name: A to Z" },
  { id: "default", label: "Default order" },
];

function initialSortOption(): SortOption {
  try {
    const sort = new URLSearchParams(window.location.search).get("sort");
    if (sort && SORT_OPTIONS.some((option) => option.id === sort)) {
      return sort as SortOption;
    }
  } catch {}
  return DEFAULT_SORT;
}

type RecentGame = { id: string; playedAt: number };

function loadRecentGames(): RecentGame[] {
  try {
    const raw = localStorage.getItem(RECENT_GAMES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const cutoff = Date.now() - RECENT_WINDOW_MS;
    return parsed
      .filter(
        (entry): entry is RecentGame =>
          !!entry &&
          typeof entry.id === "string" &&
          typeof entry.playedAt === "number" &&
          entry.playedAt > cutoff
      )
      .slice(0, MAX_RECENT_GAMES);
  } catch {
    return [];
  }
}

export function initialSearchQuery() {
  try {
    return new URLSearchParams(window.location.search).get(SEARCH_PARAM) ?? "";
  } catch {
    return "";
  }
}

export function initialCategory(): CategoryId {
  try {
    const param = new URLSearchParams(window.location.search).get(CATEGORY_PARAM);
    if (param && (CATEGORY_FILTERS.some((c) => c.id === param) || param === "buggy" || param === "blocked")) {
      // A shared ?c=offline link should not hide every chip on an online device.
      if (param === OFFLINE_CATEGORY && navigator.onLine) return "all";
      return param as CategoryId;
    }
  } catch {}
  return "all";
}



const OFFLINE_CATEGORY = "offline";

function nameKey(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function urlKey(url: string) {
  return url.trim().toLowerCase().replace(/\/+$/, "");
}

function topGameIdsByClicks(stats: { id: string; clicks: number }[]): Set<string> {
  return new Set(
    [...stats]
      .filter((game) => game.clicks > 0)
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 3)
      .map((game) => game.id)
  );
}

function isSameOriginGame(url: string) {
  try {
    return new URL(url, window.location.origin).origin === window.location.origin;
  } catch {
    return false;
  }
}

function isSubdomainUrl(url: string) {
  try {
    return new URL(url, "https://benlaunches.icu").hostname.endsWith(".benlaunches.icu");
  } catch {
    return false;
  }
}

function sameGame(a: GameItem, b: GameItem) {
  if (a.id === b.id) return true;
  if (urlKey(a.url) === urlKey(b.url)) return true;
  const x = nameKey(a.name);
  const y = nameKey(b.name);
  if (!x || !y) return false;

  // Keep numbered sequels (e.g. Monster Tracks 2) distinct from the original title.
  const sequelNumber = (name: string) => name.match(/[0-9]+$/)?.[0] ?? "";
  if (sequelNumber(x) !== sequelNumber(y)) return false;

  return x === y || x.startsWith(y) || y.startsWith(x) || x.includes(y) || y.includes(x);
}

function preferredUrl(current: string, incoming: string) {
  if (!incoming || incoming === "#") return current;
  if (isSubdomainUrl(current) && !isSubdomainUrl(incoming)) return current;
  return incoming;
}

export function mergeCatalog(defaults: GameItem[], loaded: GameItem[]): GameItem[] {
  const remaining = [...loaded];
  const merged: GameItem[] = [];

  for (const item of defaults) {
    const index = remaining.findIndex((entry) => sameGame(item, entry));
    if (index === -1) {
      merged.push(item);
      continue;
    }
    const [match] = remaining.splice(index, 1);
    merged.push({
      ...item,
      url: preferredUrl(item.url, match.url),
      description:
        match.description && !match.description.includes("from games catalog")
          ? match.description
          : item.description,
      disabled: match.disabled ?? item.disabled,
      editorsPick: match.editorsPick ?? item.editorsPick,
      errorBug: match.errorBug ?? item.errorBug,
      verified: match.verified ?? item.verified
    });
  }

  for (const item of remaining) {
    if (!merged.some((entry) => sameGame(entry, item))) merged.push(item);
  }

  return merged;
}



function matchesCategory(game: GameItem, categoryId: CategoryId): boolean {
  if (categoryId === "all") return true;
  const tagsLower = game.tags.map((t) => t.toLowerCase());
  const nameLower = game.name.toLowerCase();

  switch (categoryId) {
    case "flash":
      return (
        tagsLower.includes("flash") ||
        game.url.toLowerCase().includes("flash") ||
        game.url.toLowerCase().includes("swf")
      );
    case "action":
      return (
        tagsLower.some((t) =>
          [
            "action",
            "combat",
            "3d combat",
            "arena",
            "brawler",
            "shooter",
            "tanks",
            "fighting",
            "crossover"
          ].includes(t)
        ) ||
        nameLower.includes("smash") ||
        nameLower.includes("brawl") ||
        nameLower.includes("tank") ||
        nameLower.includes("shootout") ||
        nameLower.includes("snout") ||
        nameLower.includes("happy wheels")
      );
    case "driving":
      return (
        tagsLower.some((t) =>
          [
            "driving",
            "racing",
            "tracks",
            "stunts",
            "drift",
            "4x4",
            "offroad",
            "cars",
            "sci-fi"
          ].includes(t)
        ) ||
        nameLower.includes("drive") ||
        nameLower.includes("moto") ||
        nameLower.includes("drift") ||
        nameLower.includes("hexgl") ||
        nameLower.includes("polytrack")
      );
    case "sports":
      return (
        tagsLower.some((t) => ["sports", "football", "basketball", "soccer"].includes(t)) ||
        nameLower.includes("bowl") ||
        nameLower.includes("basket")
      );
    case "arcade":
      return (
        tagsLower.some((t) =>
          [
            "arcade",
            "retro",
            "classic",
            "runner",
            "platformer",
            "skill",
            "speedrun",
            "parkour",
            "jumper",
            "rhythm"
          ].includes(t)
        ) ||
        nameLower.includes("jump") ||
        nameLower.includes("bird") ||
        nameLower.includes("run") ||
        nameLower.includes("ovo") ||
        nameLower.includes("hook") ||
        nameLower.includes("geometry") ||
        nameLower.includes("ice-cream") ||
        nameLower.includes("vex")
      );
    case "puzzle":
      return (
        tagsLower.some((t) =>
          [
            "puzzle",
            "logic",
            "quiz",
            "trivia",
            "brain",
            "challenge",
            "escape",
            "strategy",
            "tower defense",
            "math"
          ].includes(t)
        ) ||
        nameLower.includes("quiz") ||
        nameLower.includes("portal") ||
        nameLower.includes("school") ||
        nameLower.includes("bloxorz") ||
        nameLower.includes("2048") ||
        nameLower.includes("bloons") ||
        nameLower.includes("rope") ||
        nameLower.includes("cut the rope")
      );
    case "casual":
      return (
        tagsLower.some((t) =>
          [
            "casual",
            "idle",
            "clicker",
            "simulation",
            "cooking",
            "rpg",
            "pets",
            "training",
            "management",
            "fishing"
          ].includes(t)
        ) ||
        nameLower.includes("cookie") ||
        nameLower.includes("fishing") ||
        nameLower.includes("papa") ||
        nameLower.includes("duck") ||
        nameLower.includes("bitlife") ||
        nameLower.includes("behold")
      );
    case "multiplayer":
      return (
        tagsLower.some((t) =>
          ["multiplayer", "2 player", "battle", "co-op", "online", "pvp", "io"].includes(t)
        ) ||
        nameLower.includes("multiplayer") ||
        nameLower.includes("2 player")
      );
    case "shooting":
      return (
        tagsLower.some((t) => ["shooting", "shooter", "fps", "gun", "sniper", "tanks"].includes(t)) ||
        nameLower.includes("shoot") ||
        nameLower.includes("sniper") ||
        nameLower.includes("gun") ||
        nameLower.includes("war")
      );
    case "strategy":
      return (
        tagsLower.some((t) =>
          ["strategy", "tower defense", "tycoon", "management", "defense", "card", "rts"].includes(t)
        ) ||
        nameLower.includes("tower") ||
        nameLower.includes("tycoon") ||
        nameLower.includes("defense")
      );
    case "idle":
      return (
        tagsLower.some((t) =>
          ["idle", "clicker", "incremental", "upgrade", "simulation", "farming"].includes(t)
        ) ||
        nameLower.includes("idle") ||
        nameLower.includes("clicker") ||
        nameLower.includes("tycoon")
      );
    case "tools":
      return tagsLower.includes("tools") || tagsLower.includes("tool");
    default:
      return true;
  }
}

function escapeRegExp(value: string) {
  const meta = new Set([".", "*", "+", "?", "^", "$", "{", "}", "(", ")", "|", "[", "]", "\\"]);
  return [...value].map((character) => (meta.has(character) ? `\\${character}` : character)).join("");
}

function HighlightText({ text, query }: { text: string; query: string }) {
  const terms = query.trim().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return <>{text}</>;

  const termSet = new Set(terms.map((term) => term.toLocaleLowerCase()));
  const matcher = new RegExp(
    `(${[...terms].sort((a, b) => b.length - a.length).map(escapeRegExp).join("|")})`,
    "gi"
  );

  return (
    <>
      {text.split(matcher).map((part, index) =>
        termSet.has(part.toLocaleLowerCase()) ? (
          <mark
            key={`${index}-${part}`}
            className="rounded-sm bg-amber-300 px-0.5 text-zinc-950"
          >
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
}

function VerifiedBadge() {
  const [open, setOpen] = React.useState(false);
  const rootRef = React.useRef<HTMLSpanElement>(null);
  const tipId = React.useId();

  React.useEffect(() => {
    if (!open) return;
    const closeOnOutside = (event: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", closeOnOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  const canHover = () =>
    typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  return (
    <span ref={rootRef} className="relative inline-flex shrink-0 items-center">
      <button
        type="button"
        aria-label="Verified game — what does this mean?"
        aria-expanded={open}
        aria-describedby={open ? tipId : undefined}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          setOpen((value) => !value);
        }}
        onMouseEnter={() => {
          if (canHover()) setOpen(true);
        }}
        onMouseLeave={() => {
          if (canHover()) setOpen(false);
        }}
        className="inline-flex cursor-help items-center justify-center text-amber-300"
      >
        <BadgeCheck aria-hidden="true" className="h-3.5 w-3.5 text-amber-300" />
      </button>
      {open && (
        <span
          id={tipId}
          role="tooltip"
          className="absolute left-1/2 top-full z-30 mt-1.5 w-40 -translate-x-1/2 rounded-lg border border-white/10 bg-[#1c1c1e] px-2 py-1.5 text-[11px] font-normal leading-snug text-zinc-300 shadow-[0_8px_24px_rgba(0,0,0,0.6)] sm:w-44"
        >
          Checked by an admin — this game loads and plays.
        </span>
      )}
    </span>
  );
}

/** The larger native unit; it sits inside the game grid on the home view. */
function CatalogNativeAd({ hidden }: { hidden: boolean }) {
  return (
    <div
      aria-label="Advertisement"
      style={{
        borderRadius: 12,
        background: "rgba(255, 255, 255, 0.015)",
        boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.03)",
      }}
      className={`catalog-native-ad col-span-full mx-auto w-full max-w-sm flex-col gap-1 px-2.5 py-1.5 ${hidden ? "hidden" : "flex"}`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-medium text-zinc-400">Ad</span>
        <a
          href="mailto:hello@base31.org?subject=Ad%20space%20on%20math_games"
          className="text-[11px] text-zinc-400 underline decoration-white/10 underline-offset-2 transition-colors hover:text-zinc-300"
        >
          Advertise
        </a>
      </div>
      <BidvertiserAd slot="catalog-native" showClose={false} className="flex items-center justify-center" />
    </div>
  );
}

function GameCard({
  game,
  isRecent,
  isPopular,
  isFavorite,
  isBuggy,
  isVerified,
  isEditorPick,
  isNotMobile,
  isBlocked,
  hiddenInfo,
  blockedEmoji,
  plays,
  searchQuery,
  onPlay,
  onToggleFavorite,
  onRestoreHidden,
  variant = "classic",
  sizeClass
}: {
  game: GameItem;
  isRecent: boolean;
  isPopular: boolean;
  isFavorite: boolean;
  isBuggy: boolean;
  isVerified: boolean;
  isEditorPick: boolean;
  isNotMobile: boolean;
  isBlocked: boolean;
  hiddenInfo?: HiddenGameEntry | null;
  blockedEmoji: string;
  plays: number;
  searchQuery: string;
  onPlay: (game: GameItem, event?: React.MouseEvent) => void;
  onToggleFavorite: (id: string, event?: React.MouseEvent) => void;
  onRestoreHidden?: (id: string) => void;
  variant?: GameCardLayout;
  sizeClass?: string;
}) {
  const opensInHub = !game.disabled && isSameOriginGame(game.url);
  const genreAccent = gameAccent(game);

  if (variant === "mosaic") {
    const compactChip = "inline-flex h-5 shrink-0 items-center gap-1 rounded-full bg-black/45 px-1.5 text-[11px] font-medium leading-none text-zinc-200 backdrop-blur-sm";
    return (
      <article
        key={game.id}
        className={`game-card game-card-mosaic group relative flex h-full w-full flex-col overflow-hidden ${sizeClass ?? ""} ${
          game.disabled ? "opacity-80" : ""
        }`}
      >
        <GameCoverArt game={game} accent={genreAccent} />

        <div className="relative z-20 flex items-start justify-between gap-1.5 p-2.5">
          <div className="flex min-w-0 flex-wrap items-center gap-1">
            {isVerified && <VerifiedBadge />}
            {isPopular && (
              <span title="Most played" className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-black/45 backdrop-blur-sm">
                <Flame aria-hidden="true" className="h-3 w-3 text-amber-300" />
              </span>
            )}
            {isEditorPick && (
              <span title="Editor's pick" className={compactChip}>
                <Star aria-hidden="true" className="h-2.5 w-2.5 text-amber-300" /> Pick
              </span>
            )}
            {isRecent && (
              <span title="Played in the last week" className={compactChip}>
                Recent
              </span>
            )}
            {isBuggy && (
              <span title="Known bug or issue reported" className={`${compactChip} text-red-200`}>
                <Bug aria-hidden="true" className="h-2.5 w-2.5 text-red-400" /> bug
              </span>
            )}
            {isNotMobile && (
              <span title="Best played on desktop" className={`${compactChip} text-amber-200`}>
                <Smartphone aria-hidden="true" className="h-2.5 w-2.5 text-amber-400" />
              </span>
            )}
            {isBlocked && (
              <span title="Blocked site or game" className={`${compactChip} text-zinc-200`}>
                <Ban aria-hidden="true" className="h-2.5 w-2.5 text-amber-300" /> Blocked
              </span>
            )}
            {hiddenInfo && (
              <span title={hiddenInfo.detail} className={`${compactChip} text-zinc-200`}>
                <EyeOff aria-hidden="true" className="h-2.5 w-2.5 text-zinc-400" /> hidden
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleFavorite(game.id, e);
            }}
            onMouseDown={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            aria-label={isFavorite ? `Remove ${game.name} from favorites` : `Add ${game.name} to favorites`}
            title={isFavorite ? "Remove from favorites" : "Add to favorites"}
            className="relative z-20 inline-flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-full bg-black/45 text-zinc-300 backdrop-blur-sm transition hover:bg-black/70 hover:text-amber-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400 active:scale-90"
          >
            <Heart
              aria-hidden="true"
              className={`pointer-events-none h-3.5 w-3.5 ${
                isFavorite
                  ? "fill-amber-400 text-amber-400"
                  : "stroke-[1.75]"
              }`}
            />
          </button>
        </div>

        <div className="relative z-10 mt-auto p-3">
          <h4
            className="line-clamp-2 min-w-0 text-sm font-semibold leading-snug text-white sm:text-base"
            title={game.name}
          >
            <HighlightText text={game.name} query={searchQuery} />
          </h4>
          <div className="mt-1.5 flex items-center justify-between gap-2">
            <div className="flex min-w-0 flex-col">
              <span className="truncate text-[11px] text-zinc-300/80">
                {game.disabled ? "Coming soon" : game.tags[0] || (opensInHub ? "In the hub" : "New tab")}
              </span>
              {!game.disabled && plays > 0 && (
                <span
                  className="font-mono text-[11px] leading-tight tabular-nums text-zinc-300/60"
                  title={`${plays.toLocaleString("en-US")} plays`}
                >
                  {formatPlays(plays)} plays
                </span>
              )}
            </div>
            {hiddenInfo && onRestoreHidden && (
              <button
                type="button"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  onRestoreHidden(game.id);
                }}
                title="Put this game back in the main catalog"
                className="relative z-20 inline-flex h-6 shrink-0 cursor-pointer items-center rounded-full bg-white/15 px-2 text-[11px] font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/25"
              >
                Restore
              </button>
            )}
            {game.disabled ? (
              <span className="inline-flex h-6 shrink-0 items-center gap-1 rounded-full bg-white/10 px-2 text-[11px] font-medium text-zinc-200 backdrop-blur-sm">
                <Clock3 aria-hidden="true" className="h-2.5 w-2.5" /> Soon
              </span>
            ) : (
              <span
                aria-hidden="true"
                className="inline-flex h-6 shrink-0 items-center gap-1 rounded-full bg-white px-2.5 text-[11px] font-semibold text-zinc-950 shadow-sm transition-colors group-hover:bg-zinc-100"
              >
                <Play className="h-2.5 w-2.5 fill-current" />
                Play
              </span>
            )}
          </div>
        </div>

        {!game.disabled && (
          <a
            href={game.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(event) => onPlay(game, event)}
            title={game.name}
            aria-label={`Open ${game.name} ${opensInHub ? "in the hub" : "in a new tab"}`}
            className="game-card-link absolute inset-0 z-[15] rounded-2xl"
          />
        )}
      </article>
    );
  }

  return (
    <article
      key={game.id}
      className={`game-card group relative flex w-full flex-col overflow-hidden ${
        game.disabled ? "opacity-80" : ""
      }`}
      style={genreAccent ? { borderLeft: `3px solid ${genreAccent}` } : undefined}
    >
      <div className="flex flex-1 flex-col p-3">
        <div className="mb-2 flex items-start justify-between gap-2">
          <h4 className="flex min-w-0 flex-wrap items-center gap-2 text-base font-semibold text-zinc-100">
            {game.disabled ? (
              <span className="line-clamp-2" title={game.name}>
                <HighlightText text={game.name} query={searchQuery} />
              </span>
            ) : (
              <a
                href={game.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(event) => onPlay(game, event)}
                title={game.name}
                className="game-card-link min-w-0 line-clamp-2 transition-colors group-hover:text-white"
              >
                <HighlightText text={game.name} query={searchQuery} />
                <span className="sr-only"> {opensInHub ? "(opens in the hub)" : "(opens in a new tab)"}</span>
              </a>
            )}
            {isVerified && <VerifiedBadge />}
            {isEditorPick && (
              <span
                title="Editor's pick"
                style={CHIP_STYLE}
                className="shrink-0 px-2 py-0.5 text-[11px] font-medium text-amber-300"
              >
                Editor's pick
              </span>
            )}
            {isBuggy && (
              <span
                title="Known bug or issue reported for this game"
                style={{
                  ...CHIP_STYLE,
                  background: "linear-gradient(135deg, rgba(239, 68, 68, 0.22), rgba(185, 28, 28, 0.16))",
                  border: "1px solid rgba(239, 68, 68, 0.45)",
                  color: "#fca5a5"
                }}
                className="inline-flex shrink-0 items-center gap-1 px-2 py-0.5 text-[11px] font-semibold tracking-wide font-mono"
              >
                <Bug aria-hidden="true" className="h-3 w-3 text-red-400 shrink-0" />
                <span>error:bug</span>
              </span>
            )}
            {isNotMobile && (
              <span
                title="Not optimized for mobile — best played on desktop"
                style={{
                  ...CHIP_STYLE,
                  background: "linear-gradient(135deg, rgba(245, 158, 11, 0.22), rgba(180, 83, 9, 0.16))",
                  border: "1px solid rgba(245, 158, 11, 0.4)",
                  color: "#fcd34d"
                }}
                className="inline-flex shrink-0 items-center gap-1 px-2 py-0.5 text-[11px] font-semibold tracking-wide font-mono"
              >
                <Smartphone aria-hidden="true" className="h-3 w-3 text-amber-400 shrink-0" />
                <span>no mobile</span>
              </span>
            )}
            {isBlocked && (
              <span
                title="Blocked site or game"
                style={{
                  ...CHIP_STYLE,
                  background: "linear-gradient(135deg, rgba(168, 85, 247, 0.22), rgba(126, 34, 206, 0.16))",
                  border: "1px solid rgba(168, 85, 247, 0.45)",
                  color: "#e9d5ff"
                }}
                className="inline-flex shrink-0 items-center gap-1 px-2 py-0.5 text-[11px] font-semibold tracking-wide font-mono"
              >
                <Ban aria-hidden="true" className="h-3 w-3 shrink-0 text-amber-300" />
                <span>Blocked</span>
              </span>
            )}
            {hiddenInfo && (
              <span
                title={`${hiddenInfo.source === "auto" ? "Automated check" : "Failed to load in this browser"}: ${hiddenInfo.detail}`}
                style={{
                  ...CHIP_STYLE,
                  background: "linear-gradient(135deg, rgba(113, 113, 122, 0.25), rgba(63, 63, 70, 0.18))",
                  border: "1px solid rgba(161, 161, 170, 0.35)",
                  color: "#d4d4d8"
                }}
                className="inline-flex shrink-0 items-center gap-1 px-2 py-0.5 text-[11px] font-semibold tracking-wide font-mono"
              >
                <EyeOff aria-hidden="true" className="h-3 w-3 shrink-0 text-zinc-400" />
                <span>auto-hidden</span>
              </span>
            )}
            {isRecent && (
              <span
                title="You played this in the last week"
                style={CHIP_STYLE}
                className="shrink-0 px-2 py-0.5 text-[11px] font-medium text-amber-300"
              >
                Recent
              </span>
            )}
            {isPopular && (
              <span className="shrink-0" title="Most played">
                <Flame
                  aria-hidden="true"
                  className="h-3.5 w-3.5 fill-orange-400/20 text-orange-400"
                />
                <span className="sr-only">Most played</span>
              </span>
            )}
          </h4>
          <div className="relative z-20 flex shrink-0 items-center gap-1.5">
            {game.version && (
              <span
                style={CHIP_STYLE}
                className="shrink-0 px-2.5 py-0.5 font-mono text-[11px] text-[#caccd2]"
              >
                {game.version}
              </span>
            )}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onToggleFavorite(game.id, e);
              }}
              onMouseDown={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
              aria-label={isFavorite ? `Remove ${game.name} from favorites` : `Add ${game.name} to favorites`}
              title={isFavorite ? "Remove from favorites" : "Add to favorites"}
              className="relative z-20 group/fav inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-zinc-400 transition hover:bg-white/[0.12] hover:text-amber-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400 active:scale-90"
            >
              <Heart
                aria-hidden="true"
                className={`h-4 w-4 pointer-events-none transition-colors ${
                  isFavorite
                    ? "fill-amber-400 text-amber-400"
                    : "stroke-[1.75] text-zinc-400 group-hover/fav:text-amber-300"
                }`}
              />
            </button>
          </div>
        </div>

        <p className="mb-3 line-clamp-2 flex-1 text-xs leading-[17px] text-[#8B9099] sm:text-sm sm:leading-[18px]">
          <HighlightText text={game.description} query={searchQuery} />
        </p>

        <div className="mt-auto flex items-center justify-between gap-2 border-t border-white/[0.06] pt-3 sm:gap-3">
          <div className="flex min-w-0 flex-nowrap items-center gap-1.5 overflow-hidden sm:flex-wrap">
            {game.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                style={CHIP_STYLE}
                className="inline-flex h-5 shrink-0 items-center px-2 text-[11px] leading-[13px] text-[#caccd2] sm:h-6 sm:px-2.5 sm:text-[11px] sm:leading-[14px]"
              >
                <HighlightText text={tag} query={searchQuery} />
              </span>
            ))}
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {!game.disabled && plays > 0 && (
              <span
                className="text-[11px] font-mono tabular-nums text-zinc-500"
                title={`${plays.toLocaleString("en-US")} plays`}
              >
                {formatPlays(plays)} plays
              </span>
            )}
            {hiddenInfo && onRestoreHidden && (
              <button
                type="button"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  onRestoreHidden(game.id);
                }}
                title="Put this game back in the main catalog"
                className="inline-flex h-7 cursor-pointer items-center justify-center gap-1.5 rounded-full border border-white/15 px-2.5 text-[11px] font-medium text-zinc-200 transition-colors hover:bg-white/[0.1] focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
              >
                Restore
              </button>
            )}
            {game.disabled ? (
              <span
                style={CHIP_STYLE}
                className="inline-flex h-7 items-center justify-center gap-1.5 px-3 text-xs font-medium text-zinc-400"
              >
                <Clock3 className="h-3 w-3" aria-hidden="true" />
                <span>Coming soon</span>
              </span>
            ) : (
              <span
                aria-hidden="true"
                className="inline-flex h-7 items-center justify-center gap-1.5 rounded-full bg-white px-3.5 text-xs font-semibold text-zinc-950 shadow-sm transition-colors group-hover:bg-zinc-100"
              >
                <Play className="h-3 w-3 fill-current" />
                <span>Play</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

function BlockedCheckRow({
  game,
  status,
  onPlay,
}: {
  game: GameItem;
  status: "unblocked" | "blocked";
  onPlay: (game: GameItem, event?: React.MouseEvent) => void;
}) {
  return (
    <a
      href={game.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(event) => onPlay(game, event)}
      className="group flex items-center gap-2.5 rounded-xl border border-white/[0.08] bg-white/[0.035] p-2 transition hover:border-white/[0.16] hover:bg-white/[0.07]"
    >
      <span className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg ring-1 ring-inset ring-white/[0.08]">
        <GameCoverArt game={game} accent={gameAccent(game)} compact />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-xs font-medium text-zinc-100">{game.name}</span>
        <span className="block truncate text-[11px] text-zinc-500">{game.url}</span>
      </span>
      <span
        className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
          status === "unblocked"
            ? "bg-amber-400/15 text-amber-300"
            : "bg-red-500/15 text-red-300"
        }`}
      >
        {status === "unblocked" ? "Unblocked" : "Blocked"}
      </span>
    </a>
  );
}

export function GameCatalog({
  showAdSpot = true,
  onReportBug,
  bugReportOpen = false,
  searchQuery,
  onSearchQueryChange,
  selectedCategory,
  onSelectCategory,
}: {
  showAdSpot?: boolean;
  onReportBug?: (gameName?: string) => void;
  // While the report form is up it owns focus, not the game launcher.
  bugReportOpen?: boolean;
  // Search and the active filter live in the top nav and side nav, so they are
  // owned by the app and passed down.
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  selectedCategory: CategoryId;
  onSelectCategory: (category: CategoryId) => void;
}) {
  const [games, setGames] = React.useState<GameItem[]>([]);
  const [catalogLoading, setCatalogLoading] = React.useState(true);
  const [catalogError, setCatalogError] = React.useState("");
  const [sortOption, setSortOption] = React.useState<SortOption>(initialSortOption);
  // The full grid is kept behind a Browse all button on the unfiltered home view.
  const [showAllGames, setShowAllGames] = React.useState(false);
  const [cardLayout, setCardLayout] = React.useState<GameCardLayout>(loadGameCardLayout);
  React.useEffect(() => onGameCardLayoutChange(setCardLayout), []);
  const [filterOpen, setFilterOpen] = React.useState(false);
  const filterRef = React.useRef<HTMLDivElement>(null);
  const filterMenuRef = React.useRef<HTMLDivElement>(null);
  const filterButtonRef = React.useRef<HTMLButtonElement>(null);
  const [launcherGame, setLauncherGame] = React.useState<GameItem | null>(null);
  const [launcherNonce, setLauncherNonce] = React.useState(0);
  const [launcherLoaded, setLauncherLoaded] = React.useState(false);
  const [launcherSlow, setLauncherSlow] = React.useState(false);
  const launcherIframeRef = React.useRef<HTMLIFrameElement>(null);
  const [launcherIssue, setLauncherIssue] = React.useState<{ reason: HiddenGameReason; detail: string } | null>(null);
  // The launcher fades out before it unmounts, so leaving a game does not snap.
  const [launcherClosing, setLauncherClosing] = React.useState(false);
  const launcherCloseTimerRef = React.useRef<number | null>(null);
  React.useEffect(() => {
    return () => {
      if (launcherCloseTimerRef.current) window.clearTimeout(launcherCloseTimerRef.current);
    };
  }, []);
  // Occasional one-tap "Did this work?" after a game has actually loaded.
  const [feedbackPrompt, setFeedbackPrompt] = React.useState(false);
  // Closing the sponsor slot only pauses it; it comes back after 30 seconds.
  const [adSpotHidden, setAdSpotHidden] = React.useState(false);
  const adSpotTimerRef = React.useRef<number | null>(null);
  React.useEffect(() => {
    return () => {
      if (adSpotTimerRef.current) window.clearTimeout(adSpotTimerRef.current);
    };
  }, []);
  const dismissAdSpot = React.useCallback(() => {
    setAdSpotHidden(true);
    if (adSpotTimerRef.current) window.clearTimeout(adSpotTimerRef.current);
    adSpotTimerRef.current = window.setTimeout(() => setAdSpotHidden(false), 30_000);
  }, []);
  const launcherPanelRef = React.useRef<HTMLDivElement>(null);
  const launcherBackRef = React.useRef<HTMLButtonElement>(null);
  const [popularGameIds, setPopularGameIds] = React.useState<Set<string>>(() => new Set());
  const [recentIds, setRecentIds] = React.useState<Set<string>>(
    () => new Set(loadRecentGames().map((entry) => entry.id))
  );
  const [favoriteIds, setFavoriteIds] = React.useState<Set<string>>(() => new Set(loadFavorites()));
  const [buggyIds, setBuggyIds] = React.useState<Set<string>>(loadBuggyGameIds);

  React.useEffect(() => {
    return onBuggyGamesChange((updated) => setBuggyIds(updated));
  }, []);

  const [verifiedIds, setVerifiedIds] = React.useState<Set<string>>(loadVerifiedGameIds);

  React.useEffect(() => {
    return onVerifiedGamesChange((updated) => setVerifiedIds(updated));
  }, []);

  // Editor's picks come from the admin-managed list once one has been saved;
  // until then the catalog's own editorsPick fields decide.
  const [editorPickIds, setEditorPickIds] = React.useState<Set<string> | null>(loadEditorPicks);

  React.useEffect(() => {
    return onEditorPicksChange((updated) => setEditorPickIds(updated));
  }, []);

  React.useEffect(() => {
    fetchEditorPicks().catch(() => {});
  }, []);

  const isEditorPick = React.useCallback(
    (game: GameItem) => (editorPickIds ? editorPickIds.has(game.id) : !!game.editorsPick),
    [editorPickIds]
  );

  const [notMobileIds, setNotMobileIds] = React.useState<Set<string>>(loadNotMobileGameIds);

  React.useEffect(() => {
    return onNotMobileGamesChange((updated) => setNotMobileIds(updated));
  }, []);

  const [blockedIds, setBlockedIds] = React.useState<Set<string>>(loadBlockedGameIds);
  const [blockedEmoji] = React.useState<string>(() => getRandomBlockedEmoji());
  // Per-game offline packs downloaded from Settings. The Offline filter is only
  // offered while the browser has no connection.
  const [offlinePackIds, setOfflinePackIds] = React.useState<Set<string>>(
    () => new Set(loadDownloadedPackIds())
  );
  const [offlineNow, setOfflineNow] = React.useState(
    () => typeof navigator !== "undefined" && !navigator.onLine
  );

  React.useEffect(() => {
    return onDownloadedPacksChange((ids) => setOfflinePackIds(new Set(ids)));
  }, []);

  React.useEffect(() => {
    // Only visitors who downloaded a game have a reason to see the filter.
    if (loadDownloadedPackIds().length > 0) void detectOffline().then(setOfflineNow);
    const goOnline = () => {
      setOfflineNow(false);
      // The offline filter disappears with the connection; keep a valid filter.
      if (selectedCategory === OFFLINE_CATEGORY) onSelectCategory("all");
    };
    const goOffline = () => setOfflineNow(true);
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, [selectedCategory, onSelectCategory]);
  // "Run Blocked Check" in the filter menu: every game is loaded once in an
  // invisible frame, and a frame that never loads counts as blocked.
  const [blockedCheckOpen, setBlockedCheckOpen] = React.useState(false);
  const [blockedCheck, setBlockedCheck] = React.useState<{
    running: boolean;
    checked: number;
    total: number;
    unblocked: GameItem[];
    blocked: GameItem[];
  }>({ running: false, checked: 0, total: 0, unblocked: [], blocked: [] });
  const blockedCheckAbortRef = React.useRef<AbortController | null>(null);
  const blockedCheckPanelRef = React.useRef<HTMLDivElement>(null);
  const blockedCheckCloseRef = React.useRef<HTMLButtonElement>(null);

  const startBlockedCheck = React.useCallback(() => {
    blockedCheckAbortRef.current?.abort();
    const controller = new AbortController();
    blockedCheckAbortRef.current = controller;

    const targets = games.filter((game) => !!game.url);
    const unblocked: GameItem[] = [];
    const blocked: GameItem[] = [];
    let checked = 0;
    let finished = false;
    let timer: number | null = null;

    const flush = (running: boolean) => {
      if (timer !== null) {
        window.clearTimeout(timer);
        timer = null;
      }
      setBlockedCheck({
        running,
        checked,
        total: targets.length,
        unblocked: [...unblocked],
        blocked: [...blocked],
      });
    };

    // Frames settle a few at a time, so paint the list on a short interval
    // instead of re-rendering it for every result.
    const queueFlush = () => {
      if (finished || timer !== null) return;
      timer = window.setTimeout(() => {
        timer = null;
        if (!finished && !controller.signal.aborted) flush(true);
      }, 160);
    };

    setBlockedCheckOpen(true);
    flush(true);

    let next = 0;
    const worker = async () => {
      while (!controller.signal.aborted) {
        const index = next;
        next += 1;
        if (index >= targets.length) return;
        const game = targets[index];
        const result = await testFrameLoad(game.url, BLOCKED_CHECK_TIMEOUT_MS, controller.signal);
        if (controller.signal.aborted) return;
        if (result === "reachable") unblocked.push(game);
        else blocked.push(game);
        checked += 1;
        queueFlush();
      }
    };

    void Promise.all(
      Array.from({ length: Math.min(BLOCKED_CHECK_CONCURRENCY, targets.length) }, () => worker())
    ).then(() => {
      // A newer run (or a close) owns the panel now.
      if (blockedCheckAbortRef.current !== controller) return;
      finished = true;
      flush(false);
      blockedCheckAbortRef.current = null;
    });
  }, [games]);

  const stopBlockedCheck = React.useCallback(() => {
    blockedCheckAbortRef.current?.abort();
    setBlockedCheck((previous) =>
      previous.running ? { ...previous, running: false } : previous
    );
  }, []);

  const closeBlockedCheck = React.useCallback(() => {
    stopBlockedCheck();
    setBlockedCheckOpen(false);
  }, [stopBlockedCheck]);

  useDialogFocus({
    active: blockedCheckOpen,
    onClose: closeBlockedCheck,
    panelRef: blockedCheckPanelRef,
    initialFocusRef: blockedCheckCloseRef,
  });

  // Closing the catalog mid-check should not leave hidden frames behind.
  React.useEffect(() => () => blockedCheckAbortRef.current?.abort(), []);

  const blockedCheckGroups = React.useMemo(
    () => ({
      unblocked: [...blockedCheck.unblocked].sort((a, b) => a.name.localeCompare(b.name)),
      blocked: [...blockedCheck.blocked].sort((a, b) => a.name.localeCompare(b.name)),
    }),
    [blockedCheck.unblocked, blockedCheck.blocked]
  );

  // Broken games are hidden from the main list, but a scan cannot see a game
  // that dies after loading, so the launcher adds its own detections here.
  const [hiddenGames, setHiddenGames] = React.useState<Record<string, HiddenGameEntry>>(loadHiddenGames);

  React.useEffect(() => {
    return onHiddenGamesChange((updated) => setHiddenGames(updated));
  }, []);

  // The admin picks this from the panel; it is stored on this device.
  const [gameOfTheDayId, setGameOfTheDayId] = React.useState<string>(loadGameOfTheDayId);

  React.useEffect(() => {
    return onGameOfTheDayChange((entry) => setGameOfTheDayId(entry?.gameId || ""));
  }, []);

  const catalogScrollRef = React.useRef<HTMLDivElement>(null);
  const allGamesSectionRef = React.useRef<HTMLElement>(null);
  const savedCatalogScrollRef = React.useRef(0);
  const catalogScrollTouchedRef = React.useRef(false);

  const rememberCatalogScroll = React.useCallback((top?: number) => {
    const value = Math.max(0, Math.round(top ?? catalogScrollRef.current?.scrollTop ?? 0));
    savedCatalogScrollRef.current = value;
    try {
      sessionStorage.setItem(CATALOG_SCROLL_KEY, String(value));
    } catch {}
  }, []);

  const handleCatalogScroll = React.useCallback(
    (event: React.UIEvent<HTMLDivElement>) => rememberCatalogScroll(event.currentTarget.scrollTop),
    [rememberCatalogScroll]
  );

  const markCatalogScrollTouched = React.useCallback(() => {
    catalogScrollTouchedRef.current = true;
  }, []);

  // Returning from a game (including a fresh page load in this tab) should put
  // the reader back on the row they left.
  React.useEffect(() => {
    try {
      savedCatalogScrollRef.current = Number(sessionStorage.getItem(CATALOG_SCROLL_KEY) || "0") || 0;
    } catch {}
    if (savedCatalogScrollRef.current <= 0) return;
    const restore = () => {
      if (catalogScrollTouchedRef.current) return;
      const element = catalogScrollRef.current;
      if (element) element.scrollTop = savedCatalogScrollRef.current;
    };
    const frame = window.requestAnimationFrame(() => window.requestAnimationFrame(restore));
    const timers = [150, 600, 1500].map((delay) => window.setTimeout(restore, delay));
    return () => {
      window.cancelAnimationFrame(frame);
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  // The lower sponsor unit is mounted only after the reader has scrolled into
  // the list, so a quick first-screen visit never loads it.
  const [lowerAdVisible, setLowerAdVisible] = React.useState(false);
  React.useEffect(() => {
    const element = catalogScrollRef.current;
    if (!element || lowerAdVisible) return;
    const reveal = () => {
      if (element.scrollTop > 280) setLowerAdVisible(true);
    };
    element.addEventListener("scroll", reveal, { passive: true });
    reveal();
    return () => element.removeEventListener("scroll", reveal);
  }, [lowerAdVisible]);

  React.useEffect(() => {
    return onBlockedGamesChange((updated) => setBlockedIds(updated));
  }, []);

  // Fetch flags from Cloudflare backend so verified, bug & mobile tags show up on all devices
  React.useEffect(() => {
    let active = true;
    loadGameFlags()
      .then((flags) => {
        if (!active) return;
        saveVerifiedGameIds(flags.verified);
        saveBuggyGameIds(flags.buggy);
        saveNotMobileGameIds(flags.notMobile);
        saveBlockedGameIds(flags.blocked);
        setVerifiedIds(new Set(flags.verified));
        setBuggyIds(new Set(flags.buggy));
        setNotMobileIds(new Set(flags.notMobile));
        setBlockedIds(new Set(flags.blocked));
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const toggleFavorite = React.useCallback((id: string, event?: React.MouseEvent) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    const action = favoriteIds.has(id) ? "removed" : "added";
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      if (action === "removed") {
        next.delete(id);
      } else {
        next.add(id);
      }
      try {
        localStorage.setItem(FAVORITES_GAMES_KEY, JSON.stringify(Array.from(next)));
      } catch {}
      return next;
    });
    posthog.capture("game_favorite_toggled", { game_id: id, action });
  }, [favoriteIds]);
  const markGamePlayed = React.useCallback((id: string) => {
    const next = [
      { id, playedAt: Date.now() },
      ...loadRecentGames().filter((entry) => entry.id !== id)
    ].slice(0, MAX_RECENT_GAMES);
    setRecentIds(new Set(next.map((entry) => entry.id)));
    try {
      localStorage.setItem(RECENT_GAMES_KEY, JSON.stringify(next));
    } catch {
      // Storage can be unavailable in private mode; the game link still works.
    }
  }, []);

  // The catalog ships as JSON instead of living in the bundle, so the hub shell
  // loads fast and the list can be cached or replaced without a new build.
  React.useEffect(() => {
    let active = true;
    loadCatalog()
      .then((loaded) => {
        if (!active) return;
        setGames((prev) => mergeCatalog(loaded, prev));
        setCatalogError("");
        posthog.logger.info("catalog loaded", { game_count: loaded.length });
      })
      .catch(() => {
        if (!active) return;
        setCatalogError("The game catalog could not be loaded. Check your connection and reload.");
      })
      .finally(() => {
        if (active) setCatalogLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  React.useEffect(() => {
    // The response carries s-maxage/stale-while-revalidate headers, so let the
    // browser and CDN reuse it instead of forcing a full download every visit.
    fetch("/games/config.json")
      .then((res) => {
        if (!res.ok) throw new Error("Config not found");
        return res.json();
      })
      .then((data) => {
        if (data && Array.isArray(data.games)) {
          const loaded: GameItem[] = data.games.map((g: any, idx: number) => ({
            id: `cfg-${g.subdomain || idx}`,
            name: g.name || "Game",
            url: g.url || "#",
            description: g.description || `${g.name} game from games catalog.`,
            tags: g.category ? [g.category.toUpperCase(), "Web"] : ["Catalog", "Web"],
            disabled: !!g.disabled,
            editorsPick: !!g.editorsPick,
            errorBug: !!g.errorBug || !!g.buggy,
            verified: !!g.verified
          }));

          // The catalog fetch may still be in flight; merging into whatever has
          // arrived so far keeps both sources (the catalog wins on duplicates).
          setGames((prev) => (prev.length ? mergeCatalog(prev, loaded) : prev));
          posthog.logger.info("catalog configuration loaded", {
            configured_game_count: loaded.length,
          });
        }
      })
      .catch(() => {});
  }, []);

  React.useEffect(() => {
    loadGameStats()
      .then((stats) => {
        if (!stats.length) return;
        const byId = new Map(stats.map((item) => [item.id, item]));
        const byUrl = new Map(stats.filter((item) => item.url).map((item) => [urlKey(item.url), item]));
        const byName = new Map(stats.map((item) => [nameKey(item.name), item]));
        setGames((current) =>
          current.map((game) => {
            const stat =
              byId.get(game.id) ||
              (game.url ? byUrl.get(urlKey(game.url)) : undefined) ||
              byName.get(nameKey(game.name));
            return stat ? { ...game, clicks: stat.clicks } : game;
          })
        );
        setPopularGameIds(topGameIdsByClicks(stats));
      })
      .catch(() => {});
  }, []);

  const openLauncher = React.useCallback((game: GameItem) => {
    if (launcherCloseTimerRef.current) {
      window.clearTimeout(launcherCloseTimerRef.current);
      launcherCloseTimerRef.current = null;
    }
    setLauncherClosing(false);
    setLauncherGame(game);
    setLauncherNonce((value) => value + 1);
    setLauncherLoaded(false);
    setLauncherSlow(false);
    setLauncherIssue(null);
    setFeedbackPrompt(false);
  }, []);

  // A game that fails inside the launcher is remembered as hidden, so the same
  // dead embed is not offered to the next visitor on this device.
  const flagLauncherBroken = React.useCallback(
    (game: GameItem, reason: HiddenGameReason, detail: string) => {
      hideGame(game.id, reason, detail);
      setLauncherIssue({ reason, detail });
    },
    [],
  );

  const inspectLauncherFrame = React.useCallback(
    (game: GameItem) => {
      if (!isSameOriginGame(game.url)) return;
      window.setTimeout(() => {
        try {
          const doc = launcherIframeRef.current?.contentDocument;
          const body = doc?.body;
          if (!doc || !body) return;
          const text = (body.innerText || body.textContent || "").replace(/\s+/g, " ").trim();
          const hasGameContent =
            !!doc.querySelector("canvas, embed, object, video, iframe, img, svg, audio") || doc.scripts.length > 0;
          if (/^(404|410)\b|page not found|the page could not be found|cannot get /i.test(text) && text.length < 300) {
            flagLauncherBroken(game, "not-found", `the game page says “${text.slice(0, 80)}”`);
          } else if (text.length < 10 && !hasGameContent) {
            flagLauncherBroken(game, "blank", "the game loaded with no visible content");
          }
        } catch {
          // Cross-origin frames cannot be inspected; the load/error events still cover them.
        }
      }, 2500);
    },
    [flagLauncherBroken],
  );

  const dismissLauncher = React.useCallback(() => {
    setFeedbackPrompt(false);
    setLauncherClosing(true);
    if (launcherCloseTimerRef.current) window.clearTimeout(launcherCloseTimerRef.current);
    launcherCloseTimerRef.current = window.setTimeout(() => {
      launcherCloseTimerRef.current = null;
      setLauncherGame(null);
      setLauncherSlow(false);
      setLauncherClosing(false);
    }, 180);
  }, []);

  // Ask only sometimes, only for games this device has not answered for, and
  // never before the game has had a moment to render.
  React.useEffect(() => {
    if (!launcherGame || !launcherLoaded || launcherIssue) return;
    if (!shouldPromptFeedback(launcherGame.id)) return;
    const timer = window.setTimeout(() => setFeedbackPrompt(true), 1500);
    return () => window.clearTimeout(timer);
  }, [launcherGame, launcherLoaded, launcherIssue]);

  const answerFeedback = React.useCallback(
    (answer: "worked" | "broken" | "dismissed") => {
      if (!launcherGame) return;
      recordGameFeedback(launcherGame.id, answer);
      markFeedbackPromptSeen();
      setFeedbackPrompt(false);
      // A failure goes straight into the normal bug report, game name included.
      if (answer === "broken") onReportBug?.(launcherGame.name);
    },
    [launcherGame, onReportBug],
  );

  const closeLauncher = React.useCallback(() => {
    finalizePlaySession();
    dismissLauncher();
    const element = catalogScrollRef.current;
    if (element && savedCatalogScrollRef.current > 0) element.scrollTop = savedCatalogScrollRef.current;
  }, [dismissLauncher]);

  const handleGameClick = (game: GameItem) => {
    const launchMode = isSameOriginGame(game.url) ? "in_hub" : "new_tab";
    posthog.capture("game_started", {
      game_id: game.id,
      launch_mode: launchMode,
    });
    posthog.logger.info("game launch initiated", {
      game_id: game.id,
      launch_mode: launchMode,
    });
    noteGamePlayed(game.id, game.name);
    markGamePlayed(game.id);
    setGames((current) =>
      current.map((item) =>
        item.id === game.id ? { ...item, clicks: (item.clicks || 0) + 1 } : item
      )
    );
    setPopularGameIds(
      topGameIdsByClicks(
        games.map((item) => ({
          id: item.id,
          clicks: (item.clicks || 0) + (item.id === game.id ? 1 : 0),
        }))
      )
    );
    recordGameClick({ id: game.id, name: game.name, url: game.url })
      .then((updated) => {
        if (!updated) return;
        setGames((current) =>
          current.map((item) =>
            item.id === game.id ? { ...item, clicks: updated.clicks } : item
          )
        );
        loadGameStats()
          .then((stats) => setPopularGameIds(topGameIdsByClicks(stats)))
          .catch(() => {});
      })
      .catch(() => {});
  };

  const launchGame = (game: GameItem, event?: React.MouseEvent) => {
    const embed = !game.disabled && isSameOriginGame(game.url);
    if (embed) event?.preventDefault();
    rememberCatalogScroll();
    handleGameClick(game);
    if (embed) openLauncher(game);
  };

  // The shuffle button in the header asks for a random game; the catalog owns
  // the list, so it picks one and launches it the same way a card does.
  const launchRandomGameRef = React.useRef<() => void>(() => {});
  launchRandomGameRef.current = () => {
    const pool = games.filter((game) => !game.disabled && !hiddenGames[game.id]);
    if (pool.length === 0) return;
    const game = pool[Math.floor(Math.random() * pool.length)];
    const embed = isSameOriginGame(game.url);
    launchGame(game);
    if (!embed) window.open(game.url, "_blank", "noopener,noreferrer");
  };
  React.useEffect(() => {
    const playRandomGame = () => launchRandomGameRef.current();
    window.addEventListener(RANDOM_GAME_EVENT, playRandomGame);
    return () => window.removeEventListener(RANDOM_GAME_EVENT, playRandomGame);
  }, []);

  // The notifications bell asks for a specific game to continue, which launches
  // through the same path as a card so the play session and launch are counted.
  const launchGameByIdRef = React.useRef<(id: string) => void>(() => {});
  launchGameByIdRef.current = (id: string) => {
    const game = games.find(
      (entry) => entry.id === id && !entry.disabled && !hiddenGames[entry.id]
    );
    if (!game) return;
    const embed = isSameOriginGame(game.url);
    launchGame(game);
    if (!embed) window.open(game.url, "_blank", "noopener,noreferrer");
  };
  React.useEffect(() => {
    const playGameById = (event: Event) => {
      const id = (event as CustomEvent<{ id?: string }>).detail?.id;
      if (id) launchGameByIdRef.current(id);
    };
    window.addEventListener(CONTINUE_GAME_EVENT, playGameById);
    return () => window.removeEventListener(CONTINUE_GAME_EVENT, playGameById);
  }, []);

  // The in-page launcher stays open while the game runs; Escape or the return
  // bar closes it, and only then is the play session finalized.
  useDialogFocus({
    active: !!launcherGame && !bugReportOpen,
    onClose: closeLauncher,
    panelRef: launcherPanelRef,
    initialFocusRef: launcherBackRef,
  });

  React.useEffect(() => {
    if (!launcherGame) return;
    document.documentElement.dataset.gameLauncher = "open";
    const slowTimer = window.setTimeout(() => setLauncherSlow(true), 8000);
    return () => {
      delete document.documentElement.dataset.gameLauncher;
      window.clearTimeout(slowTimer);
    };
  }, [launcherGame, launcherNonce]);

  // If the frame never reports a load, treat the game as erroring out and hide
  // it. The generous window keeps slow Unity downloads from being flagged.
  React.useEffect(() => {
    if (!launcherGame || launcherLoaded) return;
    const stuckTimer = window.setTimeout(() => {
      flagLauncherBroken(launcherGame, "error", "the game never finished loading (25s)");
    }, 25_000);
    return () => window.clearTimeout(stuckTimer);
  }, [launcherGame, launcherNonce, launcherLoaded, flagLauncherBroken]);

  // Keep search and category filter in the URL so filtered views can be shared or bookmarked.
  React.useEffect(() => {
    const url = new URL(window.location.href);
    if (searchQuery.trim()) url.searchParams.set(SEARCH_PARAM, searchQuery);
    else url.searchParams.delete(SEARCH_PARAM);

    if (selectedCategory && selectedCategory !== "all") {
      url.searchParams.set(CATEGORY_PARAM, selectedCategory);
    } else {
      url.searchParams.delete(CATEGORY_PARAM);
    }

    if (sortOption !== DEFAULT_SORT) url.searchParams.set("sort", sortOption);
    else url.searchParams.delete("sort");

    window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
  }, [searchQuery, selectedCategory, sortOption]);

  // A menu opens onto its first item and responds to the arrow keys, Home,
  // End and Escape, matching the role="menu" semantics it announces.
  React.useEffect(() => {
    if (!filterOpen) return;
    filterMenuRef.current?.querySelector<HTMLElement>('[role^="menuitem"]')?.focus();
  }, [filterOpen]);

  const handleFilterMenuKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp" && event.key !== "Home" && event.key !== "End") {
      return;
    }
    const items = Array.from(
      filterMenuRef.current?.querySelectorAll<HTMLElement>('[role^="menuitem"]') ?? []
    );
    if (items.length === 0) return;
    event.preventDefault();
    const current = items.indexOf(document.activeElement as HTMLElement);
    if (event.key === "Home") return items[0].focus();
    if (event.key === "End") return items[items.length - 1].focus();
    const step = event.key === "ArrowDown" ? 1 : -1;
    const next = current === -1 ? 0 : (current + step + items.length) % items.length;
    items[next].focus();
  };

  React.useEffect(() => {
    if (!filterOpen) return;
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setFilterOpen(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setFilterOpen(false);
        filterButtonRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [filterOpen]);

  // Search runs on the server so the browser does not filter the whole catalog;
  // a failed request falls back to the local filter below.
  const [serverMatches, setServerMatches] = React.useState<GameItem[] | null>(null);
  const [serverSearching, setServerSearching] = React.useState(false);

  React.useEffect(() => {
    const query = searchQuery.trim();
    if (query.length < 2) {
      setServerMatches(null);
      setServerSearching(false);
      return;
    }

    const controller = new AbortController();
    setServerSearching(true);
    const timer = window.setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(query)}`, {
        signal: controller.signal,
        headers: { Accept: "application/json" },
      })
        .then((response) => (response.ok ? response.json() : Promise.reject(new Error("Search unavailable"))))
        .then((data) => {
          const remote: GameItem[] = Array.isArray(data.games) ? data.games : [];
          const localById = new Map(games.map((game) => [game.id, game]));
          setServerMatches(remote.map((game) => localById.get(game.id) ?? game));
        })
        .catch(() => {
          if (!controller.signal.aborted) setServerMatches(null);
        })
        .finally(() => {
          if (!controller.signal.aborted) setServerSearching(false);
        });
    }, 220);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [searchQuery, games]);

  // The ten most played games drive both the Trending view and its Top 10
  // chart, ranked like a streaming service.
  const trendingGames = React.useMemo(
    () =>
      games
        .filter((game) => !game.disabled && !hiddenGames[game.id])
        .sort((a, b) => totalPlays(b) - totalPlays(a))
        .slice(0, 10),
    [games, hiddenGames]
  );
  const trendingIds = React.useMemo(
    () => new Set(trendingGames.map((game) => game.id)),
    [trendingGames]
  );

  const filteredGames = React.useMemo(() => {
    const trimmedQuery = searchQuery.trim();
    const usingServer = trimmedQuery.length >= 2 && serverMatches !== null;
    let list = usingServer ? serverMatches : games;
    if (selectedCategory !== "hidden") {
      list = list.filter((game) => !hiddenGames[game.id]);
    }
    if (selectedCategory === "favorites") {
      list = list.filter((game) => favoriteIds.has(game.id));
    } else if (selectedCategory === "recent") {
      list = list.filter((game) => recentIds.has(game.id));
    } else if (selectedCategory === "editors") {
      list = list.filter((game) => isEditorPick(game));
    } else if (selectedCategory === "verified") {
      list = list.filter((game) => verifiedIds.has(game.id) || !!game.verified);
    } else if (selectedCategory === "hidden") {
      list = list.filter((game) => !!hiddenGames[game.id]);
    } else if (selectedCategory === "trending") {
      list = list.filter((game) => trendingIds.has(game.id));
    } else if (selectedCategory === "buggy") {
      list = list.filter((game) => buggyIds.has(game.id) || !!game.errorBug);
    } else if (selectedCategory === "blocked") {
      list = list.filter((game) => blockedIds.has(game.id));
    } else if (selectedCategory === OFFLINE_CATEGORY) {
      list = list.filter((game) => offlinePackIds.has(game.id));
    } else if (selectedCategory !== "all") {
      list = list.filter((game) => matchesCategory(game, selectedCategory));
    }
    if (usingServer || !trimmedQuery) return list;
    const terms = trimmedQuery.toLowerCase().split(/\s+/).filter(Boolean);
    return list.filter((game) => {
      const searchableText = [game.name, game.description, ...game.tags]
        .join(" ")
        .toLowerCase();
      return terms.every((term) => searchableText.includes(term));
    });
  }, [games, selectedCategory, favoriteIds, buggyIds, blockedIds, verifiedIds, trendingIds, hiddenGames, searchQuery, serverMatches, offlinePackIds, recentIds, isEditorPick]);

  const playableGames = React.useMemo(
    () => filteredGames.filter((game) => !game.disabled),
    [filteredGames]
  );
  const sortGames = React.useCallback((items: GameItem[]) => {
    const sorted = [...items];
    switch (sortOption) {
      case "popular":
        return sorted.sort((a, b) => {
          const diff = totalPlays(b) - totalPlays(a);
          if (diff !== 0) return diff;
          if (!!b.editorsPick !== !!a.editorsPick) return Number(!!b.editorsPick) - Number(!!a.editorsPick);
          return Number(!!b.featured) - Number(!!a.featured);
        });
      case "az":
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case "recent": {
        const playedAt = new Map(loadRecentGames().map((entry) => [entry.id, entry.playedAt]));
        return sorted.sort((a, b) => (playedAt.get(b.id) || 0) - (playedAt.get(a.id) || 0));
      }
      case "featured":
        return sorted.sort((a, b) => {
          if (!!b.editorsPick !== !!a.editorsPick) return Number(!!b.editorsPick) - Number(!!a.editorsPick);
          return Number(!!b.featured) - Number(!!a.featured);
        });
      default:
        return sorted;
    }
  }, [sortOption]);

  const sortedPlayableGames = React.useMemo(
    () => sortGames(playableGames),
    [playableGames, sortGames]
  );
  const comingSoonGames = React.useMemo(
    () => sortGames(filteredGames.filter((game) => game.disabled)),
    [filteredGames, sortGames]
  );

  const clearSearch = React.useCallback(() => {
    onSearchQueryChange("");
    document.getElementById("game-search")?.focus();
  }, [onSearchQueryChange]);

  const resetAllFilters = React.useCallback(() => {
    onSearchQueryChange("");
    onSelectCategory("all");
    setSortOption(DEFAULT_SORT);
    document.getElementById("game-search")?.focus();
  }, [onSearchQueryChange, onSelectCategory]);

  const gameOfTheDay = React.useMemo(() => {
    if (!gameOfTheDayId) return null;
    const game = games.find((item) => item.id === gameOfTheDayId);
    if (!game || game.disabled || hiddenGames[game.id]) return null;
    return game;
  }, [games, gameOfTheDayId, hiddenGames]);

  // The hero always has a base game: the admin's pick for today, or the
  // most-played game in the catalog when no pick has been set.
  const topGameToday = React.useMemo(() => {
    if (gameOfTheDay) return gameOfTheDay;
    const candidates = games.filter((game) => !game.disabled && !hiddenGames[game.id]);
    if (candidates.length === 0) return null;
    return candidates.reduce((best, game) =>
      totalPlays(game) > totalPlays(best) ? game : best
    );
  }, [gameOfTheDay, games, hiddenGames]);

  // The hero rotates through the editor's picks, starting with today's pick
  // (or the most played game when no pick has been set). The dots below the
  // card report and switch the active game.
  const heroGames = React.useMemo(() => {
    const picks = games.filter(
      (game) => isEditorPick(game) && !game.disabled && !hiddenGames[game.id]
    );
    if (!topGameToday) return picks;
    return [topGameToday, ...picks.filter((game) => game.id !== topGameToday.id)];
  }, [games, hiddenGames, topGameToday, isEditorPick]);

  const [heroIndex, setHeroIndex] = React.useState(0);
  const [heroPaused, setHeroPaused] = React.useState(false);
  const [heroCycle, setHeroCycle] = React.useState(0);
  const heroTouchStart = React.useRef<{ x: number; y: number; time: number } | null>(null);
  const heroTouchDelta = React.useRef({ dx: 0, dy: 0 });
  // A swipe still ends in a click on the card underneath it. Swallow that one
  // click so flicking between cards never launches a game by accident.
  const heroIgnoreClickUntil = React.useRef(0);

  React.useEffect(() => {
    setHeroIndex(0);
  }, [heroGames.length]);

  // Advance on its own, but not while the reader is hovering or tabbing through
  // the card, and never when the OS asks for reduced motion.
  React.useEffect(() => {
    if (heroGames.length < 2 || heroPaused) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      setHeroIndex((index) => (index + 1) % heroGames.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [heroGames.length, heroPaused, heroCycle]);

  const selectHeroGame = (index: number) => {
    setHeroIndex(index);
    // Restart the timer so a manual pick gets a full turn on screen.
    setHeroCycle((value) => value + 1);
  };

  const stepHeroGame = (direction: 1 | -1) => {
    if (heroGames.length < 2) return;
    selectHeroGame((heroIndex + direction + heroGames.length) % heroGames.length);
  };

  const commitHeroSwipe = (dx: number, dy: number, elapsed: number) => {
    if (heroGames.length < 2) return;
    // Ignore slow drags and mostly-vertical gestures: those are catalog scrolls.
    if (elapsed > 700) return;
    if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy) * 1.2) return;

    heroIgnoreClickUntil.current = Date.now() + 350;
    stepHeroGame(dx < 0 ? 1 : -1);
  };

  const onHeroTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    const touch = event.touches[0];
    if (!touch) return;
    // Hold the auto-rotation still while a finger is on the card.
    setHeroPaused(true);
    heroTouchStart.current = { x: touch.clientX, y: touch.clientY, time: Date.now() };
    heroTouchDelta.current = { dx: 0, dy: 0 };
  };

  const onHeroTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    const start = heroTouchStart.current;
    const touch = event.touches[0];
    if (!start || !touch) return;
    heroTouchDelta.current = {
      dx: touch.clientX - start.x,
      dy: touch.clientY - start.y,
    };
  };

  const onHeroTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    setHeroPaused(false);
    const start = heroTouchStart.current;
    const touch = event.changedTouches[0];
    heroTouchStart.current = null;
    heroTouchDelta.current = { dx: 0, dy: 0 };
    if (!start || !touch) return;
    commitHeroSwipe(touch.clientX - start.x, touch.clientY - start.y, Date.now() - start.time);
  };

  // Safari cancels the touch sequence when it hands a gesture to the scroller;
  // use the last recorded drag so a horizontal flick still changes the card.
  const onHeroTouchCancel = () => {
    const start = heroTouchStart.current;
    const delta = heroTouchDelta.current;
    heroTouchStart.current = null;
    heroTouchDelta.current = { dx: 0, dy: 0 };
    setHeroPaused(false);
    if (!start) return;
    commitHeroSwipe(delta.dx, delta.dy, Date.now() - start.time);
  };

  const recentGameItems = React.useMemo(() => {
    const byId = new Map(games.map((game) => [game.id, game]));
    return loadRecentGames()
      .map((entry) => byId.get(entry.id))
      .filter((game): game is GameItem => !!game && !game.disabled && !hiddenGames[game.id]);
  }, [games, recentIds, hiddenGames]);

  const searching = searchQuery.trim().length > 0;
  const tagCounts: Record<TagFilterId, number> = React.useMemo(
    () => ({
      editors: games.filter((game) => isEditorPick(game)).length,
      verified: games.filter((game) => verifiedIds.has(game.id) || !!game.verified).length,
      hidden: Object.keys(hiddenGames).length,
      buggy: games.filter((game) => buggyIds.has(game.id) || !!game.errorBug).length,
      blocked: blockedIds.size,
    }),
    [games, verifiedIds, buggyIds, blockedIds, hiddenGames, isEditorPick]
  );

  const isFiltered = searching || selectedCategory !== "all";

  React.useEffect(() => {
    // A new search or category always starts from the shelves again.
    setShowAllGames(false);
  }, [searchQuery, selectedCategory]);

  React.useEffect(() => {
    // Swapping the tall shelves for the grid must not leave the reader scrolled
    // past the start of that grid.
    if (showAllGames) allGamesSectionRef.current?.scrollIntoView({ block: "start" });
  }, [showAllGames]);

  const genreShelves = React.useMemo(() => {
    if (isFiltered) return [];
    return GENRE_SHELVES.map((id) => {
      const matches = sortedPlayableGames.filter((game) => matchesCategory(game, id));
      return {
        id,
        title: CATEGORY_NAMES[id],
        icon: CATEGORY_ICONS[id],
        total: matches.length,
        games: matches.slice(0, SHELF_GAME_LIMIT),
      };
    }).filter((shelf) => shelf.games.length >= 3);
  }, [isFiltered, sortedPlayableGames]);

  const seeAllCategory = (id: CategoryId) => {
    onSelectCategory(id);
    catalogScrollRef.current?.scrollTo({ top: 0, behavior: "auto" });
  };

  const renderGameCard = (
    game: GameItem,
    options?: { layout?: GameCardLayout; sizeClass?: string }
  ) => (
    <GameCard
      key={game.id}
      variant={options?.layout ?? cardLayout}
      sizeClass={options?.sizeClass}
      game={game}
      isRecent={recentIds.has(game.id)}
      isPopular={popularGameIds.has(game.id)}
      isFavorite={favoriteIds.has(game.id)}
      isBuggy={buggyIds.has(game.id) || !!game.errorBug}
      isVerified={verifiedIds.has(game.id) || !!game.verified}
      isEditorPick={isEditorPick(game)}
      isNotMobile={notMobileIds.has(game.id)}
      isBlocked={blockedIds.has(game.id)}
      hiddenInfo={hiddenGames[game.id] ?? null}
      blockedEmoji={blockedEmoji}
      plays={totalPlays(game)}
      searchQuery={searchQuery}
      onPlay={launchGame}
      onToggleFavorite={toggleFavorite}
      onRestoreHidden={restoreGame}
    />
  );

  return (
    <div className="solid-3d-panel flex min-h-0 flex-1 flex-col overflow-hidden">
      {/* Catalog top controls with search and category filters */}
      <div className="flex shrink-0 flex-col gap-2 border-b border-white/[0.06] p-2.5 sm:gap-2.5 sm:p-4">
        <div
          data-tour-target="game-categories"
          className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2"
        >
          <div className="flex min-w-0 items-center gap-2">
            <h2
              aria-live="polite"
              className="flex min-w-0 items-baseline gap-1.5 truncate text-sm font-semibold text-zinc-100 sm:text-base"
            >
              {(() => {
                const CategoryIcon = CATEGORY_ICONS[selectedCategory];
                return CategoryIcon ? (
                  <CategoryIcon aria-hidden="true" className="h-3.5 w-3.5 shrink-0 self-center text-zinc-400" />
                ) : null;
              })()}
              {serverSearching ? (
                <span className="font-normal text-zinc-400">Searching…</span>
              ) : (
                <>
                  <span className="tabular-nums">{filteredGames.length}</span>
                  <span className="font-normal text-zinc-400">
                    {filteredGames.length === 1 ? "game" : "games"} in
                  </span>
                  <span className="truncate">{CATEGORY_NAMES[selectedCategory]}</span>
                </>
              )}
              {!serverSearching && searchQuery.trim() && (
                <span className="truncate text-xs font-normal text-zinc-500">
                  for “{searchQuery.trim()}”
                </span>
              )}
            </h2>
          </div>
          <div className="flex min-w-0 items-center gap-1.5">
            <div className="relative shrink-0" ref={filterRef}>
              <button
                ref={filterButtonRef}
                type="button"
                aria-haspopup="menu"
                aria-expanded={filterOpen}
                aria-label={`Sort & filter games: ${
                  TAG_FILTERS.find((tag) => tag.id === selectedCategory)?.label ??
                  SORT_OPTIONS.find((option) => option.id === sortOption)?.label ??
                  "Most played"
                }`}
                onClick={() => setFilterOpen((open) => !open)}
                style={CHIP_STYLE}
                className={`inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-[11px] font-medium transition-colors ${
                  sortOption !== DEFAULT_SORT || TAG_FILTERS.some((tag) => tag.id === selectedCategory)
                    ? "bg-white/[0.12] text-white"
                    : "text-zinc-300 hover:bg-white/[0.08] hover:text-white"
                }`}
              >
                <SlidersHorizontal aria-hidden="true" className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">
                  {TAG_FILTERS.find((tag) => tag.id === selectedCategory)?.label ??
                    SORT_OPTIONS.find((option) => option.id === sortOption)?.label ??
                    "Most played"}
                </span>
              </button>
              {filterOpen && (
                <div
                  ref={filterMenuRef}
                  role="menu"
                  aria-label="Sort and filter games"
                  onKeyDown={handleFilterMenuKeyDown}
                  className="absolute right-0 top-full z-30 mt-2 min-w-48 overflow-hidden rounded-xl border border-white/[0.08] bg-[#1d1d1d] p-1.5 shadow-2xl"
                >
                  <div className="px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                    Sort by
                  </div>
                  {SORT_OPTIONS.map((option) => {
                    const active = sortOption === option.id;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        role="menuitemradio"
                        aria-checked={active}
                        onClick={() => {
                          setSortOption(option.id);
                          posthog.capture("catalog_filter_applied", {
                            filter_type: "sort",
                            filter_value: option.id,
                          });
                          setFilterOpen(false);
                          filterButtonRef.current?.focus();
                        }}
                        className="flex w-full items-center justify-between gap-3 rounded-lg px-2.5 py-1.5 text-left text-xs text-zinc-200 transition-colors hover:bg-white/[0.08] focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
                      >
                        <span>{option.label}</span>
                        {active && <Check aria-hidden="true" className="h-3.5 w-3.5 text-amber-300" />}
                      </button>
                    );
                  })}

                  <div className="my-1 border-t border-white/[0.08]" />

                  <div className="px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                    Tag filters
                  </div>
                  {TAG_FILTERS.map((tag) => {
                    const active = selectedCategory === tag.id;
                    const count = tagCounts[tag.id];
                    return (
                      <button
                        key={tag.id}
                        type="button"
                        role="menuitemcheckbox"
                        aria-checked={active}
                        onClick={() => {
                          onSelectCategory(selectedCategory === tag.id ? "all" : tag.id);
                          posthog.capture("catalog_filter_applied", {
                            filter_type: "tag",
                            filter_value: active ? "all" : tag.id,
                          });
                          setFilterOpen(false);
                          filterButtonRef.current?.focus();
                        }}
                        className={`flex w-full items-center justify-between gap-3 rounded-lg px-2.5 py-1.5 text-left text-xs transition-colors hover:bg-white/[0.08] focus-visible:outline focus-visible:outline-2 focus-visible:outline-white ${
                          active ? "text-amber-300 font-medium" : "text-zinc-200"
                        }`}
                      >
                        <span className="flex items-center gap-1.5">
                          <tag.icon aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-zinc-400" />
                          <span>{tag.label}</span>
                          {count > 0 && (
                            <span className="rounded-full bg-white/[0.08] px-1.5 py-0.5 text-[11px] font-mono text-zinc-400">
                              {count}
                            </span>
                          )}
                        </span>
                        {active && <Check aria-hidden="true" className="h-3.5 w-3.5 text-amber-300" />}
                      </button>
                    );
                  })}

                  <div className="my-1 border-t border-white/[0.08]" />

                  <div className="px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                    Checks
                  </div>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setFilterOpen(false);
                      startBlockedCheck();
                    }}
                    className="flex w-full items-center justify-between gap-3 rounded-lg px-2.5 py-1.5 text-left text-xs text-zinc-200 transition-colors hover:bg-white/[0.08] focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
                  >
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck aria-hidden="true" className="h-3.5 w-3.5 text-amber-300" />
                      <span>Run Blocked Check</span>
                    </span>
                    <span className="font-mono text-[11px] tabular-nums text-zinc-500">
                      {blockedCheck.running
                        ? `${blockedCheck.checked}/${blockedCheck.total}`
                        : games.length}
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Game list */}
      <div
        ref={catalogScrollRef}
        onScroll={handleCatalogScroll}
        onWheel={markCatalogScrollTouched}
        onTouchStart={markCatalogScrollTouched}
        onKeyDown={markCatalogScrollTouched}
        className="min-h-0 flex-1 overflow-y-auto p-3 sm:p-4"
        style={{
          background: "rgba(0, 0, 0, 0.18)",
          boxShadow: "inset 0 1px 4px rgba(0, 0, 0, 0.3)",
        }}
      >
        <div className="flex flex-col gap-8">
          {/* The top games carousel scrolls with the catalog, just below the filters. */}
          {!isFiltered && heroGames.length > 0 && (
            <section aria-labelledby="top-game-heading" className="flex flex-col gap-3">
              <div
                role="group"
                aria-roledescription="carousel"
                onMouseEnter={() => setHeroPaused(true)}
                onMouseLeave={() => setHeroPaused(false)}
                onFocusCapture={() => setHeroPaused(true)}
                onBlurCapture={() => setHeroPaused(false)}
                onTouchStart={onHeroTouchStart}
                onTouchMove={onHeroTouchMove}
                onTouchEnd={onHeroTouchEnd}
                onTouchCancel={onHeroTouchCancel}
                style={{ touchAction: "pan-y" }}
                className="relative h-[13rem] overflow-hidden rounded-2xl border border-white/[0.07] bg-[#1a1a1a]"
              >
                {heroGames.map((game, index) => {
                  const active = index === heroIndex % heroGames.length;
                  return (
                    <a
                      key={game.id}
                      href={game.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(event) => {
                        if (Date.now() < heroIgnoreClickUntil.current) {
                          event.preventDefault();
                          return;
                        }
                        launchGame(game, event);
                      }}
                      aria-hidden={!active}
                      tabIndex={active ? undefined : -1}
                      className={`group absolute inset-0 transition-[opacity,transform] duration-200 ease-out ${
                        active
                          ? "z-10 translate-x-0 opacity-100"
                          : "pointer-events-none z-0 translate-x-3 opacity-0"
                      }`}
                    >
                      {/* The cover takes the right third; the title keeps the rest. */}
                      <div className="absolute inset-y-0 right-0 w-1/3 overflow-hidden">
                        <GameCoverArt
                          game={game}
                          accent={gameAccent(game)}
                          eager={index === 0}
                        />
                        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[#1a1a1a]/40 to-[#1a1a1a]" />
                      </div>
                      <div className="relative z-10 flex h-full flex-col justify-end gap-1.5 p-3 sm:p-4">
                        <div className="min-w-0 max-w-[62%]">
                          <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-amber-400/15 px-2 py-0.5 text-[11px] font-medium text-amber-300">
                            <Flame aria-hidden="true" className="h-3 w-3" />
                            {isEditorPick(game) ? "Editor's pick" : "#1 game today"}
                          </span>
                          <h2
                            id={active ? "top-game-heading" : undefined}
                            className="mt-1 line-clamp-2 text-[28px] font-semibold leading-tight tracking-tight text-white"
                          >
                            {game.name}
                          </h2>
                          <p className="mt-1 line-clamp-2 text-[14px] leading-snug text-zinc-400">
                            {game.description}
                          </p>
                          {totalPlays(game) > 0 && (
                            <p className="mt-1 text-[11px] font-medium tabular-nums text-zinc-500">
                              {formatPlays(totalPlays(game))} plays
                            </p>
                          )}
                          <span className="mt-1.5 inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full bg-amber-400 px-3.5 py-1.5 text-xs font-semibold text-zinc-950 transition group-hover:bg-amber-300">
                            <Play aria-hidden="true" className="h-3.5 w-3.5 fill-current" />
                            Play
                          </span>
                        </div>
                      </div>
                    </a>
                  );
                })}
              </div>

              {heroGames.length > 1 && (
                <div
                  role="group"
                  aria-label="Choose the top game"
                  className="flex items-center justify-center gap-1"
                >
                  {heroGames.map((game, index) => {
                    const active = index === heroIndex % heroGames.length;
                    return (
                      <button
                        key={game.id}
                        type="button"
                        aria-label={`Show ${game.name}`}
                        aria-pressed={active}
                        title={game.name}
                        onClick={() => selectHeroGame(index)}
                        className="group/dot flex h-6 w-6 cursor-pointer items-center justify-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-300"
                      >
                        <span
                          aria-hidden="true"
                          className={`block rounded-full transition-[width,height,background-color] duration-150 ease-out ${
                            active
                              ? "h-2 w-2 bg-amber-300"
                              : "h-1.5 w-1.5 bg-white/25 group-hover/dot:bg-white/50"
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
              )}
            </section>
          )}

          {catalogLoading && games.length === 0 && (
            <div
              role="status"
              className="flex items-center gap-2.5 rounded-xl border border-white/[0.07] bg-white/[0.02] px-3.5 py-3 text-xs text-zinc-400"
            >
              <span
                aria-hidden="true"
                className="h-3.5 w-3.5 shrink-0 animate-spin rounded-full border-2 border-white/15 border-t-white/80"
              />
              <span>Loading the game catalog…</span>
            </div>
          )}

          {catalogError && (
            <p role="alert" className="rounded-xl border border-red-500/25 bg-red-500/10 px-3.5 py-3 text-xs text-red-300">
              {catalogError}
            </p>
          )}

          {!isFiltered && recentGameItems.length > 0 && (
            <section aria-labelledby="catalog-recent-heading" className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <h3 id="catalog-recent-heading" className="text-xs font-semibold text-zinc-200">Recently played</h3>
                <span aria-hidden="true" className="h-px flex-1 bg-white/[0.07]" />
              </div>
              <div className="relative">
              <div className="flex gap-2 overflow-x-auto pb-2 [scrollbar-width:thin]">
                {recentGameItems.map((game) => (
                  <a key={game.id} href={game.url} target="_blank" rel="noopener noreferrer" onClick={(event) => launchGame(game, event)} className="group flex w-44 shrink-0 items-center gap-2.5 rounded-xl border border-white/[0.08] bg-white/[0.035] p-2.5 text-left transition hover:border-white/[0.16] hover:bg-white/[0.07]">
                    <span className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg ring-1 ring-inset ring-white/[0.08]">
                      <GameCoverArt game={game} accent={gameAccent(game)} compact />
                    </span>
                    <span className="min-w-0 flex-1"><span className="block truncate text-xs font-medium text-zinc-100">{game.name}</span><span className="mt-0.5 block text-[11px] text-zinc-500">Play again</span></span>
                    <Play className="h-3.5 w-3.5 shrink-0 text-zinc-500 transition group-hover:text-zinc-200" />
                  </a>
                ))}
              </div>
              <ScrollEdgeBlur />
              </div>
            </section>
          )}

          {showAdSpot && (
            <div
              aria-label="Advertisement"
              style={{
                borderRadius: 12,
                background: "rgba(255, 255, 255, 0.015)",
                boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.03)",
              }}
              className={`flex-wrap items-center justify-center gap-x-2 gap-y-1 px-3 py-1.5 ${adSpotHidden ? "hidden" : "flex"}`}
            >
              <span className="shrink-0 text-[11px] font-medium text-zinc-400">Ad</span>
              <BidvertiserAd slot="catalog" showClose={false} className="flex items-center justify-center" />
              <a
                href="mailto:hello@base31.org?subject=Ad%20space%20on%20math_games"
                className="shrink-0 text-[11px] text-zinc-400 underline decoration-white/10 underline-offset-2 transition-colors hover:text-zinc-300"
              >
                Advertise
              </a>
              <button
                type="button"
                onClick={dismissAdSpot}
                aria-label="Close ad"
                title="Close ad (comes back in 30s)"
                className="-mr-1 flex h-4 w-4 shrink-0 cursor-pointer items-center justify-center rounded-full text-zinc-500 transition-colors hover:bg-white/10 hover:text-zinc-200"
              >
                <X aria-hidden="true" className="h-3 w-3" />
              </button>
            </div>
          )}

          {!isFiltered && trendingGames.length > 0 && (
            <TopTenChart games={trendingGames} onLaunch={launchGame} />
          )}

          {selectedCategory === "trending" && !searching && trendingGames.length > 0 && (
            <TopTenChart games={trendingGames} onLaunch={launchGame} />
          )}

          {!isFiltered && genreShelves.length > 0 && (
            <div className="flex flex-col gap-8">
              {genreShelves.map((shelf, index) => (
                <React.Fragment key={shelf.id}>
                  <GameRail
                    id={shelf.id}
                    title={shelf.title}
                    icon={shelf.icon}
                    total={shelf.total}
                    games={shelf.games}
                    onSeeAll={() => seeAllCategory(shelf.id)}
                    renderGame={(game) => renderGameCard(game, { layout: "mosaic" })}
                  />
                  {/* The larger ad follows the third shelf on the home view. */}
                  {index === Math.min(2, genreShelves.length - 1) &&
                    showAdSpot &&
                    lowerAdVisible && <CatalogNativeAd hidden={adSpotHidden} />}
                </React.Fragment>
              ))}
            </div>
          )}

          {!isFiltered && playableGames.length > 0 && !showAllGames && (
            <div className="flex justify-center pt-1">
              <button
                type="button"
                onClick={() => setShowAllGames(true)}
                className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.04] px-4 py-2 text-xs font-semibold text-zinc-200 transition-colors hover:border-white/20 hover:bg-white/[0.08] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <LayoutGrid aria-hidden="true" className="h-3.5 w-3.5" />
                Browse all {playableGames.length} games
              </button>
            </div>
          )}

          {playableGames.length > 0 && (isFiltered || showAllGames) && (
            <section
              ref={allGamesSectionRef}
              aria-labelledby="catalog-play-heading"
              className="flex flex-col gap-3"
            >
              <div className="flex items-center gap-2">
                <h3 id="catalog-play-heading" className="text-xs font-semibold text-zinc-200">
                  {isFiltered ? "Filtered matches" : "All games"}
                </h3>
                <span aria-hidden="true" className="h-px flex-1 bg-white/[0.07]" />
                {!isFiltered && showAllGames && (
                  <button
                    type="button"
                    onClick={() => setShowAllGames(false)}
                    className="shrink-0 cursor-pointer rounded-full px-1.5 py-0.5 text-[11px] font-medium text-zinc-400 transition-colors hover:bg-white/[0.06] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
                  >
                    Back to categories
                  </button>
                )}
                <span className="rounded-full bg-white/[0.05] px-1.5 py-0.5 font-mono text-[11px] tabular-nums text-zinc-400">
                  {playableGames.length}
                </span>
              </div>
              <div className={cardLayout === "mosaic" ? MOSAIC_GRID_CLASS : CLASSIC_GRID_CLASS}>
              {sortedPlayableGames.map((game, index) => (
                <React.Fragment key={game.id}>
                  {/* The larger ad waits until a few rows of games have gone by,
                      and only exists on the unfiltered home view. */}
                  {index === 12 && showAdSpot && lowerAdVisible && !isFiltered && (
                    <CatalogNativeAd hidden={adSpotHidden} />
                  )}
                  {renderGameCard(game, {
                    sizeClass: cardLayout === "mosaic" ? mosaicSpan(index) : undefined,
                  })}
                </React.Fragment>
              ))}
              </div>
            </section>
          )}

          {comingSoonGames.length > 0 && (
            <section aria-labelledby="catalog-soon-heading" className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <h3 id="catalog-soon-heading" className="text-xs font-semibold text-zinc-200">
                  Coming soon
                </h3>
                <span aria-hidden="true" className="h-px flex-1 bg-white/[0.07]" />
                <span className="rounded-full bg-white/[0.05] px-1.5 py-0.5 font-mono text-[11px] tabular-nums text-zinc-400">
                  {comingSoonGames.length}
                </span>
              </div>
              <div className={cardLayout === "mosaic" ? MOSAIC_GRID_CLASS : CLASSIC_GRID_CLASS}>
              {comingSoonGames.map((game, index) =>
                renderGameCard(game, {
                  sizeClass: cardLayout === "mosaic" ? mosaicSpan(index) : undefined,
                })
              )}
              </div>
            </section>
          )}

          {filteredGames.length === 0 && (
            <div className="flex flex-col items-center gap-2 py-12 text-center">
              {selectedCategory === "hidden" ? (
                <>
                  <CheckCircle2 className="h-8 w-8 text-amber-300/50" aria-hidden="true" />
                  <p className="text-sm font-medium text-zinc-300">No hidden games</p>
                  <p className="max-w-[20rem] text-xs leading-relaxed text-zinc-500">
                    Every game passed the broken-game check. Games are hidden when they 404, error out, load blank, or fail inside the launcher.
                  </p>
                </>
              ) : selectedCategory === "recent" ? (
                <>
                  <Clock3 className="h-8 w-8 text-zinc-600" aria-hidden="true" />
                  <p className="text-sm font-medium text-zinc-300">No recently played games yet</p>
                  <p className="max-w-[18rem] text-xs leading-relaxed text-zinc-500">
                    Games you open show up here for the next week, so you can jump back in.
                  </p>
                </>
              ) : selectedCategory === "favorites" ? (
                <>
                  <Heart className="h-8 w-8 text-amber-400/50" aria-hidden="true" />
                  <p className="text-sm font-medium text-zinc-300">
                    No favorite games yet
                  </p>
                  <p className="max-w-[18rem] text-xs leading-relaxed text-zinc-500">
                    Click the heart on any game card to bookmark your favorites for quick access!
                  </p>
                </>
              ) : (
                <>
                  <Gamepad2 className="h-8 w-8 text-zinc-600" aria-hidden="true" />
                  <p className="text-sm font-medium text-zinc-300">
                    {selectedCategory === OFFLINE_CATEGORY
                      ? "No games downloaded for offline"
                      : "No games match your filters"}
                  </p>
                  <p className="max-w-[16rem] text-xs leading-relaxed text-zinc-500">
                    {selectedCategory === OFFLINE_CATEGORY
                      ? "Open Settings › Offline mode while connected and download a game to play it here."
                      : searchQuery
                        ? `No games found for "${searchQuery}" in ${selectedCategory}.`
                        : "No games found in this category."}
                  </p>
                </>
              )}
              <button
                type="button"
                onClick={resetAllFilters}
                className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-zinc-950 transition-colors hover:bg-zinc-100"
              >
                <RotateCcw className="h-3 w-3" aria-hidden="true" />
                Reset filters
              </button>
            </div>
          )}
        </div>
      </div>

      {launcherGame && typeof document !== "undefined"
        ? createPortal(
            <div
              ref={launcherPanelRef}
              className={`fixed inset-0 z-[60] flex flex-col bg-[#09090b] transition-[opacity,transform] duration-200 ease-out ${
                launcherClosing ? "pointer-events-none scale-[0.99] opacity-0" : "opacity-100"
              }`}
              role="dialog"
              aria-modal={bugReportOpen ? undefined : "true"}
              aria-hidden={bugReportOpen || undefined}
              inert={bugReportOpen}
              aria-label={`${launcherGame.name} game`}
            >
              <div
                className="flex shrink-0 items-center gap-2 border-b border-white/[0.1] bg-[#171717] px-2 pb-2 sm:px-3"
                style={{ paddingTop: "calc(0.5rem + env(safe-area-inset-top))" }}
              >
                <button
                  ref={launcherBackRef}
                  type="button"
                  onClick={closeLauncher}
                  className="inline-flex h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-full bg-white px-3 text-xs font-semibold text-zinc-950 transition-colors hover:bg-zinc-100 active:scale-[0.98]"
                >
                  <ArrowLeft aria-hidden="true" className="h-4 w-4" />
                  <span>Back to class</span>
                </button>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-xs font-semibold text-zinc-100 sm:text-sm">
                    {launcherGame.name}
                  </div>
                  <div className="hidden truncate text-[11px] text-zinc-500 sm:block">
                    Playing inside the hub
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => toggleFavorite(launcherGame.id)}
                  aria-pressed={favoriteIds.has(launcherGame.id)}
                  aria-label={
                    favoriteIds.has(launcherGame.id)
                      ? `Remove ${launcherGame.name} from favorites`
                      : `Add ${launcherGame.name} to favorites`
                  }
                  title={favoriteIds.has(launcherGame.id) ? "Remove from favorites" : "Add to favorites"}
                  className="inline-flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-white/[0.08] hover:text-amber-300 active:scale-95"
                >
                  <Heart
                    aria-hidden="true"
                    className={`h-4 w-4 ${
                      favoriteIds.has(launcherGame.id)
                        ? "fill-amber-400 text-amber-400"
                        : "stroke-[1.75]"
                    }`}
                  />
                </button>
                <button
                  type="button"
                  onClick={() => onReportBug?.(launcherGame.name)}
                  aria-label="Report a bug"
                  title="Report a bug"
                  aria-haspopup="dialog"
                  className="inline-flex h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-full px-2 text-xs font-medium text-zinc-300 transition-colors hover:bg-white/[0.08] hover:text-white active:scale-95 sm:px-2.5"
                >
                  <Bug aria-hidden="true" className="h-4 w-4 text-amber-400" />
                  <span className="hidden sm:inline">Report bug</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLauncherLoaded(false);
                    setLauncherSlow(false);
                    setLauncherNonce((value) => value + 1);
                  }}
                  aria-label="Reload game"
                  title="Reload game"
                  className="inline-flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-white/[0.08] hover:text-white"
                >
                  <RotateCcw aria-hidden="true" className="h-4 w-4" />
                </button>
                <PanicButton />
                <a
                  href={launcherGame.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={dismissLauncher}
                  aria-label="Open game in a new tab"
                  title="Open game in a new tab"
                  className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full px-2.5 text-xs font-medium text-zinc-300 transition-colors hover:bg-white/[0.08] hover:text-white"
                >
                  <ExternalLink aria-hidden="true" className="h-4 w-4" />
                  <span className="hidden sm:inline">New tab</span>
                </a>
              </div>

              <div className="relative min-h-0 flex-1 bg-black">
                {launcherIssue && (
                  <div className="absolute inset-x-3 top-3 z-20 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-red-400/30 bg-[#1c1315]/95 px-3 py-2 text-[11px] text-zinc-200 shadow-lg">
                    <span className="flex min-w-0 items-center gap-1.5">
                      <EyeOff aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-red-300" />
                      <span>Hidden from the catalog — {launcherIssue.detail}.</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        if (launcherGame) restoreGame(launcherGame.id);
                        setLauncherIssue(null);
                      }}
                      className="shrink-0 cursor-pointer rounded-full border border-white/15 px-2.5 py-1 font-semibold text-white transition-colors hover:bg-white/[0.1]"
                    >
                      Keep visible
                    </button>
                  </div>
                )}
                {!launcherLoaded && (
                  <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-[#09090b]">
                    <div className="flex flex-col items-center gap-3 text-xs text-zinc-400">
                      <span
                        aria-hidden="true"
                        className="h-5 w-5 animate-spin rounded-full border-2 border-white/15 border-t-white/80"
                      />
                      Loading {launcherGame.name}…
                    </div>
                  </div>
                )}
                <iframe
                  ref={launcherIframeRef}
                  key={`${launcherGame.id}-${launcherNonce}`}
                  src={launcherGame.url}
                  title={launcherGame.name}
                  onLoad={() => {
                    setLauncherLoaded(true);
                    if (launcherGame) inspectLauncherFrame(launcherGame);
                  }}
                  onError={() => {
                    setLauncherLoaded(true);
                    if (launcherGame) flagLauncherBroken(launcherGame, "error", "the browser could not load the game");
                  }}
                  className="h-full w-full border-0 bg-black"
                  allow="autoplay; fullscreen; gamepad; clipboard-write; encrypted-media; picture-in-picture"
                  allowFullScreen
                />
                {feedbackPrompt && launcherLoaded && !launcherIssue && (
                  <div
                    role="status"
                    className="absolute bottom-3 left-1/2 z-20 flex w-[min(94%,27rem)] -translate-x-1/2 items-center gap-2 rounded-xl border border-white/12 bg-[#171717]/95 px-3 py-2 text-zinc-200 shadow-[0_12px_32px_rgba(0,0,0,0.55)] backdrop-blur"
                  >
                    <CheckCircle2 aria-hidden="true" className="h-4 w-4 shrink-0 text-amber-300" />
                    <span className="min-w-0 flex-1 text-xs font-semibold leading-tight text-zinc-100">
                      Did this work?
                    </span>
                    <button
                      type="button"
                      onClick={() => answerFeedback("worked")}
                      className="shrink-0 cursor-pointer rounded-full bg-amber-400/20 px-3 py-1 text-[11px] font-semibold text-amber-200 transition-colors hover:bg-amber-400/30"
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      onClick={() => answerFeedback("broken")}
                      className="shrink-0 cursor-pointer rounded-full bg-red-500/15 px-3 py-1 text-[11px] font-semibold text-red-200 transition-colors hover:bg-red-500/25"
                    >
                      No
                    </button>
                    <button
                      type="button"
                      onClick={() => answerFeedback("dismissed")}
                      aria-label="Dismiss feedback prompt"
                      className="shrink-0 cursor-pointer rounded-full p-1 text-zinc-500 transition-colors hover:bg-white/10 hover:text-zinc-200"
                    >
                      <X aria-hidden="true" className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
                {launcherSlow && !launcherLoaded && (
                  <div className="absolute inset-x-3 bottom-3 z-20 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/10 bg-[#171717]/95 px-3 py-2 text-[11px] text-zinc-300 shadow-lg">
                    <span>This game is taking a while, or it may not allow embedding.</span>
                    <a
                      href={launcherGame.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={dismissLauncher}
                      className="font-semibold text-amber-300 underline decoration-sky-400/40 underline-offset-2"
                    >
                      Open in a new tab
                    </a>
                  </div>
                )}
              </div>
            </div>,
            document.body
          )
        : null}

      {blockedCheckOpen && typeof document !== "undefined"
        ? createPortal(
            <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-2 sm:p-4">
              <div
                ref={blockedCheckPanelRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="blocked-check-heading"
                tabIndex={-1}
                className="solid-3d-panel flex max-h-full w-full max-w-3xl flex-col overflow-hidden outline-none"
              >
                <div className="flex shrink-0 flex-wrap items-start gap-2 border-b border-white/[0.08] p-3">
                  <div className="min-w-0 flex-1">
                    <h3
                      id="blocked-check-heading"
                      className="flex items-center gap-1.5 text-sm font-semibold text-zinc-100"
                    >
                      <ShieldCheck aria-hidden="true" className="h-4 w-4 text-amber-300" />
                      Run Blocked Check
                    </h3>
                    <p
                      role="status"
                      aria-live="polite"
                      className="mt-0.5 text-[11px] leading-relaxed text-zinc-400"
                    >
                      {blockedCheck.running
                        ? `Checking ${blockedCheck.checked} of ${blockedCheck.total} games…`
                        : blockedCheck.total > 0
                          ? `${blockedCheck.checked} of ${blockedCheck.total} checked — ${blockedCheck.unblocked.length} unblocked, ${blockedCheck.blocked.length} blocked`
                          : "The catalog has not loaded yet."}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={blockedCheck.running ? stopBlockedCheck : startBlockedCheck}
                    className={`inline-flex h-8 shrink-0 cursor-pointer items-center gap-1.5 rounded-full px-3 text-[11px] font-semibold transition-colors ${
                      blockedCheck.running
                        ? "bg-white/[0.1] text-zinc-200 hover:bg-white/[0.16]"
                        : "bg-white text-zinc-950 hover:bg-zinc-100"
                    }`}
                  >
                    {blockedCheck.running ? "Stop" : "Check again"}
                  </button>
                  <button
                    ref={blockedCheckCloseRef}
                    type="button"
                    onClick={closeBlockedCheck}
                    aria-label="Close blocked check"
                    className="inline-flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-white/[0.08] hover:text-white"
                  >
                    <X aria-hidden="true" className="h-4 w-4" />
                  </button>
                </div>

                {blockedCheck.total > 0 && (
                  <div className="h-1 shrink-0 bg-white/[0.06]">
                    <div
                      className="h-full bg-emerald-400/70 transition-[width] duration-200"
                      style={{ width: `${Math.round((blockedCheck.checked / blockedCheck.total) * 100)}%` }}
                    />
                  </div>
                )}

                <div className="min-h-0 flex-1 overflow-y-auto p-3">
                  <div className="flex flex-col gap-8">
                    <section aria-labelledby="blocked-check-unblocked-heading">
                      <div className="flex items-center gap-2">
                        <h4
                          id="blocked-check-unblocked-heading"
                          className="text-xs font-semibold text-amber-300"
                        >
                          Unblocked
                        </h4>
                        <span aria-hidden="true" className="h-px flex-1 bg-white/[0.07]" />
                        <span className="rounded-full bg-white/[0.05] px-1.5 py-0.5 font-mono text-[11px] tabular-nums text-zinc-400">
                          {blockedCheckGroups.unblocked.length}
                        </span>
                      </div>
                      <div className="mt-2 flex flex-col gap-1.5">
                        {blockedCheckGroups.unblocked.length === 0 ? (
                          <p className="text-[11px] text-zinc-500">
                            {blockedCheck.running ? "Still checking…" : "No game loaded."}
                          </p>
                        ) : (
                          blockedCheckGroups.unblocked.map((game) => (
                            <BlockedCheckRow
                              key={game.id}
                              game={game}
                              status="unblocked"
                              onPlay={(item, event) => {
                                closeBlockedCheck();
                                launchGame(item, event);
                              }}
                            />
                          ))
                        )}
                      </div>
                    </section>

                    <section aria-labelledby="blocked-check-blocked-heading">
                      <div className="flex items-center gap-2">
                        <h4
                          id="blocked-check-blocked-heading"
                          className="flex items-center gap-1.5 text-xs font-semibold text-red-300"
                        >
                          <WifiOff aria-hidden="true" className="h-3.5 w-3.5" />
                          Blocked
                        </h4>
                        <span aria-hidden="true" className="h-px flex-1 bg-white/[0.07]" />
                        <span className="rounded-full bg-white/[0.05] px-1.5 py-0.5 font-mono text-[11px] tabular-nums text-zinc-400">
                          {blockedCheckGroups.blocked.length}
                        </span>
                      </div>
                      <div className="mt-2 flex flex-col gap-1.5">
                        {blockedCheckGroups.blocked.length === 0 ? (
                          <p className="text-[11px] text-zinc-500">
                            {blockedCheck.running ? "None so far." : "Every game loaded."}
                          </p>
                        ) : (
                          blockedCheckGroups.blocked.map((game) => (
                            <BlockedCheckRow
                              key={game.id}
                              game={game}
                              status="blocked"
                              onPlay={(item, event) => {
                                closeBlockedCheck();
                                launchGame(item, event);
                              }}
                            />
                          ))
                        )}
                      </div>
                    </section>
                  </div>
                </div>

                <p className="shrink-0 border-t border-white/[0.08] px-3 py-2 text-[11px] leading-relaxed text-zinc-500">
                  Each game is loaded once in an invisible frame. “Blocked” means the frame did not
                  load, so a network filter — or a site that refuses to be embedded — shows up here.
                </p>
              </div>
            </div>,
            document.body
          )
        : null}
    </div>
  );
}
