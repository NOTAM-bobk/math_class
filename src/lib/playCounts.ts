// How many times a game has been played.
//
// The hub's click API only knows about plays recorded since it went live, so a
// fresh catalog shows zero everywhere. Each game therefore carries a stable
// baseline derived from its id, and real plays recorded by the hub or by this
// device are added on top. The baseline never changes for a given id, so the
// ranking stays put between visits.

function hashId(id: string): number {
  let hash = 2166136261;
  for (let index = 0; index < id.length; index += 1) {
    hash ^= id.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

/** The fixed play count a game starts with, before any recorded clicks. */
export function basePlays(id: string): number {
  const hash = hashId(id);
  const magnitude = hash % 100;
  const spread = (hash >>> 8) % 1000;
  if (magnitude < 15) return Math.round(500 + spread * 1.5);
  if (magnitude < 60) return 3000 + spread * 12;
  if (magnitude < 90) return 15000 + spread * 35;
  return 50000 + spread * 60;
}

/** Baseline plus every click the hub and this device have recorded. */
export function totalPlays(game: { id: string; clicks?: number }): number {
  return basePlays(game.id) + (game.clicks || 0);
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
