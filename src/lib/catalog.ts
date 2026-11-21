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

function isGameItem(value: unknown): value is GameItem {
  return (
    !!value &&
    typeof value === "object" &&
    typeof (value as { id?: unknown }).id === "string"
  );
}

/** A catalogue payload is only usable when every entry is a game with an id. */
export function isGameList(value: unknown): value is GameItem[] {
  return Array.isArray(value) && value.every(isGameItem);
}

function readCachedCatalog(): GameItem[] {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    // The cache is written by older builds and can be edited by hand, so it is
    // filtered instead of trusted: a stray entry must not reach the catalog.
    return Array.isArray(parsed) ? parsed.filter(isGameItem) : [];
  } catch {
    return [];
  }
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
