import * as React from "react";
import { AlertCircle, Check, Copy, Loader2, Mail, QrCode, Send, Share2, X } from "lucide-react";
import qrcode from "qrcode-generator";
import { useDialogFocus } from "@/lib/dialogFocus";
import { posthog } from "@/lib/posthog";

type ShareState = "idle" | "copied" | "error";
type EmailStatus = "idle" | "sending" | "sent" | "error";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function pageUrl() {
  const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  return (canonical?.href || window.location.href).split("#")[0];
}

async function copyText(text: string) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const field = document.createElement("textarea");
  field.value = text;
  field.setAttribute("readonly", "");
  field.style.position = "fixed";
  field.style.opacity = "0";
  document.body.appendChild(field);
  field.select();
  const copied = document.execCommand("copy");
  field.remove();
  if (!copied) throw new Error("Copy failed");
}

const ICON_BUTTON_STYLE: React.CSSProperties = {
  borderRadius: 999,
  background: "rgba(255, 255, 255, 0.06)",
  boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.05), inset 0 1px 0 0 rgba(255, 255, 255, 0.06)",
};

// Drawn from the QR modules instead of an image request, so the code works
// offline and stays crisp at any size.
function QrGraphic({ url }: { url: string }) {
  const code = React.useMemo(() => {
    const qr = qrcode(0, "M");
    qr.addData(url);
    qr.make();
    const count = qr.getModuleCount();
    const margin = 2;
    let path = "";
    for (let row = 0; row < count; row += 1) {
      for (let column = 0; column < count; column += 1) {
        if (qr.isDark(row, column)) path += `M${column + margin} ${row + margin}h1v1h-1z`;
      }
    }
    return { path, size: count + margin * 2 };
  }, [url]);

  return (
    <svg
      viewBox={`0 0 ${code.size} ${code.size}`}
      role="img"
      aria-label={`QR code that opens ${url}`}
      shapeRendering="crispEdges"
      className="h-40 w-40 sm:h-44 sm:w-44"
    >
      <rect width={code.size} height={code.size} fill="#ffffff" />
      <path d={code.path} fill="#111111" />
    </svg>
  );
}

