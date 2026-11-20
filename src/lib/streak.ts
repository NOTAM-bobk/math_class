// Daily visit streak, kept on this device.
//
// A day is the visitor's own local midnight, not UTC, so the streak changes
// when their calendar day changes. Opening the site counts once; reloading or
// leaving a tab open does not add days. Missing a day starts a new run at 1.

export interface StreakData {
  current: number;
  longest: number;
  totalDays: number;
  lastVisit: string | null;
  /** Visited local days, ascending, capped for storage. */
  history: string[];
}

const STREAK_KEY = "polytrack_daily_streak_v1";
const HISTORY_LIMIT = 60;
const DAY_MS = 24 * 60 * 60 * 1000;

const EMPTY_STREAK: StreakData = {
  current: 0,
  longest: 0,
  totalDays: 0,
  lastVisit: null,
  history: [],
};

let cache: StreakData | null = null;
const listeners = new Set<(data: StreakData) => void>();

/** Local calendar day as YYYY-MM-DD. */
export function dayKey(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** Days since the epoch, or null for an unparseable / impossible date. */
function dayNumber(key: string | null): number | null {
  if (!key) return null;
  const parts = /^(\d{4})-(\d{2})-(\d{2})$/.exec(key);
  if (!parts) return null;
  const year = Number(parts[1]);
  const month = Number(parts[2]);
  const day = Number(parts[3]);
  const stamp = Date.UTC(year, month - 1, day);
  if (!Number.isFinite(stamp)) return null;
  const check = new Date(stamp);
  if (
    check.getUTCFullYear() !== year ||
    check.getUTCMonth() !== month - 1 ||
    check.getUTCDate() !== day
  ) {
    return null;
  }
  return Math.floor(stamp / DAY_MS);
}

function safeCount(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) && value > 0 ? Math.floor(value) : 0;
}

function sanitize(value: unknown): StreakData {
  if (!value || typeof value !== "object") return { ...EMPTY_STREAK, history: [] };
  const data = value as Partial<StreakData>;
  const history = Array.isArray(data.history)
    ? [
        ...new Set(
          data.history.filter(
            (day): day is string => typeof day === "string" && dayNumber(day) !== null
          )
        ),
      ]
        .sort((a, b) => (dayNumber(a) ?? 0) - (dayNumber(b) ?? 0))
        .slice(-HISTORY_LIMIT)
    : [];
  const lastVisit =
    typeof data.lastVisit === "string" && dayNumber(data.lastVisit) !== null
      ? data.lastVisit
      : history[history.length - 1] ?? null;
  const current = safeCount(data.current);
  return {
    current,
    longest: Math.max(safeCount(data.longest), current),
    totalDays: Math.max(safeCount(data.totalDays), history.length),
    lastVisit,
    history,
  };
}

function read(): StreakData {
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(STREAK_KEY);
    cache = raw ? sanitize(JSON.parse(raw)) : { ...EMPTY_STREAK, history: [] };
  } catch {
    // Private mode can block storage; the streak still works for this visit.
    cache = { ...EMPTY_STREAK, history: [] };
  }
  return cache;
}

function write(next: StreakData) {
  cache = next;
  try {
    localStorage.setItem(STREAK_KEY, JSON.stringify(next));
  } catch {}
  for (const listener of listeners) {
    try {
      listener(next);
    } catch {}
  }
}

export function loadStreak(): StreakData {
  const data = read();
  return { ...data, history: [...data.history] };
}

/**
 * Counts today for the streak and returns the updated data. Safe to call on
 * every mount or tab focus: the same local day never counts twice, and a clock
 * that moved backwards leaves the saved run alone instead of wiping it.
 */
export function recordVisit(now: Date = new Date()): StreakData {
  const previous = read();
  const today = dayKey(now);
  if (previous.lastVisit === today) return previous;

  const todayNumber = dayNumber(today);
  const lastNumber = dayNumber(previous.lastVisit);
  if (todayNumber === null) return previous;
  if (lastNumber !== null && todayNumber <= lastNumber) return previous;

  const current =
    lastNumber !== null && todayNumber - lastNumber === 1 ? previous.current + 1 : 1;
  const history = [...previous.history.filter((day) => day !== today), today].slice(
    -HISTORY_LIMIT
  );
  const next: StreakData = {
    current,
    longest: Math.max(previous.longest, current),
    totalDays: previous.totalDays + 1,
    lastVisit: today,
    history,
  };
  write(next);
  return next;
}

export function subscribeStreak(listener: (data: StreakData) => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
