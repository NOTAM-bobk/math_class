import { build } from "esbuild";

await build({
  entryPoints: ["src/index.tsx"],
  bundle: true,
  minify: true,
  alias: { "@": "./src" },
  outfile: "dist/home.bundle.js",
  define: {
    "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV ?? "production"),
    "process.env.PUBLIC_POSTHOG_KEY": JSON.stringify(process.env.PUBLIC_POSTHOG_KEY ?? ""),
    "process.env.PUBLIC_POSTHOG_HOST": JSON.stringify(process.env.PUBLIC_POSTHOG_HOST ?? ""),
  },
});
