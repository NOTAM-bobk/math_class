import { useEffect, useRef, useState, type FormEvent } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDialogFocus } from "@/lib/dialogFocus";
import {
  signInCheckout,
  signUpCheckout,
  type CheckoutUser,
} from "@/lib/checkoutApi";

type Mode = "signin" | "signup";

interface CheckoutAuthDialogProps {
  open: boolean;
  onClose: () => void;
  onAuthenticated: (user: CheckoutUser) => void;
}

/**
 * The account step before payment. The account owns the order, so signing in
 * comes before the card rather than after it.
 */
export function CheckoutAuthDialog({
  open,
  onClose,
  onAuthenticated,
}: CheckoutAuthDialogProps) {
  const [mode, setMode] = useState<Mode>("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useDialogFocus({ active: open, onClose, panelRef });

  useEffect(() => {
    if (!open) return;
    setPassword("");
    setError("");
    setBusy(false);
  }, [open]);

  if (!open) return null;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setError("");
    setBusy(true);
    try {
      const user =
        mode === "signup"
          ? await signUpCheckout({
              name: name.trim(),
              email: email.trim(),
              password,
            })
          : await signInCheckout({ email: email.trim(), password });
      setPassword("");
      setBusy(false);
      onAuthenticated(user);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not sign in.");
      setBusy(false);
    }
  }

  function switchMode() {
    setMode((current) => (current === "signin" ? "signup" : "signin"));
    setError("");
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 p-4 sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-auth-title"
        tabIndex={-1}
        className="w-full max-w-[400px] animate-enter rounded-xl border border-white/[0.09] bg-[#111113] p-5 focus:outline-none sm:p-6"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2
              id="checkout-auth-title"
              className="text-base font-medium text-zinc-100"
            >
              {mode === "signin" ? "Sign in before you pay" : "Create your account"}
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              {mode === "signin"
                ? "Use the account that should own this order."
                : "Your Ultra order is saved to this account."}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close account form"
            className="-mr-1.5 -mt-1.5 rounded-md p-2 text-zinc-500 transition-colors duration-150 hover:bg-white/[0.06] hover:text-zinc-200"
          >
            <X aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {mode === "signup" ? (
            <div className="space-y-1.5">
              <Label htmlFor="checkoutName">Name</Label>
              <Input
                id="checkoutName"
                name="name"
                autoComplete="name"
                maxLength={60}
                placeholder="John Doe"
                value={name}
                onChange={(event) => setName(event.target.value)}
                autoFocus
                required
              />
            </div>
          ) : null}

          <div className="space-y-1.5">
            <Label htmlFor="checkoutEmail">Email</Label>
            <Input
              id="checkoutEmail"
              name="email"
              type="email"
              autoComplete="email"
              maxLength={200}
              placeholder="you@school.edu"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoFocus={mode === "signin"}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="checkoutPassword">Password</Label>
            <Input
              id="checkoutPassword"
              name="password"
              type="password"
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              maxLength={200}
              minLength={mode === "signup" ? 8 : undefined}
              placeholder={mode === "signup" ? "At least 8 characters" : "Your password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
            {mode === "signup" ? (
              <p className="text-[11px] text-zinc-500">At least 8 characters.</p>
            ) : null}
          </div>

          {error ? (
            <p
              role="alert"
              className="rounded-lg border border-red-500/25 bg-red-500/10 px-3 py-2 text-xs leading-relaxed text-red-300"
            >
              {error}
            </p>
          ) : null}

          <Button type="submit" className="w-full" disabled={busy}>
            {busy
              ? mode === "signin"
                ? "Signing in…"
                : "Creating account…"
              : mode === "signin"
                ? "Sign in"
                : "Create account"}
          </Button>
        </form>

        <p className="mt-4 text-center text-xs text-zinc-500">
          {mode === "signin" ? "New here?" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={switchMode}
            className="text-zinc-300 underline underline-offset-2 transition-colors hover:text-white"
          >
            {mode === "signin" ? "Create an account" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}
