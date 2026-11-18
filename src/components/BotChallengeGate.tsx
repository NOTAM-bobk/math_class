import * as React from "react";
import { Loader2, ShieldAlert, ShieldCheck } from "lucide-react";
import { markBotChallengePassed } from "@/lib/botDetection";
import {
  fetchTurnstileSiteKey,
  loadTurnstileScript,
  verifyTurnstileToken,
} from "@/lib/turnstile";

type GateState = "loading" | "ready" | "checking" | "error" | "unconfigured";

/**
 * Full-screen "I'm not a robot" check shown after the loading reveal when the
 * startup bot check flags the browser. Uses the same Cloudflare Turnstile
 * widget and server verification as chat. If no site key is configured (some
 * mirrors do not set one), the gate steps aside instead of locking the hub.
 */
export function BotChallengeGate({ onVerified }: { onVerified: () => void }) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const widgetIdRef = React.useRef<string | null>(null);
  const [state, setState] = React.useState<GateState>("loading");
  const [message, setMessage] = React.useState("");

  React.useEffect(() => {
    let cancelled = false;

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
        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          theme: "dark",
          size: "flexible",
          callback: async (token: string) => {
            if (cancelled) return;
            setState("checking");
            const verified = await verifyTurnstileToken(token);
            if (cancelled) return;
            if (verified) {
              markBotChallengePassed();
              onVerified();
            } else {
              setMessage("That check didn't pass. Give it another try.");
              setState("error");
              if (widgetIdRef.current) window.turnstile?.reset(widgetIdRef.current);
            }
          },
          "error-callback": () => {
            if (cancelled) return;
            setMessage("The check could not load. Check your connection and try again.");
            setState("error");
          },
          "expired-callback": () => {
            if (!cancelled && widgetIdRef.current) window.turnstile?.reset(widgetIdRef.current);
          },
        });
      } catch {
        if (!cancelled) {
          setMessage("The check could not load. Check your connection and try again.");
          setState("error");
        }
      }
    };

    void start();
    return () => {
      cancelled = true;
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {}
      }
      widgetIdRef.current = null;
    };
  }, [onVerified]);

  if (state === "unconfigured") return null;

  const retry = () => {
    setMessage("");
    setState("ready");
    if (widgetIdRef.current) window.turnstile?.reset(widgetIdRef.current);
  };

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="bot-challenge-title"
      aria-describedby="bot-challenge-description"
    >
      <div
        className="flex w-full max-w-sm flex-col items-center p-6 text-center sm:p-7"
        style={{
          background: "#1d1d1d",
          borderRadius: 20,
          boxShadow:
            "inset 0 0 0 1px rgba(44, 47, 54, 0.65), inset 0 0 50px 0 rgba(255, 255, 255, 0.02), 0 24px 60px -12px rgba(0, 0, 0, 0.9), 0 6px 16px rgba(0, 0, 0, 0.6)",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <div
          className="mb-4 p-3 text-zinc-300"
          style={{
            borderRadius: 36,
            background: "rgba(255, 255, 255, 0.05)",
            boxShadow:
              "inset 0 0 0 1px rgba(255, 255, 255, 0.04), inset 0 1px 0 0 rgba(255, 255, 255, 0.08)",
          }}
        >
          {state === "error" ? (
            <ShieldAlert aria-hidden="true" className="h-7 w-7 text-amber-300" />
          ) : state === "checking" ? (
            <Loader2 aria-hidden="true" className="h-7 w-7 animate-spin text-sky-300" />
          ) : (
            <ShieldCheck aria-hidden="true" className="h-7 w-7 text-emerald-300" />
          )}
        </div>

        <h2 id="bot-challenge-title" className="mb-2 text-lg font-semibold tracking-tight text-zinc-100">
          One quick check
        </h2>
        <p id="bot-challenge-description" className="mb-5 max-w-xs text-xs leading-relaxed text-zinc-400">
          {state === "checking"
            ? "Checking you're human…"
            : "This browser looked automated. Confirm you're not a robot to keep playing."}
        </p>

        <div ref={containerRef} className="w-full min-h-[65px]" />

        {state === "error" && (
          <div className="mt-2 w-full">
            <p role="status" className="text-[11px] leading-snug text-amber-200">
              {message}
            </p>
            <button
              type="button"
              onClick={retry}
              className="mt-3 w-full cursor-pointer rounded-full bg-white px-4 py-2 text-xs font-semibold text-zinc-950 transition hover:bg-zinc-100 active:scale-[0.98]"
            >
              Try the check again
            </button>
          </div>
        )}

        <p className="mt-4 text-[10px] text-zinc-500">Protected by Cloudflare Turnstile</p>
      </div>
    </div>
  );
}
