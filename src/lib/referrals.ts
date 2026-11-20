// Referral links shown in Settings > Referrals.
//
// They live in referrals.json at the site root, not in the bundle, so links can
// be added or edited without rebuilding the app.

export interface ReferralLink {
  id: string;
  title: string;
  description: string;
  url: string;
  badge: string;
  cta: string;
}

export const REFERRALS_URL = "/referrals.json";

let referralsPromise: Promise<ReferralLink[]> | null = null;

function readText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function isLinkUrl(url: string): boolean {
  // Only normal links: no javascript:, data: or other scheme tricks.
  return /^https?:\/\//i.test(url) || url.startsWith("/");
}

function parseReferrals(raw: unknown): ReferralLink[] {
  const list =
    raw && typeof raw === "object" ? (raw as { referrals?: unknown }).referrals : null;
  if (!Array.isArray(list)) return [];

  const seen = new Set<string>();
  const referrals: ReferralLink[] = [];

  for (const item of list) {
    if (!item || typeof item !== "object") continue;
    const entry = item as Record<string, unknown>;
    const id = readText(entry.id);
    const title = readText(entry.title);
    const url = readText(entry.url);

    if (!id || !title || !isLinkUrl(url) || seen.has(id)) continue;
    seen.add(id);

    referrals.push({
      id,
      title,
      url,
      description: readText(entry.description),
      badge: readText(entry.badge),
      cta: readText(entry.cta),
    });
  }

  return referrals;
}

/** Loads referrals.json once per page; a missing file simply means no cards. */
export function loadReferrals(): Promise<ReferralLink[]> {
  if (!referralsPromise) {
    referralsPromise = (async () => {
      try {
        const response = await fetch(REFERRALS_URL, {
          cache: "no-store",
          headers: { Accept: "application/json" },
        });
        if (!response.ok) return [];
        return parseReferrals(await response.json());
      } catch {
        return [];
      }
    })();
  }
  return referralsPromise;
}
