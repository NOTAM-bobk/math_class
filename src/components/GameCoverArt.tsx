import * as React from "react";
import { gameCoverUrl } from "@/lib/gameCovers";
import { gameCoverMeta } from "@/lib/gameCoverMeta";

// The same cover is used by the catalog cards, the recently played row and the
// game of the day banner: the game's own artwork at its largest stored
// resolution, then a live capture of the game page, then a generated cover made
// from the game name, its genre tint and its category icon.

export interface CoverGame {
  id: string;
  name: string;
  url: string;
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

// Thum.io needs no key; it streams a capture of the page as an image. That host
// is blocked on filtered networks, so the capture is fetched through the site's
// own /api/cover proxy first and only falls back to the direct URL.
function gameScreenshotUrls(url: string) {
  const target = screenshotTarget(url);
  if (!target) return [];
  return [
    `/api/cover?url=${encodeURIComponent(target)}`,
    `https://image.thum.io/get/width/800/crop/800/${target}`,
  ];
}

/** A generated cover: genre tint, category icon and the game's name. */
function GeneratedCover({
  name,
  accent,
  icon: Icon,
  compact,
}: {
  name: string;
  accent: string;
  icon?: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  compact: boolean;
}) {
  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{
        background: `linear-gradient(160deg, ${accent}2e 0%, #17171a 46%, #0f0f11 100%)`,
      }}
    >
      <span
        aria-hidden="true"
        className="absolute right-[-18%] top-[-28%] rounded-full"
        style={{ width: "76%", aspectRatio: "1", background: `${accent}24` }}
      />
      <span
        aria-hidden="true"
        className="absolute bottom-[-40%] left-[-10%] rounded-full"
        style={{ width: "64%", aspectRatio: "1", background: `${accent}14` }}
      />
      <div
        className={
          compact
            ? "relative flex h-full w-full items-center justify-center"
            : "relative flex h-full w-full flex-col justify-between p-3"
        }
      >
        {Icon &&
          (compact ? (
            <Icon className="h-4 w-4" style={{ color: accent }} />
          ) : (
            <span
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-black/25"
            >
              <Icon className="h-4 w-4" style={{ color: accent }} />
            </span>
          ))}
        {!compact && (
          <span className="line-clamp-2 text-[14px] font-semibold leading-tight text-white">
            {name}
          </span>
        )}
      </div>
    </div>
  );
}

export function GameCoverArt({
  game,
  accent,
  icon,
  compact = false,
  eager = false,
  sizes = "(min-width: 1280px) 22rem, (min-width: 768px) 33vw, 45vw",
}: {
  game: CoverGame;
  accent: string;
  icon?: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  compact?: boolean;
  eager?: boolean;
  sizes?: string;
}) {
  const [coverFailed, setCoverFailed] = React.useState(false);
  const [shotIndex, setShotIndex] = React.useState(0);
  const [loaded, setLoaded] = React.useState(false);
  const meta = React.useMemo(() => gameCoverMeta(game.id), [game.id]);
  const screenshotUrls = React.useMemo(() => gameScreenshotUrls(game.url), [game.url]);
  const screenshotUrl = screenshotUrls[shotIndex] ?? "";
  const coverUrl = meta?.src || gameCoverUrl(game.id) || LOCAL_GAME_COVERS[game.id] || "";
  const srcSet = meta?.srcset || undefined;
  const lqip = meta?.lqip;
  const showCover = !!coverUrl && !coverFailed;
  const showShot = !showCover && !!screenshotUrl;

  React.useEffect(() => {
    setCoverFailed(false);
    setLoaded(false);
  }, [coverUrl]);

  React.useEffect(() => {
    setShotIndex(0);
  }, [game.url]);

  const imageClass =
    "absolute inset-0 h-full w-full object-cover object-center transition-[opacity,filter] duration-300 ease-out";

  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden bg-[#141416]">
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(120% 120% at 20% 0%, ${accent}40 0%, rgba(18, 18, 22, 0.98) 62%, #0c0c0f 100%)`,
        }}
      />
      {/* Blurred placeholder: a 24px thumbnail scaled up until the real art lands. */}
      {lqip && showCover && (
        <img
          src={lqip}
          alt=""
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full scale-110 object-cover object-center blur-xl"
        />
      )}
      {showCover ? (
        <img
          src={coverUrl}
          srcSet={srcSet}
          sizes={srcSet ? sizes : undefined}
          alt=""
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setCoverFailed(true)}
          className={`${imageClass} ${loaded ? "opacity-100 blur-0" : "opacity-0 blur-md"}`}
        />
      ) : showShot ? (
        <img
          src={screenshotUrl}
          alt=""
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setShotIndex((index) => index + 1)}
          className={`${imageClass} ${loaded ? "opacity-100 blur-0" : "opacity-0 blur-md"}`}
        />
      ) : (
        <GeneratedCover name={game.name} accent={accent} icon={icon} compact={compact} />
      )}
    </div>
  );
}
