import * as React from "react";
import { Send, Radio, RefreshCw, AlertTriangle, ArrowDown, SmilePlus, Sparkles, X, ImagePlus, Loader2 } from "lucide-react";
import { HubMessage, loadMessages, loadReactions, sendMessage, sendReaction, uploadChatImage } from "@/lib/hubApi";
import { CHAT_IMAGE_ACCEPT, prepareChatImage } from "@/lib/chatImages";
import { notifyNewChatMessage } from "@/lib/chatNotifications";
import { isChatVerified } from "@/lib/turnstile";
import { TurnstileGate } from "./TurnstileGate";
import { BidvertiserAd } from "./BidvertiserAd";
import { formatChatText } from "@/lib/chatFormat";
import { useOnlineCount } from "@/lib/presence";
import { posthog } from "@/lib/posthog";

export interface ChatMessage extends HubMessage {
  from: "user" | "assistant" | "system" | "racer";
  timestamp: string;
  badge?: string;
  color?: string;
}

function toChatMessage(message: HubMessage, from: ChatMessage["from"] = "racer"): ChatMessage {
  return {
    ...message,
    from,
    timestamp: new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    badge: from === "user" ? "PILOT" : "RACER",
    color: from === "user" ? "cyan" : "blue",
  };
}

const LOCAL_SENT_MESSAGES_KEY = "polytrack_sent_messages";
const CHAT_REACTIONS_KEY = "polytrack_chat_reactions";

// message id -> emoji -> the names of everyone who picked it
type ReactionsByMessage = Record<string, Record<string, string[]>>;

function readStoredReactions(): ReactionsByMessage {
  try {
    const parsed = JSON.parse(localStorage.getItem(CHAT_REACTIONS_KEY) || "{}");
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    const cleaned: ReactionsByMessage = {};
    for (const [messageId, perEmoji] of Object.entries(parsed)) {
      if (!perEmoji || typeof perEmoji !== "object" || Array.isArray(perEmoji)) continue;
      const emojis: Record<string, string[]> = {};
      for (const [emoji, authors] of Object.entries(perEmoji as Record<string, unknown>)) {
        if (!Array.isArray(authors)) continue;
        const names = authors.filter((author): author is string => typeof author === "string" && author.length > 0);
        if (names.length > 0) emojis[emoji] = names;
      }
      if (Object.keys(emojis).length > 0) cleaned[messageId] = emojis;
    }
    return cleaned;
  } catch {
    return {};
  }
}

function readStoredMessages(key: string): ChatMessage[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(key) || "[]");
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (message): message is ChatMessage =>
        !!message &&
        typeof message.id === "string" &&
        typeof message.createdAt === "string" &&
        typeof message.author === "string" &&
        typeof message.text === "string" &&
        typeof message.from === "string"
    );
  } catch {
    return [];
  }
}

function loadLocalSentMessages(): ChatMessage[] {
  return readStoredMessages(LOCAL_SENT_MESSAGES_KEY);
}

function mergeMessages(...groups: ChatMessage[][]): ChatMessage[] {
  const unique = new Map<string, ChatMessage>();
  for (const message of groups.flat()) unique.set(message.id, message);
  return [...unique.values()]
    .sort((a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt))
    .slice(-100);
}

function persistSentMessage(message: ChatMessage) {
  try {
    const saved = mergeMessages(loadLocalSentMessages(), [message]);
    localStorage.setItem(LOCAL_SENT_MESSAGES_KEY, JSON.stringify(saved));
  } catch {}
}

const fallbackMessages = (): ChatMessage[] =>
  mergeMessages(readStoredMessages("polytrack_chat_history"), loadLocalSentMessages());

declare global {
  interface Window {
    PolyTrackChat?: {
      addMessage: (msg: Partial<ChatMessage> & { text: string }) => void;
      setMessages: (msgs: ChatMessage[]) => void;
      getMessages: () => ChatMessage[];
      onSend: (cb: (msg: ChatMessage) => void) => void;
      clear: () => void;
    };
  }
}

const CHIP_STYLE: React.CSSProperties = {
  borderRadius: 999,
  background: "rgba(255, 255, 255, 0.04)",
  boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.02), inset 0 1px 0 0 rgba(255, 255, 255, 0.04)",
};

