import * as React from "react";
import { createPortal } from "react-dom";
import { Play, Gamepad2, Clock3, RotateCcw, X, Flame, Sparkles, SlidersHorizontal, Check, Star, Bug, CheckCircle2, Smartphone, ArrowLeft, ExternalLink, EyeOff } from "lucide-react";
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
import { loadGameCardLayout, onGameCardLayoutChange, type GameCardLayout } from "@/lib/gameCardLayout";
import { loadGameOfTheDayId, onGameOfTheDayChange } from "@/lib/gameOfTheDay";
import { GameCoverArt } from "./GameCoverArt";
import { BidvertiserAd } from "./BidvertiserAd";
import { PanicButton } from "./PanicButton";
import { useDialogFocus } from "@/lib/dialogFocus";
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
  borderRadius: 36,
  background: "rgba(255, 255, 255, 0.04)",
  boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.02), inset 0 1px 0 0 rgba(255, 255, 255, 0.04)",
};

const FAVORITES_GAMES_KEY = "polytrack_favorite_games";

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
  { id: "recent", label: "🕘 Recently played" },
  { id: "favorites", label: "⭐ Favorites" },
  { id: "editors", label: "✨ Editor’s Pick" },
  { id: "verified", label: "✅ Verified" },
  { id: "hidden", label: "🙈 Hidden" },
  { id: "trending", label: "🔥 Trending" },
  { id: "offline", label: "📥 Offline" },
  { id: "flash", label: "⚡ Flash" },
  { id: "action", label: "⚔️ Action" },
  { id: "driving", label: "🏎️ Driving" },
  { id: "sports", label: "🏈 Sports" },
  { id: "arcade", label: "🕹️ Arcade" },
  { id: "puzzle", label: "🧩 Puzzle" },
  { id: "casual", label: "🎮 Casual" },
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
  "grid grid-flow-row-dense auto-rows-[148px] grid-cols-2 gap-2.5 sm:auto-rows-[168px] sm:grid-cols-3 sm:gap-3 xl:grid-cols-4";
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

export type SpecialFilterId = "buggy" | "blocked";
export type CategoryId = (typeof CATEGORY_FILTERS)[number]["id"] | SpecialFilterId;

type SortOption = "popular" | "featured" | "recent" | "az" | "default";

const DEFAULT_SORT: SortOption = "popular";

const TAG_FILTERS = [
  { id: "editors", emoji: "✨", label: "Editor’s Pick" },
  { id: "verified", emoji: "✅", label: "Verified" },
  { id: "hidden", emoji: "🙈", label: "Hidden" },
  { id: "buggy", emoji: "🐛", label: "Error: bug" },
  { id: "blocked", emoji: "😿", label: "Blocked" },
] as const satisfies readonly { id: CategoryId; emoji: string; label: string }[];

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
        className="inline-flex cursor-help items-center justify-center text-emerald-400"
      >
        <CheckCircle2
          aria-hidden="true"
          className="h-3.5 w-3.5 fill-emerald-500/20 text-emerald-400 drop-shadow-[0_0_5px_rgba(52,211,153,0.35)]"
        />
      </button>
      {open && (
        <span
          id={tipId}
          role="tooltip"
          className="absolute left-1/2 top-full z-30 mt-1.5 w-40 -translate-x-1/2 rounded-lg border border-white/10 bg-[#1c1c1e] px-2 py-1.5 text-[10.5px] font-normal leading-snug text-zinc-300 shadow-[0_8px_24px_rgba(0,0,0,0.6)] sm:w-44"
        >
          Checked by an admin — this game loads and plays.
        </span>
      )}
    </span>
  );
}

