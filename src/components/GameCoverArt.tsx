import * as React from "react";

// The same generated cover is used by the mosaic catalog cards and the
// recently played row: a genre-tinted backdrop with the game's own icon where
// one exists, and the game's initials when it lives on this origin.

export interface CoverGame {
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

export function GameCoverArt({
  game,
  accent,
  compact = false,
}: {
  game: CoverGame;
  accent: string;
  compact?: boolean;
}) {
  const [iconFailed, setIconFailed] = React.useState(false);
  const iconUrl = React.useMemo(() => gameIconUrl(game.url), [game.url]);
  const initials = React.useMemo(() => gameInitials(game.name), [game.name]);
  const showIcon = !!iconUrl && !iconFailed;

  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(125% 125% at 18% 6%, ${accent}66 0%, rgba(18, 18, 22, 0.96) 56%, #0c0c0f 100%)`,
        }}
      />
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
            loading="lazy"
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
      {!compact && <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />}
    </div>
  );
}