// Chat paints a page of messages instead of the whole backlog, grows a page on
// request, and polls only the newest slice on each refresh.
const INITIAL_VISIBLE_MESSAGES = 25;
const OLDER_PAGE_SIZE = 25;
const FETCH_LIMIT = 50;
const POLL_LIMIT = 25;

// The chat ad cycles instead of sitting there: it loads once, then shows for a
// short window every few minutes so it never crowds the conversation.
const AD_FIRST_DELAY_MS = 45_000;
const AD_VISIBLE_MS = 12_000;
const AD_HIDDEN_MS = 180_000;

// Client-side send throttle: one message every few seconds, capped per minute.
const SEND_COOLDOWN_MS = 4000;
const SEND_WINDOW_MS = 60_000;
const SEND_WINDOW_MAX = 6;

const QUICK_REACTION_POOL = [
  "🏎️", "🔥", "🎮", "🏆", "⚡", "🚀", "👋", "GG",
  "😮", "🎯", "💀", "🕹️", "🤯", "👾", "🍕", "☕",
  "🏁", "🙌", "💯", "🥇", "🎉", "🤝", "😎", "🧠",
  "🛞", "😭", "🧨", "🥶", "🦆", "🌟",
];

// A different handful of reactions each time the page loads.
function pickQuickReactions(count = 8): string[] {
  const pool = [...QUICK_REACTION_POOL];
  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, count);
}

