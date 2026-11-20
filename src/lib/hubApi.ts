import { loadNotMobileGameIds } from "./notMobileGames";
import { loadBlockedGameIds } from "./blockedGames";

const HUB_API = "/api/hub";
const WORKER_ORIGIN = "https://polytrack-hub-api.sawyerbobk563.workers.dev";

// The Worker historically returned a path relative to itself. That path works
// on the direct Worker mirror, but the main Vercel site exposes the Worker
// through /api/hub, so a bare /api/chat/images/... URL 404s there. Resolve
// stored paths to the Worker origin so old and new photo messages work on every
// supported mirror without changing the database rows.
function resolveChatImage(image: unknown): string | undefined {
  if (typeof image !== "string" || !image) return undefined;
  if (/^https?:\/\//i.test(image)) return image;
  if (/^\/api\/chat\/images\/[a-zA-Z0-9-]{8,64}$/.test(image)) {
    return `${WORKER_ORIGIN}${image}`;
  }
  return image;
}

function normalizeMessage(message: any): HubMessage {
  const image = resolveChatImage(message?.image);
  return {
    id: String(message?.id || ""),
    createdAt: String(message?.createdAt || ""),
    author: String(message?.author || "Guest"),
    text: String(message?.text || ""),
    ...(image ? { image } : {}),
  };
}

// A backend deployed before the "not mobile optimized" tag existed omits it from
// its responses, so keep the tags already stored on this device instead of
// wiping them on every read or save.
function readNotMobileFlags(data: any): string[] {
  return Array.isArray(data?.notMobile) ? data.notMobile : Array.from(loadNotMobileGameIds());
}

function readBlockedFlags(data: any): string[] {
  return Array.isArray(data?.blocked) ? data.blocked : Array.from(loadBlockedGameIds());
}

/**
 * The proxy answers a missing route with an empty 404, while the Worker's own
 * 404s are JSON; that tells the two apart without reading the body.
 */
function isMissingProxyRoute(response: Response) {
  if (response.status !== 404 && response.status !== 405) return false;
  const type = response.headers.get("content-type") || "";
  return !type.includes("json");
}

/**
 * Calls the hub API through the site's own /api/hub proxy, which keeps chat on
 * networks that block other hosts. Mirrors without that proxy (the Cloudflare
 * and Deno builds) then talk to the Worker directly, so messages and reactions
 * still land in Cloudflare instead of silently failing.
 */
async function hubRequest(path: string, init: RequestInit = {}): Promise<Response> {
  let response: Response | null = null;
  try {
    response = await fetch(`${HUB_API}${path}`, init);
  } catch {
    response = null;
  }
  if (response && !isMissingProxyRoute(response)) return response;
  return fetch(`${WORKER_ORIGIN}/api${path}`, init);
}

export interface HubMessage {
  id: string;
  createdAt: string;
  author: string;
  text: string;
  /** Hub path of the photo sent with the message, when there is one. */
  image?: string;
}

export interface GameStats {
  id: string;
  name: string;
  url: string;
  clicks: number;
}

export interface GameFlagsData {
  verified: string[];
  buggy: string[];
  notMobile: string[];
  blocked: string[];
}

export async function loadMessages(limit = 50): Promise<HubMessage[]> {
  const safeLimit = Math.min(Math.max(Math.trunc(limit), 1), 100);
  const response = await hubRequest(`/messages?limit=${safeLimit}`, { headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error("Message service unavailable");
  const data = await response.json();
  return Array.isArray(data.messages) ? data.messages.map(normalizeMessage) : [];
}

export async function sendMessage(author: string, text: string, image?: string): Promise<HubMessage> {
  const response = await hubRequest(`/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(image ? { author, text, image } : { author, text }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.message) throw new Error(data.error || "Message could not be sent");
  return normalizeMessage(data.message);
}

/**
 * Uploads a chat photo to the Cloudflare Worker and returns the path to send
 * with the message.
 */
export async function uploadChatImage(file: Blob): Promise<string> {
  const response = await hubRequest(`/chat/images`, {
    method: "POST",
    headers: { "Content-Type": file.type || "image/jpeg", Accept: "application/json" },
    body: file,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.path) throw new Error(data.error || "That photo could not be uploaded");
  return data.path as string;
}

export type HubReactions = Record<string, Record<string, string[]>>;

function readReactions(value: unknown): HubReactions {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const cleaned: HubReactions = {};
  for (const [messageId, perEmoji] of Object.entries(value as Record<string, unknown>)) {
    if (!perEmoji || typeof perEmoji !== "object" || Array.isArray(perEmoji)) continue;
    const emojis: Record<string, string[]> = {};
    for (const [emoji, authors] of Object.entries(perEmoji as Record<string, unknown>)) {
      if (!Array.isArray(authors)) continue;
      const names = authors.filter(
        (author): author is string => typeof author === "string" && author.length > 0
      );
      if (names.length > 0) emojis[emoji] = names;
    }
    if (Object.keys(emojis).length > 0) cleaned[messageId] = emojis;
  }
  return cleaned;
}

/** Loads the reactions for a batch of message ids from the hub. */
export async function loadReactions(ids: string[]): Promise<HubReactions> {
  const unique = [...new Set(ids.filter(Boolean))].slice(0, 100);
  if (unique.length === 0) return {};
  const response = await hubRequest(`/reactions?ids=${encodeURIComponent(unique.join(","))}`, {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  if (!response.ok) throw new Error("Reactions unavailable");
  const data = await response.json().catch(() => ({}));
  return readReactions(data?.reactions);
}

/** Toggles one reaction on the hub and returns that message's current chips. */
export async function sendReaction(
  messageId: string,
  emoji: string,
  author: string
): Promise<Record<string, string[]>> {
  const response = await hubRequest(`/reactions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ messageId, emoji, author }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "Reaction could not be saved");
  return readReactions({ [messageId]: data?.reactions })[messageId] ?? {};
}

export async function recordPageView(): Promise<number> {
  const response = await hubRequest(`/views`, { method: "POST", headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error("View counter unavailable");
  const data = await response.json();
  return Number(data.total || 0);
}

/**
 * Posts this tab's heartbeat and returns how many people are on the site now.
 * The hub counts every session that pinged inside its presence window.
 */
export async function reportPresence(sessionId: string): Promise<number> {
  const response = await hubRequest(`/presence`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ id: sessionId }),
    cache: "no-store",
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error("Online counter unavailable");
  return Number(data.online || 0);
}

export async function loadGameStats(): Promise<GameStats[]> {
  const response = await hubRequest(`/games/stats`, { headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error("Game stats unavailable");
  const data = await response.json();
  return Array.isArray(data.games) ? data.games : [];
}

export async function recordGameClick(game: { id: string; name: string; url: string }): Promise<GameStats | null> {
  const response = await hubRequest(`/games/click`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(game),
  });
  if (!response.ok) throw new Error("Game click could not be recorded");
  const data = await response.json();
  return data.game || null;
}

export interface GameSubmissionInput {
  name: string;
  url: string;
  category?: string;
  description?: string;
  submittedBy?: string;
  website?: string;
  pageUrl?: string;
}

/**
 * Sends a game request through the Vercel proxy, which stores it with the
 * bug reports so the admin panel can review it.
 */
export async function submitGameRequest(input: GameSubmissionInput): Promise<void> {
  const endpoints = ["/api/hub/submit-game", "/api/submissions"];
  let lastError: Error | null = null;

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(input),
      });
      const data = await response.json().catch(() => ({}));

      if (response.ok && data.ok !== false) return;

      // A missing proxy route is worth retrying through the direct function;
      // a validation or rate-limit error is final.
      if (response.status === 404 || response.status === 405) {
        lastError = new Error(data.error || "Submission endpoint unavailable");
        continue;
      }

      throw new Error(data.error || "Could not send the game request");
    } catch (error) {
      lastError = error instanceof Error ? error : new Error("Could not send the game request");
    }
  }

  throw lastError || new Error("Could not send the game request");
}

