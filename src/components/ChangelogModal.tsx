import * as React from "react";
import { X, History, Sparkles } from "lucide-react";
import { CHANGELOG, SITE_VERSION } from "@/lib/changelog";
import { useDialogFocus } from "@/lib/dialogFocus";
import { GitHubActivityGrid } from "./GitHubActivityGrid";
import { getUpdateHistoryDays } from "@/lib/updateHistory";

interface ChangelogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CHIP_STYLE: React.CSSProperties = {
  borderRadius: 36,
  background: "rgba(255, 255, 255, 0.04)",
  boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.02), inset 0 1px 0 0 rgba(255, 255, 255, 0.04)",
};

export function ChangelogModal({ isOpen, onClose }: ChangelogModalProps) {
  const panelRef = React.useRef<HTMLDivElement>(null);
  useDialogFocus({ active: isOpen, onClose, panelRef });

  const activityDays = React.useMemo(() => getUpdateHistoryDays(), []);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overscroll-contain bg-black/80 p-3 backdrop-blur-sm sm:p-4"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="changelog-title"
        tabIndex={-1}
        className="relative my-auto flex w-full max-w-lg flex-col gap-4 p-5 text-zinc-100 focus:outline-none sm:max-w-3xl sm:p-6 md:max-h-[90vh]"
        style={{
          background: "#1d1d1d",
          borderRadius: 20,
          border: "none",
          boxShadow:
            "inset 0 0 0 1px rgba(44, 47, 54, 0.65), inset 0 0 50px 0 rgba(255, 255, 255, 0.02), 0 24px 60px -12px rgba(0, 0, 0, 0.9), 0 6px 16px rgba(0, 0, 0, 0.6)",
          fontFamily: "var(--app-font, system-ui, -apple-system, sans-serif)",
        }}
      >
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
          <div className="flex items-center gap-2">
            <div
              style={{ borderRadius: 36, background: "rgba(56, 189, 248, 0.12)" }}
              className="p-1.5 text-sky-400"
            >
              <History aria-hidden="true" className="h-4 w-4" />
            </div>
            <h2 id="changelog-title" className="text-base font-semibold tracking-tight text-zinc-100">
              Change log & Update History
            </h2>
            <span style={CHIP_STYLE} className="px-2.5 py-0.5 font-mono text-[11px] text-[#caccd2]">
              v{SITE_VERSION}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-lg p-1 text-zinc-400 transition-colors hover:bg-white/[0.08] hover:text-white"
            aria-label="Close change log"
          >
            <X aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>

        <div className="flex min-h-0 flex-col gap-4 overflow-y-auto pr-1">
          {/* GitHub Activity Grid component */}
          <div>
            <div className="mb-2 text-xs font-medium text-zinc-400">
              Activity & Update Frequency
            </div>
            <GitHubActivityGrid days={activityDays} cellSize={11} cellGap={3} />
          </div>

          <div className="flex flex-col gap-3">
            <div className="text-xs font-medium text-zinc-400">
              Release History
            </div>
            {CHANGELOG.map((entry, index) => (
              <section
                key={entry.version}
                aria-labelledby={`changelog-${entry.version}`}
                style={{
                  borderRadius: 14,
                  background: "rgba(0, 0, 0, 0.3)",
                  boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.04)",
                }}
                className="flex flex-col gap-2 p-3"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <h3
                    id={`changelog-${entry.version}`}
                    className="font-mono text-xs font-semibold text-zinc-100"
                  >
                    v{entry.version}
                  </h3>
                  {index === 0 && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/20 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
                      <Sparkles aria-hidden="true" className="h-3 w-3" />
                      Latest
                    </span>
                  )}
                  <span className="text-[11px] text-zinc-500">{entry.date}</span>
                </div>
                <p className="text-xs font-medium text-zinc-300">{entry.title}</p>
                <ul className="flex flex-col gap-1.5">
                  {entry.changes.map((change) => (
                    <li key={change} className="flex gap-2 text-[11.5px] leading-relaxed text-[#9BA1AA]">
                      <span aria-hidden="true" className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-zinc-600" />
                      <span>{change}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>

        <p className="border-t border-white/[0.06] pt-3 text-[10.5px] leading-relaxed text-zinc-500">
          Every major update adds an entry here. Older entries stay so you can see how the hub changed.
        </p>
      </div>
    </div>
  );
}
