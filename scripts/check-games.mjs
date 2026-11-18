// Crawls every game in the catalog and records the ones that are broken, so the
// hub can hide them from the main list instead of sending visitors to a dead
// embed. A game is flagged when the URL 404s, errors out, answers with an empty
// page, or (for this site's own same-origin embeds) redirects off-site.
//
// Usage:
//   npm run check:games                     # scans the live site
//   node scripts/check-games.mjs --base=http://localhost:3006
//   node scripts/check-games.mjs --limit=20 --filter=hf-
//   node scripts/check-games.mjs --resume    # continue an interrupted scan
//
// The scan writes:
//   src/lib/autoHiddenGames.ts    generated list the catalog imports
//   scripts/game-check-report.json every result, for debugging
//   scripts/.game-check-progress.jsonl  resumable per-game results
import { build } from "esbuild";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");

const args = new Map(
  process.argv.slice(2).map((arg) => {
    const [key, ...rest] = arg.replace(/^--/, "").split("=");
    return [key, rest.length ? rest.join("=") : "true"];
  }),
);

const base = (args.get("base") || process.env.CHECK_BASE || "https://poly2.benlaunches.icu").replace(/\/+$/, "");
const concurrency = Math.max(1, Number(args.get("concurrency") || 10));
const timeoutMs = Math.max(1000, Number(args.get("timeout") || 20000));
const limit = Number(args.get("limit") || 0);
const filter = (args.get("filter") || "").toLowerCase();
const includeDisabled = args.get("include-disabled") === "true";
const resume = args.get("resume") === "true";
const outFile = path.resolve(root, args.get("out") || "src/lib/autoHiddenGames.ts");
const reportFile = path.resolve(root, args.get("report") || "scripts/game-check-report.json");
const progressFile = path.resolve(root, args.get("progress") || "scripts/.game-check-progress.jsonl");

let baseOrigin;
try {
  baseOrigin = new URL(base).origin;
} catch {
  console.error(`Invalid --base value: ${base}`);
  process.exit(1);
}

// Pull the catalog from the same source the app uses, so the scan can never
// drift from what visitors actually see.
async function collectCatalog() {
  const outfile = path.join(os.tmpdir(), `polytrack-check-catalog-${Date.now()}.mjs`);
  const result = await build({
    stdin: {
      contents:
        'import { DEFAULT_GAMES } from "@/components/GameCatalog";\nprocess.stdout.write(JSON.stringify(DEFAULT_GAMES));\n',
      resolveDir: root,
      loader: "tsx",
      sourcefile: "check-catalog-entry.tsx",
    },
    bundle: true,
    platform: "node",
    format: "esm",
    write: false,
    alias: { "@": path.join(root, "src") },
    logLevel: "silent",
  });
  fs.writeFileSync(outfile, result.outputFiles[0].text);
  try {
    const json = execFileSync(process.execPath, [outfile], {
      encoding: "utf8",
      maxBuffer: 32 * 1024 * 1024,
    });
    return JSON.parse(json);
  } finally {
    fs.rmSync(outfile, { force: true });
  }
}

const ERROR_TEXT =
  /^(404|410)\b|page not found|the page could not be found|cannot get |file not found|this page does not exist|this site can.t be reached/i;

function stripToText(html) {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&[a-z#0-9]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function readTextCapped(response, maxBytes = 262144) {
  if (!response.body) return "";
  const reader = response.body.getReader();
  const chunks = [];
  let total = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      chunks.push(Buffer.from(value));
      if (total >= maxBytes) {
        try {
          await reader.cancel();
        } catch {}
        break;
      }
    }
  } catch {}
  const buffer = Buffer.concat(chunks);
  const charset = /charset=([^;]+)/i.exec(response.headers.get("content-type") || "")?.[1]?.trim();
  try {
    return new TextDecoder(charset || "utf-8").decode(buffer);
  } catch {
    return buffer.toString("utf8");
  }
}

/**
 * Returns { reason, detail } when the game looks broken, or null when it looks
 * healthy. `url` is resolved against the site being scanned.
 */
