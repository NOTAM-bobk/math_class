// Single source of truth for the site version and its user-facing change log.
// Bump SITE_VERSION and add a new entry at the top for every major update.

export const SITE_VERSION = "1.2.0";

export interface ChangelogEntry {
  version: string;
  date: string;
  title: string;
  changes: string[];
}

export const CHANGELOG: ChangelogEntry[] = [
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
