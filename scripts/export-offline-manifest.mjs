// Builds offline-manifest.json: the files Settings downloads for offline use.
// Same-origin files are counted by size so the page can show real progress.
// The font stylesheet is still remote; the hub's own CSS is same-origin.
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const seen = new Set();
const files = [];

function addUrl(url, bytes = 0) {
  if (seen.has(url)) return;
  seen.add(url);
  files.push({ url, bytes });
}

function addFile(relativePath) {
  const absolutePath = path.join(root, relativePath);
  if (!fs.existsSync(absolutePath)) return;
  const stat = fs.statSync(absolutePath);
  if (!stat.isFile()) return;
  addUrl(`/${relativePath.split(path.sep).join("/")}`, stat.size);
}

function walk(relativeDir) {
  const absoluteDir = path.join(root, relativeDir);
  if (!fs.existsSync(absoluteDir)) return;
  for (const entry of fs.readdirSync(absoluteDir, { withFileTypes: true })) {
    const relativePath = path.join(relativeDir, entry.name);
    if (entry.isDirectory()) {
      walk(relativePath);
    } else if (entry.isFile() && !relativePath.endsWith(".map") && !relativePath.endsWith(".md")) {
      addFile(relativePath);
    }
  }
}

// The hub shell and its pre-built bundle come first so a slow or interrupted
// download still leaves a usable hub.
for (const file of [
  "index.html",
  "manifest.json",
  "catalog.json",
  "offline-packs.json",
  "games/config.json",
]) {
  addFile(file);
}

// The whole dist directory, including the code-split chunks.
walk("dist");
walk("images");
walk("games");

// The catalog's Polytrack entry and the small hub pages are same-origin too.
for (const directory of ["0.5.0", "outside", "ai", "terms", "submit", "yt"]) {
  walk(directory);
}

const remoteFiles = [
  "https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&family=Geist+Mono:wght@400;500;600&display=swap",
];

const localFiles = files.filter((file) => file.url.startsWith("/"));
const totalBytes = localFiles.reduce((total, file) => total + file.bytes, 0);

const manifest = {
  version: 1,
  generatedAt: new Date().toISOString(),
  totalBytes,
  files: [...files, ...remoteFiles.map((url) => ({ url, bytes: 0 }))],
};

fs.writeFileSync(path.join(root, "offline-manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(
  `Wrote offline-manifest.json (${manifest.files.length} files, ${(totalBytes / 1024 / 1024).toFixed(1)} MB)`,
);