async function testGame(game, signal) {
  let requested;
  try {
    requested = new URL(game.url, base);
  } catch {
    return { reason: "error", detail: "Invalid game URL" };
  }
  if (!/^https?:$/.test(requested.protocol)) {
    return { reason: "error", detail: `Unsupported protocol ${requested.protocol}` };
  }
  const sameOriginRequest = requested.origin === baseOrigin;

  let current = requested;
  let response;
  for (let hop = 0; hop < 4; hop += 1) {
    try {
      response = await fetch(current, {
        redirect: "manual",
        signal,
        headers: {
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
        },
      });
    } catch (error) {
      const timedOut = error && (error.name === "AbortError" || error.name === "TimeoutError");
      return {
        reason: "error",
        detail: timedOut ? `Timed out after ${Math.round(timeoutMs / 1000)}s` : `Request failed: ${error?.message || error}`,
      };
    }

    if ([301, 302, 303, 307, 308].includes(response.status)) {
      const location = response.headers.get("location");
      if (!location) return { reason: "error", detail: `HTTP ${response.status} without a Location` };
      let next;
      try {
        next = new URL(location, current);
      } catch {
        return { reason: "error", detail: `Bad redirect target: ${location}` };
      }
      if (!/^https?:$/.test(next.protocol)) {
        return { reason: "offsite", detail: `Redirects to ${next.protocol}//${next.host}` };
      }
      if (sameOriginRequest && next.origin !== baseOrigin) {
        return { reason: "offsite", detail: `Redirects off-site to ${next.host}` };
      }
      current = next;
      continue;
    }
    break;
  }

  if (!response) return { reason: "error", detail: "No response" };

  if (response.status === 404 || response.status === 410) {
    return { reason: "not-found", detail: `HTTP ${response.status}` };
  }
  if (response.status >= 400) {
    return { reason: "error", detail: `HTTP ${response.status}` };
  }

  const contentType = (response.headers.get("content-type") || "").toLowerCase();
  if (!contentType.includes("html")) {
    const length = response.headers.get("content-length");
    if (length === "0") return { reason: "blank", detail: `Empty ${contentType || "response"}` };
    try {
      await response.body?.cancel();
    } catch {}
    return null;
  }

  let html = "";
  try {
    html = await readTextCapped(response);
  } catch {
    return { reason: "error", detail: "Could not read the page" };
  }

  const title = /<title[^>]*>([\s\S]*?)<\/title>/i.exec(html)?.[1]?.replace(/\s+/g, " ").trim() || "";
  if (/^(404|410)\b|page not found|not found\b/i.test(title) && title.length < 80) {
    return { reason: "not-found", detail: `Page title: ${title}` };
  }

  const text = stripToText(html);
  if (ERROR_TEXT.test(text) && text.length < 400) {
    return { reason: "not-found", detail: text.slice(0, 90) };
  }

  const hasEmbeddedGame =
    /<(canvas|embed|object|video|iframe)\b/i.test(html) ||
    /<script[^>]+src=/i.test(html) ||
    /<script\b(?![^>]*src=)[^>]*>[\s\S]{40,}<\/script>/i.test(html);
  if (text.length < 20 && !hasEmbeddedGame) {
    return { reason: "blank", detail: `Blank page (${text.length} chars of text, no game embed)` };
  }

  return null;
}

function reasonLabel(reason) {
  switch (reason) {
    case "not-found":
      return "404 / missing page";
    case "offsite":
      return "redirects off-site";
    case "blank":
      return "loads blank";
    default:
      return "errors out";
  }
}

function tsString(value) {
  return JSON.stringify(value);
}

