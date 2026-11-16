const BLOCKED_GAMES_STORAGE_KEY = "polytrack_blocked_games";
const BLOCKED_GAMES_EVENT = "polytrack_blocked_games_updated";
const LAST_BLOCKED_EMOJI_KEY = "polytrack_last_blocked_emoji";

export const BLOCKED_EMOJIS = [
  "😿",
  "😭",
  "🥺",
  "😢",
  "🚫",
  "🔒",
  "🛑",
  "⛔",
  "💀",
  "😵",
  "🙀",
  "😔",
  "💔",
  "🥀",
  "🤐",
  "🙈",
];

/**
 * Returns a random emoji for the Blocked tag that changes on each page refresh.
 * It avoids immediately repeating the previous refresh's emoji when possible.
 */
export function getRandomBlockedEmoji(): string {
  try {
    let last = "";
    if (typeof sessionStorage !== "undefined") {
      last = sessionStorage.getItem(LAST_BLOCKED_EMOJI_KEY) || "";
    }
    const candidates = BLOCKED_EMOJIS.filter((e) => e !== last);
    const pool = candidates.length > 0 ? candidates : BLOCKED_EMOJIS;
    const picked = pool[Math.floor(Math.random() * pool.length)] || "😿";
    if (typeof sessionStorage !== "undefined") {
      sessionStorage.setItem(LAST_BLOCKED_EMOJI_KEY, picked);
    }
    return picked;
  } catch {
    return "😿";
  }
}

/**
 * Loads the list of game IDs tagged as Blocked:😿.
 */
export function loadBlockedGameIds(): Set<string> {
  try {
    const raw = localStorage.getItem(BLOCKED_GAMES_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return new Set(Array.isArray(parsed) ? parsed.filter((id) => typeof id === "string") : []);
  } catch {
    return new Set();
  }
}

/**
 * Saves the list of game IDs tagged as Blocked:😿.
 */
export function saveBlockedGameIds(ids: string[] | Set<string>): void {
  try {
    const array = Array.from(ids);
    localStorage.setItem(BLOCKED_GAMES_STORAGE_KEY, JSON.stringify(array));
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent(BLOCKED_GAMES_EVENT, { detail: array }));
    }
  } catch {}
}

/**
 * Toggles the "Blocked:😿" tag on a game ID.
 */
export function toggleBlockedGameId(id: string): boolean {
  const current = loadBlockedGameIds();
  let isBlocked = false;
  if (current.has(id)) {
    current.delete(id);
  } else {
    current.add(id);
    isBlocked = true;
  }
  saveBlockedGameIds(current);
  return isBlocked;
}

/**
 * Subscribes to changes in blocked game IDs across components and storage tabs.
 */
export function onBlockedGamesChange(callback: (ids: Set<string>) => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = () => callback(loadBlockedGameIds());
  window.addEventListener(BLOCKED_GAMES_EVENT, handler);
  window.addEventListener("storage", (event) => {
    if (event.key === BLOCKED_GAMES_STORAGE_KEY) callback(loadBlockedGameIds());
  });
  return () => {
    window.removeEventListener(BLOCKED_GAMES_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}
