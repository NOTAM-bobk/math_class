// Single source of truth for the site version and its user-facing change log.
// Bump SITE_VERSION and add a new entry at the top for every major update.

export const SITE_VERSION = "1.5.0";

export interface ChangelogEntry {
  version: string;
  date: string;
  title: string;
  changes: string[];
}

export const CHANGELOG: ChangelogEntry[] = [
  {
    version: "1.5.0",
    date: "November 2026",
    title: "Offline game packs, faster startup and one-tap feedback",
    changes: [
      "Offline mode can now download one game at a time: search for a game in Settings and save just that pack.",
      "While the browser has no connection, the catalog shows an Offline filter with the games you saved.",
      "Settings, the admin panel and the change log now load on first open instead of shipping in the main bundle.",
      "The game catalog is fetched as JSON, so the hub shell starts before the list of games arrives.",
      "Games occasionally ask a one-tap \"Did this work?\"; answering No opens the bug report with the game name filled in.",
    ],
  },
  {
    version: "1.4.0",
    date: "November 2026",
    title: "Update history grid and customizable system fonts",
    changes: [
      "Added an interactive 371-day update history grid to Settings and the Change log dialog, tracking commits, engine updates, and releases with smooth spring tooltips.",
      "Added custom System Font settings under Theme & Fonts with 10 fun and unique typefaces (8-bit arcade, CRT terminal, cyber, comic, bubbly, chalkboard, developer code, and blocky arcade).",
      "Live typography preview card and instant site-wide application with zero layout flash.",
    ],
  },
  {
    version: "1.3.1",
    date: "November 2026",
    title: "Faster bug reports and game art",
    changes: [
      "Reporting a bug from inside a game now fills in that game's name for you.",
      "Recently played games show their own cover art instead of a generic icon.",
      "The Admin pane shows the build stamp and credit read-only instead of offering editable fields.",
    ],
  },
  {
    version: "1.3.0",
    date: "November 2026",
    title: "Live stats and cover cards",
    changes: [
      "Your stats now count every second, on the hub and while a game is open, and update live in Settings.",
      "A new Always count switch in Your stats pauses or resumes counting.",
      "Settings > Layout & startup gained a Game card layout choice: classic cards or a cover mosaic of different sized boxes with the game name on the art.",
    ],
  },
  {
    version: "1.2.0",
    date: "November 2026",
    title: "Server-side search, mirrors and crawler blocking",
    changes: [
      "Search now runs on the server and the catalog and bundle are cached at the edge, so the hub loads and filters faster.",
      "Notifications are delivered by the browser itself, and the new-game alert only fires when the catalog actually gains a game.",
      "The top navigation starts closed, chat dropped its avatar icons, and the verified check explains itself on hover or tap.",
      "Search engines, automated crawlers and AI training agents are blocked from this site.",
      "A backup mirror of the hub is linked at the bottom of Settings.",
      "The footer and the bottom of Settings show when the site was last updated.",
    ],
  },
  {
    version: "1.1.0",
    date: "November 2026",
    title: "Notifications and this change log",
    changes: [
      "Settings can now ask your browser for notification permission.",
      "Once notifications are allowed, the site sends you a \"new game dropped\" alert and repeats it whenever a new version adds games.",
      "Added this change log, reachable from the button at the bottom of Settings.",
      "Notification preferences are stored on your device only.",
    ],
  },
  {
    version: "1.0.0",
    date: "October 2026",
    title: "Hub, filters and badges",
    changes: [
      "Blocked games now show a Blocked tag with a randomized emoji on every refresh, manageable from the admin panel.",
      "Game filters, sorting, favorites and recent plays.",
      "Mobile layout passes, plus a no-mobile tag for desktop-only games.",
      "Verified and error:bug badges sync across devices through the Cloudflare backend.",
      "Background styles in Settings: halftone shader, solid colors and gradients.",
    ],
  },
  {
    version: "0.9.0",
    date: "September 2026",
    title: "Share, panic and analytics",
    changes: [
      "Share dialog and periodic feature tooltips.",
      "Emergency panic redirect with presets.",
      "Analytics across all games and Editor's Pick tags.",
      "Bug report form and password protected admin panel.",
    ],
  },
];

/** The newest game named in the change log, used by the notification copy. */
export function latestGameMention(): string | null {
  const entry = CHANGELOG[0];
  if (!entry) return null;
  const line = entry.changes.find((change) => change.toLowerCase().includes("game"));
  return line ?? null;
}
