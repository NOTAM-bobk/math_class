import * as React from "react";
import { ArrowLeft, Play, Volume2, VolumeX, X } from "lucide-react";
import { useDialogFocus } from "@/lib/dialogFocus";
import { GAME_AD_SLATE_SRC } from "@/lib/gameAdSlate";
import { SPONSOR_OFFER_URL, consumeSponsorOfferClick } from "@/lib/sponsorAd";
import { BidvertiserAd } from "./BidvertiserAd";

// Adcash In-stream Video, zone 12479070. Adcash delivers this format as a VAST
// tag meant for a VAST-compatible player, and its documented integration is
// Video.js with the IMA plugin, so this tag is handed to videojs-ima instead of
// being parsed by the hub. The tag is fetched through the same-origin
// `/adserv/*` Vercel rewrite (see vercel.json) so the request to
// youradexchange.com leaves from the deployment, not the visitor's browser.
export const GAME_AD_VAST_TAG_URL = "/adserv/video/select.php?r=12479070";

// Video.js, contrib-ads and the IMA plugin are bundled locally (see
// scripts/build-client.mjs), so the only other origin involved is Google's IMA
// SDK. The second URL is a same-origin Vercel rewrite for networks that block
// Google's CDN.
const IMA_SDK_SOURCES = [
  "https://imasdk.googleapis.com/js/sdkloader/ima3.js",
  "/imasdk/ima3.js",
];

// The Video.js skin and ad UI styles are only needed once a game click has an
// ad in front of it, so they are linked on first use rather than loaded on
// every visit.
const AD_STYLESHEETS = [
  "/dist/vendor/video-js.min.css",
  "/dist/vendor/videojs-contrib-ads.css",
  "/dist/vendor/videojs.ima.css",
];

// A break that never starts must not hold the game hostage: if the ad video has
// not started within six seconds, the overlay closes and the game opens.
const NO_AD_TIMEOUT_MS = 6_000;
// A hard stop for an ad that starts but never finishes.
const AD_RUN_TIMEOUT_MS = 180_000;

type AdPhase = "loading" | "playing" | "needs-play" | "skipped";

let adStylesPromise: Promise<void> | null = null;

function loadAdStyles(): Promise<void> {
  if (adStylesPromise) return adStylesPromise;
  adStylesPromise = Promise.all(
    AD_STYLESHEETS.map(
      (href) =>
        new Promise<void>((resolve) => {
          if (document.querySelector(`link[data-game-ad-style="${href}"]`)) {
            resolve();
            return;
          }
          const link = document.createElement("link");
          link.rel = "stylesheet";
          link.href = href;
          link.dataset.gameAdStyle = href;
          // A missing stylesheet must not keep the game from opening.
          link.onload = () => resolve();
          link.onerror = () => resolve();
          document.head.appendChild(link);
        })
    )
  ).then(() => undefined);
  return adStylesPromise;
}

function appendScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    // A stalled CDN would leave the overlay spinning forever; give each source
    // a bounded chance before falling through to the game.
    const timer = window.setTimeout(() => {
      script.remove();
      reject(new Error("The IMA SDK timed out"));
    }, 8000);
    script.onload = () => {
      window.clearTimeout(timer);
      resolve();
    };
    script.onerror = () => {
      window.clearTimeout(timer);
      script.remove();
      reject(new Error(`Could not load ${src}`));
    };
    document.head.appendChild(script);
  });
}

let imaSdkPromise: Promise<void> | null = null;

function loadImaSdk(): Promise<void> {
  const googleWindow = window as Window & { google?: { ima?: unknown } };
  if (googleWindow.google?.ima) return Promise.resolve();
  if (!imaSdkPromise) {
    imaSdkPromise = (async () => {
      let lastError: unknown = new Error("The IMA SDK did not load");
      for (const src of IMA_SDK_SOURCES) {
        try {
          await appendScript(src);
          // A blocked request can still come back as HTML with a 200; confirm
          // the SDK really registered before trusting the script.
          if (googleWindow.google?.ima) return;
        } catch (error) {
          lastError = error;
        }
      }
      throw lastError;
    })().catch((error) => {
      // Let the next click try again instead of caching the failure forever.
      imaSdkPromise = null;
      throw error;
    });
  }
  return imaSdkPromise;
}

/**
 * Plays the Adcash VAST tag before a game opens. The overlay is a real dialog:
 * focus moves in, Tab stays inside, and Escape (or "Back to class") tells the
 * caller not to launch after all. Any failure — no ad, blocked SDK, autoplay
 * refusal the visitor abandons — resolves through `onComplete` so a game is
 * never stuck behind an ad that cannot play.
 */