function writeOutputs(results) {
  const flagged = results
    .filter((entry) => entry.reason)
    .sort((a, b) => (a.reason === b.reason ? a.id.localeCompare(b.id) : a.reason.localeCompare(b.reason)));
  const checkedAt = new Date().toISOString();
  const lines = [
    "// Generated by `npm run check:games` (scripts/check-games.mjs). Do not edit by hand.",
    "// Games whose embed failed the automated check; the catalog hides these by",
    "// default and still lists them under the Hidden filter so they can be tried.",
    "",
    'export type HiddenGameReason = "blank" | "not-found" | "offsite" | "error";',
    "",
    "export interface AutoHiddenGame {",
    "  reason: HiddenGameReason;",
    "  detail: string;",
    "  checkedAt: string;",
    "}",
    "",
    `export const AUTO_HIDDEN_CHECKED_AT = ${tsString(checkedAt)};`,
    "",
    `export const AUTO_HIDDEN_BASE = ${tsString(base)};`,
    "",
    "export const AUTO_HIDDEN_GAMES: Record<string, AutoHiddenGame> = {",
  ];
  for (const entry of flagged) {
    lines.push(
      `  ${tsString(entry.id)}: { reason: ${tsString(entry.reason)}, detail: ${tsString(
        `${reasonLabel(entry.reason)} — ${entry.detail}`,
      )}, checkedAt: ${tsString(checkedAt)} },`,
    );
  }
  lines.push("};", "");
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, lines.join("\n"));

  fs.mkdirSync(path.dirname(reportFile), { recursive: true });
  fs.writeFileSync(
    reportFile,
    `${JSON.stringify(
      {
        base,
        checkedAt,
        total: results.length,
        healthy: results.filter((entry) => !entry.reason).length,
        flagged: flagged.length,
        results,
      },
      null,
      2,
    )}\n`,
  );

  const byReason = flagged.reduce((acc, entry) => {
    acc[entry.reason] = (acc[entry.reason] || 0) + 1;
    return acc;
  }, {});
  console.log(`Scanned ${results.length} games against ${base}`);
  console.log(`  healthy: ${results.length - flagged.length}`);
  for (const [reason, count] of Object.entries(byReason)) {
    console.log(`  ${reasonLabel(reason)}: ${count}`);
  }
  console.log(`Wrote ${path.relative(root, outFile)} (${flagged.length} hidden)`);
  console.log(`Report: ${path.relative(root, reportFile)}`);
}

async function main() {
  const catalog = await collectCatalog();
  let games = catalog.filter((game) => includeDisabled || !game.disabled);
  if (filter) {
    games = games.filter(
      (game) =>
        game.id.toLowerCase().includes(filter) ||
        game.name.toLowerCase().includes(filter) ||
        game.url.toLowerCase().includes(filter),
    );
  }
  if (limit > 0) games = games.slice(0, limit);
  if (games.length === 0) {
    console.error("No games matched.");
    process.exit(1);
  }

  const done = new Map();
  if (resume && fs.existsSync(progressFile)) {
    for (const line of fs.readFileSync(progressFile, "utf8").split("\n")) {
      if (!line.trim()) continue;
      try {
        const entry = JSON.parse(line);
        if (entry && entry.id) done.set(entry.id, entry);
      } catch {}
    }
    console.log(`Resuming with ${done.size} saved results.`);
  } else {
    fs.mkdirSync(path.dirname(progressFile), { recursive: true });
    fs.writeFileSync(progressFile, "");
  }

  const queue = games.filter((game) => !done.has(game.id));
  console.log(`Checking ${queue.length} games (${concurrency} at a time, ${Math.round(timeoutMs / 1000)}s timeout)...`);

  const progress = fs.createWriteStream(progressFile, { flags: "a" });
  let completed = 0;
  let index = 0;

  async function worker() {
    while (index < queue.length) {
      const game = queue[index++];
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);
      const startedAt = Date.now();
      let outcome = null;
      try {
        outcome = await testGame(game, controller.signal);
      } catch (error) {
        outcome = { reason: "error", detail: `Checker failed: ${error?.message || error}` };
      } finally {
        clearTimeout(timer);
      }
      const entry = {
        id: game.id,
        name: game.name,
        url: game.url,
        reason: outcome?.reason || null,
        detail: outcome?.detail || "",
        ms: Date.now() - startedAt,
      };
      done.set(entry.id, entry);
      progress.write(`${JSON.stringify(entry)}\n`);
      completed += 1;
      if (completed % 25 === 0 || completed === queue.length) {
        console.log(`  ${completed}/${queue.length}`);
      }
    }
  }

  await Promise.all(Array.from({ length: Math.min(concurrency, queue.length) }, () => worker()));
  progress.end();

  // Keep the order of the catalog in the report.
  const results = catalog
    .filter((game) => done.has(game.id))
    .map((game) => done.get(game.id));
  writeOutputs(results);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
