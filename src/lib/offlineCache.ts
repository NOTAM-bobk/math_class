// Offline copy of the hub, controlled by the Settings dialog.
//
// Files are downloaded and stored from the page, not from inside the service
// worker: the catalog is large, and a visible tab is not stopped by the
// worker's event lifetime limits. The root worker only serves what is stored.
//
// The root service worker already belongs to the notification ad network, so
// the offline fetch handler lives in that same /sw.js instead of registering a
// second worker on the root scope.

export interface OfflineSchedule {
  /** Set once the visitor has downloaded a copy on this device. */
  requested: boolean;
  /** Use the downloaded copy first between startTime and endTime. */
  scheduleEnabled: boolean;
  startTime: string;
  endTime: string;
}

export interface OfflineProgress {
  done: number;
  total: number;
  bytes: number;
  totalBytes: number;
  failed: number;
  url?: string;
}

export interface OfflineStatus {
  cachedFiles: number;
  bytes: number;
  cachedAt: string | null;
  failed: number;
}

interface ManifestEntry {
  url: string;
  bytes?: number;
}

const STORAGE_KEY = "polytrack_offline_schedule";
const OFFLINE_MANIFEST_URL = "/offline-manifest.json";
const OFFLINE_STATUS_URL = "/__polytrack_offline_status__";
const OFFLINE_CONCURRENCY = 4;
export const OFFLINE_CACHE_NAME = "polytrack-offline-v1";
export const OFFLINE_META_CACHE_NAME = "polytrack-offline-meta-v1";

const DEFAULT_SCHEDULE: OfflineSchedule = {
  requested: false,
  scheduleEnabled: false,
  startTime: "08:00",
  endTime: "15:00",
};

function cleanTime(value: unknown, fallback: string): string {
  return typeof value === "string" && /^([01]\d|2[0-3]):[0-5]\d$/.test(value) ? value : fallback;
}

export function offlineSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    "serviceWorker" in navigator &&
    "caches" in window
  );
}

export function loadOfflineSchedule(): OfflineSchedule {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_SCHEDULE };
    const parsed = JSON.parse(raw);
    return {
      requested: !!parsed?.requested,
      scheduleEnabled: !!parsed?.scheduleEnabled,
      startTime: cleanTime(parsed?.startTime, DEFAULT_SCHEDULE.startTime),
      endTime: cleanTime(parsed?.endTime, DEFAULT_SCHEDULE.endTime),
    };
  } catch {
    return { ...DEFAULT_SCHEDULE };
  }
}

export function saveOfflineSchedule(patch: Partial<OfflineSchedule>): OfflineSchedule {
  const next = { ...loadOfflineSchedule(), ...patch };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Private mode can block storage; the worker still keeps its last config.
  }
  void syncOfflineSchedule(next);
  return next;
}

function withTimeout<T>(promise: Promise<T>, milliseconds: number): Promise<T | null> {
  return Promise.race([
    promise,
    new Promise<null>((resolve) => window.setTimeout(() => resolve(null), milliseconds)),
  ]);
}

function waitForActivation(worker: ServiceWorker, timeoutMs: number): Promise<void> {
  return new Promise((resolve) => {
    const finish = () => {
      window.clearTimeout(timer);
      worker.removeEventListener("statechange", check);
      resolve();
    };
    const check = () => {
      if (worker.state === "activated" || worker.state === "redundant") finish();
    };
    const timer = window.setTimeout(finish, timeoutMs);
    worker.addEventListener("statechange", check);
    check();
  });
}

async function ensureWorker(): Promise<ServiceWorker | null> {
  if (!offlineSupported()) return null;
  try {
    const registration = await withTimeout(
      navigator.serviceWorker.register("/sw.js", { scope: "/" }),
      10000,
    );
    if (!registration) return null;

    // Immediately trigger an update check to pull the newest worker build
    registration.update().catch(() => {});

    // An older worker may still be active while this deployment's script
    // installs. Wait for the update before sending it the schedule.
    const pending = registration.installing || registration.waiting;
    if (pending) await waitForActivation(pending, 10000);

    const ready = await withTimeout(navigator.serviceWorker.ready, 10000);
    return ready?.active ?? registration.active ?? null;
  } catch {
    return null;
  }
}

async function syncOfflineSchedule(schedule: OfflineSchedule): Promise<void> {
  if (!schedule.requested && !schedule.scheduleEnabled) return;
  const worker = await ensureWorker();
  worker?.postMessage({ type: "OFFLINE_CONFIG", config: schedule });
}

/** Re-sends the saved schedule after a reload so the worker knows the window. */
export function initOfflineMode(): void {
  const schedule = loadOfflineSchedule();
  if (!schedule.requested && !schedule.scheduleEnabled) return;
  void syncOfflineSchedule(schedule);
}

function isCacheable(response: Response): boolean {
  return !!response && response.status !== 206 && (response.ok || response.type === "opaque");
}

function isRemote(url: string): boolean {
  return new URL(url, window.location.origin).origin !== window.location.origin;
}

async function fetchForCache(url: string): Promise<Response> {
  const remote = isRemote(url);
  const options: RequestInit = remote
    ? { mode: "cors", credentials: "omit", cache: "reload" }
    : { cache: "reload", credentials: "same-origin" };
  try {
    return await fetch(url, options);
  } catch (error) {
    if (!remote) throw error;
    // Opaque fallback keeps CDN scripts cacheable when CORS is not offered.
    return await fetch(url, { mode: "no-cors", credentials: "omit", cache: "reload" });
  }
}

