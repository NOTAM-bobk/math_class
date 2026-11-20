import { SITE_VERSION } from "./changelog";
import { LAST_UPDATED_ISO } from "./buildInfo";

export interface CheckUpdateResult {
  hasUpdate: boolean;
  currentVersion: string;
  latestVersion: string;
  currentBuildIso: string;
  latestBuildIso?: string;
  source: "service-worker" | "version-endpoint" | "manifest" | "none";
  error?: string;
}

type UpdateListener = (result: CheckUpdateResult) => void;
const listeners = new Set<UpdateListener>();

export function subscribeToUpdateCheck(listener: UpdateListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function notifyListeners(result: CheckUpdateResult) {
  for (const listener of listeners) {
    try {
      listener(result);
    } catch {}
  }
}

/**
 * Checks whether a newer version or build of the site is available.
 * Queries active service worker registrations, the /version.json endpoint,
 * and falls back to /offline-manifest.json.
 */
export async function checkForUpdate(): Promise<CheckUpdateResult> {
  let hasUpdate = false;
  let latestVersion = SITE_VERSION;
  let latestBuildIso = LAST_UPDATED_ISO;
  let source: CheckUpdateResult["source"] = "none";
  let error: string | undefined;

  // 1. Service Worker check
  if (typeof navigator !== "undefined" && "serviceWorker" in navigator) {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const reg of registrations) {
        if (reg.waiting || reg.installing) {
          hasUpdate = true;
          source = "service-worker";
        }
        await reg.update().catch(() => {});
        if (reg.waiting || reg.installing) {
          hasUpdate = true;
          source = "service-worker";
        }
      }
    } catch (swError) {
      console.warn("Service worker update check error:", swError);
    }
  }

  // 2. Fetch server version metadata
  try {
    const res = await fetch(`/version.json?t=${Date.now()}`, {
      cache: "no-store",
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
      },
    });
    if (res.ok) {
      const data = await res.json();
      if (data && typeof data === "object") {
        const sVer = String(data.version || "").trim();
        const sIso = String(data.buildIso || "").trim();
        if (sVer && sVer !== SITE_VERSION) {
          hasUpdate = true;
          latestVersion = sVer;
          source = "version-endpoint";
        }
        if (sIso) {
          latestBuildIso = sIso;
          const sTime = new Date(sIso).getTime();
          const cTime = new Date(LAST_UPDATED_ISO).getTime();
          if (!Number.isNaN(sTime) && !Number.isNaN(cTime) && sTime > cTime + 1000) {
            hasUpdate = true;
            source = "version-endpoint";
          }
        }
      }
    }
  } catch {
    // Fallback: /api/version
    try {
      const res2 = await fetch(`/api/version?t=${Date.now()}`, { cache: "no-store" });
      if (res2.ok) {
        const data2 = await res2.json();
        if (data2?.version && data2.version !== SITE_VERSION) {
          hasUpdate = true;
          latestVersion = data2.version;
          source = "version-endpoint";
        }
      }
    } catch {}
  }

  // 3. Fallback: /offline-manifest.json
  if (!hasUpdate) {
    try {
      const mRes = await fetch(`/offline-manifest.json?t=${Date.now()}`, { cache: "no-store" });
      if (mRes.ok) {
        const manifest = await mRes.json();
        if (manifest?.generatedAt) {
          const mTime = new Date(manifest.generatedAt).getTime();
          const cTime = new Date(LAST_UPDATED_ISO).getTime();
          if (!Number.isNaN(mTime) && !Number.isNaN(cTime) && mTime > cTime + 1000) {
            hasUpdate = true;
            latestBuildIso = manifest.generatedAt;
            source = "manifest";
          }
        }
      }
    } catch {}
  }

  // 4. Offline notice if disconnected and not found
  if (typeof navigator !== "undefined" && !navigator.onLine && !hasUpdate) {
    error = "You are currently offline. Connect to the internet to check for updates.";
  }

  const result: CheckUpdateResult = {
    hasUpdate,
    currentVersion: SITE_VERSION,
    latestVersion: hasUpdate ? latestVersion : SITE_VERSION,
    currentBuildIso: LAST_UPDATED_ISO,
    latestBuildIso,
    source,
    error,
  };

  notifyListeners(result);
  return result;
}

/**
 * Safely applies the latest update:
 * 1. Signals any waiting service worker to skipWaiting.
 * 2. Purges stale shell/bundle cache entries from CacheStorage so fresh bundles load.
 * 3. NEVER clears saves, user settings, favorites, custom tracks, or IndexedDB.
 * 4. Reloads the window with a cache-busting timestamp to pull the latest HTML.
 */
export async function applyUpdate(): Promise<void> {
  // 1. Tell all service workers to take control immediately
  if (typeof navigator !== "undefined" && "serviceWorker" in navigator) {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const reg of registrations) {
        if (reg.waiting) {
          reg.waiting.postMessage({ type: "SKIP_WAITING" });
        }
      }
    } catch {}
  }

  // 2. Remove cached index/bundle entries so network fresh files load
  if (typeof caches !== "undefined") {
    try {
      const keys = await caches.keys();
      for (const key of keys) {
        if (key.startsWith("polytrack-offline-") && !key.includes("meta") && !key.includes("pack")) {
          const c = await caches.open(key);
          await Promise.all([
            c.delete("/"),
            c.delete("/index.html"),
            c.delete("/dist/home.bundle.js"),
            c.delete("/home.bundle.js"),
            c.delete("/dist/styles.css"),
          ]);
        }
      }
    } catch {}
  }

  // 3. Reload with fresh query to bypass browser document HTTP cache
  const url = new URL(window.location.href);
  url.searchParams.set("updated", String(Date.now()));
  window.location.replace(url.toString());
}
