// Per-device play statistics for the Settings dialog.
//
// Games open in a new tab, so a session starts when a game is clicked and is
// finalized when the hub becomes visible again. That makes the time estimate
// include the new tab without needing code inside every game page.

export interface GamePlayStat {
  id: string;
  name: string;
  clicks: number;
  playMs: number;
  lastPlayedAt: number;
}

export interface PlayStats {
  totalClicks: number;
  totalPlayMs: number;
  totalSessions: number;
  games: GamePlayStat[];
  firstPlayedAt: number | null;
  lastPlayedAt: number | null;
}

interface PlaySession {
  id: string;
  name: string;
  startedAt: number;
}

const STATS_KEY = "polytrack_play_stats";
const SESSION_KEY = "polytrack_play_session";
// A session longer than this is almost certainly a closed browser rather than
// time spent playing, so it is discarded instead of inflating the totals.
const MAX_SESSION_MS = 6 * 60 * 60 * 1000;

const EMPTY_STATS: PlayStats = {
  totalClicks: 0,
  totalPlayMs: 0,
  totalSessions: 0,
  games: [],
  firstPlayedAt: null,
  lastPlayedAt: null,
};

function safeNumber(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) && value > 0 ? value : 0;
}

function readStats(): PlayStats {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (!raw) return { ...EMPTY_STATS, games: [] };
    const parsed = JSON.parse(raw);
    const games = Array.isArray(parsed?.games)
      ? parsed.games
          .filter((game: any) => game && typeof game.id === "string" && typeof game.name === "string")
          .map((game: any) => ({
            id: game.id,
            name: game.name,
            clicks: safeNumber(game.clicks),
            playMs: safeNumber(game.playMs),
            lastPlayedAt: safeNumber(game.lastPlayedAt),
          }))
      : [];
    return {
      totalClicks: safeNumber(parsed?.totalClicks),
      totalPlayMs: safeNumber(parsed?.totalPlayMs),
      totalSessions: safeNumber(parsed?.totalSessions),
      games,
      firstPlayedAt: safeNumber(parsed?.firstPlayedAt) || null,
      lastPlayedAt: safeNumber(parsed?.lastPlayedAt) || null,
    };
  } catch {
    return { ...EMPTY_STATS, games: [] };
  }
}

function writeStats(stats: PlayStats) {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch {
    // Private mode can block storage; the in-memory numbers still work this visit.
  }
}

function readSession(): PlaySession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (typeof parsed?.id !== "string" || typeof parsed?.startedAt !== "number") return null;
    return {
      id: parsed.id,
      name: typeof parsed.name === "string" ? parsed.name : "Game",
      startedAt: parsed.startedAt,
    };
  } catch {
    return null;
  }
}

function clearSession() {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {}
}

export function loadPlayStats(): PlayStats {
  return readStats();
}

/** Counts a game click and starts timing the new tab. */
export function noteGamePlayed(id: string, name: string) {
  const stats = readStats();
  const now = Date.now();
  let game = stats.games.find((entry) => entry.id === id);
  if (!game) {
    game = { id, name, clicks: 0, playMs: 0, lastPlayedAt: 0 };
    stats.games.push(game);
  }
  game.name = name;
  game.clicks += 1;
  game.lastPlayedAt = now;
  stats.totalClicks += 1;
  stats.totalSessions += 1;
  stats.firstPlayedAt = stats.firstPlayedAt || now;
  stats.lastPlayedAt = now;
  writeStats(stats);

  try {
    localStorage.setItem(
      SESSION_KEY,
      JSON.stringify({ id, name, startedAt: now } satisfies PlaySession),
    );
  } catch {}
}

/** Adds the time since the last game click to the totals, once. */
export function finalizePlaySession(): PlayStats {
  const stats = readStats();
  const session = readSession();
  if (!session) return stats;
  clearSession();

  const now = Date.now();
  const elapsed = now - session.startedAt;
  if (elapsed <= 0 || elapsed > MAX_SESSION_MS) return stats;

  stats.totalPlayMs += elapsed;
  stats.lastPlayedAt = now;
  const game = stats.games.find((entry) => entry.id === session.id);
  if (game) {
    game.playMs += elapsed;
    game.lastPlayedAt = now;
  }
  writeStats(stats);
  return stats;
}

export function formatPlayTime(ms: number): string {
  const totalMinutes = Math.floor(Math.max(0, ms) / 60000);
  if (totalMinutes < 1) return "0m";
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) return `${minutes}m`;
  return minutes === 0 ? `${hours}h` : `${hours}h ${minutes}m`;
}
