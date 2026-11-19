// Per-game offline packs.
//
// A pack is the set of same-origin files one game needs to run (built into
// offline-packs.json by scripts/export-offline-packs.mjs). Settings downloads a
// single pack into its own cache, so a visitor can keep three games instead of
// the whole site. The catalog only offers the Offline filter while the browser
// reports no connection.

import { ensureWorker, formatBytes } from "./offlineCache";

export interface GamePackFile {
  url: string;
  bytes: number;
}

export interface GamePack {
  gameId: string;
  name: string;
  url: string;
  bytes: number;
  files: GamePackFile[];
}

export interface GamePackProgress {
  done: number;
  total: number;
  bytes: number;
  failed: number;
  name: string;
}

interface DownloadedPack {
  name: string;
  bytes: number;
  files: string[];
  downloadedAt: number;
}

export const GAME_PACK_CACHE = "polytrack-game-packs-v1";
export const PACKS_URL = "/offline-packs.json";
const STORAGE_KEY = "polytrack_game_packs";
const PACKS_CACHE_KEY = "polytrack_offline_packs_cache";
const CONCURRENCY = 4;

let packsPromise: Promise<GamePack[]> | null = null;
const listeners = new Set<(ids: string[]) => void>();

function readDownloaded(): Record<string, DownloadedPack> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? (parsed as Record<string, DownloadedPack>) : {};
  } catch {
    return {};
  }
}

function writeDownloaded(packs: Record<string, DownloadedPack>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(packs));
  } catch {}
  const ids = Object.keys(packs);
  listeners.forEach((listener) => {
    try {
      listener(ids);
    } catch {}
  });
}

export function loadDownloadedPackIds(): string[] {
  return Object.keys(readDownloaded());
}

export function loadDownloadedPacks(): (DownloadedPack & { gameId: string })[] {
  return Object.entries(readDownloaded()).map(([gameId, pack]) => ({ gameId, ...pack }));
}

export function onDownloadedPacksChange(listener: (ids: string[]) => void): () => void {
  listeners.add(listener);
  const handleStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) listener(loadDownloadedPackIds());
  };
  window.addEventListener("storage", handleStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", handleStorage);
  };
}

export function isOfflineNow(): boolean {
  return typeof navigator !== "undefined" && !navigator.onLine;
}

/**
 * navigator.onLine only reports whether a network interface exists, which is
 * true on a captive portal and stays true in some embedded browsers even with
 * no traffic. Ask the site itself before deciding the Offline filter applies.
 * Any response (even an error status) means the connection works.
 */
export async function detectOffline(): Promise<boolean> {
  if (typeof navigator === "undefined") return false;
  if (!navigator.onLine) return true;
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), 2500);
  try {
    await fetch("/api/flags", { method: "HEAD", cache: "no-store", signal: controller.signal });
    return false;
  } catch {
    return true;
  } finally {
    window.clearTimeout(timer);
  }
}

/** Loads the pack index once per page, with a stored copy for offline browsing. */
export function loadGamePacks(): Promise<GamePack[]> {
  if (!packsPromise) {
    packsPromise = (async () => {
      try {
        const response = await fetch(PACKS_URL, { headers: { Accept: "application/json" } });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        const packs = Array.isArray(data?.packs) ? (data.packs as GamePack[]) : [];
        try {
          localStorage.setItem(PACKS_CACHE_KEY, JSON.stringify(packs));
        } catch {}
        return packs;
      } catch (error) {
        try {
          const raw = localStorage.getItem(PACKS_CACHE_KEY);
          const parsed = raw ? JSON.parse(raw) : null;
          if (Array.isArray(parsed)) return parsed as GamePack[];
        } catch {}
        throw error;
      }
    })();
  }
  return packsPromise;
}

export function formatPackSize(bytes: number): string {
  return formatBytes(bytes);
}

