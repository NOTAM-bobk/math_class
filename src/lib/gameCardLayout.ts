// The catalog can list games as classic rows or as a mosaic of cover art.
// The choice lives on this device and every open catalog listens for changes.

export type GameCardLayout = "classic" | "mosaic";

const LAYOUT_KEY = "polytrack_game_card_layout";
const LAYOUT_EVENT = "polytrack_game_card_layout_updated";

export const GAME_CARD_LAYOUTS: { id: GameCardLayout; name: string; description: string }[] = [
  {
    id: "classic",
    name: "Classic cards",
    description: "Title, description and tags in a roomy row.",
  },
  {
    id: "mosaic",
    name: "Cover mosaic",
    description: "Different sized boxes where the art is the game and the name sits on it.",
  },
];

export function loadGameCardLayout(): GameCardLayout {
  try {
    return localStorage.getItem(LAYOUT_KEY) === "mosaic" ? "mosaic" : "classic";
  } catch {
    return "classic";
  }
}

export function saveGameCardLayout(layout: GameCardLayout): void {
  try {
    localStorage.setItem(LAYOUT_KEY, layout);
  } catch {}
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(LAYOUT_EVENT, { detail: layout }));
  }
}

export function onGameCardLayoutChange(callback: (layout: GameCardLayout) => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = () => callback(loadGameCardLayout());
  window.addEventListener(LAYOUT_EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(LAYOUT_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}
