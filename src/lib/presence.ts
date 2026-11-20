import * as React from "react";
import { reportPresence } from "./hubApi";

// Live "online now" presence. Every open tab pings the Cloudflare hub with a
// random session id, and the hub answers with the number of sessions seen in
// the last minute and a half. One shared heartbeat serves every subscriber, so
// the page never sends more than it has to.
const SESSION_KEY = "polytrack_presence_session";
const HEARTBEAT_MS = 25_000;

function readSessionId(): string {
  try {
    const existing = localStorage.getItem(SESSION_KEY);
    if (existing) return existing;
  } catch {}
  const id =
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `tab-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  try {
    localStorage.setItem(SESSION_KEY, id);
  } catch {}
  return id;
}

let online: number | null = null;
let timer: number | null = null;
let subscribers = 0;
const listeners = new Set<(count: number | null) => void>();

function publish(count: number | null) {
  online = count;
  for (const listener of listeners) listener(count);
}

let sessionId: string | null = null;

async function ping() {
  // A hidden tab still counts until its heartbeat goes stale, but it stops
  // spending requests until the visitor comes back.
  if (typeof document !== "undefined" && document.visibilityState === "hidden") return;
  sessionId = sessionId || readSessionId();
  try {
    publish(await reportPresence(sessionId));
  } catch {
    // A hub without the presence route leaves the counter untouched.
  }
}

function startHeartbeat() {
  subscribers += 1;
  if (timer !== null) return;
  void ping();
  timer = window.setInterval(() => void ping(), HEARTBEAT_MS);
  document.addEventListener("visibilitychange", onVisibilityChange);
}

function stopHeartbeat() {
  subscribers = Math.max(0, subscribers - 1);
  if (subscribers > 0 || timer === null) return;
  window.clearInterval(timer);
  timer = null;
  document.removeEventListener("visibilitychange", onVisibilityChange);
}

function onVisibilityChange() {
  if (document.visibilityState === "visible") void ping();
}

/** How many people are on the site right now, or null until the first ping. */
export function useOnlineCount(): number | null {
  const [count, setCount] = React.useState<number | null>(online);
  React.useEffect(() => {
    listeners.add(setCount);
    setCount(online);
    startHeartbeat();
    return () => {
      listeners.delete(setCount);
      stopHeartbeat();
    };
  }, []);
  return count;
}

/** Keeps this tab counted as online without showing anything. */
export function usePresenceHeartbeat() {
  React.useEffect(() => {
    startHeartbeat();
    return stopHeartbeat;
  }, []);
}
