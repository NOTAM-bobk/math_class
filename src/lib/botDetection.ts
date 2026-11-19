// Free, on-device bot detection (Fingerprint BotD, MIT). No API key and no
// network calls: monitoring is off, so nothing about the visitor leaves the
// browser. The check runs once per page load, started while the glass logo
// reveal plays.
import { load } from "@fingerprintjs/botd";

export interface BotCheckResult {
  suspected: boolean;
  botKind?: string;
}

const CHALLENGE_PASSED_KEY = "polytrack_bot_challenge_passed_at";

let checkPromise: Promise<BotCheckResult> | null = null;

/**
 * Starts the startup bot check, or returns the result of the run already in
 * flight. Failures resolve as "human" so a detector problem never blocks the hub.
 */
export function startStartupBotCheck(): Promise<BotCheckResult> {
  if (!checkPromise) {
    checkPromise = load({ monitoring: false })
      .then((botd) => botd.detect())
      .then((result): BotCheckResult =>
        result.bot ? { suspected: true, botKind: result.botKind } : { suspected: false }
      )
      .catch((): BotCheckResult => ({ suspected: false }));
  }
  return checkPromise;
}

/** A passed challenge is remembered for this tab for 30 minutes. */
export function hasPassedBotChallenge(): boolean {
  try {
    const passedAt = Number(sessionStorage.getItem(CHALLENGE_PASSED_KEY) || 0);
    return passedAt > 0 && Date.now() - passedAt < 30 * 60 * 1000;
  } catch {
    return false;
  }
}

export function markBotChallengePassed(): void {
  try {
    sessionStorage.setItem(CHALLENGE_PASSED_KEY, String(Date.now()));
  } catch {}
}
