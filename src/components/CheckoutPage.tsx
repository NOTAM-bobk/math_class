import { useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CheckoutAuthDialog } from "@/components/CheckoutAuthDialog";
import { GlassCheckoutCard } from "@/components/ui/glass-checkout-card-shadcnui";
import { useDialogFocus } from "@/lib/dialogFocus";
import {
  loadCheckoutSession,
  placeCheckoutOrder,
  signOutCheckout,
  type CheckoutPayment,
  type CheckoutUser,
} from "@/lib/checkoutApi";

const ULTRA_PRICE = 1;

const INCLUDED = [
  "No ad bar under the hub",
  "No ad slots around the catalog",
  "New Ultra features as they ship",
];

function usd(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function CheckoutPage() {
  const [account, setAccount] = useState<CheckoutUser | null>(null);
  const [checkingAccount, setCheckingAccount] = useState(true);
  const [authOpen, setAuthOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const closePayment = () => setPaymentOpen(false);

  useDialogFocus({
    active: paymentOpen,
    onClose: closePayment,
    panelRef,
  });

  useEffect(() => {
    let active = true;
    loadCheckoutSession()
      .then((user) => {
        if (active) setAccount(user);
      })
      .finally(() => {
        if (active) setCheckingAccount(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const price = usd(ULTRA_PRICE);

  function startCheckout() {
    if (checkingAccount) return;
    if (account) setPaymentOpen(true);
    else setAuthOpen(true);
  }

  function handleAuthenticated(user: CheckoutUser) {
    setAccount(user);
    setAuthOpen(false);
    setPaymentOpen(true);
  }

  async function handleSignOut() {
    await signOutCheckout();
    setAccount(null);
  }

  async function payForUltra(payment: CheckoutPayment) {
    const order = await placeCheckoutOrder(payment);
    return order.id;
  }

  return (
    <div className="min-h-dvh bg-[#0b0b0d] font-sans text-zinc-100">
      <div className="mx-auto w-full max-w-[1000px] px-5 sm:px-8">
        <header className="flex h-16 items-center justify-between border-b border-white/[0.07]">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-sm text-zinc-400 transition-colors duration-150 hover:text-zinc-100"
          >
            <span aria-hidden="true">←</span>
            math_games
          </a>
          <span className="text-sm text-zinc-500">Checkout</span>
        </header>

        <main className="grid items-start gap-10 py-10 sm:py-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16 lg:py-20">
          <section aria-labelledby="ultra-title">
            <p className="text-sm font-medium text-amber-300">math_games Ultra</p>
            <h1
              id="ultra-title"
              className="mt-3 font-display text-[3.25rem] font-semibold leading-[0.95] text-zinc-50 sm:text-[3.75rem]"
            >
              No ads between games.
            </h1>
            <p className="mt-4 max-w-[46ch] text-[15px] leading-relaxed text-zinc-400">
              One dollar, once. Ultra takes the ad bar off the hub and the ad
              slots out from around the catalog.
            </p>

            <ul className="mt-8 divide-y divide-white/[0.07] border-y border-white/[0.07]">
              {INCLUDED.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 py-3.5 text-sm text-zinc-300"
                >
                  <Check
                    aria-hidden="true"
                    className="h-4 w-4 shrink-0 text-zinc-500"
                  />
                  {item}
                </li>
              ))}
            </ul>

            <p className="mt-6 max-w-[46ch] text-xs leading-relaxed text-zinc-500">
              Ads keep the hub free for everyone. Ultra is for people who would
              rather pay a dollar than see them.
            </p>
          </section>

          <section
            aria-labelledby="summary-title"
            className="overflow-hidden rounded-xl border border-white/[0.09] bg-[#101012]"
          >
            <div
              aria-hidden="true"
              className="h-2"
              style={{
                backgroundImage:
                  "repeating-conic-gradient(from 0deg, rgba(250,250,250,0.2) 0deg 90deg, rgba(250,250,250,0) 90deg 180deg)",
                backgroundSize: "16px 16px",
              }}
            />
            <div className="p-5 sm:p-6">
              <h2 id="summary-title" className="text-sm font-medium text-zinc-300">
                Order summary
              </h2>

              <div className="mt-4 flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm text-zinc-100">math_games Ultra</div>
                  <div className="mt-0.5 text-xs text-zinc-500">
                    One-time payment
                  </div>
                </div>
                <div className="text-sm tabular-nums text-zinc-100">{price}</div>
              </div>

              <div className="mt-5 flex items-baseline justify-between gap-4 border-t border-white/[0.08] pt-4">
                <span className="text-sm text-zinc-400">Total</span>
                <span className="font-display text-[2rem] font-semibold leading-none tabular-nums text-zinc-50">
                  {price}
                </span>
              </div>

              <Button
                className="mt-5 w-full"
                onClick={startCheckout}
                disabled={checkingAccount}
              >
                Pay {price}
              </Button>

              {checkingAccount ? (
                <p className="mt-3 text-center text-xs leading-relaxed text-zinc-500">
                  Checking your account…
                </p>
              ) : account ? (
                <p className="mt-3 text-center text-xs leading-relaxed text-zinc-500">
                  Signed in as{" "}
                  <span className="text-zinc-300">{account.email}</span>
                  {" · "}
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="underline underline-offset-2 transition-colors hover:text-zinc-200"
                  >
                    Sign out
                  </button>
                </p>
              ) : (
                <p className="mt-3 text-center text-xs leading-relaxed text-zinc-500">
                  You’ll sign in or create an account before paying.
                </p>
              )}

              <p className="mt-1.5 text-center text-xs leading-relaxed text-zinc-500">
                Card, PayPal or Apple Pay. One-time payment.
              </p>
            </div>
          </section>
        </main>
      </div>

      {paymentOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 p-4 sm:p-6"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closePayment();
          }}
        >
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="checkout-card-title"
            tabIndex={-1}
            className="w-full max-w-[420px] animate-enter focus:outline-none"
          >
            <GlassCheckoutCard
              amount={ULTRA_PRICE}
              onClose={closePayment}
              onPay={payForUltra}
            />
          </div>
        </div>
      ) : null}

      <CheckoutAuthDialog
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        onAuthenticated={handleAuthenticated}
      />
    </div>
  );
}
