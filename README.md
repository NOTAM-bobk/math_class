# math_games (637 game Hub)

A classroom-friendly browser game hub: hundreds of games in one place, plus PolyTrack
build archives, favourites, play stats, offline play and the settings a shared computer
needs (site lock, panic redirect, tab disguise).

**Current version: v1.7.2** — see [`src/lib/changelog.ts`](src/lib/changelog.ts).

## Live mirrors

- https://poly2.benlaunches.icu
- https://polytrack.sawyerbobk563.deno.net (can lag a few days behind)
- https://polytrack.sawyerbobk563.workers.dev
- https://basket-random-1df0d.containers.snapdeploy.app (takes a minute to start)
- https://vh-prod-math-class-main-6f638f-09230ec8.livemy.site (may lag behind updates)

## Features

### Games
- **One catalog, many sources.** Local HTML games in `games/`, hosted games on other
  domains, and the PolyTrack builds in `0.3.1/` and `0.5.0/`.
- **Search, filters and sorting** across categories, Editor's Pick, Verified, Trending,
  Flash, Error:bug and Blocked, plus A–Z, recently played and most played orders.
- **Favourites and recently played**, remembered on the device.
- **Two card layouts** (Settings → Layout & startup): the classic row cards, or a cover
  mosaic of different sized boxes where each game's art fills the card and its name sits
  on the art.
- **Badges everywhere:** verified games, known-bug flags, Editor's Picks, desktop-only
  ("no mobile") games and a randomised blocked tag.
- **Play in the hub or in a new tab.** Same-origin games open in a launcher inside the
  page, with reload, favourite, panic and bug-report controls.

### Your stats (per device)
- A live counter that ticks every second while the hub **or** a game is open.
- Total time on site, game clicks, games played and sessions, plus a most-played list.
- **Always count** switch in Settings → Your stats pauses and resumes counting.
- Stats never leave the browser and a hard reset clears them.

### Settings
- **Layout & startup:** loading animation, side chat and visitor counter, footer, game
  card layout, ad space, and a hard reset that clears the site's local data.
- **Appearance:** halftone shader, solid colours or gradient backgrounds.
- **Tab cloak and panic button:** disguise the tab as Classroom/Docs and jump to a preset
  or custom page with one key.
- **Site Lock:** password gate on refresh for classroom machines.
- **Notifications:** browser alerts for new games and chat messages, once per version.
- **Offline mode:** download the hub and its games, then serve them cache-first during a
  scheduled window.
- **Your stats**, **Proxies & source** (live reachability checks) and the **change log**.
- **Admin:** read-only build stamp ("Last updated", "Built by") plus a shortcut into the
  password-protected admin panel.

### Reporting and moderation
- Bug report form, optionally pre-filled with the game you were playing when opened from
  the in-hub launcher.
- Password-protected admin panel for bug reports, game submissions and flag toggles.
- Visitor counter and per-game click analytics through the Cloudflare Worker.

## Quick start

Requirements: Node.js 18+ and npm.

```bash
npm install
npm run build
```

`npm run build` writes the prebuilt Tailwind CSS, the exported catalog, the offline
manifest and the bundled hub. Serve the repository root with any static file server
(`npx serve .`, `python3 -m http.server`, or your host of choice) and open `index.html`.

### PostHog analytics

The hub uses `posthog-js` for pageviews, session replay, error capture and product
events such as game launches, favourites, filters, shares, chat messages, bug reports
and submissions. Because this is a static bundle, the public project token and ingestion
host must be present when `npm run build` runs; they are injected into the bundle by
`scripts/build-client.mjs` and must not be hard-coded in source files.

Set these variables in the local shell or hosting provider for every build environment:

