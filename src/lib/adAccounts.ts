// BidVertiser accounts are per site property: the widget tag has to name the
// account the current domain was verified under. poly2.benlaunches.icu is its
// own property (verified by <!-- Bidvertiser2109175 -->), while
// games.mathclass.uk and the other mirrors use the original 2108105 account
// (verified by <!-- Bidvertiser2108105 -->). Both verification comments live in
// index.html; this is the one place the split is decided.
const POLY2_HOST = "poly2.benlaunches.icu";
const POLY2_OWNER_ID = 2109175;
const DEFAULT_OWNER_ID = 2108105;

function currentHostname(): string {
  return typeof window === "undefined" ? "" : window.location.hostname;
}

/** The BidVertiser publisher account that owns `hostname` (defaults to this page's). */
export function bidvertiserOwnerId(hostname: string = currentHostname()): number {
  const host = hostname.trim().toLowerCase().replace(/\.$/, "");
  return host === POLY2_HOST || host.endsWith("." + POLY2_HOST) ? POLY2_OWNER_ID : DEFAULT_OWNER_ID;
}
