// BidVertiser accounts are per site property: the widget tag has to name the
// account the current domain was verified under. games.mathclass.uk is its own
// property (verified by <!-- Bidvertiser2109175 --> at the top of index.html),
// while poly2.benlaunches.icu and the other mirrors use the original 2108105
// account (verified by <!-- Bidvertiser2108105 -->).
const MATHCLASS_HOST = "games.mathclass.uk";
const MATHCLASS_OWNER_ID = 2109175;
const DEFAULT_OWNER_ID = 2108105;

function currentHostname(): string {
  return typeof window === "undefined" ? "" : window.location.hostname;
}

/** The BidVertiser publisher account that owns `hostname` (defaults to this page's). */
export function bidvertiserOwnerId(hostname: string = currentHostname()): number {
  const host = hostname.trim().toLowerCase().replace(/\.$/, "");
  return host === MATHCLASS_HOST || host.endsWith("." + MATHCLASS_HOST) ? MATHCLASS_OWNER_ID : DEFAULT_OWNER_ID;
}
