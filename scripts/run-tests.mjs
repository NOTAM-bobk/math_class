// Zero-dependency test runner.
//
// The hub has no general test toolchain and no framework dev server, so tests
// are TypeScript files next to the modules they cover. esbuild (already a
// devDependency for the client bundle) compiles them into .test-build/, and
// node --test runs each built file in its own process, which keeps the
// modules' in-memory caches from leaking between test files.
//
// Usage:
//   npm test                 # every *.test.ts under src/ and test/
//   node scripts/run-tests.mjs src/lib/streak.test.ts
import { build } from "esbuild";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// fileURLToPath, not import.meta.dirname: the README still supports Node 18.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, ".test-build");
const SEARCH_DIRS = ["src", "test"];
const SKIP_DIRS = new Set(["node_modules", ".test-build", ".git"]);
const TEST_FILE = /\.test\.(ts|tsx|mts|js|mjs)$/;

function findTests(dir) {
  if (!fs.existsSync(dir)) return [];
  const found = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) found.push(...findTests(full));
    else if (TEST_FILE.test(entry.name)) found.push(full);
  }
  return found;
}

const requested = process.argv.slice(2).map((arg) => path.resolve(root, arg));
const testFiles = (requested.length ? requested : SEARCH_DIRS.flatMap((dir) => findTests(path.join(root, dir)))).sort();

if (!testFiles.length) {
  console.error("run-tests: no test files found (looked under src/ and test/)");
  process.exit(1);
}

fs.rmSync(outDir, { recursive: true, force: true });

const built = [];
const buildFailures = [];
for (const file of testFiles) {
  const name = path
    .relative(root, file)
    .replace(/\.(ts|tsx|mts|js|mjs)$/, "")
    .replace(/[\\/]/g, "--");
  const outfile = path.join(outDir, `${name}.mjs`);
  try {
    await build({
      entryPoints: [file],
      outfile,
      bundle: true,
      platform: "node",
      format: "esm",
      target: "node18",
      jsx: "automatic",
      alias: { "@": path.join(root, "src") },
      define: { "process.env.NODE_ENV": '"test"' },
      logLevel: "warning",
    });
    built.push(outfile);
  } catch (error) {
    // Keep going so every broken test file is reported in one run, not one per fix.
    buildFailures.push(`${path.relative(root, file)}: ${error.message}`);
  }
}

if (buildFailures.length) {
  console.error(`run-tests: ${buildFailures.length} test file(s) failed to compile\n`);
  for (const failure of buildFailures) console.error(failure, "\n");
  process.exit(1);
}

// Pass the built files explicitly: a directory argument is not portable across
// the Node versions this project's hosts run.
const result = spawnSync(process.execPath, ["--test", ...built], {
  stdio: "inherit",
  cwd: root,
});

process.exit(result.status ?? 1);
