// The sponsor's direct link. The game launch popup opens it every third time
// the "Continue to <game>" button is used, so the visitor still gets the game
// in the hub while the offer opens in its own tab.
export const SPONSOR_OFFER_URL = "https://asiafilm.org/4/857d2eb4830b5fd9ce6806758f86fa2e";

const SPONSOR_OFFER_EVERY = 3;
const SPONSOR_CLICK_KEY = "polytrack_sponsor_continue_clicks";

// Kept outside localStorage so a browser that refuses storage still counts
// clicks for the current page.
let memoryClicks = 0;

/** Counts one Continue click and says whether this one opens the offer. */
export function consumeSponsorOfferClick(): boolean {
  let clicks = memoryClicks + 1;
  try {
    const stored = Number(localStorage.getItem(SPONSOR_CLICK_KEY));
    clicks = (Number.isFinite(stored) && stored > 0 ? Math.floor(stored) : 0) + 1;
    localStorage.setItem(SPONSOR_CLICK_KEY, String(clicks));
  } catch {
    // Storage is optional; the in-memory count still holds this visit.
  }
  memoryClicks = clicks;
  return clicks % SPONSOR_OFFER_EVERY === 0;
}
