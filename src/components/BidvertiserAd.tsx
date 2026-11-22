import * as React from "react";

// Bidvertiser widget tag (account 2108105). The tag rewrites the id of the
// element it finds, so every placement gets its own host id — otherwise the
// second widget would attach to the first one and only one ad would render.
const WIDGET_BASE_ID = "ntv_2108105";
const OWNER_ID = 2108105;
const SCRIPT_PATH = "/bidvertiser/tags/active/bdvws.js";

// The widget script loads from this origin, but it then asks its own ad server
// (a CloudFront host) for the ad. A filtered network blocks that request, so the
// slot would stay an empty hole. After this long without a rendered ad, the slot
// fills itself from the hub's server-side feed, and with a house ad after that.
const WIDGET_GRACE_MS = 7_000;

const FEED_MIN_WIDTH_CHARS = 12;

let instanceCount = 0;

type Fallback = null | "feed" | "house";

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
}: {
  slot: string;
  className?: string;
  // Closing an ad only pauses it; it returns after this delay.
  reappearMs?: number;
  // Parents that draw their own close button turn this one off.
  showClose?: boolean;
}) {
  const hostRef = React.useRef<HTMLDivElement>(null);
  const loadedRef = React.useRef(false);
  const [closed, setClosed] = React.useState(false);
  const [fallback, setFallback] = React.useState<Fallback>(null);
  const [feedAd, setFeedAd] = React.useState<FeedAd | null>(null);
  const reopenTimerRef = React.useRef<number | null>(null);
  const [widgetId] = React.useState(() => {
    instanceCount += 1;
    return `${WIDGET_BASE_ID}_${slot}_${instanceCount}`;
  });

  React.useEffect(() => {
    const host = hostRef.current;
    // One loader per slot: a re-render must not stack a second ad.
    if (!host || loadedRef.current) return;
    loadedRef.current = true;

    const params: Record<string, string | number> = {
      bvwidgetid: widgetId,
      bvlinksownid: OWNER_ID,
      rows: 1,
      cols: 1,
      textpos: "below",
      imagewidth: 120,
      mobilecols: 1,
      cb: Date.now(),
    };
    const query = Object.keys(params)
      .map((key) => `${key}=${encodeURIComponent(String(params[key]))}`)
      .join("&");

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.async = true;
    // Same-origin path: vercel.json rewrites it to the ad CDN so restricted networks still load it.
    script.src = `${SCRIPT_PATH}?${query}`;
    host.appendChild(script);
  }, [widgetId]);

  // Watch the widget's host: if the network answers, its ad wins and the
  // stand-in is dropped. If nothing arrives, the slot still shows something.
  React.useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let cancelled = false;
    let timer: number | null = null;
    const stopTimer = () => {
      if (timer !== null) window.clearTimeout(timer);
      timer = null;
    };
    const hasAd = () =>
      host.querySelector("img, iframe, a, ins, object, embed") !== null ||
      (host.textContent || "").trim().length >= FEED_MIN_WIDTH_CHARS;

    const fillSlot = async () => {
      try {
        const query = new URLSearchParams({ max: "1", q: slot, ref: location.href });
        const response = await fetch(`/api/bidvertiser?${query.toString()}`);
        const data = await response.json();
        const ad = readFeedAd(Array.isArray(data?.ads) ? data.ads[0] : null);
        if (cancelled) return;
        if (ad) {
          setFeedAd(ad);
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
      if (hasAd()) {
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
  }, [slot]);

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
      {fallback === "feed" && feedAd && (
        <a
          href={feedAd.redirect}
          target="_blank"
          rel="noopener sponsored nofollow"
          title={feedAd.description || feedAd.title}
          className="flex min-w-0 max-w-[44ch] items-baseline gap-1.5 truncate text-[11px] text-zinc-300 transition-colors hover:text-white"
        >
          <span className="truncate font-medium">{feedAd.title}</span>
          {feedAd.displayURL && (
            <span className="shrink-0 text-zinc-500">{feedAd.displayURL}</span>
          )}
        </a>
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
