// Mirrors the site's `polytrack_*` localStorage keys into real cookies, so progress
// and settings survive when localStorage is cleared or blocked, and follow the
// visitor across browsers that accept cookies. localStorage stays the primary store.

const PREFIX = "polytrack_";
const COOKIE_DAYS = 365;

function readCookie(name: string): string | null {
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}=([^;]*)`)
  );
  return match ? decodeURIComponent(match[1]) : null;
}

function writeCookie(name: string, value: string) {
  const expires = new Date(Date.now() + COOKIE_DAYS * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

/**
 * Restores any `polytrack_*` cookie that is missing from localStorage, then keeps
 * the two in sync: every localStorage write to a `polytrack_*` key is copied to a cookie.
 */
export function initCookieStore() {
  if (typeof window === "undefined" || typeof document === "undefined") return;

  for (const pair of document.cookie.split("; ")) {
    const eq = pair.indexOf("=");
    if (eq === -1) continue;
    const name = pair.slice(0, eq);
    if (!name.startsWith(PREFIX)) continue;
    if (localStorage.getItem(name) === null) {
      try {
        localStorage.setItem(name, decodeURIComponent(pair.slice(eq + 1)));
      } catch {
        // Storage can be unavailable; the cookie still holds the value for next time.
      }
    }
  }

  const originalSetItem = Storage.prototype.setItem;
  Storage.prototype.setItem = function (key: string, value: string) {
    originalSetItem.call(this, key, value);
    if (this === window.localStorage && key.startsWith(PREFIX)) {
      writeCookie(key, value);
    }
  };

  const originalRemoveItem = Storage.prototype.removeItem;
  Storage.prototype.removeItem = function (key: string) {
    originalRemoveItem.call(this, key);
    if (this === window.localStorage && key.startsWith(PREFIX)) {
      document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`;
    }
  };

  // Write current values into cookies once, so existing localStorage data is saved too.
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(PREFIX) && readCookie(key) === null) {
      writeCookie(key, localStorage.getItem(key) ?? "");
    }
  }
}
