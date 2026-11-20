import * as React from "react";
import { ShieldAlert } from "lucide-react";

const PANIC_STORAGE_KEY = "polytrack_panic_url";
const DEFAULT_TARGET = "https://www.wikipedia.org/";

export function PanicButton({ className = "" }: { className?: string }) {
  const triggerPanic = React.useCallback(() => {
    let target = DEFAULT_TARGET;
    try {
      target = localStorage.getItem(PANIC_STORAGE_KEY) || DEFAULT_TARGET;
    } catch {
      // Storage can be unavailable; the default destination still works.
    }
    try {
      window.location.replace(target);
    } catch {
      window.location.assign(target);
    }
  }, []);

  // "]" is the only panic shortcut: Escape belongs to closing dialogs, so it must not navigate away.
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "]" || event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName))
      ) {
        return;
      }
      event.preventDefault();
      triggerPanic();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [triggerPanic]);

  return (
    <button
      type="button"
      data-tour-target="panic"
      onClick={triggerPanic}
      title="Panic: press ] anywhere to leave this site instantly"
      aria-keyshortcuts="]"
      aria-label="Panic: leave this site"
      className={`inline-flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-red-600/90 text-white shadow-sm transition-colors hover:bg-red-500 active:scale-[0.98] ${className}`}
    >
      <ShieldAlert aria-hidden="true" className="h-4 w-4" />
    </button>
  );
}
