import * as React from "react";
import { bidvertiserOwnerId } from "@/lib/adAccounts";

// Bidvertiser widget tag. The account depends on the domain (see
// src/lib/adAccounts.ts), and the tag rewrites the id of the element it finds,
// so every placement gets its own host id — otherwise the second widget would
// attach to the first one and only one ad would render.

// The tag is tried twice: straight from the ad CDN first, so BidVertiser
// records the impression against the visitor's own request, and through
// /api/bidvertiser on this origin (see api/bidvertiser.js) only when that
// fails. The proxy serves the loader, its JSONP ad data, its native markup and
// its creatives, so a network that blocks the ad domains still gets a filled
// slot. The widget's own script lookup keeps working because the proxied URL
// carries "bidvertiser" and "bvwidgetid" ("bdvws" too, which the loader
// matches on when it scans for its own tag).
const DIRECT_LOADER = "https://cdn.hyperpromote.com/bidvertiser/tags/active/bdvws.js";
const PROXY_LOADER = "/api/bidvertiser?what=bdvws";

// A blocked loader fires onerror at once, but one that loads and then cannot
// reach its ad data or markup never reports anything, so the direct attempt is
// given this long to put an ad in the slot before the proxy takes over.
const DIRECT_ATTEMPT_MS = 3_000;

// Even with the proxy in place the slot can come back empty (no fill for this
// visitor, or the function unreachable). After this long without a rendered ad,
// the slot fills itself from the hub's server-side feed, and with a house ad
// after that.
const WIDGET_GRACE_MS = 7_000;

const FEED_MIN_WIDTH_CHARS = 12;

let instanceCount = 0;

type Attempt = "direct" | "proxy";

type Fallback = null | "feed" | "house";

function hasAd(host: HTMLElement) {
  return (
    host.querySelector("img, iframe, a, ins, object, embed") !== null ||
    (host.textContent || "").trim().length >= FEED_MIN_WIDTH_CHARS
  );
}

type FeedAd = {
  title: string;
  description: string;
  displayURL: string;
  redirect: string;
};

function readFeedAd(value: any): FeedAd | null {
  if (!value || typeof value.redirect !== "string" || !/^https?:\/\//i.test(value.redirect)) {
    return null;
  }
  const title = String(value.title || "").trim();
  if (title.length < 1) return null;
  return {
    title: title.slice(0, 120),
    description: String(value.description || "").trim().slice(0, 200),
    displayURL: String(value.displayURL || "").trim().slice(0, 80),
    redirect: value.redirect,
  };
}

