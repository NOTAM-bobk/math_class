import * as React from "react";
import { BellOff, X } from "lucide-react";
import { useDialogFocus } from "@/lib/dialogFocus";

/**
 * The occasional reminder that the visitor can hide every ad. It is a real
 * dialog: focus moves in, Tab stays inside, Escape closes it, and focus returns
 * to whatever opened it.
 */
export function AdsNudgeModal({
  isOpen,
  onClose,
  onTurnOffAds,
}: {
  isOpen: boolean;
  onClose: () => void;
  onTurnOffAds: () => void;
}) {
  const panelRef = React.useRef<HTMLDivElement>(null);
  useDialogFocus({ active: isOpen, onClose, panelRef });

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="ads-nudge-title"
        aria-describedby="ads-nudge-description"
        tabIndex={-1}
        className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#1d1d1d] p-5 text-zinc-100 shadow-[0_24px_60px_rgba(0,0,0,0.7)] focus:outline-none"
      >
        <div className="flex items-start gap-3">
          <span aria-hidden="true" className="rounded-full bg-amber-500/10 p-2 text-amber-300">
            <BellOff className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <h2 id="ads-nudge-title" className="text-base font-semibold">
              Don’t like ads? You can turn them off.
            </h2>
            <p id="ads-nudge-description" className="mt-1 text-xs leading-relaxed text-zinc-300">
              Every ad on the site can be hidden for this browser, anytime in Settings.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close ad reminder"
            className="shrink-0 rounded-full p-1 text-zinc-400 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-5 flex flex-wrap justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-2 text-xs font-medium text-zinc-300 transition-colors hover:bg-white/[0.06] hover:text-zinc-100"
          >
            Maybe later
          </button>
          <button
            type="button"
            onClick={onTurnOffAds}
            className="rounded-lg bg-white px-3 py-2 text-xs font-semibold text-zinc-950 transition-colors hover:bg-zinc-100"
          >
            Turn off ads
          </button>
        </div>
      </div>
    </div>
  );
}
