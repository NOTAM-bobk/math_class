import * as React from "react";
import { createPortal } from "react-dom";
import {
  Bell,
  Gamepad2,
  MessageCircle,
  Play,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import {
  loadLocalFeed,
  loadMessageNotifications,
  markNotificationsSeen,
  type HubNotificationItem,
  type NotificationKind,
} from "@/lib/notificationFeed";

// The catalog owns the games, so the bell only announces which one to play.
export const CONTINUE_GAME_EVENT = "polytrack:continue-game";

const ICON_BUTTON_STYLE: React.CSSProperties = {
  borderRadius: 999,
  background: "rgba(255, 255, 255, 0.06)",
  boxShadow:
    "inset 0 0 0 1px rgba(255, 255, 255, 0.05), inset 0 1px 0 0 rgba(255, 255, 255, 0.06)",
};

const PANEL_WIDTH = 352;
const MAX_VISIBLE_MESSAGES = 4;

const KIND_ICON: Record<NotificationKind, LucideIcon> = {
  continue: Play,
  message: MessageCircle,
  game: Gamepad2,
  update: Sparkles,
};

const KIND_ICON_STYLE: Record<NotificationKind, string> = {
  continue: "bg-emerald-400/15 text-amber-300",
  message: "bg-sky-400/15 text-amber-300",
  game: "bg-violet-400/15 text-violet-300",
  update: "bg-amber-400/15 text-amber-300",
};

function formatRelativeTime(timestamp: number): string {
  if (!Number.isFinite(timestamp) || timestamp <= 0) return "";
  const minutes = Math.floor((Date.now() - timestamp) / 60_000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

function NotificationRow({
  item,
  onSelect,
}: {
  item: HubNotificationItem;
  onSelect: (item: HubNotificationItem) => void;
}) {
  const Icon = KIND_ICON[item.kind];
  return (
    <button
      type="button"
      onClick={() => onSelect(item)}
      className="flex min-h-11 w-full items-start gap-2.5 px-3.5 py-2 text-left transition-colors hover:bg-white/[0.06] focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-white/40"
    >
      <span
        aria-hidden="true"
        className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${KIND_ICON_STYLE[item.kind]}`}
      >
        <Icon className={`h-3.5 w-3.5 ${item.kind === "continue" ? "fill-current" : ""}`} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-1.5">
          <span className="min-w-0 truncate text-xs font-semibold text-zinc-100">
            {item.title}
          </span>
          {item.isNew && (
            <span
              aria-label="Unread"
              className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400"
            />
          )}
        </span>
        <span className="mt-0.5 line-clamp-2 block text-xs leading-snug text-zinc-400">
          {item.body}
        </span>
        <span className="mt-1 block text-[11px] font-medium text-zinc-500">
          {item.meta ?? formatRelativeTime(item.at)}
        </span>
      </span>
    </button>
  );
}

export function NotificationsButton({
  onOpenChangelog,
  onOpenChat,
}: {
  onOpenChangelog: () => void;
  onOpenChat: () => void;
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [anchor, setAnchor] = React.useState<{ top: number; right: number } | null>(null);
  const [local, setLocal] = React.useState(loadLocalFeed);
  const [messages, setMessages] = React.useState<HubNotificationItem[]>([]);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const panelRef = React.useRef<HTMLDivElement>(null);

  const refreshMessages = React.useCallback(async () => {
    const items: HubNotificationItem[] = await loadMessageNotifications().catch(() => []);
    if (items.length === 0) return;
    setMessages((previous: HubNotificationItem[]) => {
      const byId = new Map<string, HubNotificationItem>();
      for (const item of previous) byId.set(item.id, item);
      for (const item of items) byId.set(item.id, item);
      return [...byId.values()]
        .sort((a, b) => b.at - a.at)
        .slice(0, MAX_VISIBLE_MESSAGES);
    });
  }, []);

  // Keep the message count current while the page is open, chat panel or not.
  React.useEffect(() => {
    void refreshMessages();
    const interval = window.setInterval(() => {
      if (document.visibilityState === "visible") void refreshMessages();
    }, 60_000);
    return () => window.clearInterval(interval);
  }, [refreshMessages]);

  const positionPanel = React.useCallback(() => {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (!rect) return;
    setAnchor({
      top: rect.bottom + 8,
      right: Math.max(8, window.innerWidth - rect.right),
    });
  }, []);

  const openPanel = React.useCallback(() => {
    positionPanel();
    setLocal(loadLocalFeed());
    // Opening the bell is reading it: the badge clears, but the rows keep their
    // unread dots until the panel closes.
    markNotificationsSeen();
    setIsOpen(true);
    void refreshMessages();
    window.setTimeout(() => panelRef.current?.focus(), 0);
  }, [positionPanel, refreshMessages]);

  const closePanel = React.useCallback((refocusButton = false) => {
    setIsOpen(false);
    setLocal(loadLocalFeed());
    setMessages((previous) =>
      previous.map((item) => ({ ...item, isNew: false }))
    );
    if (refocusButton) buttonRef.current?.focus();
  }, []);

  React.useEffect(() => {
    if (!isOpen) return;

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null;
      if (!target) return;
      if (panelRef.current?.contains(target) || buttonRef.current?.contains(target)) return;
      closePanel();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closePanel(true);
    };
    const onResize = () => positionPanel();

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);
    };
  }, [isOpen, closePanel, positionPanel]);

  const handleSelect = (item: HubNotificationItem) => {
    closePanel();
    if (item.kind === "update") {
      onOpenChangelog();
      return;
    }
    if (item.kind === "message") {
      onOpenChat();
      return;
    }
    if (item.gameId) {
      window.dispatchEvent(
        new CustomEvent(CONTINUE_GAME_EVENT, { detail: { id: item.gameId } })
      );
    }
  };

  const unread =
    local.items.filter((item) => item.isNew).length +
    messages.filter((item) => item.isNew).length;
  const newGames = local.items.filter((item) => item.kind === "game");
  const updates = local.items.filter((item) => item.kind === "update");

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => (isOpen ? closePanel(true) : openPanel())}
        title={unread > 0 ? `${unread} unread notification${unread === 1 ? "" : "s"}` : "Notifications"}
        aria-label={
          unread > 0
            ? `Notifications, ${unread} unread`
            : "Notifications"
        }
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        style={ICON_BUTTON_STYLE}
        className="relative inline-flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full p-0 text-zinc-300 transition-colors hover:bg-white/[0.12] hover:text-white active:scale-[0.98] sm:h-9 sm:w-9"
      >
        <Bell aria-hidden="true" className="h-4 w-4" />
        {unread > 0 && (
          <span
            aria-hidden="true"
            className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-400 px-1 font-mono text-[11px] font-semibold leading-none text-zinc-950 ring-2 ring-[#1d1d1d]"
          >
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {isOpen &&
        anchor &&
        createPortal(
          <div
            ref={panelRef}
            role="dialog"
            aria-label="Notifications"
            tabIndex={-1}
            style={{
              position: "fixed",
              top: anchor.top,
              right: anchor.right,
              width: `min(${PANEL_WIDTH}px, calc(100vw - 1rem))`,
            }}
            className="z-[75] max-h-[min(34rem,calc(100dvh-5rem))] overflow-y-auto overscroll-contain rounded-2xl border border-white/10 bg-[#1d1d1d] text-zinc-100 shadow-[0_24px_60px_rgba(0,0,0,0.55)] outline-none animate-in fade-in slide-in-from-top-2 duration-150 [scrollbar-width:thin]"
          >
            <div className="sticky top-0 z-10 flex items-center gap-2 border-b border-white/[0.08] bg-[#1d1d1d]/95 px-3.5 py-2.5 backdrop-blur">
              <Bell aria-hidden="true" className="h-3.5 w-3.5 text-zinc-400" />
              <h2 className="text-sm font-semibold">Notifications</h2>
              {unread > 0 && (
                <span className="rounded-full bg-amber-400/15 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-amber-300">
                  {unread} new
                </span>
              )}
            </div>

            <div className="py-1.5">
              {local.continueGame && (
                <section aria-labelledby="notifications-continue">
                  <h3
                    id="notifications-continue"
                    className="px-3.5 pb-1 pt-1.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-500"
                  >
                    Continue playing
                  </h3>
                  <button
                    type="button"
                    onClick={() => handleSelect(local.continueGame!)}
                    className="mx-2 flex w-[calc(100%-1rem)] items-center gap-2.5 rounded-xl border border-emerald-400/20 bg-emerald-400/[0.07] px-2.5 py-2.5 text-left transition-colors hover:bg-emerald-400/[0.12] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300"
                  >
                    <span
                      aria-hidden="true"
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-400/15 text-amber-300"
                    >
                      <Play className="h-3.5 w-3.5 fill-current" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-xs font-semibold">
                        {local.continueGame.title}
                      </span>
                      <span className="mt-0.5 block truncate text-xs text-zinc-400">
                        {local.continueGame.body}
                      </span>
                    </span>
                  </button>
                </section>
              )}

              {messages.length > 0 && (
                <section aria-labelledby="notifications-messages" className="mt-1">
                  <h3
                    id="notifications-messages"
                    className="px-3.5 pb-0.5 pt-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-500"
                  >
                    Recent messages
                  </h3>
                  {messages.map((item) => (
                    <NotificationRow key={item.id} item={item} onSelect={handleSelect} />
                  ))}
                </section>
              )}

              <section aria-labelledby="notifications-updates" className="mt-1">
                <h3
                  id="notifications-updates"
                  className="px-3.5 pb-0.5 pt-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-500"
                >
                  What’s new
                </h3>
                {newGames.map((item) => (
                  <NotificationRow key={item.id} item={item} onSelect={handleSelect} />
                ))}
                {updates.map((item) => (
                  <NotificationRow key={item.id} item={item} onSelect={handleSelect} />
                ))}
              </section>

              {!local.continueGame && messages.length === 0 && local.items.length === 0 && (
                <p className="px-3.5 py-6 text-center text-xs text-zinc-400">
                  You’re all caught up.
                </p>
              )}
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
