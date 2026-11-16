# Working: Site Proxies:

-https://poly2.benlaunches.icu
- //few days late
- https://polytrack.sawyerbobk563.workers.dev/
- https://basket-random-1df0d.containers.snapdeploy.app // takes a minute to start 

# v0.3.1
Replays will not render correctly (if you finish any run your camera will be bugged forever on that track) as this was one of the first mods made: camera following the ghost replay.  
Mod was used to take recordings of the world record to see strategy, as 'Watch' wasn't implemented yet.  

DEVELOPMENT STOPPED

# v0.5.0
New archive. This will sometimes still be maintained by me.  
Modified code, this can render some AI attempts when you click on S1 and on 'Watch' it will specially load these replays.  
Additionally the communication between main and simulation threads is experimentally optimized, about 90% less time wasted on serializing communication data. I saw no interpolation errors when driving, but feel free to give feedback if you do notice a difference.  
Main then reassembles those 90% of steps by copying the last (and only) step sent by the simulation and applying a custom step count to it (using the startStepCount by sim) while not changing any of the actual states data.  
I haven't implemented buffer memory beaming yet

# Hub site ("Education" Games)

Alongside the version archives this repository hosts the game hub in `src/` (React + esbuild). The hub is what has its own version number, release notes and settings.

- Version: **v1.1.0** (see [`src/lib/changelog.ts`](src/lib/changelog.ts))
- Build: `npm install` then `npm run build` — writes `dist/home.bundle.js`, which `index.html` loads (with the root `home.bundle.js` as a fallback).
- Settings live in the gear button in the top bar: Site Lock, background style, new game notifications, ad preference, tab cloaking, panic redirect, and the change log.

## New game notifications

The Notification section in Settings asks for browser permission directly from the toggle click, which is the only gesture browsers accept a prompt from.

- Allowed: the preference is stored in `localStorage` under `polytrack_notifications` and a "new game dropped" alert is shown right away.
- The alert repeats once per site version (`polytrack_notified_version` remembers the last version announced), so visitors hear about new games without being spammed on every page load.
- Denied/blocked: Settings explains how to re-allow notifications in the browser, and no prompt is shown again.
- Unsupported: the toggle reports that the browser has no Notification API.

## Change log

The in-app change log opens from the **View change log** button at the bottom of Settings (`src/components/ChangelogModal.tsx`).

For every major update:

1. Bump `SITE_VERSION` in `src/lib/changelog.ts`.
2. Add a new entry at the top of `CHANGELOG` with the version, date, a short title and the user-facing changes.
3. Mention the published version in this README.

Recent releases:

### v1.1.0 — Notifications and the change log
- Settings asks whether to allow notifications and sends a "new game dropped" alert once allowed.
- Alerts repeat once per version for visitors who opted in.
- Change log button at the bottom of Settings, backed by a single versioned list.
- Notification preferences stay on the visitor's device.

### v1.0.0 — Hub, filters and badges
- Blocked games get a randomized `Blocked:` emoji tag, managed from the admin panel.
- Game filters, sorting, favorites and recent plays.
- Mobile layout pass and a no-mobile tag for desktop-only games.
- Verified and `error:bug` badges synced across devices through the Cloudflare backend.
- Background styles in Settings: halftone shader, solid colors and gradients.

### v0.9.0 — Share, panic and analytics
- Share dialog, periodic feature tooltips, emergency panic redirect.
- Analytics across all games, Editor's Pick tags.
- Bug report form and password protected admin panel.

## What to add or improve next

Ordered by impact for a classroom-facing game hub:

1. **Search the catalog server-side.** `games/config.json` is fetched whole on every visit; past ~200 games the catalog should page or query an endpoint instead.
2. **Cache the catalog and bundle.** `index.html` loads Tailwind and Fonts from CDNs, so a slow network leaves the hub unstyled; ship a built CSS file and system-font fallback.
3. **Per-game report dashboard.** Bug reports are collected but there is no view of them; the admin panel should list open reports per game and one-click toggle `error:bug`.
4. **Real notification delivery.** The current alerts are local browser notifications and only appear while the site is open at least once per version; a Web Push backend would reach visitors who are not on the page.
5. **Settings sync.** Site Lock, background, favorites and notification choices are per-device `localStorage`. An optional account would carry them across devices and make favorites meaningful on shared classroom machines.
6. **Game health checks.** A scheduled job that requests each game URL and auto-flags dead entries would keep the catalog trustworthy as host domains expire.
