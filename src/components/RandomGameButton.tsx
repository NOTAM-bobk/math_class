import * as React from "react";
import { Shuffle } from "lucide-react";

// The catalog owns the game list, so the header button just asks it to pick.
export const RANDOM_GAME_EVENT = "polytrack:random-game";

const ICON_BUTTON_STYLE: React.CSSProperties = {
  borderRadius: 999,
  background: "rgba(255, 255, 255, 0.06)",
  boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.05), inset 0 1px 0 0 rgba(255, 255, 255, 0.06)",
};

export function RandomGameButton({ className = "" }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new CustomEvent(RANDOM_GAME_EVENT))}
      title="Play a random game"
      aria-label="Play a random game"
      style={ICON_BUTTON_STYLE}
      className={`inline-flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full p-0 text-zinc-300 transition-colors hover:bg-white/[0.12] hover:text-white active:scale-[0.98] ${className}`}
    >
      <Shuffle aria-hidden="true" className="h-4 w-4" />
    </button>
  );
}
