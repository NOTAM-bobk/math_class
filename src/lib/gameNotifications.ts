// Browser notifications for new games.
// The permission prompt must come from a user gesture, so it is driven by the
// Settings toggle. Preferences live on this device only.

import { SITE_VERSION } from "@/lib/changelog";

export const NOTIFICATIONS_KEY = "polytrack_notifications";
export const LAST_NOTIFIED_VERSION_KEY = "polytrack_notified_version";

export const NEW_GAME_TITLE = "A new game dropped! 🎮";
export const NEW_GAME_BODY =
  "Fresh picks are live on \"Education\" Games. Open the catalog and hit Play.";

export function notificationsSupported(): boolean {
  return typeof window !== "undefined" && "Notification" in window;
}

export function notificationPermission(): NotificationPermission | "unsupported" {
  if (!notificationsSupported()) return "unsupported";
  return Notification.permission;
}

/** Notifications are off until the visitor turns them on. */
export function isNotificationsEnabled(): boolean {
  try {
    return localStorage.getItem(NOTIFICATIONS_KEY) === "on";
  } catch {
    return false;
  }
}

export function setNotificationsEnabled(enabled: boolean) {
  try {
    localStorage.setItem(NOTIFICATIONS_KEY, enabled ? "on" : "off");
  } catch {
    // Storage can be unavailable in private mode; the choice still applies until reload.
  }
}

/** Must be called from a click/tap handler so the browser shows its prompt. */
export async function requestNotificationPermission(): Promise<NotificationPermission | "unsupported"> {
  if (!notificationsSupported()) return "unsupported";
  if (Notification.permission === "granted") return "granted";
  if (Notification.permission === "denied") return "denied";
  try {
    return await Notification.requestPermission();
  } catch {
    return Notification.permission;
  }
}

/** Shows the "new game dropped" alert. Returns false when it could not be shown. */
export function showNewGameNotification(body: string = NEW_GAME_BODY): boolean {
  if (!notificationsSupported() || Notification.permission !== "granted") return false;
  try {
    const notification = new Notification(NEW_GAME_TITLE, {
      body,
      tag: `polytrack-new-game-${SITE_VERSION}`,
      icon: "/favicon.ico",
    });
    notification.onclick = () => {
      window.focus();
      notification.close();
    };
    try {
      localStorage.setItem(LAST_NOTIFIED_VERSION_KEY, SITE_VERSION);
    } catch {
      // Not fatal: the alert was already shown.
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * On load, tell visitors who opted in once per version that new games arrived.
 * Returns true when a notification was shown.
 */
export function maybeNotifyNewGames(): boolean {
  if (!isNotificationsEnabled()) return false;
  if (!notificationsSupported() || Notification.permission !== "granted") return false;
  try {
    if (localStorage.getItem(LAST_NOTIFIED_VERSION_KEY) === SITE_VERSION) return false;
  } catch {
    return false;
  }
  return showNewGameNotification(
    `Version ${SITE_VERSION} is live with new additions to the catalog. Tap to play.`
  );
}