/**
 * Loads game flags (verified and bug-tagged) via the Vercel serverless proxy.
 * Works reliably on school networks because requests stay on the site's own domain.
 */
export async function loadGameFlags(): Promise<GameFlagsData> {
  // 1. Try Vercel /api/flags
  try {
    const res = await fetch("/api/flags", {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      return {
        verified: Array.isArray(data.verified) ? data.verified : [],
        buggy: Array.isArray(data.buggy) ? data.buggy : [],
        notMobile: readNotMobileFlags(data),
        blocked: readBlockedFlags(data),
      };
    }
  } catch {}

  // 2. Try rewritten /api/hub/games/flags
  try {
    const res = await fetch(`${HUB_API}/games/flags`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      return {
        verified: Array.isArray(data.verified) ? data.verified : [],
        buggy: Array.isArray(data.buggy) ? data.buggy : [],
        notMobile: readNotMobileFlags(data),
        blocked: readBlockedFlags(data),
      };
    }
  } catch {}

  // Throw instead of returning empty lists: callers keep the badges already
  // stored on this device rather than clearing them on a failed read.
  throw new Error("Game badges are unavailable from the backend");
}

/**
 * Updates game flags (verified or bug-tagged) via the Vercel serverless proxy.
 * Protected by admin password and routed server-side to Cloudflare.
 */
export async function updateAdminGameFlags(
  pwd: string,
  payload: {
    action:
      | "toggle_verified"
      | "set_verified"
      | "clear_verified"
      | "toggle_buggy"
      | "set_buggy"
      | "clear_buggy"
      | "toggle_not_mobile"
      | "set_not_mobile"
      | "clear_not_mobile"
      | "toggle_blocked"
      | "set_blocked"
      | "clear_blocked"
      | "sync_all"
      | "get";
    gameId?: string;
    verified?: boolean | string[];
    buggy?: boolean | string[];
    notMobile?: boolean | string[];
    blocked?: boolean | string[];
  }
): Promise<GameFlagsData> {
  const reqBody = { ...payload, target: "flags", password: pwd };

  // 1. Primary: Send through Vercel /api/admin function
  let res: Response | null = null;
  try {
    res = await fetch("/api/admin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Admin-Password": pwd,
      },
      body: JSON.stringify(reqBody),
    });
  } catch {
    res = null;
  }

  // 2. Fallback: Send through Vercel /api/flags
  if (!res || !res.ok) {
    try {
      const flagsRes = await fetch("/api/flags", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Admin-Password": pwd,
        },
        body: JSON.stringify(reqBody),
      });
      // Keep the newest response even when it failed so its error is shown.
      res = flagsRes;
    } catch {}
  }

  if (!res || !res.ok) {
    const errData = res ? await res.json().catch(() => ({})) : {};
    throw new Error(errData.error || "Failed to update flags through Vercel proxy");
  }

  const data = await res.json();
  return {
    verified: Array.isArray(data.verified) ? data.verified : [],
    buggy: Array.isArray(data.buggy) ? data.buggy : [],
    notMobile: readNotMobileFlags(data),
    blocked: readBlockedFlags(data),
  };
}