export function LiveMessageBoard({
  showAds = true,
  title = "Chat",
  onClose,
}: {
  showAds?: boolean;
  title?: string;
  onClose?: () => void;
}) {
  const [messages, setMessages] = React.useState<ChatMessage[]>(fallbackMessages);
  // How many people are on the site right now, straight from the hub.
  const onlineCount = useOnlineCount();
  const [nickname, setNickname] = React.useState(() => localStorage.getItem("polytrack_nickname") || `Racer_${Math.floor(100 + Math.random() * 900)}`);
  const [inputText, setInputText] = React.useState("");
  // A picked photo is shown as a preview until it goes out with the message.
  const [pendingImage, setPendingImage] = React.useState<{ blob: Blob; url: string } | null>(null);
  const [preparingImage, setPreparingImage] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [loading, setLoading] = React.useState(true);
  const [sending, setSending] = React.useState(false);
  const [error, setError] = React.useState("");
  const [refreshing, setRefreshing] = React.useState(false);
  const [showEmojiBar, setShowEmojiBar] = React.useState(false);
  const [isScrolledUp, setIsScrolledUp] = React.useState(false);
  const [unreadCount, setUnreadCount] = React.useState(0);
  const [quickReactions] = React.useState(pickQuickReactions);
  const [reactions, setReactions] = React.useState<ReactionsByMessage>(readStoredReactions);
  const [reactionPickerFor, setReactionPickerFor] = React.useState<string | null>(null);
  const [visibleCount, setVisibleCount] = React.useState(INITIAL_VISIBLE_MESSAGES);
  const [chatVerified, setChatVerified] = React.useState(isChatVerified);
  // Mounted on the first showing and kept mounted: the tag loads exactly once.
  const [adMounted, setAdMounted] = React.useState(false);
  const [adVisible, setAdVisible] = React.useState(false);
  // Closing the chat ad only pauses it: it is back after 30 seconds.
  const adDismissTimerRef = React.useRef<number | null>(null);
  React.useEffect(() => {
    return () => {
      if (adDismissTimerRef.current) window.clearTimeout(adDismissTimerRef.current);
    };
  }, []);
  const dismissAd = React.useCallback(() => {
    setAdVisible(false);
    if (adDismissTimerRef.current) window.clearTimeout(adDismissTimerRef.current);
    adDismissTimerRef.current = window.setTimeout(() => setAdVisible(true), 30_000);
  }, []);
  const pendingScrollAdjustRef = React.useRef(0);
  const lastSendAtRef = React.useRef(0);
  const sendTimesRef = React.useRef<number[]>([]);

  const handleChatVerified = React.useCallback(() => setChatVerified(true), []);

  React.useEffect(() => {
    // Turning ads off stops the cycle and unloads whatever widget is on screen.
    if (!showAds) {
      setAdVisible(false);
      setAdMounted(false);
      return;
    }
    let timer = 0;
    function hideAd() {
      setAdVisible(false);
      timer = window.setTimeout(showAd, AD_HIDDEN_MS);
    }
    function showAd() {
      setAdMounted(true);
      setAdVisible(true);
      timer = window.setTimeout(hideAd, AD_VISIBLE_MS);
    }
    timer = window.setTimeout(showAd, AD_FIRST_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [showAds]);

  // The preview belongs to the current selection; replacing or clearing it
  // releases the object URL instead of leaving it alive for the whole visit.
  React.useEffect(() => {
    return () => {
      if (pendingImage) URL.revokeObjectURL(pendingImage.url);
    };
  }, [pendingImage]);

  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const onSendCallbackRef = React.useRef<((msg: ChatMessage) => void) | null>(null);

  // Smooth scroll to bottom
  const scrollToBottom = React.useCallback((smooth = true) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: smooth ? "smooth" : "auto",
      });
      setIsScrolledUp(false);
      setUnreadCount(0);
    }
  }, []);

  // Pulls in the previous page, remembering the height so the message the
  // reader is looking at stays put while the older ones appear above it.
  const loadOlderMessages = React.useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container || visibleCount >= messages.length) return;
    pendingScrollAdjustRef.current = container.scrollHeight;
    setVisibleCount((count) => count + OLDER_PAGE_SIZE);
  }, [messages.length, visibleCount]);

  // Handle scroll detection
  const handleScroll = React.useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const distanceToBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    // Consider scrolled up if more than 120px from bottom
    const scrolledUp = distanceToBottom > 120;
    setIsScrolledUp(scrolledUp);
    if (!scrolledUp) {
      setUnreadCount(0);
    }
    // Reaching the top of the log loads the next page of older messages.
    if (el.scrollTop <= 24) loadOlderMessages();
  }, [loadOlderMessages]);

  const refreshMessages = React.useCallback(async (mode: "full" | "poll" = "full") => {
    if (mode === "full") setRefreshing(true);
    try {
      const loaded = await loadMessages(mode === "poll" ? POLL_LIMIT : FETCH_LIMIT);
      setMessages((prev) => {
        const fetched = loaded.map((message) => toChatMessage(message));
        const next =
          mode === "poll"
            ? mergeMessages(prev, fetched, loadLocalSentMessages())
            : mergeMessages(fetched, loadLocalSentMessages());
        const prevIds = new Set(prev.map((message) => message.id));
        const incoming = next.filter((message) => !prevIds.has(message.id) && message.author !== nickname);
        // Notify only about messages this tab has not seen before.
        if (incoming.length > 0) {
          const newest = incoming[incoming.length - 1];
          notifyNewChatMessage(newest.author, newest.text || "Sent a photo");
          if (isScrolledUp) setUnreadCount((count) => count + incoming.length);
        }
        return next;
      });
      // Reactions come from the hub with every refresh, so chips match on every
      // device. A hub without the endpoint leaves the local copy alone.
      const reactionIds = loaded.map((message) => message.id);
      if (reactionIds.length > 0) {
        void loadReactions(reactionIds)
          .then((serverReactions) => {
            setReactions((previous) => {
              const next = { ...previous };
              for (const id of reactionIds) delete next[id];
              for (const [id, perEmoji] of Object.entries(serverReactions)) {
                next[id] = perEmoji;
              }
              return next;
            });
          })
          .catch(() => {});
      }
      setError("");
    } catch {
      setError("Chat is offline. Check your connection, then retry.");
    } finally {
      setLoading(false);
      if (mode === "full") setRefreshing(false);
    }
  }, [isScrolledUp, nickname]);

  React.useEffect(() => {
    void refreshMessages();
  }, [refreshMessages]);

  React.useEffect(() => {
    const interval = window.setInterval(() => {
      void refreshMessages("poll");
    }, 30_000);
    return () => window.clearInterval(interval);
  }, [refreshMessages]);

  // The first paint jumps to the newest message; everything after that glides
  // down, so a poll never snaps the log out from under the reader.
  const autoScrolledRef = React.useRef(false);
  React.useEffect(() => {
    if (isScrolledUp || messages.length === 0) return;
    scrollToBottom(autoScrolledRef.current);
    autoScrolledRef.current = true;
  }, [messages.length, isScrolledUp, scrollToBottom]);

  React.useEffect(() => {
    window.PolyTrackChat = {
      addMessage: (newMessage) => {
        const message = toChatMessage({
          id: newMessage.id || `msg-${Date.now()}`,
          createdAt: newMessage.createdAt || new Date().toISOString(),
          author: newMessage.author || "Guest",
          text: newMessage.text,
        }, newMessage.from || "racer");
        if (newMessage.author && newMessage.author !== nickname) {
          notifyNewChatMessage(newMessage.author, newMessage.text);
        }
        setMessages((current) => [...current, message].slice(-100));
        if (!isScrolledUp) {
          setTimeout(() => scrollToBottom(true), 50);
        } else {
          setUnreadCount((c) => c + 1);
        }
      },
      setMessages: (newMessages) => setMessages(newMessages.slice(-100)),
      getMessages: () => messages,
      onSend: (callback) => { onSendCallbackRef.current = callback; },
      clear: () => setMessages([]),
    };
  }, [messages, isScrolledUp, scrollToBottom]);

  const handleImagePicked = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    // Let the same photo be picked again after it has been removed.
    event.target.value = "";
    if (!file) return;
    setPreparingImage(true);
    setError("");
    try {
      const prepared = await prepareChatImage(file);
      setPendingImage({ blob: prepared, url: URL.createObjectURL(prepared) });
    } catch (pickError) {
      setError(pickError instanceof Error ? pickError.message : "That photo could not be added.");
    } finally {
      setPreparingImage(false);
    }
  };

  const handleSendMessage = async (event?: React.FormEvent) => {
    event?.preventDefault();
    const cleanText = inputText.trim();
    const photo = pendingImage;
    if ((!cleanText && !photo) || sending) return;
    if (!chatVerified) {
      setError("Verify you're human before sending messages.");
      return;
    }
    const now = Date.now();
    sendTimesRef.current = sendTimesRef.current.filter((stamp) => now - stamp < SEND_WINDOW_MS);
    const cooldownLeft = SEND_COOLDOWN_MS - (now - lastSendAtRef.current);
    if (lastSendAtRef.current > 0 && cooldownLeft > 0) {
      setError(`Slow down — try again in ${Math.ceil(cooldownLeft / 1000)}s.`);
      return;
    }
    if (sendTimesRef.current.length >= SEND_WINDOW_MAX) {
      setError("Message limit reached. You can send again in a minute.");
      return;
    }
    setSending(true);
    setError("");
    try {
      // The photo goes up first; the message then stores the hub's path for it.
      const imagePath = photo ? await uploadChatImage(photo.blob) : undefined;
      const saved = await sendMessage(nickname.trim() || "Guest", cleanText, imagePath);
      lastSendAtRef.current = Date.now();
      sendTimesRef.current = [...sendTimesRef.current, Date.now()];
      const message = toChatMessage(saved, "user");
      posthog.capture("chat_message_sent");
      persistSentMessage(message);
      setMessages((current) => mergeMessages(current, [message]));
      setInputText("");
      setPendingImage(null);
      onSendCallbackRef.current?.(message);
      setTimeout(() => scrollToBottom(true), 60);
    } catch (sendError) {
      setError(sendError instanceof Error ? sendError.message : "Message could not be sent.");
    } finally {
      setSending(false);
    }
  };

  const handleReactionClick = (emoji: string) => {
    setInputText((prev) => (prev ? `${prev} ${emoji}` : emoji));
  };

  // One reaction per name per message. The chip updates immediately, then the
  // hub toggle replaces it with the shared list; when the hub is unreachable the
  // local copy still works for this device.
  const toggleReaction = React.useCallback(
    (messageId: string, emoji: string) => {
      const name = nickname.trim() || "Guest";
      setReactions((previous) => {
        const perEmoji = { ...(previous[messageId] || {}) };
        const authors = new Set(perEmoji[emoji] || []);
        if (authors.has(name)) authors.delete(name);
        else authors.add(name);
        if (authors.size === 0) delete perEmoji[emoji];
        else perEmoji[emoji] = [...authors];
        const next = { ...previous };
        if (Object.keys(perEmoji).length === 0) delete next[messageId];
        else next[messageId] = perEmoji;
        return next;
      });
      void sendReaction(messageId, emoji, name)
        .then((shared) => {
          setReactions((current) => ({ ...current, [messageId]: shared }));
        })
        .catch(() => {
          setError("Reactions are saved on this device until chat sync comes back.");
        });
    },
    [nickname]
  );

  React.useEffect(() => {
    try {
      localStorage.setItem(CHAT_REACTIONS_KEY, JSON.stringify(reactions));
    } catch {}
  }, [reactions]);

  React.useEffect(() => {
    if (!reactionPickerFor) return;
    const closeOnOutside = (event: PointerEvent) => {
      const target = event.target as Element | null;
      if (target?.closest("[data-reaction-picker]") || target?.closest("[data-reaction-toggle]")) return;
      setReactionPickerFor(null);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setReactionPickerFor(null);
    };
    document.addEventListener("pointerdown", closeOnOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [reactionPickerFor]);

  const handleNicknameChange = (value: string) => {
    setNickname(value);
    localStorage.setItem("polytrack_nickname", value);
  };

  const visibleMessages = React.useMemo(
    () => messages.slice(-visibleCount),
    [messages, visibleCount]
  );

  // Keep the reader's place when older messages are prepended.
  React.useLayoutEffect(() => {
    const container = scrollContainerRef.current;
    const previousHeight = pendingScrollAdjustRef.current;
    if (!container || !previousHeight) return;
    pendingScrollAdjustRef.current = 0;
    container.scrollTop += container.scrollHeight - previousHeight;
  }, [visibleCount]);

  const remainingChars = 280 - inputText.length;

  return (
    <div
      className="solid-3d-panel flex-1 flex flex-col min-h-0 overflow-hidden"
      style={{
        background: "#1d1d1d",
        borderRadius: 16,
        border: "1px solid rgba(255, 255, 255, 0.07)",
      }}
    >
      {/* Chat Top Header */}
      <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-white/[0.06] shrink-0">
        <div className="flex items-center gap-2">
          <div style={CHIP_STYLE} className="p-1.5 text-zinc-300">
            <Radio aria-hidden="true" className="w-3.5 h-3.5" />
          </div>
          <h2 className={`font-semibold text-zinc-200 ${onClose ? "text-sm" : "text-xs"}`}>{title}</h2>
        </div>
        <div className="flex items-center gap-1.5">
          {/* One merged label, and nothing at all until the first heartbeat answers. */}
          {onlineCount !== null && (
            <span
              role="status"
              aria-label={`Live chat, ${onlineCount} ${onlineCount === 1 ? "person" : "people"} online`}
              title="People on the site right now"
              style={CHIP_STYLE}
              className="flex shrink-0 items-center gap-1.5 px-2 py-1"
            >
              <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
              <span className="text-[11px] font-medium tabular-nums text-zinc-200">
                Live · {onlineCount}
              </span>
            </span>
          )}
          <button
            type="button"
            onClick={() => void refreshMessages()}
            disabled={refreshing}
            title="Refresh chat"
            aria-label="Refresh chat"
            style={CHIP_STYLE}
            className="p-1.5 text-zinc-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <RefreshCw aria-hidden="true" className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
          </button>
          {error && (
            <span role="status" className="flex items-center gap-1.5 rounded-full border border-white/[0.07] px-2 py-1">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-zinc-500" />
              <span className="text-[11px] font-medium text-zinc-400">Offline</span>
            </span>
          )}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              title="Close chat"
              aria-label="Close chat"
              style={CHIP_STYLE}
              className="p-1.5 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <X aria-hidden="true" className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Smooth Scrollable Messages Container */}
      <div
        className="flex-1 min-h-0 relative flex flex-col"
        style={{
          background: "rgba(0, 0, 0, 0.16)",
        }}
      >
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          role="log"
          aria-live="polite"
          aria-relevant="additions"
          aria-label="Chat messages"
          tabIndex={0}
          className="flex-1 overflow-y-auto overscroll-contain p-3 space-y-3 scroll-smooth focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-white [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.15)_transparent]"
          style={{
            WebkitOverflowScrolling: "touch",
          }}
        >
          {messages.length === 0 && !loading && !error && (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <Sparkles className="w-6 h-6 text-zinc-600 mb-2" />
              <p className="text-xs font-medium text-zinc-400">No messages yet</p>
              <p className="text-[11px] text-zinc-400 mt-1 max-w-[180px]">
                Say hi or share your best PolyTrack times with fellow racers!
              </p>
            </div>
          )}

          {loading && (
            <div className="flex items-center justify-center py-12 text-xs text-zinc-500 gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-zinc-600" />
              <span>Connecting to chat…</span>
            </div>
          )}

          {messages.length > visibleMessages.length && (
            <div className="flex justify-center pb-1">
              <button
                type="button"
                onClick={loadOlderMessages}
                style={CHIP_STYLE}
                className="inline-flex min-h-6 cursor-pointer items-center gap-1.5 px-3 py-1 text-[11px] font-medium text-zinc-300 transition-colors hover:bg-white/[0.08] hover:text-white"
              >
                <ArrowDown aria-hidden="true" className="h-3 w-3 rotate-180" />
                <span>Load older messages</span>
              </button>
            </div>
          )}

          {visibleMessages.map((message) => {
            const isUser = message.from === "user";
            const myName = nickname.trim() || "Guest";
            const reactionEntries = Object.entries(reactions[message.id] || {});
            return (
              <div
                key={message.id}
                className={`group flex flex-col transition-opacity duration-150 ease-out ${
                  isUser ? "items-end" : "items-start"
                }`}
              >
                <div className="flex items-center gap-1.5 px-1 mb-1 text-[11px]">
                  <span className="font-semibold text-zinc-300">
                    {message.author}
                  </span>
                  <span className="text-zinc-500 text-[11px]">
                    {message.timestamp}
                  </span>
                </div>

                <div
                  className={`max-w-[88%] whitespace-pre-wrap px-3 py-2 text-xs leading-relaxed break-words shadow-sm transition ${
                    isUser
                      ? "bg-white text-zinc-950 rounded-2xl font-medium"
                      : "text-[#d4d4d8] rounded-2xl"
                  }`}
                  style={
                    isUser
                      ? {}
                                              : {
                            background: "rgba(255, 255, 255, 0.055)",
                            border: "1px solid rgba(255, 255, 255, 0.06)",
                          }
                  }
                >
                  {message.image && (
                    <a
                      href={message.image}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Open photo"
                      className="block"
                    >
                      <img
                        src={message.image}
                        alt={`Photo from ${message.author}`}
                        loading="lazy"
                        className={`max-h-52 w-auto max-w-full rounded-xl object-cover ${message.text ? "mb-1.5" : ""}`}
                      />
                    </a>
                  )}
                  {message.text ? formatChatText(message.text) : null}
                </div>

                <div className={`chat-reactions mt-1 flex flex-wrap items-center gap-1 ${isUser ? "justify-end" : "justify-start"}`}>
                  {reactionEntries.map(([emoji, authors]) => {
                    const mine = authors.includes(myName);
                    return (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => toggleReaction(message.id, emoji)}
                        aria-pressed={mine}
                        title={`${emoji} from ${authors.join(", ")}`}
                        aria-label={`${emoji} reaction from ${authors.join(", ")}. ${mine ? "Remove yours" : "Add yours"}.`}
                        className={`inline-flex h-5 cursor-pointer items-center gap-1 rounded-full border px-1.5 text-[11px] leading-none transition active:scale-95 ${
                          mine
                            ? "border-amber-300/40 bg-amber-400/15 text-amber-100"
                            : "border-white/[0.06] bg-white/[0.05] text-zinc-300 hover:border-white/15 hover:bg-white/[0.09] hover:text-white"
                        }`}
                      >
                        <span>{emoji}</span>
                        <span className="text-[11px] tabular-nums text-zinc-400">{authors.length}</span>
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    data-reaction-toggle
                    aria-expanded={reactionPickerFor === message.id}
                    onClick={() =>
                      setReactionPickerFor((current) => (current === message.id ? null : message.id))
                    }
                    aria-label={
                      reactionPickerFor === message.id
                        ? "Close quick reactions"
                        : `React to ${message.author}'s message`
                    }
                    title="Add a reaction"
                    className="inline-flex h-5 w-5 cursor-pointer items-center justify-center rounded-full text-zinc-500 transition-colors hover:bg-white/[0.08] hover:text-zinc-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/60"
                  >
                    <SmilePlus aria-hidden="true" className="h-3 w-3" />
                  </button>
                </div>

                {reactionPickerFor === message.id && (
                  <div
                    role="group"
                    aria-label={`Quick reactions for ${message.author}'s message`}
                    data-reaction-picker
                    className="mt-1 grid grid-cols-8 gap-0.5 rounded-xl border border-white/10 bg-[#242424] p-1 shadow-[0_10px_24px_rgba(0,0,0,0.5)] animate-enter"
                  >
                    {quickReactions.map((emoji) => {
                      const chosen = (reactions[message.id]?.[emoji] || []).includes(myName);
                      return (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => toggleReaction(message.id, emoji)}
                          aria-pressed={chosen}
                          aria-label={`React with ${emoji}`}
                          title={`React with ${emoji}`}
                          className={`flex h-7 min-w-7 cursor-pointer items-center justify-center rounded-lg px-1 text-sm transition-transform hover:bg-white/[0.1] active:scale-90 ${
                            chosen ? "bg-amber-400/20" : ""
                          }`}
                        >
                          {emoji}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
          <div ref={messagesEndRef} className="h-1" />
        </div>

        {/* Floating "Scroll to latest" button when scrolled up */}
        {isScrolledUp && (
          <button
            type="button"
            onClick={() => scrollToBottom(true)}
            className="absolute bottom-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-800/95 hover:bg-zinc-700 text-white border border-white/10 text-xs font-semibold shadow-lg backdrop-blur-md transition-[background-color,transform] duration-150 ease-out active:scale-95 cursor-pointer z-10 animate-enter"
          >
            <ArrowDown className="w-3.5 h-3.5 text-amber-300" />
            <span>Latest messages</span>
            {unreadCount > 0 && (
              <span className="rounded-full bg-amber-400 px-1.5 py-0.5 text-[11px] font-semibold tabular-nums text-zinc-950">
                +{unreadCount}
              </span>
            )}
          </button>
        )}
      </div>

      {error && (
        <div
          role="alert"
          className="mx-2.5 mb-1.5 flex items-center gap-2 rounded-xl bg-amber-500/10 px-2.5 py-2 text-[11px] text-amber-200 sm:mx-3"
        >
          <AlertTriangle aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
          <span className="min-w-0 flex-1 leading-snug">{error}</span>
          <button
            type="button"
            onClick={() => void refreshMessages()}
            className="shrink-0 cursor-pointer rounded-full bg-amber-400/15 px-2 py-0.5 font-medium text-amber-100 transition-colors hover:bg-amber-400/25"
          >
            Retry
          </button>
        </div>
      )}

      {!chatVerified && <TurnstileGate onVerified={handleChatVerified} />}

      {showAds && adMounted && (
        <div
          aria-label="Sponsored"
          className={`shrink-0 border-t border-white/[0.04] px-3 py-1 ${adVisible ? "" : "hidden"}`}
        >
          <div className="flex items-center justify-center gap-2 overflow-hidden">
            <span className="shrink-0 text-[11px] font-medium uppercase tracking-[0.14em] text-zinc-400">
              Ad
            </span>
            <BidvertiserAd slot="chat" showClose={false} className="flex items-center justify-center" />
            <button
              type="button"
              onClick={dismissAd}
              aria-label="Close ad"
              title="Close ad (comes back in 30s)"
              className="flex h-4 w-4 shrink-0 cursor-pointer items-center justify-center rounded-full text-zinc-500 transition-colors hover:bg-white/10 hover:text-zinc-200"
            >
              <X aria-hidden="true" className="h-3 w-3" />
            </button>
          </div>
        </div>
      )}

      {/* Quick Reactions Bar (Expandable or always subtle) */}
      <div className="px-3 pt-2 pb-1 border-t border-white/[0.06] flex items-center justify-between gap-1 shrink-0 bg-white/[0.01]">
        <div className="flex items-center gap-1 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {quickReactions.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => handleReactionClick(emoji)}
              aria-label={`Add ${emoji} reaction`}
              className="inline-flex h-6 min-w-6 items-center justify-center rounded-full px-1.5 text-xs transition-transform hover:bg-white/[0.08] active:scale-90 cursor-pointer"
              title={`Add ${emoji}`}
            >
              {emoji}
            </button>
          ))}
        </div>
        <span className="text-[11px] text-zinc-500 font-mono shrink-0 pl-1">
          {remainingChars <= 40 ? `${remainingChars} left` : ""}
        </span>
      </div>

      {pendingImage && (
        <div className="flex shrink-0 items-center gap-2.5 border-t border-white/[0.04] bg-[#191919] px-3 pt-2">
          <div className="relative">
            <img
              src={pendingImage.url}
              alt="Photo ready to send"
              className="h-12 w-12 rounded-lg object-cover"
            />
            <button
              type="button"
              onClick={() => setPendingImage(null)}
              aria-label="Remove photo"
              title="Remove photo"
              className="absolute -right-1.5 -top-1.5 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full bg-zinc-800 text-zinc-300 ring-1 ring-white/15 transition-colors hover:bg-zinc-700 hover:text-white"
            >
              <X aria-hidden="true" className="h-3 w-3" />
            </button>
          </div>
          <span className="text-[11px] text-zinc-400">Photo ready to send</span>
        </div>
      )}

      {/* Input Form with Enter-to-send */}
      <form
        data-tour-target="chat-composer"
        onSubmit={handleSendMessage}
        className="p-2.5 sm:p-3 border-t border-white/[0.04] flex items-center gap-2 shrink-0 bg-[#191919]"
      >
        <label htmlFor="chat-name" className="sr-only">
          Your display name
        </label>
        <input
          id="chat-name"
          name="nickname"
          type="text"
          value={nickname}
          onChange={(event) => handleNicknameChange(event.target.value)}
          placeholder="Nickname"
          title="Your display name in chat"
          maxLength={24}
          autoComplete="nickname"
          spellCheck={false}
          style={{
            ...CHIP_STYLE,
            borderRadius: 8,
            background: "rgba(255, 255, 255, 0.04)",
          }}
          className="w-20 shrink-0 px-2.5 py-2 text-[11px] font-medium text-[#caccd2] placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-white/20"
        />

        <div className="relative min-w-0 flex-1">
          <label htmlFor="chat-message" className="sr-only">
            Message
          </label>
          <input
            id="chat-message"
            name="message"
            type="text"
            value={inputText}
            onChange={(event) => setInputText(event.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void handleSendMessage();
              }
            }}
            placeholder={
              !chatVerified ? "Verify you're human to chat…" : pendingImage ? "Add a caption" : "Message"
            }
            maxLength={280}
            enterKeyHint="send"
            autoComplete="off"
            style={{
              ...CHIP_STYLE,
              borderRadius: 8,
              background: "rgba(255, 255, 255, 0.04)",
            }}
            className="w-full px-3 py-2 pr-16 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-white/20"
          />
          <kbd
            aria-hidden="true"
            className="pointer-events-none absolute right-2.5 top-1/2 hidden -translate-y-1/2 font-mono text-[10px] font-medium text-zinc-500 sm:block"
          >
            ↵ Enter
          </kbd>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept={CHAT_IMAGE_ACCEPT}
          className="hidden"
          tabIndex={-1}
          aria-hidden="true"
          onChange={(event) => void handleImagePicked(event)}
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={!chatVerified || sending || preparingImage}
          aria-label="Send a photo"
          title="Send a photo"
          style={{ borderRadius: 8 }}
          className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center text-zinc-300 transition-colors hover:bg-white/[0.08] hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
        >
          {preparingImage ? (
            <Loader2 aria-hidden="true" className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <ImagePlus aria-hidden="true" className="w-3.5 h-3.5" />
          )}
        </button>

        <button
          type="submit"
          disabled={(!inputText.trim() && !pendingImage) || sending || !chatVerified}
          aria-label={sending ? "Sending message" : chatVerified ? "Send message" : "Verify to send messages"}
          style={{
            borderRadius: 8,
          }}
          className="flex items-center justify-center w-8 h-8 bg-white text-zinc-950 hover:bg-zinc-200 disabled:opacity-30 disabled:cursor-not-allowed transition-[background-color,transform] duration-150 ease-out active:scale-95 cursor-pointer shrink-0 shadow-sm"
        >
          <Send aria-hidden="true" className={`w-3.5 h-3.5 ${sending ? "animate-pulse" : ""}`} />
        </button>
      </form>
    </div>
  );
}
