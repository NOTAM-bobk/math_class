import { formatLastUpdated } from "./lastUpdated";

// Small, admin-editable override for the footer credit lines. It lives in this
// browser: the site is static, so there is no server field to write to.
const SITE_META_KEY = "polytrack_site_meta";

export const DEFAULT_BUILT_BY = "SS";

export interface SiteMeta {
  // Display text for the footer's "Updated …" line.
  updatedAt: string;
  builtBy: string;
}

export function defaultSiteMeta(): SiteMeta {
  return { updatedAt: formatLastUpdated(), builtBy: DEFAULT_BUILT_BY };
}

export function loadSiteMeta(): SiteMeta {
  const fallback = defaultSiteMeta();
  try {
    const raw = localStorage.getItem(SITE_META_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as Partial<SiteMeta> | null;
    return {
      updatedAt:
        typeof parsed?.updatedAt === "string" && parsed.updatedAt.trim()
          ? parsed.updatedAt.trim()
          : fallback.updatedAt,
      builtBy:
        typeof parsed?.builtBy === "string" && parsed.builtBy.trim()
          ? parsed.builtBy.trim()
          : fallback.builtBy,
    };
  } catch {
    return fallback;
  }
}

export function saveSiteMeta(meta: SiteMeta) {
  try {
    localStorage.setItem(SITE_META_KEY, JSON.stringify(meta));
  } catch {}
}

export function clearSiteMeta(): SiteMeta {
  try {
    localStorage.removeItem(SITE_META_KEY);
  } catch {}
  return defaultSiteMeta();
}
