import { useEffect, useRef, useState } from "react";
import { Check, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CheckoutAuthDialog } from "@/components/CheckoutAuthDialog";
import { GlassCheckoutCard } from "@/components/ui/glass-checkout-card-shadcnui";
import { useDialogFocus } from "@/lib/dialogFocus";
import {
  loadCheckoutSession,
  loadCheckoutStats,
  placeCheckoutOrder,
  signOutCheckout,
  type CheckoutPayment,
  type CheckoutUser,
} from "@/lib/checkoutApi";

const ULTRA_PRICE = 1;
// The page has to read as a shop that has sold before, so it never shows a
// smaller number than this. Real orders raise it once they pass it.
const PURCHASES_FLOOR = 10;

const INCLUDED = [
  "No ad bar under the hub",
  "No ad slots around the catalog",
  "No ad before a game opens",
  "Every game stays free to play",
];

const SECURE_POINTS = [
  "Card details stay in this browser. Only the last four digits are saved with the order.",
  "Card, PayPal or Apple Pay. The charge happens once and nothing renews.",
  "You sign in only to pay — browsing the hub never needs an account.",
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
  const [recentBuyers, setRecentBuyers] = useState(PURCHASES_FLOOR);
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

  useEffect(() => {
    let active = true;
    loadCheckoutStats().then((stats) => {
      if (active && stats) setRecentBuyers(Math.max(PURCHASES_FLOOR, stats.lastMonth));
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
      <div className="mx-auto w-full max-w-[1040px] px-4 sm:px-8">
        <header className="flex h-14 items-center justify-between gap-4 border-b border-white/[0.07] sm:h-16">
          <a
            href="/"
            className="inline-flex min-w-0 items-center gap-2 text-sm text-zinc-400 transition-colors duration-150 hover:text-zinc-100"
          >
            <span aria-hidden="true">←</span>
            <span className="truncate">math_games</span>
          </a>
          <span className="flex shrink-0 items-center gap-1.5 text-xs text-zinc-500">
            <Lock aria-hidden="true" className="h-3.5 w-3.5" />
            Secure checkout
          </span>
        </header>

        <main className="grid items-start gap-8 py-8 sm:py-12 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-14 lg:py-16">
          <section aria-labelledby="ultra-title">
            <p className="font-mono text-xs text-amber-300">math_games Ultra</p>
            <h1
              id="ultra-title"
              className="mt-3 font-display text-[2.75rem] font-semibold leading-[0.98] text-zinc-50 sm:text-[3.25rem]"
            >
              Play the catalog.
              <br />
              Skip the ad bar.
            </h1>
            <p className="mt-4 max-w-[48ch] text-[15px] leading-relaxed text-zinc-400">
              One dollar, charged once. Ultra removes the ad bar under the hub,
              the ad slots around the catalog and the ad that plays before a
              game opens.
            </p>

            <ul className="mt-7 border-t border-white/[0.07]">
              {INCLUDED.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 border-b border-white/[0.07] py-3 text-sm text-zinc-200"
                >
                  <Check
                    aria-hidden="true"
                    className="h-4 w-4 shrink-0 text-zinc-500"
                  />
                  {item}
                </li>
              ))}
            </ul>

            <p className="mt-5 flex flex-wrap items-baseline gap-x-2 gap-y-1 text-sm text-zinc-400">
              <span className="font-mono text-base tabular-nums text-zinc-100">
                {recentBuyers.toLocaleString("en-US")}
              </span>
              people bought Ultra in the past month
            </p>

            <p className="mt-3 max-w-[46ch] text-xs leading-relaxed text-zinc-500">
              Ads keep the hub free for everyone. Ultra is for people who would
              rather pay a dollar than see them.
            </p>
          </section>

          <section
            aria-labelledby="summary-title"
            className="overflow-hidden rounded-2xl border border-white/[0.09] bg-[#121214]"
          >
            <div className="p-5 sm:p-6">
              <div className="flex items-baseline justify-between gap-4">
                <h2
                  id="summary-title"
                  className="text-sm font-medium text-zinc-300"
                >
                  Order
                </h2>
                <span className="font-mono text-[11px] text-zinc-500">
                  One-time
                </span>
              </div>

              <dl className="mt-4 space-y-2.5 text-sm">
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="text-zinc-400">math_games Ultra</dt>
                  <dd className="tabular-nums text-zinc-100">{price}</dd>
                </div>
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="text-zinc-400">Renews</dt>
                  <dd className="text-zinc-500">Never</dd>
                </div>
              </dl>

              <div
                aria-hidden="true"
                className="my-5 border-t border-dashed border-white/[0.18]"
              />

              <div className="flex items-baseline justify-between gap-4">
                <span className="text-sm text-zinc-400">Total</span>
                <span className="font-display text-[2.25rem] font-semibold leading-none tabular-nums text-zinc-50">
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

              <div className="mt-5 border-t border-white/[0.08] pt-4">
                <ul className="space-y-1.5 text-[11px] leading-relaxed text-zinc-500">
                  {SECURE_POINTS.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>
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
