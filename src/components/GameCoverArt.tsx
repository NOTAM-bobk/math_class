import * as React from "react";
import { gameCoverUrl } from "@/lib/gameCovers";

// The same cover is used by the mosaic catalog cards, the recently played row
// and the game of the day banner: the game's own artwork where it ships one,
// then a live screenshot of the game page, then a genre-tinted backdrop with
// the game's icon, and finally its initials.

export interface CoverGame {
  id: string;
  name: string;
  url: string;
}

export function gameInitials(name: string) {
  return (
    name
      .split(/[^A-Za-z0-9]+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0])
      .join("") || "🎮"
  ).toUpperCase();
}

// A game on another origin has its own icon; same-origin pages would only show
// the hub's icon, so those get the generated cover instead.
export function gameIconUrl(url: string) {
  try {
    const parsed = new URL(url, window.location.origin);
    if (parsed.origin === window.location.origin) return "";
    return `${parsed.origin}/favicon.ico`;
  } catch {
    return "";
  }
}

// The hub hosts PolyTrack itself, so its in-game scenery is the cover art.
const LOCAL_GAME_COVERS: Record<string, string> = {
  "polytrack-050": "/0.5.0/images/official_tracks.jpg",
};

// Most imported games ship no artwork of their own, so each genre has a
// painted backdrop. It keeps the hero and the cards looking like game art
// instead of an empty gradient with initials.
const GENRE_ART: Record<string, string> = {
  "#ef4444": "/covers/genre-action.jpg",
  "#eab308": "/covers/genre-driving.jpg",
  "#22c55e": "/covers/genre-sports.jpg",
  "#a855f7": "/covers/genre-arcade.jpg",
  "#06b6d4": "/covers/genre-puzzle.jpg",
  "#ec4899": "/covers/genre-casual.jpg",
  "#f97316": "/covers/genre-flash.jpg",
};
const GENERIC_ART = "/covers/genre-generic.jpg";

// The screenshot service fetches pages from its own network, so it cannot see
// localhost or a password-protected preview host. Games the hub serves itself
// are captured from the public deployment instead.
const PUBLIC_GAME_ORIGIN = "https://polytrack.sawyerbobk563.workers.dev";
const PROXY_HOSTS: Record<string, string> = {
  og: "https://www.onlinegames.io/",
  ogc: "https://cloud.onlinegames.io/",
};

function isLocalHost(hostname: string) {
  return (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname.endsWith(".localhost") ||
    hostname.endsWith(".style.dev")
  );
}

/** The public page a screenshot should capture, or "" when there is none. */
function screenshotTarget(url: string) {
  try {
    const resolved = new URL(url, window.location.origin);
    // Proxied games are captured at their own host, not through /api/proxy.
    const proxy = resolved.pathname.match(/^\/api\/proxy\/(og|ogc)\/(.*)$/);
    const target = proxy
      ? `${PROXY_HOSTS[proxy[1]]}${proxy[2]}${resolved.search}`
      : resolved.origin === window.location.origin
        ? new URL(
            `${resolved.pathname}${resolved.search}`,
            isLocalHost(window.location.hostname) ? PUBLIC_GAME_ORIGIN : window.location.origin
          ).href
        : resolved.href;
    return /^https?:/i.test(target) ? target : "";
  } catch {
    return "";
  }
}

function gameScreenshotUrl(url: string) {
  const target = screenshotTarget(url);
  // Thum.io needs no key; it streams a capture of the page as an image.
  return target ? `https://image.thum.io/get/width/800/crop/800/${target}` : "";
}

export function GameCoverArt({
  game,
  accent,
  compact = false,
  eager = false,
}: {
  game: CoverGame;
  accent: string;
  compact?: boolean;
  eager?: boolean;
}) {
  const [iconFailed, setIconFailed] = React.useState(false);
  const [coverFailed, setCoverFailed] = React.useState(false);
  const [shotFailed, setShotFailed] = React.useState(false);
  const [artFailed, setArtFailed] = React.useState(false);
  const iconUrl = React.useMemo(() => gameIconUrl(game.url), [game.url]);
  const screenshotUrl = React.useMemo(() => gameScreenshotUrl(game.url), [game.url]);
  const coverUrl = React.useMemo(
    () => gameCoverUrl(game.id) || LOCAL_GAME_COVERS[game.id] || "",
    [game.id]
  );
  const initials = React.useMemo(() => gameInitials(game.name), [game.name]);
  const artUrl = GENRE_ART[accent] ?? GENERIC_ART;
  const showCover = !!coverUrl && !coverFailed;
  const showShot = !showCover && !!screenshotUrl && !shotFailed;
  const showArt = !showCover && !showShot && !artFailed;
  const showIcon = !showCover && !showShot && !showArt && !!iconUrl && !iconFailed;

  React.useEffect(() => {
    setCoverFailed(false);
  }, [coverUrl]);

  React.useEffect(() => {
    setShotFailed(false);
  }, [screenshotUrl]);

  React.useEffect(() => {
    setArtFailed(false);
  }, [artUrl]);

  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(125% 125% at 18% 6%, ${accent}66 0%, rgba(18, 18, 22, 0.96) 56%, #0c0c0f 100%)`,
        }}
      />
      {showCover ? (
        <img
          src={coverUrl}
          alt=""
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          onError={() => setCoverFailed(true)}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      ) : showShot ? (
        <img
          src={screenshotUrl}
          alt=""
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          onError={() => setShotFailed(true)}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      ) : showArt ? (
        <img
          src={artUrl}
          alt=""
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          onError={() => setArtFailed(true)}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      ) : (
        <>
          {!compact && (
            <div
              className="absolute inset-0 opacity-[0.12]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.45) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.45) 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            />
          )}
          <div className={`absolute inset-0 flex items-center justify-center ${compact ? "" : "pb-8"}`}>
            {showIcon ? (
              <img
                src={iconUrl}
                alt=""
                loading={eager ? "eager" : "lazy"}
                decoding="async"
                onError={() => setIconFailed(true)}
                className={`object-contain drop-shadow-[0_6px_18px_rgba(0,0,0,0.6)] transition-transform duration-300 group-hover:scale-110 ${
                  compact ? "h-5 w-5 rounded" : "h-12 w-12 rounded-xl"
                }`}
              />
            ) : (
              <span
                className={`select-none font-black tracking-tight text-white/90 drop-shadow-[0_6px_18px_rgba(0,0,0,0.6)] transition-transform duration-300 group-hover:scale-105 ${
                  compact ? "text-[13px]" : "text-4xl"
                }`}
              >
                {initials}
              </span>
            )}
          </div>
        </>
      )}
      {!compact && <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />}
    </div>
  );
}
