// Browser side of Cloudflare Turnstile: fetch the public site key, load the
// widget script once, and remember that this tab already passed verification.
const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
const VERIFIED_KEY = "polytrack_chat_verified_at";
const VERIFIED_TTL_MS = 30 * 60 * 1000;

type TurnstileApi = {
  render: (element: HTMLElement, options: Record<string, unknown>) => string;
  remove: (widgetId: string) => void;
  reset: (widgetId?: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

let siteKeyPromise: Promise<string | null> | null = null;
let scriptPromise: Promise<void> | null = null;

/** The site key comes from a server route so the bundle stays environment-free. */
export function fetchTurnstileSiteKey(): Promise<string | null> {
  if (!siteKeyPromise) {
    siteKeyPromise = fetch("/api/turnstile", { headers: { Accept: "application/json" } })
      .then(async (response) => {
        if (!response.ok) return null;
        const data = await response.json().catch(() => ({}));
        return typeof data.siteKey === "string" && data.siteKey ? data.siteKey : null;
      })
      .catch(() => null);
  }
  return siteKeyPromise;
}

export function loadTurnstileScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.turnstile) return Promise.resolve();
  if (!scriptPromise) {
    scriptPromise = new Promise<void>((resolve, reject) => {
      const existing = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT_SRC}"]`);
      const script = existing ?? document.createElement("script");
      script.addEventListener("load", () => (window.turnstile ? resolve() : reject(new Error("Turnstile did not load"))), {
        once: true,
      });
      script.addEventListener("error", () => reject(new Error("Turnstile is unavailable")), { once: true });
      if (!existing) {
        script.src = SCRIPT_SRC;
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
      }
    }).catch((error) => {
      scriptPromise = null;
      throw error;
    });
  }
  return scriptPromise;
}

/** Verification lasts for this browser tab, so the challenge is not repeated per message. */
export function isChatVerified(): boolean {
  try {
    const stamp = Number(sessionStorage.getItem(VERIFIED_KEY) || 0);
    return stamp > 0 && Date.now() - stamp < VERIFIED_TTL_MS;
  } catch {
    return false;
  }
}

export function markChatVerified(): void {
  try {
    sessionStorage.setItem(VERIFIED_KEY, String(Date.now()));
  } catch {}
}

export async function verifyTurnstileToken(token: string, action?: string): Promise<boolean> {
  const response = await fetch("/api/turnstile", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ token, ...(action ? { action } : {}) }),
  });
  const data = await response.json().catch(() => ({}));
  return response.ok && data.verified === true;
}
