// Runtime catalog loading.
//
// The list lives in catalog.json (built from src/data/*), not in the bundle, so
// the hub shell can paint before the games data arrives. The last good copy is
// kept in localStorage so a device that has already visited can still browse
// and open downloaded games with no connection at all.

import type { GameItem } from "@/data/gameItem";

export const CATALOG_URL = "/catalog.json";
const CACHE_KEY = "polytrack_catalog_cache";

let catalogPromise: Promise<GameItem[]> | null = null;

function readCachedCatalog(): GameItem[] {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as GameItem[]) : [];
  } catch {
    return [];
  }
}

function isGameList(value: unknown): value is GameItem[] {
  return Array.isArray(value) && value.every((item) => !!item && typeof item.id === "string");
}

/** Loads the catalog once per page; later callers share the same promise. */
export function loadCatalog(): Promise<GameItem[]> {
  if (!catalogPromise) {
    catalogPromise = (async () => {
      try {
        const response = await fetch(CATALOG_URL, { headers: { Accept: "application/json" } });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        if (!isGameList(data)) throw new Error("Malformed catalog");
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify(data));
        } catch {
          // The catalog still works this visit when storage is full or blocked.
        }
        return data;
      } catch (error) {
        const cached = readCachedCatalog();
        if (cached.length) return cached;
        throw error;
      }
    })();
  }
  return catalogPromise;
}

/** The last catalog this device saw, without touching the network. */
export function cachedCatalog(): GameItem[] {
  return readCachedCatalog();
}
