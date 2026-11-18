// A hard reset throws away everything this site kept in the browser — localStorage,
// sessionStorage, cookies, the downloaded offline copy, IndexedDB and the service
// worker — so the next load fetches the newest build with default settings.

function clearCookies() {
  try {
    for (const pair of document.cookie.split("; ")) {
      const name = pair.split("=")[0];
      if (!name) continue;
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`;
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${window.location.pathname}; SameSite=Lax`;
    }
  } catch {
    // Cookies can be blocked; the rest of the reset still runs.
  }
}

async function clearCaches() {
  if (typeof caches === "undefined") return;
  try {
    const names = await caches.keys();
    await Promise.all(names.map((name) => caches.delete(name)));
  } catch {
    // Cache storage may be unavailable in private modes.
  }
}

async function clearDatabases() {
  if (typeof indexedDB === "undefined") return;
  try {
    if (!indexedDB.databases) return;
    const databases = await indexedDB.databases();
    await Promise.all(
      databases.map((database) => {
        if (!database.name) return Promise.resolve();
        return new Promise<void>((resolve) => {
          const request = indexedDB.deleteDatabase(database.name as string);
          // A blocked delete must not keep the reset from finishing.
          const timer = window.setTimeout(resolve, 1500);
          request.onsuccess = request.onerror = request.onblocked = () => {
            window.clearTimeout(timer);
            resolve();
          };
        });
      })
    );
  } catch {
    // IndexedDB is optional; skip it when the browser refuses.
  }
}

async function clearServiceWorkers() {
  if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;
  try {
    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(registrations.map((registration) => registration.unregister()));
  } catch {
    // Unregistering is best effort.
  }
}

export async function hardResetSite(): Promise<void> {
  try {
    localStorage.clear();
  } catch {}
  try {
    sessionStorage.clear();
  } catch {}
  clearCookies();
  await clearCaches();
  await clearDatabases();
  await clearServiceWorkers();
  // A hard navigation past the reload prompt so nothing cached in this tab survives.
  window.location.replace(`/?reset=${Date.now()}`);
}