export function BidvertiserAd({
  slot,
  className = "",
  reappearMs = 30_000,
  showClose = true,
  rows = 1,
  cols = 1,
  feedMax = 1,
}: {
  slot: string;
  className?: string;
  // Closing an ad only pauses it; it returns after this delay.
  reappearMs?: number;
  // Parents that draw their own close button turn this one off.
  showClose?: boolean;
  // The widget draws a rows × cols grid of ads; wide slots ask for more than
  // one so a single placement still shows several units.
  rows?: number;
  cols?: number;
  // How many text ads the feed stand-in may show when the widget is empty.
  feedMax?: number;
}) {
  const hostRef = React.useRef<HTMLDivElement>(null);
  const loadedAttemptRef = React.useRef<Attempt | null>(null);
  const [attempt, setAttempt] = React.useState<Attempt>("direct");
  const [closed, setClosed] = React.useState(false);
  const [fallback, setFallback] = React.useState<Fallback>(null);
  const [feedAds, setFeedAds] = React.useState<FeedAd[]>([]);
  const reopenTimerRef = React.useRef<number | null>(null);
  const ownerId = React.useMemo(() => bidvertiserOwnerId(), []);
  const [widgetId] = React.useState(() => {
    instanceCount += 1;
    return `ntv_${ownerId}_${slot}_${instanceCount}`;
  });

  React.useEffect(() => {
    const host = hostRef.current;
    // One loader per attempt per slot: a re-render must not stack a second ad.
    if (!host || loadedAttemptRef.current === attempt) return;
    loadedAttemptRef.current = attempt;

    const params: Record<string, string | number> = {
      bvwidgetid: widgetId,
      bvlinksownid: ownerId,
      rows: Math.min(Math.max(Math.round(rows), 1), 4),
      cols: Math.min(Math.max(Math.round(cols), 1), 4),
      textpos: "below",
      imagewidth: 120,
      mobilecols: 1,
      cb: Date.now(),
    };
    const query = Object.keys(params)
      .map((key) => `${key}=${encodeURIComponent(String(params[key]))}`)
      .join("&");

    // The retry starts from an empty slot: leftovers from the failed direct
    // attempt (markup, a placeholder image) must not sit next to the ad.
    if (attempt === "proxy") host.replaceChildren();

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.async = true;
    script.src = attempt === "direct" ? `${DIRECT_LOADER}?${query}` : `${PROXY_LOADER}&${query}`;

    let settled = false;
    let timer: number | null = null;
    let observer: MutationObserver | null = null;

    const stopWatching = () => {
      if (timer !== null) window.clearTimeout(timer);
      timer = null;
      if (observer) observer.disconnect();
      observer = null;
    };

    const settle = () => {
      if (settled) return;
      settled = true;
      stopWatching();
    };

    const fallBack = () => {
      if (settled) return;
      settle();
      setAttempt("proxy");
    };

    if (attempt === "direct") {
      script.onerror = fallBack;
      timer = window.setTimeout(fallBack, DIRECT_ATTEMPT_MS);
      observer = new MutationObserver(() => {
        if (hasAd(host)) settle();
      });
      observer.observe(host, { childList: true, subtree: true, characterData: true });
    }

    host.appendChild(script);

    return () => {
      settle();
      script.remove();
    };
  }, [widgetId, attempt, ownerId, rows, cols]);

  // Watch the widget's host: if the network answers, its ad wins and the
  // stand-in is dropped. If nothing arrives, the slot still shows something.
  // This only runs behind the proxy attempt; the direct attempt has its own
  // deadline above.
  React.useEffect(() => {
    const host = hostRef.current;
    if (!host || attempt !== "proxy") return;

    let cancelled = false;
    let timer: number | null = null;
    const stopTimer = () => {
      if (timer !== null) window.clearTimeout(timer);
      timer = null;
    };
    const fillSlot = async () => {
      try {
        const want = Math.min(Math.max(Math.round(feedMax), 1), 5);
        const query = new URLSearchParams({ max: String(want), q: slot, ref: location.href });
        const response = await fetch(`/api/bidvertiser?${query.toString()}`);
        const data = await response.json();
        const ads = (Array.isArray(data?.ads) ? data.ads : [])
          .map(readFeedAd)
          .filter((ad: FeedAd | null): ad is FeedAd => ad !== null)
          .slice(0, want);
        if (cancelled) return;
        if (ads.length) {
          setFeedAds(ads);
          setFallback("feed");
          return;
        }
      } catch {
        // The feed needs the network too; the house ad never does.
      }
      if (!cancelled) setFallback("house");
    };

    timer = window.setTimeout(() => void fillSlot(), WIDGET_GRACE_MS);

    const observer = new MutationObserver(() => {
      if (hasAd(host)) {
        stopTimer();
        setFallback(null);
      }
    });
    observer.observe(host, { childList: true, subtree: true, characterData: true });

    return () => {
      cancelled = true;
      stopTimer();
      observer.disconnect();
    };
  }, [slot, attempt, feedMax]);

  React.useEffect(() => {
    return () => {
      if (reopenTimerRef.current) window.clearTimeout(reopenTimerRef.current);
    };
  }, []);

  const closeAd = () => {
    setClosed(true);
    if (reopenTimerRef.current) window.clearTimeout(reopenTimerRef.current);
    reopenTimerRef.current = window.setTimeout(() => setClosed(false), reappearMs);
  };

  // The host stays mounted while hidden, so the widget does not have to reload
  // (and count as a second impression) when the ad comes back.
  return (
    <div
      className="relative inline-flex max-w-full"
      style={closed ? { display: "none" } : undefined}
      aria-hidden={closed || undefined}
    >
      <div ref={hostRef} id={widgetId} data-ad-slot={slot} className={className} />
      {fallback === "feed" && feedAds.length > 0 && (
        <div className="flex min-w-0 max-w-[44ch] flex-wrap items-baseline gap-x-2 gap-y-0.5 text-[11px] text-zinc-300">
          {feedAds.map((ad) => (
            <a
              key={ad.redirect}
              href={ad.redirect}
              target="_blank"
              rel="noopener sponsored nofollow"
              title={ad.description || ad.title}
              className="flex min-w-0 max-w-[22ch] items-baseline gap-1.5 truncate transition-colors hover:text-white"
            >
              <span className="truncate font-medium">{ad.title}</span>
              {ad.displayURL && (
                <span className="shrink-0 text-zinc-500">{ad.displayURL}</span>
              )}
            </a>
          ))}
        </div>
      )}
      {fallback === "house" && (
        <a
          href="/checkout"
          title="Ads keep the games free. Ultra is $1 and removes them."
          className="inline-flex shrink-0 items-baseline gap-1 whitespace-nowrap text-[11px] text-zinc-400 transition-colors hover:text-zinc-200"
        >
          <span className="font-medium text-zinc-200">Ultra</span>
          <span>$1 · no ads</span>
        </a>
      )}
      {showClose && (
        <button
          type="button"
          onClick={closeAd}
          aria-label="Close ad"
          title="Close ad (comes back in 30s)"
          className="absolute -right-1.5 -top-1.5 z-10 flex h-4 w-4 cursor-pointer items-center justify-center rounded-full bg-zinc-800 text-[11px] leading-none text-zinc-300 shadow ring-1 ring-white/15 transition-colors hover:bg-zinc-700 hover:text-white"
        >
          ×
        </button>
      )}
    </div>
  );
}
