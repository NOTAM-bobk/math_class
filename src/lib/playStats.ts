// Per-device play statistics for the Settings dialog.
//
// One clock keeps counting to the second: time spent on the hub and time spent
// in a game both count. Games open in a new tab, so a session starts when a game
// is clicked and ends when the hub becomes visible again; while that session is
// open the hidden tab's time is counted too, without needing code inside every
// game page. Counting stops when the visitor turns it off in Settings.

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
const ENABLED_KEY = "polytrack_play_stats_enabled";
// A minute of skips is normal in a background tab, but a longer gap means the
// device slept or the tab was frozen, so that span is not counted as play time.
const MAX_TICK_MS = 5 * 60 * 1000;
// Writes are batched so a one-second display does not hit localStorage every tick.
const FLUSH_INTERVAL_MS = 5000;

const EMPTY_STATS: PlayStats = {
  totalClicks: 0,
  totalPlayMs: 0,
  totalSessions: 0,
  games: [],
  firstPlayedAt: null,
  lastPlayedAt: null,
};

let cache: PlayStats | null = null;
let lastTickAt = 0;
let pendingMs = 0;
let timerId: number | null = null;
let stopListening: (() => void) | null = null;
const listeners = new Set<(stats: PlayStats) => void>();

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

function currentStats(): PlayStats {
  if (!cache) cache = readStats();
  return cache;
}

function writeStats(stats: PlayStats) {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch {
    // Private mode can block storage; the in-memory numbers still work this visit.
  }
}

function flush() {
  if (!cache) return;
  writeStats(cache);
  pendingMs = 0;
}

function snapshot(): PlayStats {
  const stats = currentStats();
  return { ...stats, games: stats.games.map((game) => ({ ...game })) };
}

function notify() {
  if (!listeners.size) return;
  const next = snapshot();
  listeners.forEach((listener) => {
    try {
      listener(next);
    } catch {
      // A broken listener must not stop the clock.
    }
  });
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

export function isPlayStatsEnabled(): boolean {
  try {
    return localStorage.getItem(ENABLED_KEY) !== "false";
  } catch {
    return true;
  }
}

/** Turns the always-on counter off or back on. */
export function setPlayStatsEnabled(enabled: boolean): void {
  try {
    localStorage.setItem(ENABLED_KEY, enabled ? "true" : "false");
  } catch {}
  if (!enabled) {
    // Drop a session that started while counting was on, so re-enabling later
    // cannot bill the gap to that game.
    clearSession();
    flush();
  }
  lastTickAt = Date.now();
  notify();
}

export function loadPlayStats(): PlayStats {
  return snapshot();
}

/** Calls `listener` every second while stats update, and once right away. */
export function subscribePlayStats(listener: (stats: PlayStats) => void): () => void {
  listeners.add(listener);
  listener(snapshot());
  return () => {
    listeners.delete(listener);
  };
}

export interface TickInput {
  elapsedMs: number;
  enabled: boolean;
  visible: boolean;
  hasSession: boolean;
}

/**
 * Whether a tick's elapsed time belongs to the totals: the hub counts while it
 * is on screen, a game counts while its session is open, sleep and frozen tabs
 * never count, and the always-count switch stops everything.
 */
export function shouldCountTick({ elapsedMs, enabled, visible, hasSession }: TickInput): boolean {
  if (!(elapsedMs > 0) || elapsedMs > MAX_TICK_MS) return false;
  if (!enabled) return false;
  return visible || hasSession;
}

/** Counts the time since the last tick, to the millisecond, when it should count. */
function tick() {
  const now = Date.now();
  const elapsed = now - lastTickAt;
  lastTickAt = now;

  const session = readSession();
  const visible = typeof document === "undefined" || document.visibilityState === "visible";
  if (
    !shouldCountTick({
      elapsedMs: elapsed,
      enabled: isPlayStatsEnabled(),
      visible,
      hasSession: !!session,
    })
  ) {
    return;
  }

  const stats = currentStats();
  stats.totalPlayMs += elapsed;
  stats.firstPlayedAt = stats.firstPlayedAt || now;
  stats.lastPlayedAt = now;

  if (session) {
    const game = stats.games.find((entry) => entry.id === session.id);
    if (game) {
      game.playMs += elapsed;
      game.lastPlayedAt = now;
    }
  }

  pendingMs += elapsed;
  if (pendingMs >= FLUSH_INTERVAL_MS) flush();
  notify();
}

/** Starts the always-on counter. Returns a function that stops it. */
export function startPlayStatsClock(): () => void {
  if (typeof window === "undefined") return () => {};
  stopPlayStatsClock();

  lastTickAt = Date.now();
  timerId = window.setInterval(tick, 1000);

  const handleVisibility = () => {
    tick();
    flush();
  };
  const handlePageHide = () => {
    tick();
    flush();
  };
  document.addEventListener("visibilitychange", handleVisibility);
  window.addEventListener("pagehide", handlePageHide);

  stopListening = () => {
    if (timerId !== null) window.clearInterval(timerId);
    timerId = null;
    document.removeEventListener("visibilitychange", handleVisibility);
    window.removeEventListener("pagehide", handlePageHide);
    flush();
    stopListening = null;
  };
  return stopPlayStatsClock;
}

function stopPlayStatsClock() {
  stopListening?.();
}

/** Counts a game click and opens the session that times the game. */
export function noteGamePlayed(id: string, name: string) {
  if (!isPlayStatsEnabled()) return;
  // The time up to the click still belongs to whatever was open before it.
  tick();

  const stats = currentStats();
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
  flush();

  try {
    localStorage.setItem(
      SESSION_KEY,
      JSON.stringify({ id, name, startedAt: now } satisfies PlaySession),
    );
  } catch {}
  notify();
}

/** Counts the time up to this moment, then closes the open game session. */
export function finalizePlaySession(): PlayStats {
  tick();
  clearSession();
  flush();
  notify();
  return snapshot();
}

export function formatPlayTime(ms: number): string {
  const totalSeconds = Math.floor(Math.max(0, ms) / 1000);
  const seconds = totalSeconds % 60;
  const totalMinutes = Math.floor(totalSeconds / 60);
  const minutes = totalMinutes % 60;
  const hours = Math.floor(totalMinutes / 60);
  if (hours > 0) {
    return `${hours}h ${String(minutes).padStart(2, "0")}m ${String(seconds).padStart(2, "0")}s`;
  }
  if (totalMinutes > 0) {
    return `${minutes}m ${String(seconds).padStart(2, "0")}s`;
  }
  return `${seconds}s`;
}

// Keep other tabs (and the Settings pane) honest when the stored numbers change.
if (typeof window !== "undefined") {
  window.addEventListener("storage", (event) => {
    if (event.key !== STATS_KEY) return;
    cache = readStats();
    notify();
  });
}