function GameCard({
  game,
  isRecent,
  isPopular,
  isFavorite,
  isBuggy,
  isVerified,
  isNotMobile,
  isBlocked,
  hiddenInfo,
  blockedEmoji,
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
  isNotMobile: boolean;
  isBlocked: boolean;
  hiddenInfo?: HiddenGameEntry | null;
  blockedEmoji: string;
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
    const compactChip = "inline-flex h-5 shrink-0 items-center gap-1 rounded-full bg-black/45 px-1.5 text-[9.5px] font-medium leading-none text-zinc-200 backdrop-blur-sm";
    return (
      <article
        key={game.id}
        className={`game-card group relative flex h-full w-full flex-col overflow-hidden ${sizeClass ?? ""} ${
          game.disabled ? "opacity-80" : ""
        }`}
      >
        <GameCoverArt game={game} accent={genreAccent} />

        <div className="relative z-10 flex items-start justify-between gap-1.5 p-2.5">
          <div className="flex min-w-0 flex-wrap items-center gap-1">
            {isVerified && <VerifiedBadge />}
            {isPopular && (
              <span title="Most played" className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-black/45 backdrop-blur-sm">
                <Flame aria-hidden="true" className="h-3 w-3 fill-orange-400/20 text-orange-400" />
              </span>
            )}
            {game.editorsPick && (
              <span title="Editor's Pick" className={compactChip}>
                <span aria-hidden="true">✨</span> Pick
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
              <span title="Blocked site or game" className={`${compactChip} text-purple-200`}>
                Blocked:{blockedEmoji}
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
            <Star
              aria-hidden="true"
              className={`pointer-events-none h-3.5 w-3.5 ${
                isFavorite
                  ? "fill-amber-400 text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.5)]"
                  : "stroke-[1.75]"
              }`}
            />
          </button>
        </div>

        <div className="relative z-10 mt-auto p-3">
          <h4
            className="line-clamp-2 min-w-0 text-sm font-semibold leading-snug text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] sm:text-base"
            title={game.name}
          >
            <HighlightText text={game.name} query={searchQuery} />
          </h4>
          <div className="mt-1.5 flex items-center justify-between gap-2">
            <span className="truncate text-[10px] text-zinc-300/80">
              {game.disabled ? "Coming soon" : game.tags[0] || (opensInHub ? "In the hub" : "New tab")}
            </span>
            {hiddenInfo && onRestoreHidden && (
              <button
                type="button"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  onRestoreHidden(game.id);
                }}
                title="Put this game back in the main catalog"
                className="relative z-20 inline-flex h-6 shrink-0 cursor-pointer items-center rounded-full bg-white/15 px-2 text-[10px] font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/25"
              >
                Restore
              </button>
            )}
            {game.disabled ? (
              <span className="inline-flex h-6 shrink-0 items-center gap-1 rounded-full bg-white/10 px-2 text-[10px] font-medium text-zinc-200 backdrop-blur-sm">
                <Clock3 aria-hidden="true" className="h-2.5 w-2.5" /> Soon
              </span>
            ) : (
              <span
                aria-hidden="true"
                className="inline-flex h-6 shrink-0 items-center gap-1 rounded-full bg-white px-2.5 text-[10px] font-semibold text-zinc-950 shadow-sm transition-colors group-hover:bg-zinc-100"
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
            className="game-card-link absolute inset-0 z-[15] rounded-[20px]"
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
      <div className="flex flex-1 flex-col p-3 sm:p-5">
        <div className="mb-1.5 flex items-start justify-between gap-2 sm:mb-2">
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
            {game.editorsPick && (
              <span
                title="Editor's Pick"
                style={CHIP_STYLE}
                className="shrink-0 px-2 py-0.5 text-[11px] font-medium text-amber-300"
              >
                Editor's Pick
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
                className="inline-flex shrink-0 items-center gap-1 px-2 py-0.5 text-[10.5px] font-semibold tracking-wide font-mono"
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
                className="inline-flex shrink-0 items-center gap-1 px-2 py-0.5 text-[10.5px] font-semibold tracking-wide font-mono"
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
                className="inline-flex shrink-0 items-center gap-1 px-2 py-0.5 text-[10.5px] font-semibold tracking-wide font-mono"
              >
                <span>Blocked:{blockedEmoji}</span>
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
                className="inline-flex shrink-0 items-center gap-1 px-2 py-0.5 text-[10.5px] font-semibold tracking-wide font-mono"
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
              <Star
                aria-hidden="true"
                className={`h-4 w-4 pointer-events-none transition-colors ${
                  isFavorite
                    ? "fill-amber-400 text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.5)]"
                    : "stroke-[1.75] text-zinc-400 group-hover/fav:text-amber-300"
                }`}
              />
            </button>
          </div>
        </div>

        <p className="mb-2.5 line-clamp-2 flex-1 text-[12.5px] leading-[17px] text-[#8B9099] sm:mb-4 sm:text-[13px] sm:leading-[18px]">
          <HighlightText text={game.description} query={searchQuery} />
        </p>

        <div className="mt-auto flex items-center justify-between gap-2 border-t border-white/[0.06] pt-2.5 sm:gap-3 sm:pt-3">
          <div className="flex min-w-0 flex-nowrap items-center gap-1.5 overflow-hidden sm:flex-wrap">
            {game.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                style={CHIP_STYLE}
                className="inline-flex h-5 shrink-0 items-center px-2 text-[10.5px] leading-[13px] text-[#caccd2] sm:h-6 sm:px-2.5 sm:text-[11px] sm:leading-[14px]"
              >
                <HighlightText text={tag} query={searchQuery} />
              </span>
            ))}
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {!game.disabled && (game.clicks || 0) > 0 && (
              <span
                className="text-[10px] font-mono tabular-nums text-zinc-500"
                title={`${game.clicks} ${game.clicks === 1 ? "play" : "plays"}`}
              >
                {game.clicks} {game.clicks === 1 ? "play" : "plays"}
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
    setLauncherGame(null);
    setLauncherSlow(false);
    setFeedbackPrompt(false);
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
      list = list.filter((game) => !!game.editorsPick);
    } else if (selectedCategory === "verified") {
      list = list.filter((game) => verifiedIds.has(game.id) || !!game.verified);
    } else if (selectedCategory === "hidden") {
      list = list.filter((game) => !!hiddenGames[game.id]);
    } else if (selectedCategory === "trending") {
      list = list.filter((game) => popularGameIds.has(game.id));
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
  }, [games, selectedCategory, favoriteIds, buggyIds, blockedIds, verifiedIds, popularGameIds, hiddenGames, searchQuery, serverMatches, offlinePackIds, recentIds]);

  const playableGames = React.useMemo(
    () => filteredGames.filter((game) => !game.disabled),
    [filteredGames]
  );
  const sortGames = React.useCallback((items: GameItem[]) => {
    const sorted = [...items];
    switch (sortOption) {
      case "popular":
        return sorted.sort((a, b) => {
          const diff = (b.clicks || 0) - (a.clicks || 0);
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

  const recentGameItems = React.useMemo(() => {
    const byId = new Map(games.map((game) => [game.id, game]));
    return loadRecentGames()
      .map((entry) => byId.get(entry.id))
      .filter((game): game is GameItem => !!game && !game.disabled && !hiddenGames[game.id]);
  }, [games, recentIds, hiddenGames]);

  const searching = searchQuery.trim().length > 0;
  const tagCounts: Record<TagFilterId, number> = React.useMemo(
    () => ({
      editors: games.filter((game) => !!game.editorsPick).length,
      verified: games.filter((game) => verifiedIds.has(game.id) || !!game.verified).length,
      hidden: Object.keys(hiddenGames).length,
      buggy: games.filter((game) => buggyIds.has(game.id) || !!game.errorBug).length,
      blocked: blockedIds.size,
    }),
    [games, verifiedIds, buggyIds, blockedIds, hiddenGames]
  );

  const isFiltered = searching || selectedCategory !== "all";

  return (
    <div className="solid-3d-panel flex min-h-0 flex-1 flex-col overflow-hidden">
      {/* Catalog top controls with search and category filters */}
      <div className="flex shrink-0 flex-col gap-2 border-b border-white/[0.06] p-2.5 sm:gap-2.5 sm:p-4">
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
          <div className="flex min-w-0 items-center gap-2">
            <h2 className="text-sm font-semibold tracking-tight text-zinc-100">Games</h2>
            <span
              role="status"
              aria-live="polite"
              style={CHIP_STYLE}
              className="shrink-0 px-2.5 py-0.5 text-[11px] tabular-nums text-[#caccd2]"
            >
              {serverSearching ? "Searching…" : `${filteredGames.length} ${filteredGames.length === 1 ? "game" : "games"}`}
            </span>
          </div>
        </div>

        {/* Category Filter Chips Bar near search */}
        <div className="flex min-w-0 items-center gap-1.5">
          <div className="flex min-w-0 flex-1 items-center gap-1.5">
            <div className="relative min-w-0 flex-1">
            <div
              role="group"
              aria-label="Filter games by category"
              className="flex min-w-0 flex-1 items-center gap-1.5 overflow-x-auto pt-0.5 pb-0.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            >
              {CATEGORY_FILTERS.map((cat) => {
                // Downloaded games are only useful with no connection, so the
                // filter only exists while the browser is offline.
                if (cat.id === OFFLINE_CATEGORY && !offlineNow) return null;
                const active = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => {
                      onSelectCategory(cat.id);
                      posthog.capture("catalog_filter_applied", {
                        filter_type: "category",
                        filter_value: cat.id,
                      });
                    }}
                    style={{
                      ...CHIP_STYLE,
                      borderRadius: 20,
                      background: active ? "#ffffff" : "rgba(255, 255, 255, 0.04)",
                      color: active ? "#09090b" : cat.id === "favorites" && favoriteIds.size > 0 ? "#fbbf24" : "#d4d4d8",
                      fontWeight: active ? 600 : 500,
                      boxShadow: active
                        ? "0 2px 8px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.4)"
                        : "inset 0 0 0 1px rgba(255, 255, 255, 0.03), inset 0 1px 0 0 rgba(255, 255, 255, 0.04)",
                    }}
                    className="inline-flex shrink-0 items-center gap-1 px-3 py-1 text-[11px] transition hover:text-white active:scale-95"
                  >
                    {CATEGORY_ACCENTS[cat.id] && (
                      <span
                        aria-hidden="true"
                        className="h-1.5 w-1.5 shrink-0 rounded-full"
                        style={{ background: CATEGORY_ACCENTS[cat.id] }}
                      />
                    )}
                    <span>{cat.label}</span>
                    {cat.id === "favorites" && favoriteIds.size > 0 && (
                      <span className={`ml-0.5 rounded-full px-1.5 py-0.2 text-[10px] font-mono leading-tight ${active ? "bg-zinc-900/10 text-zinc-900 font-bold" : "bg-amber-400/20 text-amber-300"}`}>
                        {favoriteIds.size}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            {/* Soft blur over the clipped edges of the scrolling chip row. */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 w-5 backdrop-blur-[2px] [mask-image:linear-gradient(to_right,black,transparent)] [-webkit-mask-image:linear-gradient(to_right,black,transparent)]" />
            <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 w-5 backdrop-blur-[2px] [mask-image:linear-gradient(to_left,black,transparent)] [-webkit-mask-image:linear-gradient(to_left,black,transparent)]" />
            </div>

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
                  <div className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
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

                  <div className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
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
                          <span>{tag.id === "blocked" ? blockedEmoji || tag.emoji : tag.emoji}</span>
                          <span>{tag.label}</span>
                          {count > 0 && (
                            <span className="rounded-full bg-white/[0.08] px-1.5 py-0.2 text-[10px] font-mono text-zinc-400">
                              {count}
                            </span>
                          )}
                        </span>
                        {active && <Check aria-hidden="true" className="h-3.5 w-3.5 text-amber-300" />}
                      </button>
                    );
                  })}
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
        <div className="flex flex-col gap-4">
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

          {showAdSpot && (
            <div
              aria-label="Advertisement"
              style={{
                borderRadius: 14,
                background: "rgba(255, 255, 255, 0.015)",
                boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.03)",
              }}
              className={`flex-wrap items-center justify-center gap-x-2 gap-y-1 px-3 py-1.5 ${adSpotHidden ? "hidden" : "flex"}`}
            >
              <span className="shrink-0 text-[8.5px] font-medium uppercase tracking-[0.16em] text-zinc-400">
                Ad
              </span>
              <BidvertiserAd slot="catalog" showClose={false} className="flex items-center justify-center" />
              <a
                href="mailto:hello@base31.org?subject=Ad%20space%20on%20math_games"
                className="shrink-0 text-[10px] text-zinc-400 underline decoration-white/10 underline-offset-2 transition-colors hover:text-zinc-300"
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

          {!isFiltered && gameOfTheDay && (
            <section aria-labelledby="catalog-daily-heading" className="flex flex-col gap-2.5">
              <div className="flex items-center gap-2">
                <h3 id="catalog-daily-heading" className="flex items-center gap-1.5 text-xs font-semibold text-zinc-200">
                  <Sparkles aria-hidden="true" className="h-3.5 w-3.5 text-amber-300" />
                  Game of the day
                </h3>
                <span aria-hidden="true" className="h-px flex-1 bg-white/[0.07]" />
                <span className="rounded-full bg-amber-400/15 px-2 py-0.5 text-[10px] font-semibold text-amber-300">Today&rsquo;s pick</span>
              </div>
              <a
                href={gameOfTheDay.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(event) => launchGame(gameOfTheDay, event)}
                className="group relative flex min-h-[7.5rem] items-end overflow-hidden rounded-2xl border border-amber-400/25 bg-white/[0.04] p-3 transition hover:border-amber-300/45 sm:min-h-[9rem] sm:p-4"
              >
                <GameCoverArt game={gameOfTheDay} accent={gameAccent(gameOfTheDay)} />
                <div className="relative z-10 flex w-full items-end justify-between gap-3">
                  <div className="min-w-0">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-300">Game of the day</span>
                    <p className="truncate text-lg font-bold tracking-tight text-white sm:text-xl">{gameOfTheDay.name}</p>
                    <p className="line-clamp-2 max-w-xl text-[11.5px] leading-snug text-zinc-300 sm:text-xs">{gameOfTheDay.description}</p>
                  </div>
                  <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold text-zinc-950 transition group-hover:bg-amber-200">
                    <Play aria-hidden="true" className="h-3.5 w-3.5 fill-current" />
                    Play
                  </span>
                </div>
              </a>
            </section>
          )}

          {!isFiltered && recentGameItems.length > 0 && (
            <section aria-labelledby="catalog-recent-heading" className="flex flex-col gap-2.5">
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
                    <span className="min-w-0 flex-1"><span className="block truncate text-xs font-medium text-zinc-100">{game.name}</span><span className="mt-0.5 block text-[10px] text-zinc-500">Play again</span></span>
                    <Play className="h-3.5 w-3.5 shrink-0 text-zinc-500 transition group-hover:text-zinc-200" />
                  </a>
                ))}
              </div>
              {/* Soft blur over the clipped edges of the recently played row. */}
              <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 w-5 backdrop-blur-[2px] [mask-image:linear-gradient(to_right,black,transparent)] [-webkit-mask-image:linear-gradient(to_right,black,transparent)]" />
              <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 w-5 backdrop-blur-[2px] [mask-image:linear-gradient(to_left,black,transparent)] [-webkit-mask-image:linear-gradient(to_left,black,transparent)]" />
              </div>
            </section>
          )}

          {playableGames.length > 0 && (
            <section aria-labelledby="catalog-play-heading" className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <h3 id="catalog-play-heading" className="text-xs font-semibold text-zinc-200">
                  {isFiltered ? "Filtered matches" : "Play now"}
                </h3>
                <span aria-hidden="true" className="h-px flex-1 bg-white/[0.07]" />
                <span className="rounded-full bg-white/[0.05] px-1.5 py-0.5 font-mono text-[10px] tabular-nums text-zinc-400">
                  {playableGames.length}
                </span>
              </div>
              <div className={cardLayout === "mosaic" ? MOSAIC_GRID_CLASS : CLASSIC_GRID_CLASS}>
              {sortedPlayableGames.map((game, index) => (
                <GameCard
                  key={game.id}
                  variant={cardLayout}
                  sizeClass={cardLayout === "mosaic" ? mosaicSpan(index) : undefined}
                  game={game}
                  isRecent={recentIds.has(game.id)}
                  isPopular={popularGameIds.has(game.id)}
                  isFavorite={favoriteIds.has(game.id)}
                  isBuggy={buggyIds.has(game.id) || !!game.errorBug}
                  isVerified={verifiedIds.has(game.id) || !!game.verified}
                  isNotMobile={notMobileIds.has(game.id)}
                  isBlocked={blockedIds.has(game.id)}
                  hiddenInfo={hiddenGames[game.id] ?? null}
                  blockedEmoji={blockedEmoji}
                  searchQuery={searchQuery}
                  onPlay={launchGame}
                  onToggleFavorite={toggleFavorite}
                  onRestoreHidden={restoreGame}
                />
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
                <span className="rounded-full bg-white/[0.05] px-1.5 py-0.5 font-mono text-[10px] tabular-nums text-zinc-400">
                  {comingSoonGames.length}
                </span>
              </div>
              <div className={cardLayout === "mosaic" ? MOSAIC_GRID_CLASS : CLASSIC_GRID_CLASS}>
              {comingSoonGames.map((game, index) => (
                <GameCard
                  key={game.id}
                  variant={cardLayout}
                  sizeClass={cardLayout === "mosaic" ? mosaicSpan(index) : undefined}
                  game={game}
                  isRecent={recentIds.has(game.id)}
                  isPopular={popularGameIds.has(game.id)}
                  isFavorite={favoriteIds.has(game.id)}
                  isBuggy={buggyIds.has(game.id) || !!game.errorBug}
                  isVerified={verifiedIds.has(game.id) || !!game.verified}
                  isNotMobile={notMobileIds.has(game.id)}
                  isBlocked={blockedIds.has(game.id)}
                  hiddenInfo={hiddenGames[game.id] ?? null}
                  blockedEmoji={blockedEmoji}
                  searchQuery={searchQuery}
                  onPlay={launchGame}
                  onToggleFavorite={toggleFavorite}
                  onRestoreHidden={restoreGame}
                />
              ))}
              </div>
            </section>
          )}

          {filteredGames.length === 0 && (
            <div className="flex flex-col items-center gap-2 py-12 text-center">
              {selectedCategory === "hidden" ? (
                <>
                  <CheckCircle2 className="h-8 w-8 text-emerald-400/50" aria-hidden="true" />
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
                  <Star className="h-8 w-8 text-amber-400/50" aria-hidden="true" />
                  <p className="text-sm font-medium text-zinc-300">
                    No favorite games yet
                  </p>
                  <p className="max-w-[18rem] text-xs leading-relaxed text-zinc-500">
                    Click the star on any game card to bookmark your favorites for quick access!
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
              className="fixed inset-0 z-[60] flex flex-col bg-[#09090b]"
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
                  <span>Back to hub</span>
                </button>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-xs font-semibold text-zinc-100 sm:text-sm">
                    {launcherGame.name}
                  </div>
                  <div className="hidden truncate text-[10px] text-zinc-500 sm:block">
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
                  <Star
                    aria-hidden="true"
                    className={`h-4 w-4 ${
                      favoriteIds.has(launcherGame.id)
                        ? "fill-amber-400 text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.5)]"
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
                <PanicButton compact />
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
                    <CheckCircle2 aria-hidden="true" className="h-4 w-4 shrink-0 text-emerald-400" />
                    <span className="min-w-0 flex-1 text-[11.5px] font-semibold leading-tight text-zinc-100">
                      Did this work?
                    </span>
                    <button
                      type="button"
                      onClick={() => answerFeedback("worked")}
                      className="shrink-0 cursor-pointer rounded-full bg-emerald-500/20 px-3 py-1 text-[11px] font-semibold text-emerald-200 transition-colors hover:bg-emerald-500/30"
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
                      className="font-semibold text-sky-300 underline decoration-sky-400/40 underline-offset-2"
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
    </div>
  );
}
