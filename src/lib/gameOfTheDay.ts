// The admin's pick for the "Game of the day" section at the top of the catalog.
// Stored on this device, like the admin's other selections, and broadcast so the
// catalog updates the moment the admin sets a new game.

const GAME_OF_THE_DAY_KEY = "polytrack_game_of_the_day";
const GAME_OF_THE_DAY_EVENT = "polytrack_game_of_the_day_updated";

export interface GameOfTheDay {
  gameId: string;
  setAt: string;
}

export function loadGameOfTheDay(): GameOfTheDay | null {
  try {
    const raw = localStorage.getItem(GAME_OF_THE_DAY_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed.gameId !== "string" || !parsed.gameId) return null;
    return {
      gameId: parsed.gameId,
      setAt: typeof parsed.setAt === "string" ? parsed.setAt : new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

export function loadGameOfTheDayId(): string {
  return loadGameOfTheDay()?.gameId || "";
}

export function saveGameOfTheDay(gameId: string): void {
  if (!gameId) return;
  try {
    localStorage.setItem(
      GAME_OF_THE_DAY_KEY,
      JSON.stringify({ gameId, setAt: new Date().toISOString() })
    );
    dispatchChange();
  } catch {}
}

export function clearGameOfTheDay(): void {
  try {
    localStorage.removeItem(GAME_OF_THE_DAY_KEY);
    dispatchChange();
  } catch {}
}

function dispatchChange() {
  try {
    window.dispatchEvent(new CustomEvent(GAME_OF_THE_DAY_EVENT));
  } catch {}
}

export function onGameOfTheDayChange(callback: (game: GameOfTheDay | null) => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = () => callback(loadGameOfTheDay());
  const storageHandler = (event: StorageEvent) => {
    if (event.key === GAME_OF_THE_DAY_KEY) handler();
  };
  window.addEventListener(GAME_OF_THE_DAY_EVENT, handler);
  window.addEventListener("storage", storageHandler);
  return () => {
    window.removeEventListener(GAME_OF_THE_DAY_EVENT, handler);
    window.removeEventListener("storage", storageHandler);
  };
}