```bash
PUBLIC_POSTHOG_KEY=phc_...
PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

The variable names are also listed in [`.env.example`](.env.example). Keep the real
values in an ignored `.env`/`.env.local` file or in the deployment provider's encrypted
environment settings; never commit them.

| Script | What it does |
| --- | --- |
| `npm run build` | Full build: CSS, catalog, offline manifest and `dist/home.bundle.js`. |
| `npm run build:css` | Tailwind only, into `dist/styles.css`. |
| `npm run build:catalog` | Regenerates the catalog export in `api/`. |
| `npm run build:offline-manifest` | Regenerates `offline-manifest.json`. |
| `npm test` | Placeholder; there is no automated test suite yet. |

The hub is a React app (`src/`) bundled by esbuild into `dist/home.bundle.js`, which
`index.html` loads (with the root `home.bundle.js` as a fallback). There is no framework
dev server: rebuild and reload the page after changing source.

## Repository layout

| Path | Contents |
| --- | --- |
| `src/` | Hub source: `App.tsx`, components, hooks and helpers. |
| `src/lib/` | Settings, storage, stats, theme and API helpers. |
| `games/` | Self-hosted game pages and `games/config.json`, the catalog additions. |
| `0.3.1/`, `0.5.0/` | Archived PolyTrack builds, kept as playable versions. |
| `api/` | Vercel serverless functions (admin, search, flags, submissions). |
| `cf/` | Cloudflare Worker behind the proxy shortcuts and hub API. |
| `scripts/` | Build-time exporters for the catalog and offline manifest. |
| `dist/` | Built CSS and hub bundle, served as-is. |
| `images/`, `terms/`, `submit/` | Icons, terms page and the standalone submission form. |

## How the hub works

- **Catalog.** `DEFAULT_GAMES` in `src/components/GameCatalog.tsx` is the built-in list;
  `games/config.json` is merged over it at runtime, and server search results can extend
  the list. The admin panel toggles flags that are stored per device and, for verified
  and buggy games, synced through the backend.
- **Storage.** Preferences, favourites, stats and the offline schedule live in
  `localStorage`; there are no accounts yet. Settings → Layout & startup → Hard reset
  clears everything this site stored in the browser.
- **Stats clock.** `src/lib/playStats.ts` counts real elapsed time while the hub is
  visible or a game session is open, writing to storage in batches and skipping long
  gaps (sleep, frozen tabs) so totals aren't inflated.
- **Card layouts.** `src/lib/gameCardLayout.ts` stores the choice; the catalog listens
  for changes so the grid switches without a reload. Game art comes from
  `src/components/GameCoverArt.tsx`, using a game's own icon where it lives on another
  origin and generated initial art for local pages.

## Versioning and the change log

`src/lib/changelog.ts` is the single source of truth for the site version and the
user-facing change log. For every release:

1. Bump `SITE_VERSION`.
2. Add an entry at the top of `CHANGELOG` with the version, date, title and changes.
3. Mention the version in this README.

## Backend and admin

Admin changes go through the Vercel functions in `api/`, which only accept requests when
`ADMIN_PASSWORD` (or `ADMIN_SECRET` / `VERCEL_ADMIN_PASSWORD`) is set and matches. The
Cloudflare Worker in `cf/` accepts the proxy shortcut only when `HUB_INTERNAL_KEY` matches
the same value in both deployments. The Vercel functions send the shared admin password
too, so keep `ADMIN_PASSWORD` identical everywhere. Set these as deployment environment
variables; never commit them.

## Game archives

**v0.5.0** is the maintained archive. Replays are rendered by the simulation thread, and
the main/simulation message passing was optimised to serialise far less data per step.
Some AI attempts appear when you open a track and choose "Watch".

**v0.3.1** is kept for history. Its ghost-replay camera follow was an early mod, so
finishing a run can leave the camera stuck on that track. Development stopped.

## Notes

- The site is classroom-facing and deliberately blocked from search engines and
  automated crawlers (`robots.txt`, `vercel.json` headers).
- `sw.js` and `notification-sw.js` handle the offline cache and notification delivery.
- Audio and fullscreen permissions belong to each game page, not the hub.
