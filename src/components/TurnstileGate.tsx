import * as React from "react";
import { Loader2, ShieldCheck, ShieldAlert } from "lucide-react";
import {
  fetchTurnstileSiteKey,
  loadTurnstileScript,
  markChatVerified,
  verifyTurnstileToken,
} from "@/lib/turnstile";

type GateState = "loading" | "ready" | "checking" | "error" | "unconfigured";

/**
 * Renders Cloudflare's Turnstile widget and calls `onVerified` once Cloudflare
 * confirms the token on the server. If the site key is not configured yet the
 * gate steps out of the way instead of locking chat forever.
 */
export function TurnstileGate({ onVerified }: { onVerified: () => void }) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [state, setState] = React.useState<GateState>("loading");
  const [message, setMessage] = React.useState("");

  React.useEffect(() => {
    let cancelled = false;
    let widgetId: string | null = null;

    const start = async () => {
      const siteKey = await fetchTurnstileSiteKey();
      if (cancelled) return;
      if (!siteKey) {
        setState("unconfigured");
        onVerified();
        return;
      }

      try {
        await loadTurnstileScript();
        if (cancelled || !containerRef.current || !window.turnstile) return;
        setState("ready");
        widgetId = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          theme: "dark",
          size: "flexible",
          callback: async (token: string) => {
            if (cancelled) return;
            setState("checking");
            const verified = await verifyTurnstileToken(token);
            if (cancelled) return;
            if (verified) {
              markChatVerified();
              setState("ready");
              onVerified();
            } else {
              setMessage("Verification failed. Try the check again.");
              setState("error");
              if (widgetId) window.turnstile?.reset(widgetId);
            }
          },
          "error-callback": () => {
            if (cancelled) return;
            setMessage("The verification widget could not load. Check your connection and retry.");
            setState("error");
          },
          "expired-callback": () => {
            if (!cancelled && widgetId) window.turnstile?.reset(widgetId);
          },
        });
      } catch {
        if (!cancelled) {
          setMessage("The verification widget could not load. Check your connection and retry.");
          setState("error");
        }
      }
    };

    void start();
    return () => {
      cancelled = true;
      if (widgetId && window.turnstile) {
        try {
          window.turnstile.remove(widgetId);
        } catch {}
      }
    };
  }, [onVerified]);

  if (state === "unconfigured") return null;

  return (
    <div className="mx-2.5 mb-1.5 rounded-xl border border-white/[0.07] bg-white/[0.03] px-2.5 py-2 sm:mx-3">
      <div className="flex items-center gap-1.5 text-[11px] font-medium text-zinc-300">
        {state === "error" ? (
          <ShieldAlert aria-hidden="true" className="h-3.5 w-3.5 text-amber-300" />
        ) : state === "checking" ? (
          <Loader2 aria-hidden="true" className="h-3.5 w-3.5 animate-spin text-sky-300" />
        ) : (
          <ShieldCheck aria-hidden="true" className="h-3.5 w-3.5 text-emerald-300" />
        )}
        <span>
          {state === "checking" ? "Checking you're human…" : "Verify you're human to send messages"}
        </span>
      </div>
      <div ref={containerRef} className="mt-2 min-h-[65px]" />
      {state === "error" && message && (
        <p role="status" className="mt-1 text-[11px] leading-snug text-amber-200">
          {message}
        </p>
      )}
    </div>
  );
}