export function GameLaunchAd({
  game,
  onComplete,
  onCancel,
}: {
  game: { name: string };
  onComplete: () => void;
  onCancel: () => void;
}) {
  const panelRef = React.useRef<HTMLDivElement>(null);
  const stageRef = React.useRef<HTMLDivElement>(null);
  const playerRef = React.useRef<any>(null);
  const startPlaybackRef = React.useRef<() => void>(() => {});
  const completeRef = React.useRef(onComplete);
  completeRef.current = onComplete;
  const finishedRef = React.useRef(false);
  const playedRef = React.useRef(false);
  const goneRef = React.useRef(false);
  const [phase, setPhase] = React.useState<AdPhase>("loading");
  const [muted, setMuted] = React.useState(false);
  const [popupAd, setPopupAd] = React.useState(false);

  useDialogFocus({ active: true, onClose: onCancel, panelRef });

  React.useEffect(() => {
    let cancelled = false;
    let player: any = null;
    let watchdog: number | null = null;
    const clearWatchdog = () => {
      if (watchdog !== null) window.clearTimeout(watchdog);
      watchdog = null;
    };

    const finish = () => {
      if (cancelled || finishedRef.current) return;
      clearWatchdog();
      // Every failure exit — an empty VAST response, a blocked tag, a dead SDK,
      // the no-ad deadline — used to open the game straight away, which is why
      // the video ad was always skipped. Nothing played, so hold the visitor
      // with a popup ad instead; its Continue button is what launches the game.
      if (!playedRef.current) {
        try {
          player?.muted?.(true);
        } catch {
          // A player mid-teardown cannot be muted; the popup covers it anyway.
        }
        setPhase("skipped");
        setPopupAd(true);
        return;
      }
      finishedRef.current = true;
      // Let the ad break unwind before the overlay (and its player) goes away.
      window.setTimeout(() => {
        if (!cancelled) completeRef.current();
      }, 200);
    };

    const attemptPlay = async () => {
      if (cancelled || finishedRef.current || !player) return;
      try {
        player.ima?.initializeAdDisplayContainer?.();
      } catch {
        // Some browsers only allow this from a direct gesture; the SDK will
        // initialize the container itself if this call is refused.
      }
      try {
        await player.play();
        if (!cancelled) setPhase("playing");
        return;
      } catch {
        // The page click is long gone by the time the ad is ready, so an
        // unmuted autoplay can be refused. A muted retry normally succeeds and
        // the header offers an unmute button.
      }
      try {
        player.muted(true);
        if (!cancelled) setMuted(true);
        await player.play();
        if (!cancelled) setPhase("playing");
      } catch {
        if (!cancelled) setPhase("needs-play");
      }
    };
    startPlaybackRef.current = () => {
      void attemptPlay();
    };

    void (async () => {
      try {
        await Promise.all([loadAdStyles().catch(() => {}), loadImaSdk()]);
        const { default: videojs } = await import("video.js");
        await import("videojs-contrib-ads");
        await import("videojs-ima");
        if (cancelled || finishedRef.current || !stageRef.current) return;

        const element = document.createElement("video-js");
        element.className = "game-ad-player";
        element.setAttribute("playsinline", "");
        stageRef.current.appendChild(element);

        player = videojs(element, {
          controls: false,
          autoplay: false,
          muted: false,
          preload: "auto",
          fill: true,
          bigPlayButton: false,
          sources: [{ src: GAME_AD_SLATE_SRC, type: "video/mp4" }],
        });
        playerRef.current = player;

        player.on("ads-ad-started", () => {
          if (cancelled) return;
          playedRef.current = true;
          setPhase("playing");
          clearWatchdog();
          watchdog = window.setTimeout(finish, AD_RUN_TIMEOUT_MS);
        });
        // `adend` is the end-of-break signal from videojs-contrib-ads; it fires
        // for a finished ad pod as well as an empty VAST response. Everything
        // else here is a failure exit.
        player.on(["adend", "adserror", "adtimeout", "adscanceled", "error"], finish);

        player.ima({
          // IMA wants an absolute tag URL, so resolve the proxied path against
          // whatever origin is serving the hub.
          adTagUrl: new URL(GAME_AD_VAST_TAG_URL, window.location.origin).href,
          adWillAutoPlay: true,
          adWillPlayMuted: true,
          adLabel: "Advertisement",
        });

        watchdog = window.setTimeout(finish, NO_AD_TIMEOUT_MS);
        void attemptPlay();
      } catch {
        // No SDK, no plugin, or no player: the game is more important than
        // the ad, so open it.
        finish();
      }
    })();

    return () => {
      cancelled = true;
      goneRef.current = true;
      clearWatchdog();
      startPlaybackRef.current = () => {};
      try {
        player?.dispose?.();
      } catch {
        // Disposing a player mid-ad can throw inside the IMA plugin; nothing
        // is left to clean up in that case.
      }
      playerRef.current = null;
    };
  }, []);

  // The popup only ever appears when no video ad played, so closing it is the
  // visitor's way into the game.
  const openGame = () => {
    if (finishedRef.current || goneRef.current) return;
    finishedRef.current = true;
    setPopupAd(false);
    window.setTimeout(() => {
      if (!goneRef.current) completeRef.current();
    }, 120);
  };

  // Every third Continue click also opens the sponsor's offer in a new tab.
  // The game still opens here, and the tab is requested straight from the
  // click so the popup blocker accepts it.
  const continueToGame = () => {
    if (finishedRef.current || goneRef.current) return;
    if (consumeSponsorOfferClick()) {
      window.open(SPONSOR_OFFER_URL, "_blank", "noopener,noreferrer");
    }
    openGame();
  };

  const toggleMute = () => {
    const player = playerRef.current;
    if (!player) return;
    const next = !muted;
    player.muted(next);
    setMuted(next);
  };

  const statusText =
    phase === "loading"
      ? "Loading the advertisement…"
      : phase === "needs-play"
        ? "Tap play to watch the ad; your game opens when it ends."
        : phase === "skipped"
          ? "The video ad could not play. Close the sponsor to continue."
          : "Your game opens as soon as the ad ends.";

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Advertisement before ${game.name} opens`}
      tabIndex={-1}
      className="fixed inset-0 z-[95] flex flex-col bg-[#09090b] text-zinc-100 focus:outline-none"
    >
      <div
        className="flex shrink-0 items-center gap-2 border-b border-white/[0.1] bg-[#171717] px-2 pb-2 sm:px-3"
        style={{ paddingTop: "calc(0.5rem + env(safe-area-inset-top))" }}
      >
        <button
          type="button"
          onClick={onCancel}
          title="Cancel and return to the catalog"
          className="inline-flex h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-full bg-white px-3 text-xs font-semibold text-zinc-950 transition-colors hover:bg-zinc-100 active:scale-[0.98]"
        >
          <ArrowLeft aria-hidden="true" className="h-4 w-4" />
          <span>Back to class</span>
        </button>
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-semibold text-zinc-100 sm:text-sm">Advertisement</p>
          <p className="truncate text-[11px] text-zinc-500">
            {game.name} starts after the video
          </p>
        </div>
        <button
          type="button"
          onClick={toggleMute}
          aria-pressed={muted}
          aria-label={muted ? "Unmute the advertisement" : "Mute the advertisement"}
          title={muted ? "Unmute" : "Mute"}
          className="inline-flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-white/[0.08] hover:text-white active:scale-95"
        >
          {muted ? (
            <VolumeX aria-hidden="true" className="h-4 w-4" />
          ) : (
            <Volume2 aria-hidden="true" className="h-4 w-4" />
          )}
        </button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-4 overflow-y-auto p-3 sm:p-6">
        <div className="w-full max-w-4xl">
          <div
            ref={stageRef}
            className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black shadow-[0_24px_60px_rgba(0,0,0,0.55)] ring-1 ring-white/10"
          >
            {phase === "loading" && (
              <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 text-xs text-zinc-400">
                <span
                  aria-hidden="true"
                  className="h-5 w-5 animate-spin rounded-full border-2 border-white/15 border-t-white/80"
                />
                Loading the advertisement…
              </div>
            )}
            {phase === "needs-play" && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-black/85 p-4 text-center">
                <button
                  type="button"
                  onClick={() => startPlaybackRef.current()}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-zinc-950 transition-colors hover:bg-zinc-100 active:scale-[0.98]"
                >
                  <Play aria-hidden="true" className="h-4 w-4" />
                  Play ad
                </button>
                <p className="max-w-xs text-xs leading-relaxed text-zinc-400">
                  Your browser needs a tap before the video can start.
                </p>
              </div>
            )}
          </div>
          <p role="status" aria-live="polite" className="mt-3 text-center text-xs text-zinc-500">
            {statusText}
          </p>
        </div>
      </div>

      {/* z-[1001] keeps this above videojs-ima's own ad container (z-index
          1000), which could otherwise paint an empty black box over it. */}
      {popupAd && (
        <div className="fixed inset-0 z-[1001] flex items-center justify-center bg-black/80 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Sponsored message"
            className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#171717] p-4 shadow-[0_24px_60px_rgba(0,0,0,0.6)]"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-zinc-400">
                Ad
              </span>
              <button
                type="button"
                onClick={openGame}
                aria-label="Close the sponsor and open the game"
                className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X aria-hidden="true" className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="mt-3 flex min-h-[96px] items-center justify-center rounded-xl bg-black/40 px-3 py-3 text-center">
              <BidvertiserAd
                slot="game-launch"
                showClose={false}
                feedMax={4}
                className="flex flex-wrap items-center justify-center gap-2"
              />
            </div>
            <button
              type="button"
              onClick={continueToGame}
              className="mt-4 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-zinc-950 transition-colors hover:bg-zinc-100 active:scale-[0.98]"
            >
              <Play aria-hidden="true" className="h-4 w-4" />
              Continue to {game.name}
            </button>
            <p className="mt-2 text-center text-[11px] leading-relaxed text-zinc-500">
              The video ad could not play, so here is a sponsor instead.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
