// Editor's picks are chosen in the admin panel. The list is stored on the
// backend so every visitor sees the same picks, with a local copy so the
// catalog updates instantly and still works while the request is in flight.

const EDITOR_PICKS_KEY = "polytrack_editor_picks";
const EDITOR_PICKS_EVENT = "polytrack_editor_picks_updated";
const EDITOR_PICKS_ENDPOINT = "/api/editor-picks";

function cleanIds(ids: unknown): string[] {
  if (!Array.isArray(ids)) return [];
  return Array.from(
    new Set(ids.filter((id): id is string => typeof id === "string" && id.length > 0))
  );
}

function dispatchChange(ids: Set<string> | null) {
  try {
    window.dispatchEvent(
      new CustomEvent(EDITOR_PICKS_EVENT, { detail: ids ? Array.from(ids) : null })
    );
  } catch {}
}

/** The admin's picks, or null when the catalog's own editorsPick fields win. */
export function loadEditorPicks(): Set<string> | null {
  try {
    const raw = localStorage.getItem(EDITOR_PICKS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.configured !== true) return null;
    return new Set(cleanIds(parsed.ids));
  } catch {
    return null;
  }
}

export function saveEditorPicks(ids: Iterable<string>): void {
  try {
    const list = cleanIds(Array.from(ids));
    localStorage.setItem(EDITOR_PICKS_KEY, JSON.stringify({ configured: true, ids: list }));
    dispatchChange(new Set(list));
  } catch {}
}

/** Forget the override and fall back to the picks shipped in the catalog. */
export function clearEditorPicks(): void {
  try {
    localStorage.removeItem(EDITOR_PICKS_KEY);
    dispatchChange(null);
  } catch {}
}

export function onEditorPicksChange(
  callback: (ids: Set<string> | null) => void
): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = (event: Event) => {
    const detail = (event as CustomEvent<string[] | null>).detail;
    callback(detail ? new Set(cleanIds(detail)) : loadEditorPicks());
  };
  const storageHandler = (event: StorageEvent) => {
    if (event.key === EDITOR_PICKS_KEY) callback(loadEditorPicks());
  };
  window.addEventListener(EDITOR_PICKS_EVENT, handler);
  window.addEventListener("storage", storageHandler);
  return () => {
    window.removeEventListener(EDITOR_PICKS_EVENT, handler);
    window.removeEventListener("storage", storageHandler);
  };
}

/** Pull the shared list from the backend and cache it for the next visit. */
export async function fetchEditorPicks(): Promise<Set<string> | null> {
  const response = await fetch(EDITOR_PICKS_ENDPOINT, {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  if (!response.ok) throw new Error("Editor's picks are unavailable");
  const data = await response.json();
  if (data && data.configured === true) {
    const ids = cleanIds(data.picks);
    saveEditorPicks(ids);
    return new Set(ids);
  }
  if (data && data.configured === false) {
    clearEditorPicks();
    return null;
  }
  throw new Error("Editor's picks are unavailable");
}

/** Admin save: replace the shared list with these ids. */
export async function saveEditorPicksRemote(password: string, ids: Iterable<string>): Promise<string[]> {
  const picks = cleanIds(Array.from(ids));
  const response = await fetch(EDITOR_PICKS_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Admin-Password": password,
    },
    body: JSON.stringify({ picks }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(
      typeof data?.error === "string" ? data.error : "Could not save Editor's picks."
    );
  }
  const saved = cleanIds(data?.picks ?? picks);
  saveEditorPicks(saved);
  return saved;
}
