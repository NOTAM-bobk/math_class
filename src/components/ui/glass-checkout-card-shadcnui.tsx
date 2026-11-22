import { useState, type FormEvent } from "react";
import { Check, CreditCard, Lock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { CheckoutPayment } from "@/lib/checkoutApi";

type PaymentMethod = CheckoutPayment["method"];

const PAYMENT_METHODS: { id: PaymentMethod; label: string }[] = [
  { id: "card", label: "Card" },
  { id: "paypal", label: "PayPal" },
  { id: "apple", label: "Apple Pay" },
];

interface GlassCheckoutCardProps {
  amount?: number;
  className?: string;
  /** Renders the close control and the way back out of the payment step. */
  onClose?: () => void;
  /** Saves the order and resolves with its receipt number. */
  onPay: (payment: CheckoutPayment) => Promise<string>;
}

type Phase = "form" | "paying" | "done";

/**
 * The payment step for Ultra. Only the cardholder name and last four digits
 * leave this form; the full number and CVC stay in the browser.
 */
export function GlassCheckoutCard({
  amount = 1,
  className,
  onClose,
  onPay,
}: GlassCheckoutCardProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [phase, setPhase] = useState<Phase>("form");
  const [orderId, setOrderId] = useState("");
  const [error, setError] = useState("");
  const total = `$${amount.toFixed(2)}`;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (phase === "paying") return;

    const data = new FormData(event.currentTarget);
    const digits = String(data.get("cardNumber") || "").replace(/\D/g, "");
    if (paymentMethod === "card" && digits.length < 12) {
      setError("Enter the card number printed on the card.");
      return;
    }

    setError("");
    setPhase("paying");
    try {
      const id = await onPay({
        method: paymentMethod,
        cardName:
          paymentMethod === "card" ? String(data.get("cardName") || "").trim() : "",
        cardLast4: paymentMethod === "card" ? digits.slice(-4) : "",
      });
      setOrderId(id);
      setPhase("done");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "The order could not be saved."
      );
      setPhase("form");
    }
  }

  return (
    <Card className={cn("w-full rounded-xl", className)}>
      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2
              id="checkout-card-title"
              className="text-base font-medium text-zinc-100"
            >
              Payment details
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              math_games Ultra · {total} once
            </p>
          </div>
          {onClose ? (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close payment details"
              className="-mr-1.5 -mt-1.5 rounded-md p-2 text-zinc-500 transition-colors duration-150 hover:bg-white/[0.06] hover:text-zinc-200"
            >
              <X aria-hidden="true" className="h-4 w-4" />
            </button>
          ) : null}
        </div>

        {phase === "done" ? (
          <div className="mt-6" role="status">
            <div className="rounded-lg border border-white/[0.09] bg-white/[0.02] p-4">
              <div className="flex items-center gap-2.5">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-amber-400/40 bg-amber-400/10 text-amber-300">
                  <Check aria-hidden="true" className="h-3.5 w-3.5" />
                </span>
                <span className="text-sm font-medium text-zinc-100">
                  Payment received
                </span>
              </div>
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-zinc-400">math_games Ultra</dt>
                  <dd className="tabular-nums text-zinc-100">{total}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-zinc-400">Order</dt>
                  <dd className="tabular-nums text-zinc-500">{orderId}</dd>
                </div>
              </dl>
            </div>
            {onClose ? (
              <Button variant="outline" className="mt-4 w-full" onClick={onClose}>
                Done
              </Button>
            ) : null}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6">
            <div aria-label="Payment method" className="grid grid-cols-3 gap-2">
              {PAYMENT_METHODS.map((method) => {
                const selected = paymentMethod === method.id;
                return (
                  <button
                    key={method.id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setPaymentMethod(method.id)}
                    className={cn(
                      "flex h-11 items-center justify-center gap-1.5 rounded-lg border text-sm font-medium transition-colors duration-150",
                      selected
                        ? "border-amber-400/70 bg-amber-400/[0.08] text-amber-200"
                        : "border-white/[0.09] bg-white/[0.02] text-zinc-400 hover:border-white/20 hover:text-zinc-200"
                    )}
                  >
                    {method.id === "card" ? (
                      <CreditCard aria-hidden="true" className="h-4 w-4" />
                    ) : null}
                    {method.label}
                  </button>
                );
              })}
            </div>

            {paymentMethod === "card" ? (
              <div className="mt-5 space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="cardNumber">Card number</Label>
                  <Input
                    id="cardNumber"
                    name="cardNumber"
                    inputMode="numeric"
                    autoComplete="cc-number"
                    maxLength={19}
                    placeholder="0000 0000 0000 0000"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="expiry">Expiry</Label>
                    <Input
                      id="expiry"
                      name="expiry"
                      inputMode="numeric"
                      autoComplete="cc-exp"
                      maxLength={5}
                      placeholder="MM/YY"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="cvc">CVC</Label>
                    <Input
                      id="cvc"
                      name="cvc"
                      inputMode="numeric"
                      autoComplete="cc-csc"
                      maxLength={4}
                      placeholder="123"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="cardName">Name on card</Label>
                  <Input
                    id="cardName"
                    name="cardName"
                    autoComplete="cc-name"
                    maxLength={80}
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>
            ) : (
              <p className="mt-5 rounded-lg border border-white/[0.08] bg-white/[0.02] p-3.5 text-sm leading-relaxed text-zinc-400">
                You’ll approve the {total} payment in{" "}
                {paymentMethod === "paypal" ? "PayPal" : "Apple Pay"} after you
                press Pay.
              </p>
            )}

            {error ? (
              <p
                role="alert"
                className="mt-4 rounded-lg border border-red-500/25 bg-red-500/10 px-3 py-2 text-xs leading-relaxed text-red-300"
              >
                {error}
              </p>
            ) : null}

            <Button
              type="submit"
              className="mt-5 w-full"
              disabled={phase === "paying"}
            >
              {phase === "paying" ? `Paying ${total}…` : `Pay ${total}`}
            </Button>
            <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-[11px] leading-relaxed text-zinc-500">
              <Lock aria-hidden="true" className="h-3 w-3 shrink-0" />
              Only the last four digits are saved with the order.
            </p>
          </form>
        )}
      </div>
    </Card>
  );
}
