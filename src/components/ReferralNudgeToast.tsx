import * as React from "react";
import { ExternalLink, Gift, X } from "lucide-react";
import { loadReferrals, type ReferralLink } from "@/lib/referrals";

const AUTO_HIDE_MS = 14_000;
const ROTATION_KEY = "polytrack_referral_nudge_index";

/**
 * Picks the next referral in the list, so repeated reminders do not always
 * point at the same partner link.
 */
function takeNextReferral(links: ReferralLink[]): ReferralLink | null {
  if (links.length === 0) return null;
  let index = 0;
  try {
    const stored = Number.parseInt(localStorage.getItem(ROTATION_KEY) || "0", 10);
    if (Number.isFinite(stored) && stored >= 0) index = stored % links.length;
    localStorage.setItem(ROTATION_KEY, String((index + 1) % links.length));
  } catch {}
  return links[index] ?? links[0];
}

/**
 * The occasional partner referral in the bottom corner. Like the Ultra
 * reminder it is a notification, not a dialog: it never takes focus, closes
 * itself after a few seconds, and leaves the page usable the whole time.
 */
export function ReferralNudgeToast({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [referral, setReferral] = React.useState<ReferralLink | null>(null);
  const onCloseRef = React.useRef(onClose);

  React.useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  React.useEffect(() => {
    if (!isOpen) return;
    let active = true;
    setReferral(null);
    loadReferrals().then((links) => {
      if (!active) return;
      const pick = takeNextReferral(links);
      if (pick) setReferral(pick);
      else onCloseRef.current();
    });
    return () => {
      active = false;
    };
  }, [isOpen]);

  React.useEffect(() => {
    if (!isOpen) return;
    const timer = window.setTimeout(() => onCloseRef.current(), AUTO_HIDE_MS);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCloseRef.current();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  if (!isOpen || !referral) return null;

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
            <Gift className="h-4 w-4" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-medium">{referral.title}</p>
              {referral.badge && (
                <span className="font-mono text-[10px] uppercase tracking-wide text-zinc-500">
                  {referral.badge}
                </span>
              )}
            </div>
            {referral.description && (
              <p className="mt-1 text-xs leading-relaxed text-zinc-400">{referral.description}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close referral reminder"
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
            href={referral.url}
            target="_blank"
            rel="noopener noreferrer sponsored"
            onClick={onClose}
            className="inline-flex items-center gap-1 rounded-lg bg-zinc-100 px-2.5 py-1.5 text-xs font-semibold text-zinc-900 transition-colors hover:bg-white"
          >
            {referral.cta || "Open"}
            <ExternalLink aria-hidden="true" className="h-3 w-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
