// Browser notifications for new games.
// The permission prompt must come from a user gesture, so it is driven by the
// Settings toggle. Delivery goes through a small service worker so the browser
// (not the page) shows the notification, and it only fires when the catalog has
// actually gained a game since this device last looked.

export const NOTIFICATIONS_KEY = "polytrack_notifications";
export const LAST_NOTIFIED_VERSION_KEY = "polytrack_notified_version";
export const KNOWN_GAMES_KEY = "polytrack_known_game_ids";

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

// Registered on its own scope so it never replaces the ad network's worker at "/".
let workerRegistration: Promise<ServiceWorkerRegistration | null> | null = null;

function notificationWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) {
    return Promise.resolve(null);
  }
  if (!workerRegistration) {
    workerRegistration = navigator.serviceWorker
      .register("/notification-sw.js", { scope: "/notifications/" })
      .then((registration) => registration)
      .catch(() => null);
  }
  return workerRegistration;
}

/**
 * Shows a notification through the service worker when possible (so it lands in
 * the OS notification centre), falling back to a page-level Notification.
 */
export async function deliverNotification(title: string, body: string, tag: string): Promise<boolean> {
  if (!notificationsSupported() || Notification.permission !== "granted") return false;

  const registration = await notificationWorker();
  if (registration && typeof registration.showNotification === "function") {
    try {
      await registration.showNotification(title, {
        body,
        tag,
        icon: "/images/app-icon-192.png",
        badge: "/images/app-icon-192.png",
        data: { url: "/" },
      });
      return true;
    } catch {
      // Fall through to the page-level notification below.
    }
  }

  try {
    const notification = new Notification(title, {
      body,
      tag,
      icon: "/images/app-icon-192.png",
    });
    notification.onclick = () => {
      window.focus();
      notification.close();
    };
    return true;
  } catch {
    return false;
  }
}

/** Shows the "new game dropped" alert. Resolves false when it could not be shown. */
export async function showNewGameNotification(body: string = NEW_GAME_BODY): Promise<boolean> {
  const shown = await deliverNotification(NEW_GAME_TITLE, body, "polytrack-new-game-preview");
  if (shown) {
    try {
      localStorage.setItem(LAST_NOTIFIED_VERSION_KEY, "preview");
    } catch {
      // Not fatal: the alert was already shown.
    }
  }
  return shown;
}

function readKnownGameIds(): string[] | null {
  try {
    const raw = localStorage.getItem(KNOWN_GAMES_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === "string") : null;
  } catch {
    return null;
  }
}

function writeKnownGameIds(ids: string[]) {
  try {
    localStorage.setItem(KNOWN_GAMES_KEY, JSON.stringify(ids.slice(0, 500)));
  } catch {}
}

/** Games added since this device last checked, while remembering the full set. */
export function collectNewGames(games: { id: string; name: string }[]): { id: string; name: string }[] {
  if (games.length === 0) return [];
  const known = readKnownGameIds();
  const currentIds = games.map((game) => game.id);
  if (!known) {
    // First visit: record the catalog instead of announcing every game as new.
    writeKnownGameIds(currentIds);
    return [];
  }
  const knownSet = new Set(known);
  const added = games.filter((game) => !knownSet.has(game.id));
  writeKnownGameIds([...currentIds, ...known.filter((id) => !currentIds.includes(id))]);
  return added;
}

/**
 * On load, deliver an alert when the catalog actually gained games, once per
 * newly added game. Returns true when a notification was shown.
 */
export async function maybeNotifyNewGames(
  games: { id: string; name: string }[] = []
): Promise<boolean> {
  const added = collectNewGames(games);
  if (added.length === 0) return false;
  if (!isNotificationsEnabled()) return false;
  if (!notificationsSupported() || Notification.permission !== "granted") return false;

  const names = added.slice(0, 3).map((game) => game.name);
  const rest = added.length - names.length;
  const body =
    added.length === 1
      ? `${names[0]} is now live. Tap to play.`
      : `${names.join(", ")}${rest > 0 ? ` and ${rest} more` : ""} are now live. Tap to play.`;

  return deliverNotification(
    NEW_GAME_TITLE,
    body,
    `polytrack-new-games-${added.map((game) => game.id).slice(0, 5).join("-")}`
  );
}
