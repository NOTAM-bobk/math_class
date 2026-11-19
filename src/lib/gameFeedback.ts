// One-tap "Did this work?" feedback after a game loads.
//
// The prompt is deliberately rare: at most once per page session, never for a
// game this device has already answered for, and only after a multi-day
// cooldown. A "no" answer opens the normal bug report with the game name filled
// in, so the failure ends up wherever bug reports already go.

export type GameFeedbackAnswer = "worked" | "broken" | "dismissed";

export interface GameFeedbackEntry {
  answer: GameFeedbackAnswer;
  at: number;
}

const FEEDBACK_KEY = "polytrack_game_feedback";
const PROMPT_KEY = "polytrack_game_feedback_prompt";
// Long enough that a visitor does not feel surveyed, short enough that a game
// which starts failing later still gets a chance to be reported.
const COOLDOWN_MS = 3 * 24 * 60 * 60 * 1000;
const SHOW_CHANCE = 0.35;
const SESSION_KEY = "polytrack_feedback_session_prompted";
let promptedThisSession = false;

try {
  promptedThisSession = sessionStorage.getItem(SESSION_KEY) === "true";
} catch {
  // Private mode: the in-memory flag still limits the prompt to once per page.
}

function readFeedback(): Record<string, GameFeedbackEntry> {
  try {
    const raw = localStorage.getItem(FEEDBACK_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return {};
    return parsed as Record<string, GameFeedbackEntry>;
  } catch {
    return {};
  }
}

function readLastPrompt(): number {
  try {
    return Number(localStorage.getItem(PROMPT_KEY) || "0") || 0;
  } catch {
    return 0;
  }
}

export function feedbackForGame(gameId: string): GameFeedbackEntry | null {
  const entry = readFeedback()[gameId];
  return entry && typeof entry.answer === "string" ? entry : null;
}

export function recordGameFeedback(gameId: string, answer: GameFeedbackAnswer): void {
  const all = readFeedback();
  all[gameId] = { answer, at: Date.now() };
  try {
    localStorage.setItem(FEEDBACK_KEY, JSON.stringify(all));
  } catch {
    // The prompt decision for this game still holds in memory for this visit.
  }
}

/**
 * Decides whether to ask about this game right now. Once it returns true the
 * prompt counts as shown, so a reload or a second launch cannot ask again.
 */
export function shouldPromptFeedback(gameId: string): boolean {
  if (promptedThisSession) return false;
  if (feedbackForGame(gameId)) return false;
  if (Date.now() - readLastPrompt() < COOLDOWN_MS) return false;
  if (Math.random() > SHOW_CHANCE) return false;
  markFeedbackPromptSeen();
  return true;
}

export function markFeedbackPromptSeen(): void {
  promptedThisSession = true;
  try {
    sessionStorage.setItem(SESSION_KEY, "true");
    localStorage.setItem(PROMPT_KEY, String(Date.now()));
  } catch {
    // Not fatal; the in-memory flag still stops repeats this visit.
  }
}