// A downloaded pack is only usable if the hub shell itself opens offline, so
// the worker is registered and the current scripts are pulled through it once.
async function primeHubShell(): Promise<void> {
  const urls = new Set(["/", "/index.html", "/catalog.json", "/offline-packs.json", "/manifest.json"]);
  try {
    for (const entry of performance.getEntriesByType("resource") as PerformanceResourceTiming[]) {
      const url = new URL(entry.name, window.location.href);
      if (url.origin !== window.location.origin) continue;
      if (!/\.(js|css|json|svg|png|webp)$/.test(url.pathname)) continue;
      urls.add(`${url.pathname}${url.search}`);
    }
  } catch {
    // Resource timing can be unavailable; the fixed shell files still get cached.
  }
  await Promise.all(
    Array.from(urls).map((url) => fetch(url, { cache: "reload", credentials: "same-origin" }).catch(() => {}))
  );
}

async function cacheFile(file: GamePackFile): Promise<{ ok: boolean; bytes: number }> {
  try {
    // The marker header tells the service worker to pass this through without
    // also storing it in the full offline copy.
    const response = await fetch(file.url, {
      cache: "reload",
      credentials: "same-origin",
      headers: { "X-Polytrack-Pack": "1" },
    });
    if (!response.ok || response.status === 206) throw new Error(`HTTP ${response.status}`);
    const cache = await caches.open(GAME_PACK_CACHE);
    await cache.put(new Request(new URL(file.url, window.location.origin).toString()), response);
    return { ok: true, bytes: Number(file.bytes) || 0 };
  } catch {
    return { ok: false, bytes: 0 };
  }
}

/**
 * Downloads one game's files into the pack cache and records it as available
 * offline. Individual files that fail are counted, not fatal, so one missing
 * asset does not lose the whole pack.
 */
export async function downloadGamePack(
  pack: GamePack,
  onProgress?: (progress: GamePackProgress) => void,
): Promise<GamePackProgress> {
  if (typeof caches === "undefined") {
    throw new Error("This browser cannot store offline game packs.");
  }
  if (!pack.files.length) {
    throw new Error("This game has no downloadable files yet.");
  }

  // Without the service worker nothing serves these files when offline.
  const serviceWorker = await ensureWorker();
  if (!serviceWorker) {
    throw new Error("The offline worker could not start. Reload the page and try again.");
  }
  await primeHubShell();

  let done = 0;
  let failed = 0;
  let bytes = 0;
  let index = 0;
  const total = pack.files.length;

  const report = () =>
    onProgress?.({ done, total, bytes, failed, name: pack.name });

  const worker = async () => {
    while (index < total) {
      const file = pack.files[index];
      index += 1;
      const result = await cacheFile(file);
      done += 1;
      if (result.ok) bytes += result.bytes;
      else failed += 1;
      report();
    }
  };

  report();
  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, total) }, worker));

  if (done === failed) {
    throw new Error(`None of the files for ${pack.name} could be downloaded.`);
  }

  const downloaded = readDownloaded();
  downloaded[pack.gameId] = {
    name: pack.name,
    bytes,
    files: pack.files.map((file) => file.url),
    downloadedAt: Date.now(),
  };
  writeDownloaded(downloaded);
  report();
  return { done, total, bytes, failed, name: pack.name };
}

/** Removes one game's files from the cache and forgets it as downloaded. */
export async function deleteGamePack(gameId: string): Promise<void> {
  const downloaded = readDownloaded();
  const pack = downloaded[gameId];
  if (pack && typeof caches !== "undefined") {
    // Shared files (the Flash runtime, for example) stay while another pack
    // still needs them.
    const keep = new Set(
      Object.entries(downloaded)
        .filter(([id]) => id !== gameId)
        .flatMap(([, other]) => other.files),
    );
    const cache = await caches.open(GAME_PACK_CACHE);
    await Promise.all(
      pack.files
        .filter((url) => !keep.has(url))
        .map((url) => cache.delete(new URL(url, window.location.origin).toString())),
    );
  }
  delete downloaded[gameId];
  writeDownloaded(downloaded);
}

/** Deletes every downloaded pack in one go. */
export async function deleteAllGamePacks(): Promise<void> {
  if (typeof caches !== "undefined") await caches.delete(GAME_PACK_CACHE);
  writeDownloaded({});
}
