import { deliverNotification } from "./gameNotifications";

export const CHAT_NOTIFICATIONS_KEY = "polytrack_chat_notifications";

export function isChatNotificationsEnabled(): boolean {
  try {
    return localStorage.getItem(CHAT_NOTIFICATIONS_KEY) === "on";
  } catch {
    return false;
  }
}

export function setChatNotificationsEnabled(enabled: boolean): void {
  try {
    localStorage.setItem(CHAT_NOTIFICATIONS_KEY, enabled ? "on" : "off");
  } catch {}
}

export function notifyNewChatMessage(author: string, text: string): void {
  if (!isChatNotificationsEnabled()) return;
  if (typeof Notification === "undefined" || Notification.permission !== "granted") return;

  // Don't disturb if user is active in this tab
  if (!document.hidden && document.hasFocus()) return;

  void deliverNotification(
    `New chat message from ${author}`,
    text.length > 120 ? text.slice(0, 117) + "…" : text,
    "polytrack-chat-msg"
  );
}
