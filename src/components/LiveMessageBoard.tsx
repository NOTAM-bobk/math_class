import * as React from "react";
import { Send, Radio, RefreshCw, AlertTriangle, ArrowDown, Smile, Sparkles } from "lucide-react";
import { HubMessage, loadMessages, sendMessage } from "@/lib/hubApi";
import { notifyNewChatMessage } from "@/lib/chatNotifications";
import { isChatVerified } from "@/lib/turnstile";
import { TurnstileGate } from "./TurnstileGate";
import { BidvertiserAd } from "./BidvertiserAd";

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
  borderRadius: 36,
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

export function LiveMessageBoard({ showAds = true }: { showAds?: boolean }) {
  const [messages, setMessages] = React.useState<ChatMessage[]>(fallbackMessages);
  const [nickname, setNickname] = React.useState(() => localStorage.getItem("polytrack_nickname") || `Racer_${Math.floor(100 + Math.random() * 900)}`);
  const [inputText, setInputText] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [sending, setSending] = React.useState(false);
  const [error, setError] = React.useState("");
  const [refreshing, setRefreshing] = React.useState(false);
  const [showEmojiBar, setShowEmojiBar] = React.useState(false);
  const [isScrolledUp, setIsScrolledUp] = React.useState(false);
  const [unreadCount, setUnreadCount] = React.useState(0);
  const [quickReactions] = React.useState(pickQuickReactions);
  const [visibleCount, setVisibleCount] = React.useState(INITIAL_VISIBLE_MESSAGES);
  const [chatVerified, setChatVerified] = React.useState(isChatVerified);
  // Mounted on the first showing and kept mounted: the tag loads exactly once.
  const [adMounted, setAdMounted] = React.useState(false);
  const [adVisible, setAdVisible] = React.useState(false);
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
  }, []);

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
          notifyNewChatMessage(newest.author, newest.text);
          if (isScrolledUp) setUnreadCount((count) => count + incoming.length);
        }
        return next;
      });
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
    }, 35_000);
    return () => window.clearInterval(interval);
  }, [refreshMessages]);

  // Initial scroll to bottom when messages load
  React.useEffect(() => {
    if (!isScrolledUp && messages.length > 0) {
      scrollToBottom(false);
    }
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

  const handleSendMessage = async (event?: React.FormEvent) => {
    event?.preventDefault();
    const cleanText = inputText.trim();
    if (!cleanText || sending) return;
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
      const saved = await sendMessage(nickname.trim() || "Guest", cleanText);
      lastSendAtRef.current = Date.now();
      sendTimesRef.current = [...sendTimesRef.current, Date.now()];
      const message = toChatMessage(saved, "user");
      persistSentMessage(message);
      setMessages((current) => mergeMessages(current, [message]));
      setInputText("");
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

  const handleNicknameChange = (value: string) => {
    setNickname(value);
    localStorage.setItem("polytrack_nickname", value);
  };

  const visibleMessages = React.useMemo(
    () => messages.slice(-visibleCount),
    [messages, visibleCount]
  );

  const loadOlderMessages = React.useCallback(() => {
    const container = scrollContainerRef.current;
    if (container) pendingScrollAdjustRef.current = container.scrollHeight;
    setVisibleCount((count) => count + OLDER_PAGE_SIZE);
  }, []);

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
        borderRadius: 20,
        boxShadow:
          "inset 0 0 0 1px rgba(44,47,54,0.52), inset 0 0 50px 0 rgba(255,255,255,0.02), 0 14px 30px -8px rgba(0,0,0,0.55), 0 2px 8px rgba(0,0,0,0.3)",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Chat Top Header */}
      <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-white/[0.06] shrink-0">
        <div className="flex items-center gap-2">
          <div style={CHIP_STYLE} className="p-1.5 text-zinc-300">
            <Radio aria-hidden="true" className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-semibold text-zinc-200">Chat</span>
        </div>
        <div className="flex items-center gap-1.5">
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
          <span role="status" className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/30 border border-white/[0.04]">
            <span
              aria-hidden="true"
              className={`w-1.5 h-1.5 rounded-full ${
                loading ? "bg-amber-400 animate-pulse" : error ? "bg-red-400" : "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)]"
              }`}
            />
            <span className="text-[10px] font-medium text-zinc-400">
              {loading ? "Connecting…" : error ? "Offline" : "Live"}
            </span>
          </span>
        </div>
      </div>

      {/* Smooth Scrollable Messages Container */}
      <div
        className="flex-1 min-h-0 relative flex flex-col"
        style={{
          background: "rgba(0, 0, 0, 0.22)",
          boxShadow: "inset 0 1px 4px rgba(0, 0, 0, 0.4)",
        }}
      >
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto overscroll-contain p-3 space-y-3 scroll-smooth [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.15)_transparent]"
          style={{
            WebkitOverflowScrolling: "touch",
          }}
        >
          {messages.length === 0 && !loading && !error && (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <Sparkles className="w-6 h-6 text-zinc-600 mb-2" />
              <p className="text-xs font-medium text-zinc-400">No messages yet</p>
              <p className="text-[11px] text-zinc-600 mt-1 max-w-[180px]">
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
                className="inline-flex cursor-pointer items-center gap-1.5 px-3 py-1 text-[10.5px] font-medium text-zinc-300 transition-colors hover:bg-white/[0.08] hover:text-white"
              >
                <ArrowDown aria-hidden="true" className="h-3 w-3 rotate-180" />
                <span>Load older messages</span>
              </button>
            </div>
          )}

          {visibleMessages.map((message) => {
            const isUser = message.from === "user";
            return (
              <div
                key={message.id}
                className={`flex flex-col transition-all duration-200 ${
                  isUser ? "items-end" : "items-start"
                }`}
              >
                <div className="flex items-center gap-1.5 px-1 mb-1 text-[10px]">
                  <span className="font-semibold text-zinc-300">
                    {message.author}
                  </span>
                  <span className="text-zinc-500 text-[9.5px]">
                    {message.timestamp}
                  </span>
                </div>

                <div
                  className={`max-w-[88%] px-3 py-2 text-xs leading-relaxed break-words shadow-sm transition-all ${
                    isUser
                      ? "bg-white text-zinc-950 rounded-2xl rounded-tr-xs font-medium shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
                      : "text-[#d4d4d8] rounded-2xl rounded-tl-xs"
                  }`}
                  style={
                    isUser
                      ? {}
                      : {
                          background: "rgba(255, 255, 255, 0.055)",
                          boxShadow:
                            "inset 0 0 0 1px rgba(255, 255, 255, 0.05), 0 2px 6px rgba(0, 0, 0, 0.25)",
                        }
                  }
                >
                  {message.text}
                </div>
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
            className="absolute bottom-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-800/95 hover:bg-zinc-700 text-white border border-white/10 text-xs font-semibold shadow-lg backdrop-blur-md transition-all active:scale-95 cursor-pointer z-10 animate-in fade-in zoom-in-90 duration-150"
          >
            <ArrowDown className="w-3.5 h-3.5 text-amber-300 animate-bounce" />
            <span>Latest messages</span>
            {unreadCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-amber-400 text-zinc-950 font-bold">
                +{unreadCount}
              </span>
            )}
          </button>
        )}
      </div>

      {error && (
        <div
          role="status"
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
            <span className="shrink-0 text-[8.5px] font-medium uppercase tracking-[0.14em] text-zinc-600">
              Ad
            </span>
            <BidvertiserAd slot="chat" className="flex items-center justify-center" />
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
              className="px-2 py-0.5 text-xs rounded-full hover:bg-white/[0.08] active:scale-90 transition-transform cursor-pointer"
              title={`Add ${emoji}`}
            >
              {emoji}
            </button>
          ))}
        </div>
        <span className="text-[10px] text-zinc-500 font-mono shrink-0 pl-1">
          {remainingChars <= 40 ? `${remainingChars} left` : ""}
        </span>
      </div>

      {/* Input Form with Enter-to-send */}
      <form
        onSubmit={handleSendMessage}
        className="p-2.5 sm:p-3 border-t border-white/[0.04] flex items-center gap-2 shrink-0 bg-[#191919]"
      >
        <label htmlFor="chat-name" className="sr-only">
          Your display name
        </label>
        <input
          id="chat-name"
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
            borderRadius: 12,
            background: "rgba(255, 255, 255, 0.04)",
          }}
          className="w-20 shrink-0 px-2.5 py-2 text-[11px] font-medium text-[#caccd2] placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-white/20"
        />

        <label htmlFor="chat-message" className="sr-only">
          Message
        </label>
        <input
          id="chat-message"
          type="text"
          value={inputText}
          onChange={(event) => setInputText(event.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              void handleSendMessage();
            }
          }}
          placeholder={chatVerified ? "Send a message (Press Enter)…" : "Verify you're human to chat…"}
          maxLength={280}
          enterKeyHint="send"
          autoComplete="off"
          style={{
            ...CHIP_STYLE,
            borderRadius: 12,
            background: "rgba(255, 255, 255, 0.04)",
          }}
          className="flex-1 min-w-0 px-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-white/20"
        />

        <button
          type="submit"
          disabled={!inputText.trim() || sending || !chatVerified}
          aria-label={sending ? "Sending message" : chatVerified ? "Send message" : "Verify to send messages"}
          style={{
            borderRadius: 12,
          }}
          className="flex items-center justify-center w-8 h-8 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95 cursor-pointer shrink-0 shadow-sm"
        >
          <Send aria-hidden="true" className={`w-3.5 h-3.5 ${sending ? "animate-pulse" : ""}`} />
        </button>
      </form>
    </div>
  );
}
