// Single source of truth for the site version and its user-facing change log.
// Bump SITE_VERSION and add a new entry at the top for every major update.

export const SITE_VERSION = "1.7.1";

export interface ChangelogEntry {
  version: string;
  date: string;
  title: string;
  changes: string[];
}

export const CHANGELOG: ChangelogEntry[] = [
  {
    version: "1.7.1",
    date: "November 2026",
    title: "QR and email sharing, and a tidier phone header",
    changes: [
      "The share dialog can show a QR code for the current page, ready to scan with a phone camera.",
      "You can type a friend's email address in the share dialog and send them the link directly, without a mail app.",
      "Email shares are rate limited so the form cannot be used to send bulk mail.",
      "On phones the top bar now fits the menu, logo and every action button on one row, with search on the row below.",
    ],
  },
  {
    version: "1.7.0",
    date: "November 2026",
    title: "Streak milestones, a share card and synced reactions",
    changes: [
      "Daily streak milestones at 3, 7, 14, 30, 60, 100 and 365 days, with the next one always shown.",
      "Share streak card turns your run into a 1200x630 image for the phone share sheet or a download.",
      "Top 10 today now sits on the home page, right under Recently played.",
      "Chat reactions are saved on the hub so everyone sees the same chips.",
    ],
  },
  {
    version: "1.6.10",
    date: "November 2026",
    title: "Install as an app and a keyboard command palette",
    changes: [
      "math_games can be installed as an app: look for the Install button in the first-visit notice or under Settings > Install app.",
      "Press ⌘ K or Ctrl K anywhere to open a command palette that searches games and runs hub actions.",
      "Settings > Keyboard shortcuts lists every shortcut, including search, the panic key and palette navigation.",
    ],
  },
  {
    version: "1.6.9",
    date: "November 2026",
    title: "A taller hero, faster chat and a /settings address",
    changes: [
      "The featured game at the top of the catalog is taller, with larger text and a bigger Play button.",
      "Chat now checks for new messages every 30 seconds.",
      "Settings has its own /settings address, so it can be opened or shared directly.",
    ],
  },
  {
    version: "1.6.8",
    date: "November 2026",
    title: "Daily streaks with a flame in the top bar",
    changes: [
      "Every day you open math_games adds one day to your streak.",
      "A flame and your day count now sit in the top bar; tap it to open your streak.",
      "Settings has a Daily streak page with your best run, total days and a look at the last 30 days.",
    ],
  },
  {
    version: "1.6.7",
    date: "November 2026",
    title: "Message reactions and a full-screen phone chat",
    changes: [
      "Tap the smiley under any chat message to drop a quick reaction on it.",
      "Reactions sit under the message as a little arrow and the emoji with a count, and tapping one adds or removes yours.",
      "On phones, opening Chat now hides the search bar so the conversation gets the whole screen.",
    ],
  },
  {
    version: "1.6.6",
    date: "November 2026",
    title: "Ads further down, proxied ad scripts and editable Editor's picks",
    changes: [
      "The larger ad unit now appears further down the home game grid instead of above it.",
      "Opening a category from the side navigation only loads the top banner ad, not the larger unit.",
      "Ad scripts load through the site's own proxy, so they also appear on networks that block the ad hosts.",
      "Admins can change which games are Editor's picks, and the choice applies to every device.",
    ],
  },
  {
    version: "1.6.5",
    date: "November 2026",
    title: "Real screenshots for games without cover art",
    changes: [
      "Games that ship no cover art now show a live screenshot of their game page.",
      "Games that already have real cover art keep using it.",
      "If a screenshot cannot be captured, the genre artwork still fills in.",
    ],
  },
  {
    version: "1.6.4",
    date: "November 2026",
    title: "Hearts, a top 10 chart and artwork everywhere",
    changes: [
      "Favorites now use a heart instead of a star.",
      "Trending opens with a Top 10 🔥 today chart, ranked like a streaming service.",
      "Games without a cover image now show painted genre artwork, so the hero always has art.",
    ],
  },
  {
    version: "1.6.3",
    date: "November 2026",
    title: "A rotating hero and in-tab navigation",
    changes: [
      "The featured game at the top of the catalog switches every 5 seconds through the editor's picks.",
      "The featured game is a little taller.",
      "Unblocked AIs and outside games now open in the same tab instead of a new one.",
    ],
  },
  {
    version: "1.6.2",
    date: "November 2026",
    title: "Category headings and a focused chat view",
    changes: [
      "The catalog heading now reads \"82 games in Driving\" for whichever category is selected.",
      "The row of filter tags at the top of the catalog is gone; every category lives in the side navigation.",
      "Opening Community chat from the side navigation shows it centred and much larger.",
    ],
  },
  {
    version: "1.6.1",
    date: "November 2026",
    title: "Hover to open the side navigation",
    changes: [
      "The side navigation opens as you hover it and folds away when you leave.",
      "It now floats over the games instead of shifting the grid when it opens.",
      "Hold a rail icon to see its name in a small label.",
      "The games panel no longer repeats \"Games\" above the count.",
    ],
  },
  {
    version: "1.6.0",
    date: "November 2026",
    title: "Side navigation and a search bar in the top nav",
    changes: [
      "Search moved into the middle of the top bar and is larger, with the same / shortcut.",
      "The top bar is now just the logo, the centred search and quick actions.",
      "A new side navigation holds Home, recently played, favorites, trending and every category in one place.",
      "The side navigation can collapse to icons or expand with labels, and remembers which you chose.",
      "Chat, Unblocked AIs, outside games, submitting a game and bug reports live in the same navigation.",
      "On phones the same list opens as a drawer from the menu button beside the logo.",
      "Added a Recently played filter that keeps the games you opened in the last week.",
    ],
  },
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
