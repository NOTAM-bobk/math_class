// Builds offline-packs.json: one downloadable pack per same-origin game.
//
// Settings uses this list to offer a per-game download, and the catalog's
// Offline filter uses the downloaded ids. Games proxied through /api/* stay out:
// those files are streamed by the serverless function and cannot be cached by
// the browser's own worker.
//
// A pack holds everything the game asks this origin for, so a Flash game brings
// its .swf and the Ruffle runtime. Pages that only redirect to another site, or
// that need a script from an unrelated CDN, are left out: they would download
// and then fail with no connection.
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const catalogPath = path.join(root, "catalog.json");

if (!fs.existsSync(catalogPath)) {
  console.error("catalog.json is missing; run scripts/export-catalog.mjs first.");
  process.exit(1);
}

const games = JSON.parse(fs.readFileSync(catalogPath, "utf8"));
const packs = [];
const skipped = [];

// Third-party requests that are optional for play (analytics, or a CDN fallback
// for a runtime this site already ships locally).
const OPTIONAL_REMOTE = [
  /^https?:\/\/cloud\.umami\.is\//i,
  /^https?:\/\/gateway\.umami\.is\//i,
  /^https?:\/\/cdn\.jsdelivr\.net\/npm\/@vercel\/analytics/i,
  /^https?:\/\/cdn\.jsdelivr\.net\/npm\/@ruffle-rs\/ruffle/i,
  /^https?:\/\/unpkg\.com\/@ruffle-rs\/ruffle/i,
  /^https?:\/\/fonts\.(googleapis|gstatic)\.com\//i,
];

const LOCAL_ASSET = /["']((?:\/)[^"']*?\.(?:swf|js|json|png|jpe?g|webp|gif|wasm|css|mp3|ogg|wav))["']/gi;
// Only loading references count: a plain <a href> to another site is a link a
// player may click, not something the game needs to boot.
const ATTR_REF = /(?:src|data|movie)\s*=\s*["']([^"']+)["']/gi;
const LINK_REF = /<link\b[^>]*href\s*=\s*["']([^"']+)["']/gi;
// Loader pages often point at a game build on a code CDN without a src= tag.
const REMOTE_GAME_REF = /["'](https?:\/\/(?:cdn\.jsdelivr\.net\/gh\/|github\.io\/)[^"']*\/)["']/i;

function collapse(relativeDir) {
  return relativeDir.split(path.sep).join("/");
}

function addFile(files, seen, url) {
  if (seen.has(url)) return;
  const absolute = path.join(root, url.replace(/^\//, ""));
  if (!fs.existsSync(absolute) || !fs.statSync(absolute).isFile()) return;
  seen.add(url);
  files.push({ url, bytes: fs.statSync(absolute).size });
}

function walk(files, seen, relativeDir) {
  const absoluteDir = path.join(root, relativeDir);
  if (!fs.existsSync(absoluteDir) || files.length > 400) return;
  for (const entry of fs.readdirSync(absoluteDir, { withFileTypes: true })) {
    const relativePath = path.join(relativeDir, entry.name);
    if (entry.isDirectory()) {
      walk(files, seen, relativePath);
    } else if (
      entry.isFile() &&
      !entry.name.startsWith(".") &&
      !relativePath.endsWith(".map") &&
      !relativePath.endsWith(".md")
    ) {
      addFile(files, seen, `/${collapse(relativePath)}`);
    }
  }
}

function sameOriginPath(url) {
  if (!url.startsWith("/") || url.startsWith("//") || url.startsWith("/api/")) return null;
  try {
    return new URL(url, "https://local.invalid").pathname;
  } catch {
    return null;
  }
}

function isOptionalRemote(reference) {
  const normalized = reference.startsWith("//") ? `https:${reference}` : reference;
  return OPTIONAL_REMOTE.some((pattern) => pattern.test(normalized));
}

/**
 * Returns the files a page needs, or null when the page cannot work offline.
 */
function pageFiles(pathname) {
  const absolute = path.join(root, pathname.replace(/^\//, ""));
  if (!fs.existsSync(absolute) || !fs.statSync(absolute).isFile()) return null;

  const files = [];
  const seen = new Set();
  addFile(files, seen, pathname);

  const html = fs.readFileSync(absolute, "utf8");
  const references = new Set();
  for (const pattern of [ATTR_REF, LINK_REF, LOCAL_ASSET]) {
    pattern.lastIndex = 0;
    let match;
    while ((match = pattern.exec(html)) !== null) references.add(match[1].trim());
  }

  if (/http-equiv=["']?refresh/i.test(html) && /url=https?:/i.test(html)) return null;
  if (REMOTE_GAME_REF.test(html)) return null;

  let needsRuffle = false;
  for (const reference of references) {
    if (!reference || reference.startsWith("#")) continue;
    if (reference.startsWith("data:") || reference.startsWith("mailto:") || reference.startsWith("javascript:")) continue;

    if (/^(https?:)?\/\//i.test(reference)) {
      if (isOptionalRemote(reference)) continue;
      // A required script or frame from another origin will not load offline.
      return null;
    }

    const resolved = new URL(reference, `https://local.invalid${pathname}`).pathname;
    if (resolved.startsWith("/api/")) continue;
    if (/(^|\/)ruffle(\/|\.|$)/i.test(resolved)) needsRuffle = true;

    const target = path.join(root, resolved.replace(/^\//, ""));
    if (fs.existsSync(target) && fs.statSync(target).isFile()) addFile(files, seen, resolved);
  }

  // Ruffle's loader pulls hashed core/wasm files at runtime, so ship its folder.
  if (needsRuffle) walk(files, seen, "games/ruffle");

  return files.length > 1 || files[0].bytes > 1024 ? files : null;
}

function filesFor(url) {
  const pathname = sameOriginPath(url);
  if (!pathname) return [];
  if (pathname.startsWith("/api/")) return [];

  const isDirectoryGame = pathname.endsWith("/index.html") || pathname.endsWith("/");
  if (isDirectoryGame) {
    const directory = pathname.endsWith("/") ? pathname : pathname.slice(0, -"index.html".length);
    const files = [];
    walk(files, new Set(), directory.replace(/^\//, "").replace(/\/$/, ""));
    return files;
  }

  return pageFiles(pathname) || [];
}

for (const game of games) {
  if (!game || typeof game.id !== "string" || game.disabled) continue;
  const files = filesFor(game.url);
  if (!files.length) {
    if (sameOriginPath(game.url)) skipped.push(game.name);
    continue;
  }
  const bytes = files.reduce((total, file) => total + file.bytes, 0);
  packs.push({ gameId: game.id, name: game.name, url: game.url, bytes, files });
}

packs.sort((a, b) => a.name.localeCompare(b.name));

fs.writeFileSync(
  path.join(root, "offline-packs.json"),
  `${JSON.stringify({ version: 1, generatedAt: new Date().toISOString(), packs })}\n`,
);

const totalBytes = packs.reduce((total, pack) => total + pack.bytes, 0);
console.log(
  `Wrote offline-packs.json (${packs.length} games, ${(totalBytes / 1024 / 1024).toFixed(1)} MB total)`,
);
if (skipped.length) {
  console.log(`  not downloadable offline (redirect or remote-only): ${skipped.join(", ")}`);
}