function fontUrlsIn(css: string): string[] {
  const urls: string[] = [];
  const pattern = /url\((['"]?)(https:\/\/fonts\.gstatic\.com\/[^)'"]+)\1\)/g;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(css)) !== null) urls.push(match[2]);
  return urls;
}

async function readStoredStatus(): Promise<{ bytes?: number; cachedAt?: string | null; failed?: number }> {
  try {
    const meta = await caches.open(OFFLINE_META_CACHE_NAME);
    const response = await meta.match(OFFLINE_STATUS_URL);
    if (!response) return {};
    return await response.json();
  } catch {
    return {};
  }
}

async function writeStoredStatus(status: { bytes: number; cachedAt: string; failed: number }): Promise<void> {
  try {
    const meta = await caches.open(OFFLINE_META_CACHE_NAME);
    await meta.put(
      OFFLINE_STATUS_URL,
      new Response(JSON.stringify(status), { headers: { "Content-Type": "application/json" } }),
    );
  } catch {
    // Status is only for display; a failed write does not affect the cached files.
  }
}

export async function getOfflineStatus(): Promise<OfflineStatus | null> {
  if (!offlineSupported()) return null;
  try {
    const cache = await caches.open(OFFLINE_CACHE_NAME);
    const keys = await cache.keys();
    const stored = await readStoredStatus();
    return {
      cachedFiles: keys.length,
      bytes: stored.bytes || 0,
      cachedAt: stored.cachedAt || null,
      failed: stored.failed || 0,
    };
  } catch {
    return null;
  }
}

/**
 * Downloads every file in offline-manifest.json into the shared cache. Progress
 * is reported per file, and failed files are counted instead of aborting the
 * whole copy.
 */
export async function downloadOfflineSite(
  onProgress?: (progress: OfflineProgress) => void,
): Promise<OfflineStatus> {
  if (!offlineSupported()) {
    throw new Error("This browser cannot store an offline copy.");
  }

  // The copy is useless without the worker that serves it, so make sure it is
  // installed before spending time on the download.
  const worker = await ensureWorker();
  if (!worker) {
    throw new Error("The offline worker could not start. Reload the page and try again.");
  }

  const manifestResponse = await fetch(OFFLINE_MANIFEST_URL, { cache: "no-store" });
  if (!manifestResponse.ok) throw new Error("The offline file list is missing.");
  const manifest = await manifestResponse.json();
  const entries: ManifestEntry[] = Array.isArray(manifest?.files) ? manifest.files : [];
  if (entries.length === 0) throw new Error("The offline file list is empty.");

  const cache = await caches.open(OFFLINE_CACHE_NAME);
  const queued = new Set(entries.map((entry) => entry.url));
  const extraUrls: string[] = [];
  const totalBytes = Number(manifest.totalBytes) || 0;
  let done = 0;
  let failed = 0;
  let bytes = 0;
  let nextIndex = 0;

  const report = (url?: string) => {
    onProgress?.({
      done,
      total: entries.length + extraUrls.length,
      bytes,
      totalBytes,
      failed,
      url,
    });
  };

  const cacheEntry = async (entry: ManifestEntry) => {
    try {
      const response = await fetchForCache(entry.url);
      if (!isCacheable(response)) throw new Error(`HTTP ${response.status}`);

      if (/fonts\.googleapis\.com/.test(entry.url)) {
        const contentType = response.headers.get("content-type") || "";
        if (contentType.includes("text/css")) {
          for (const fontUrl of fontUrlsIn(await response.clone().text())) {
            if (!queued.has(fontUrl)) {
              queued.add(fontUrl);
              extraUrls.push(fontUrl);
            }
          }
        }
      }

      await cache.put(new Request(new URL(entry.url, window.location.origin).toString()), response);
      done += 1;
      bytes += Number(entry.bytes) || 0;
    } catch {
      failed += 1;
    }
    report(entry.url);
  };

  const runQueue = async () => {
    while (nextIndex < entries.length) {
      const entry = entries[nextIndex];
      nextIndex += 1;
      await cacheEntry(entry);
    }
  };

  report();
  await Promise.all(Array.from({ length: OFFLINE_CONCURRENCY }, runQueue));

  // The font stylesheet points at hashed font files; grab those too so the
  // offline hub keeps its typography.
  for (const url of extraUrls) {
    await cacheEntry({ url, bytes: 0 });
  }

  await writeStoredStatus({ bytes, cachedAt: new Date().toISOString(), failed });
  saveOfflineSchedule({ requested: true });
  return (await getOfflineStatus()) ?? { cachedFiles: done, bytes, cachedAt: new Date().toISOString(), failed };
}

export async function deleteOfflineCache(): Promise<void> {
  if (typeof caches === "undefined") return;
  await caches.delete(OFFLINE_CACHE_NAME);
  const meta = await caches.open(OFFLINE_META_CACHE_NAME);
  await meta.delete(OFFLINE_STATUS_URL);
}

export function formatBytes(bytes: number): string {
  if (!bytes || bytes <= 0) return "0 MB";
  const mb = bytes / 1024 / 1024;
  if (mb >= 1024) return `${(mb / 1024).toFixed(1)} GB`;
  if (mb >= 1) return `${mb.toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}
