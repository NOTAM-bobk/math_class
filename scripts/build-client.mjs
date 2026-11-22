import { build } from "esbuild";
import fs from "node:fs";

// Chunks are content-hashed, so a new deploy never reuses an old file name.
// Clearing the directory keeps stale chunks from piling up in the deployment.
fs.rmSync("dist/chunks", { recursive: true, force: true });

await build({
  entryPoints: ["src/index.tsx"],
  bundle: true,
  minify: true,
  // Settings, the admin panel and the change log are imported dynamically, so
  // they become their own chunks instead of loading on every visit.
  splitting: true,
  format: "esm",
  outdir: "dist",
  entryNames: "home.bundle",
  chunkNames: "chunks/[name]-[hash]",
  alias: { "@": "./src" },
  define: {
    "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV ?? "production"),
    "process.env.PUBLIC_POSTHOG_KEY": JSON.stringify(process.env.PUBLIC_POSTHOG_KEY ?? ""),
    "process.env.PUBLIC_POSTHOG_HOST": JSON.stringify(process.env.PUBLIC_POSTHOG_HOST ?? ""),
  },
});

// The pre-roll player (Video.js + videojs-ima) is only needed once a game is
// clicked, so its styles live in dist/vendor and are linked on demand instead
// of loading on every visit.
fs.mkdirSync("dist/vendor", { recursive: true });
for (const [from, to] of [
  ["node_modules/video.js/dist/video-js.min.css", "video-js.min.css"],
  ["node_modules/videojs-contrib-ads/dist/videojs-contrib-ads.css", "videojs-contrib-ads.css"],
  ["node_modules/videojs-ima/dist/videojs.ima.css", "videojs.ima.css"],
]) {
  fs.copyFileSync(from, `dist/vendor/${to}`);
}

// /checkout is its own static page, so it gets a self-contained bundle and
// does not change the home bundle's chunk graph.
await build({
  entryPoints: ["src/checkout.tsx"],
  bundle: true,
  minify: true,
  format: "esm",
  outfile: "dist/checkout.js",
  alias: { "@": "./src" },
  define: {
    "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV ?? "production"),
  },
});
