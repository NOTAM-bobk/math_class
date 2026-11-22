import * as React from "react";
import { BellOff, X } from "lucide-react";

const AUTO_HIDE_MS = 12_000;

/**
 * The occasional reminder that Ultra takes the ads away. It is a notification,
 * not a dialog: it sits in the corner, never takes focus, closes itself after a
 * few seconds, and leaves the page usable the whole time.
 */
export function UltraNudgeToast({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  React.useEffect(() => {
    if (!isOpen) return;
    const timer = window.setTimeout(onClose, AUTO_HIDE_MS);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-3 bottom-[calc(4.5rem+env(safe-area-inset-bottom))] z-[65] flex justify-end sm:inset-x-auto sm:bottom-4 sm:right-4"
    >
      <div className="pointer-events-auto w-full max-w-sm rounded-xl border border-white/[0.1] bg-[#1d1d1d] p-4 text-zinc-100 shadow-[0_18px_48px_rgba(0,0,0,0.55)] animate-enter">
        <div className="flex items-start gap-3">
          <span
            aria-hidden="true"
            className="mt-0.5 shrink-0 rounded-full bg-amber-400/10 p-1.5 text-amber-300"
          >
            <BellOff className="h-4 w-4" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium">Ads keep the games free. Ultra removes them.</p>
            <p className="mt-1 text-xs leading-relaxed text-zinc-400">
              $1 once. No ad bar, no ad slots, nothing renews.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Ultra reminder"
            className="-mr-1 -mt-1 shrink-0 rounded-full p-1 text-zinc-500 transition-colors hover:bg-white/[0.06] hover:text-zinc-200"
          >
            <X aria-hidden="true" className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="mt-3 flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-zinc-400 transition-colors hover:bg-white/[0.06] hover:text-zinc-100"
          >
            Not now
          </button>
          <a
            href="/checkout"
            className="rounded-lg bg-amber-400 px-2.5 py-1.5 text-xs font-semibold text-[#171205] transition-colors hover:bg-amber-300"
          >
            Upgrade · $1
          </a>
        </div>
      </div>
    </div>
  );
}