export function ShareButton() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [state, setState] = React.useState<ShareState>("idle");
  const [qrOpen, setQrOpen] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [emailStatus, setEmailStatus] = React.useState<EmailStatus>("idle");
  const [emailMessage, setEmailMessage] = React.useState("");
  const copyButtonRef = React.useRef<HTMLButtonElement>(null);
  const panelRef = React.useRef<HTMLElement>(null);
  const canUseNativeShare = typeof navigator !== "undefined" && typeof navigator.share === "function";
  const url = pageUrl();

  useDialogFocus({
    active: isOpen,
    onClose: () => setIsOpen(false),
    panelRef,
    initialFocusRef: copyButtonRef,
  });

  const openDialog = () => {
    setState("idle");
    setQrOpen(false);
    setEmailStatus("idle");
    setEmailMessage("");
    setIsOpen(true);
  };

  const handleCopy = async () => {
    try {
      await copyText(url);
      posthog.capture("share_completed", { method: "copy_link" });
      setState("copied");
    } catch {
      setState("error");
    }
  };

  const handleNativeShare = async () => {
    if (!canUseNativeShare) return;
    try {
      await navigator.share({ title: document.title, text: "Free browser games for study breaks", url });
      posthog.capture("share_completed", { method: "native_share" });
      setIsOpen(false);
    } catch (error) {
      if (!(error instanceof DOMException && error.name === "AbortError")) setState("error");
    }
  };

  const handleEmailShare = async (event: React.FormEvent) => {
    event.preventDefault();
    if (emailStatus === "sending") return;

    const target = email.trim();
    if (!EMAIL_PATTERN.test(target)) {
      setEmailStatus("error");
      setEmailMessage("Enter a valid email address.");
      return;
    }

    setEmailStatus("sending");
    setEmailMessage("");

    try {
      const response = await fetch("/api/share-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: target, url, title: document.title }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data?.ok) {
        setEmailStatus("error");
        setEmailMessage(data?.error || "Could not send the email right now. Please try again.");
        return;
      }

      posthog.capture("share_completed", { method: "email" });
      setEmail("");
      setEmailStatus("sent");
      setEmailMessage(`Link sent to ${target}.`);
    } catch {
      setEmailStatus("error");
      setEmailMessage("Network error. Check your connection and try again.");
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={openDialog}
        title="Share this page"
        aria-label="Share this page"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        style={ICON_BUTTON_STYLE}
        className="inline-flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full p-0 text-zinc-300 transition-colors hover:bg-white/[0.12] hover:text-white active:scale-[0.98] sm:h-9 sm:w-9"
      >
        <Share2 aria-hidden="true" className="h-4 w-4" />
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setIsOpen(false);
          }}
        >
          <section
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="share-dialog-title"
            className="max-h-[calc(100dvh-2rem)] w-full max-w-sm overflow-y-auto rounded-2xl border border-white/10 bg-[#1d1d1d] p-5 shadow-2xl"
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h2 id="share-dialog-title" className="text-base font-semibold text-zinc-100">Share this page</h2>
                <p className="mt-1 text-sm text-zinc-400">Share responsibly and follow your school’s rules.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close share dialog"
                className="rounded-full p-1.5 text-zinc-400 hover:bg-white/[0.08] hover:text-white"
              >
                <X aria-hidden="true" className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-2">
              {canUseNativeShare && (
                <button
                  type="button"
                  onClick={handleNativeShare}
                  className="flex min-h-11 w-full items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 text-sm text-zinc-200 hover:bg-white/[0.08]"
                >
                  <Share2 aria-hidden="true" className="h-4 w-4 text-zinc-400" />
                  Share using your device
                </button>
              )}
              <button
                ref={copyButtonRef}
                type="button"
                onClick={handleCopy}
                className="flex min-h-11 w-full items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 text-sm text-zinc-200 hover:bg-white/[0.08]"
              >
                {state === "copied" ? <Check aria-hidden="true" className="h-4 w-4 text-emerald-400" /> : <Copy aria-hidden="true" className="h-4 w-4 text-zinc-400" />}
                {state === "copied" ? "Link copied" : "Copy link"}
              </button>
              <button
                type="button"
                onClick={() => setQrOpen((open) => !open)}
                aria-expanded={qrOpen}
                aria-controls="share-qr-panel"
                className="flex min-h-11 w-full items-center justify-between gap-3 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 text-sm text-zinc-200 hover:bg-white/[0.08]"
              >
                <span className="flex items-center gap-3">
                  <QrCode aria-hidden="true" className="h-4 w-4 text-zinc-400" />
                  Share by QR code
                </span>
                <span aria-hidden="true" className="text-[11px] text-zinc-500">{qrOpen ? "Hide" : "Show"}</span>
              </button>

              {qrOpen && (
                <div
                  id="share-qr-panel"
                  className="flex flex-col items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.02] p-3"
                >
                  <div className="rounded-lg bg-white p-2">
                    <QrGraphic url={url} />
                  </div>
                  <p className="text-center text-[11px] text-zinc-400">
                    Scan with a phone camera to open this page there.
                  </p>
                </div>
              )}

              <form
                onSubmit={handleEmailShare}
                className="rounded-xl border border-white/[0.08] bg-white/[0.04] p-3"
              >
                <label htmlFor="share-email" className="flex items-center gap-2 text-sm text-zinc-200">
                  <Mail aria-hidden="true" className="h-4 w-4 text-zinc-400" />
                  Send by email
                </label>
                <p className="mt-1 text-[11px] leading-relaxed text-zinc-500">
                  We’ll email the link for you — no mail app needed.
                </p>
                <div className="mt-2 flex gap-2">
                  <input
                    id="share-email"
                    name="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    required
                    maxLength={254}
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      if (emailStatus !== "sending") {
                        setEmailStatus("idle");
                        setEmailMessage("");
                      }
                    }}
                    placeholder="friend@example.com"
                    aria-invalid={emailStatus === "error" ? true : undefined}
                    className="h-10 min-w-0 flex-1 rounded-lg border border-white/[0.08] bg-black/20 px-2.5 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={emailStatus === "sending" || !email.trim()}
                    className="inline-flex h-10 shrink-0 cursor-pointer items-center gap-1.5 rounded-lg bg-white px-3 text-sm font-semibold text-zinc-950 transition-colors hover:bg-zinc-100 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {emailStatus === "sending" ? (
                      <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send aria-hidden="true" className="h-4 w-4" />
                    )}
                    {emailStatus === "sending" ? "Sending" : "Send"}
                  </button>
                </div>
                {emailMessage && (
                  <p
                    role={emailStatus === "error" ? "alert" : "status"}
                    className={`mt-2 flex items-start gap-1.5 text-[11px] leading-relaxed ${
                      emailStatus === "error" ? "text-red-400" : "text-emerald-400"
                    }`}
                  >
                    {emailStatus === "error" ? (
                      <AlertCircle aria-hidden="true" className="mt-px h-3.5 w-3.5 shrink-0" />
                    ) : (
                      <Check aria-hidden="true" className="mt-px h-3.5 w-3.5 shrink-0" />
                    )}
                    <span>{emailMessage}</span>
                  </p>
                )}
                <p className="mt-2 text-[10px] text-zinc-500">Limited to a few sends per person per hour.</p>
              </form>
            </div>

            <p className="sr-only" role="status" aria-live="polite">
              {state === "copied" ? "Link copied to clipboard." : state === "error" ? "Could not copy the link." : ""}
            </p>
          </section>
        </div>
      )}
    </>
  );
}
