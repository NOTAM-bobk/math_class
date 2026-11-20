// The browser fires beforeinstallprompt once, often before the app bundle has
// finished loading, so index.html parks the event on window for us. This module
// only wraps reading and prompting that event.

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

const AVAILABILITY_EVENT = "polytrack:pwa-install-available";

declare global {
  interface Window {
    __pwaInstallPrompt?: BeforeInstallPromptEvent | null;
  }
}

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function getInstallPrompt(): BeforeInstallPromptEvent | null {
  if (!isBrowser()) return null;
  return window.__pwaInstallPrompt ?? null;
}

export function canInstall(): boolean {
  return getInstallPrompt() !== null && !isInstalled();
}

export function isInstalled(): boolean {
  if (!isBrowser()) return false;
  const standalone = window.matchMedia?.("(display-mode: standalone)")?.matches;
  const iosStandalone = (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
  return Boolean(standalone || iosStandalone);
}

export function isIos(): boolean {
  if (!isBrowser()) return false;
  const ua = window.navigator.userAgent || "";
  return /iphone|ipad|ipod/i.test(ua) || (window.navigator.platform === "MacIntel" && window.navigator.maxTouchPoints > 1);
}

/** Fires when the browser adds or drops its install prompt, and after install. */
export function onInstallAvailabilityChange(callback: () => void): () => void {
  if (!isBrowser()) return () => {};
  const handler = () => callback();
  window.addEventListener(AVAILABILITY_EVENT, handler);
  window.addEventListener("appinstalled", handler);
  return () => {
    window.removeEventListener(AVAILABILITY_EVENT, handler);
    window.removeEventListener("appinstalled", handler);
  };
}

/**
 * Opens the browser's own install dialog. Must be called from a click or tap:
 * Chromium rejects the prompt without a user gesture. The event can only be
 * used once, so it is cleared whatever the visitor chooses.
 */
export async function promptInstall(): Promise<"accepted" | "dismissed" | "unavailable"> {
  const prompt = getInstallPrompt();
  if (!prompt) return "unavailable";

  try {
    await prompt.prompt();
    const choice = await prompt.userChoice;
    window.__pwaInstallPrompt = null;
    window.dispatchEvent(new Event(AVAILABILITY_EVENT));
    return choice.outcome === "accepted" ? "accepted" : "dismissed";
  } catch {
    // A stale event (already prompted, or no user gesture) is as good as none.
    window.__pwaInstallPrompt = null;
    window.dispatchEvent(new Event(AVAILABILITY_EVENT));
    return "unavailable";
  }
}
