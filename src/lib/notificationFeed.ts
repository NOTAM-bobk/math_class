// The local notification feed behind the top-bar bell.
//
// It gathers the four things a visitor cares about: the games added since their
// last visit, the newest major updates, community chat messages, and the game
// they were playing last. Read state lives on this device, like the rest of the
// hub's preferences, so the feed needs no account or backend of its own.

import type { GameItem } from "@/data/gameItem";
import { cachedCatalog } from "./catalog";
import { CHANGELOG, SITE_VERSION } from "./changelog";
import { loadMessages } from "./hubApi";

export type NotificationKind = "update" | "game" | "message" | "continue";

export interface HubNotificationItem {
  id: string;
  kind: NotificationKind;
  title: string;
  body: string;
  /** Timestamp used for ordering and the relative time label. */
  at: number;
  gameId?: string;
  /** Small label shown instead of a relative time, e.g. "Version 1.7.4". */
  meta?: string;
  isNew: boolean;
}

interface SeenState {
  /** The last site version the visitor opened the feed on. */
  version: string;
  /** When the visitor last opened the feed; newer chat messages are unread. */
  chatAt: number;
  /** Game ids that existed at the last visit, so only real additions are new. */
  gameIds: string[];
}

const SEEN_KEY = "polytrack_notifications_seen";
const RECENT_GAMES_KEY = "polytrack_recent_games";
const NICKNAME_KEY = "polytrack_nickname";
const RECENT_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;
const MAX_UPDATES = 3;
const MAX_NEW_GAMES = 3;
const MAX_MESSAGES = 3;
const MAX_KNOWN_GAMES = 2000;

function readSeen(): SeenState {
  try {
    const raw = localStorage.getItem(SEEN_KEY);
    if (!raw) return { version: "", chatAt: 0, gameIds: [] };
    const parsed = JSON.parse(raw);
    return {
      version: typeof parsed?.version === "string" ? parsed.version : "",
      chatAt:
        typeof parsed?.chatAt === "number" && Number.isFinite(parsed.chatAt) && parsed.chatAt > 0
          ? parsed.chatAt
          : 0,
      gameIds: Array.isArray(parsed?.gameIds)
        ? parsed.gameIds.filter((id: unknown): id is string => typeof id === "string")
        : [],
    };
  } catch {
    return { version: "", chatAt: 0, gameIds: [] };
  }
}

function writeSeen(state: SeenState) {
  try {
    localStorage.setItem(SEEN_KEY, JSON.stringify(state));
  } catch {
    // Private mode can block storage; the feed still works for this visit.
  }
}

function updateItems(seen: SeenState): HubNotificationItem[] {
  // Everything above the last seen version is new. A version that has since
  // dropped out of the list counts as seen, so an old entry never reappears.
  const seenIndex = seen.version
    ? CHANGELOG.findIndex((entry) => entry.version === seen.version)
    : -1;

  return CHANGELOG.slice(0, MAX_UPDATES).map((entry, index) => ({
    id: `update-${entry.version}`,
    kind: "update",
    title: entry.title,
    body: entry.changes[0] ?? "",
    at: Date.parse(entry.date) || 0,
    meta: `Version ${entry.version}`,
    isNew: seen.version !== "" && seenIndex >= 0 && index < seenIndex,
  }));
}

function gameItems(seen: SeenState, catalog: GameItem[]): HubNotificationItem[] {
  // A first visit records the catalog as the baseline instead of announcing
  // every game on the site as new.
  if (catalog.length === 0 || seen.gameIds.length === 0) return [];
  const known = new Set(seen.gameIds);
  const added = catalog.filter((game) => !known.has(game.id) && !game.disabled);
  if (added.length === 0) return [];

  return added.slice(0, MAX_NEW_GAMES).map((game) => ({
    id: `game-${game.id}`,
    kind: "game" as const,
    title: game.name,
    body: "New game added to the hub. Tap to play.",
    at: 0,
    gameId: game.id,
    meta: "New game",
    isNew: true,
  }));
}

function continueItem(catalog: GameItem[]): HubNotificationItem | null {
  if (catalog.length === 0) return null;

  let recent: { id: string; playedAt: number }[] = [];
  try {
    const raw = localStorage.getItem(RECENT_GAMES_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    if (Array.isArray(parsed)) {
      const cutoff = Date.now() - RECENT_WINDOW_MS;
      recent = parsed.filter(
        (entry): entry is { id: string; playedAt: number } =>
          !!entry &&
          typeof entry.id === "string" &&
          typeof entry.playedAt === "number" &&
          entry.playedAt > cutoff
      );
    }
  } catch {
    return null;
  }

  const latest = recent[0];
  if (!latest) return null;
  const game = catalog.find((entry) => entry.id === latest.id && !entry.disabled);
  if (!game) return null;

  return {
    id: `continue-${game.id}`,
    kind: "continue",
    title: "Continue where you left off",
    body: `Jump back into ${game.name}.`,
    at: latest.playedAt,
    gameId: game.id,
    isNew: false,
  };
}

/**
 * The on-device half of the feed. Records the first-visit baselines so old
 * games and entries are not announced as new, then lists what changed since.
 */
export function loadLocalFeed(): {
  items: HubNotificationItem[];
  continueGame: HubNotificationItem | null;
} {
  const seen = readSeen();
  const catalog = cachedCatalog();
  const firstVisit = seen.version === "";

  const updates = updateItems(seen);
  const games = gameItems(seen, catalog);
  const continued = continueItem(catalog);

  let changed = false;
  if (firstVisit) {
    seen.version = SITE_VERSION;
    changed = true;
  }
  if (seen.gameIds.length === 0 && catalog.length > 0) {
    seen.gameIds = catalog.slice(0, MAX_KNOWN_GAMES).map((game) => game.id);
    changed = true;
  }
  if (changed) writeSeen(seen);

  return { items: [...games, ...updates], continueGame: continued };
}

/** Chat messages posted since the feed was last opened, newest first. */
export async function loadMessageNotifications(): Promise<HubNotificationItem[]> {
  let seen = readSeen();
  if (seen.chatAt === 0) {
    // First visit on this device: remember now, not the whole backlog.
    seen = { ...seen, chatAt: Date.now() };
    writeSeen(seen);
    return [];
  }

  try {
    const messages = await loadMessages(10);
    let nickname = "";
    try {
      nickname = localStorage.getItem(NICKNAME_KEY) || "";
    } catch {}

    return messages
      .filter((message) => {
        const at = Date.parse(message.createdAt);
        return (
          Number.isFinite(at) &&
          at > seen.chatAt &&
          message.author !== nickname
        );
      })
      .slice(-MAX_MESSAGES)
      .reverse()
      .map((message) => ({
        id: `message-${message.id}`,
        kind: "message" as const,
        title: `${message.author} sent a message`,
        body: message.text || "Sent a photo",
        at: Date.parse(message.createdAt) || Date.now(),
        isNew: true,
      }));
  } catch {
    // Chat offline: the rest of the feed still works.
    return [];
  }
}

/** Marks the feed as read and remembers the catalog as it stands right now. */
export function markNotificationsSeen(): void {
  const seen = readSeen();
  const catalog = cachedCatalog();
  const gameIds =
    catalog.length > 0
      ? catalog.slice(0, MAX_KNOWN_GAMES).map((game) => game.id)
      : seen.gameIds;

  writeSeen({
    version: SITE_VERSION,
    chatAt: Date.now(),
    gameIds,
  });
}
