# Math Class

<div align="center">
  <img src="images/app-icon-512.png" alt="Math Class app icon" width="160">

  **A classroom-friendly browser game hub for quick, easy play.**

  [![Live site](https://img.shields.io/badge/Live-Site-2563eb?style=for-the-badge)](https://poly2.benlaunches.icu)
  [![Version](https://img.shields.io/badge/Version-v1.7.6-7c3aed?style=for-the-badge)](src/lib/changelog.ts)
  [![License](https://img.shields.io/badge/License-MIT-16a34a?style=for-the-badge)](LICENSE)
</div>

Math Class brings hundreds of browser games and PolyTrack builds together in one organized, customizable hub. It includes search and filters, favourites, play stats, offline support, tab disguises, panic controls, and a password-protected admin panel.

<div align="center">
  <table>
    <tr>
      <td><img src="covers/cdn-minecraft.webp" alt="Minecraft" width="180"></td>
      <td><img src="covers/cdn-among-us.webp" alt="Among Us" width="180"></td>
      <td><img src="covers/cdn-roblox.webp" alt="Roblox" width="180"></td>
    </tr>
    <tr>
      <td><img src="covers/cdn-shell-shockers.webp" alt="Shell Shockers" width="180"></td>
      <td><img src="covers/cdn-slitherio.webp" alt="Slither.io" width="180"></td>
      <td><img src="covers/game-block-blast.jpg" alt="Block Blast" width="180"></td>
    </tr>
  </table>
</div>

## Highlights

| | |
| --- | --- |
| **637-game catalog** | Search, category filters, Editor's Picks, verified games, bug flags, and sorting. |
| **Flexible layouts** | Switch between compact row cards and an artwork-first cover mosaic. |
| **Your device, your data** | Favourites and recently played games remain on the current device. |
| **Detailed stats** | Track session time, launches, games played, and most-played titles locally. |
| **Privacy controls** | Set a tab cloak, panic redirect, Site Lock password, and blocked-search behavior. |
| **Offline ready** | Download the hub and selected games for cache-first play during a schedule. |
| **Built-in moderation** | Report bugs and submissions through a password-protected admin dashboard. |

## Live mirrors

| Mirror | Notes |
| --- | --- |
| [poly2.benlaunches.icu](https://poly2.benlaunches.icu) | Primary mirror |
| [polytrack.sawyerbobk563.deno.net](https://polytrack.sawyerbobk563.deno.net) | May lag behind updates |
| [polytrack.sawyerbobk563.workers.dev](https://polytrack.sawyerbobk563.workers.dev) | Cloudflare mirror |
| [basket-random-1df0d.containers.snapdeploy.app](https://basket-random-1df0d.containers.snapdeploy.app) | May take a minute to start |
| [vh-prod-math-class-main-6f638f-09230ec8.livemy.site](https://vh-prod-math-class-main-6f638f-09230ec8.livemy.site) | May lag behind updates |

## Quick start

**Requirements:** Node.js 18+ and npm.

```bash
npm install
npm run build
```

Serve the repository root with any static file server:

```bash
npx serve .
# or
python3 -m http.server
```

Then open `index.html`. The React app in `src/` is bundled into `dist/home.bundle.js`; rebuild and reload after source changes.

## Features

### Games

- **One catalog, many sources:** local HTML games, hosted games, and PolyTrack builds.
- **Useful discovery:** category and source filters, A-Z sorting, trending, favourites, recently played, and most-played sorting.
- **Card layouts:** compact row cards or a cover mosaic with generated fallback artwork.
- **In-hub play:** launch games inside the page with reload, favourite, panic, and bug-report controls.
- **Cover system:** stored artwork, live captures, blur-up placeholders, `srcset` support, and generated game-name covers.

### Player stats

The stats clock tracks real elapsed time only while the hub or a game is visible. It records total time, game launches, games played, sessions, and the most-played list. Everything stays in browser storage, and Settings can pause counting or reset the data.

### Settings

- Loading animation, side chat, visitor counter, footer, and ad-space controls
- Halftone, solid-colour, and gradient appearances
- Tab cloaks and a custom panic redirect
- Password-gated Site Lock
- Browser notifications for new games and chat
- Downloadable offline packs and scheduled cache-first operation
- Reachability checks for proxy sources
- Read-only build stamps and changelog

### Reporting and moderation

Bug reports can be pre-filled with the game opened from the launcher. A password-protected admin panel manages bug reports, submissions, and per-game flags. Visitor counts and game click analytics pass through the Cloudflare Worker.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run build` | Build CSS, catalog data, offline packs, bundle, and offline manifest. |
| `npm run build:css` | Rebuild `dist/styles.css` with Tailwind. |
| `npm run build:catalog` | Export the game catalog into `api/`. |
| `npm run build:offline-manifest` | Regenerate `offline-manifest.json`. |
| `npm run build:packs` | Rebuild downloadable offline packs. |
| `npm test` | Bundle `*.test.ts` files and run Node's test runner. |

## Repository layout

| Path | Contents |
| --- | --- |
| `src/` | React app, components, hooks, helpers, and styles. |
| `src/lib/` | Settings, storage, stats, themes, and API helpers. |
| `games/` | Self-hosted games and `games/config.json`. |
| `0.3.1/`, `0.5.0/` | PolyTrack build archives. |
| `api/` | Vercel serverless API functions. |
| `cf/` | Cloudflare Worker services and manifests. |
| `scripts/` | Catalog, cover, offline, and client build tools. |
| `dist/` | Built CSS and JavaScript bundle. |
| `covers/`, `images/` | Game artwork and app icons. |

## How it works

- **Catalog:** `DEFAULT_GAMES` in `src/components/GameCatalog.tsx` is the built-in list. `games/config.json` is merged at runtime, and server search results can extend the list.
- **Storage:** preferences, favourites, stats, and offline schedules use `localStorage`. Settings includes a hard reset that clears the site's browser data.
- **Stats:** `src/lib/playStats.ts` uses elapsed time, batched writes, and sleep-gap protection to avoid inflating totals.
- **Card layout:** `src/lib/gameCardLayout.ts` persists the selected layout and updates the catalog without a reload.

## Environment variables

Analytics is optional. Set these values in the local shell or deployment provider before building:

```bash
PUBLIC_POSTHOG_KEY=phc_...
PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

The names are documented in [`.env.example`](.env.example). Never commit real values.

Backend deployments can also require:

```text
ADMIN_PASSWORD       Admin API password
HUB_INTERNAL_KEY     Shared Cloudflare Worker authorization key
```

The Vercel API functions reject requests unless `ADMIN_PASSWORD` is set and matches. Keep `HUB_INTERNAL_KEY` identical in each deployment that uses proxy shortcuts.

## PolyTrack archives

**v0.5.0** is maintained and uses the simulation thread for replays. AI attempts can be watched after selecting a track.

**v0.3.1** is kept for historical use. An early ghost-replay camera mod may leave the camera stuck after a completed run.

## Notes

- The site is deliberately blocked from search engines and automated crawlers.
- `sw.js` and `notification-sw.js` handle offline caching and notification delivery.
- Game-specific audio and fullscreen permissions belong to each game page.
- The project is licensed under the [MIT License](LICENSE).

<div align="center">
  <sub>Explore the source on <a href="https://github.com/NOTAM-bobk/math_class">GitHub</a></sub>
</div>
