// How many times a game has been played.
//
// The number comes straight from the hub's Cloudflare Worker, which counts one
// click per launch. Nothing is invented: a game the Worker has not recorded yet
// reports 0, and the UI hides the figure until there is a real play.

/** Plays recorded by the hub for this game. */
export function totalPlays(game: { clicks?: number }): number {
  const clicks = game.clicks;
  if (typeof clicks !== "number" || !Number.isFinite(clicks) || clicks <= 0) return 0;
  return Math.round(clicks);
}

/** Compact display, e.g. 940, 12.4k, 1.2m. */
export function formatPlays(count: number): string {
  const value = Math.max(0, Math.round(count));
  if (value < 1000) return String(value);
  if (value < 1_000_000) {
    const thousands = value / 1000;
    const shown = thousands < 10 ? thousands.toFixed(1).replace(/\.0$/, "") : String(Math.round(thousands));
    return `${shown}k`;
  }
  const millions = value / 1_000_000;
  const shown = millions < 10 ? millions.toFixed(1).replace(/\.0$/, "") : String(Math.round(millions));
  return `${shown}m`;
}
