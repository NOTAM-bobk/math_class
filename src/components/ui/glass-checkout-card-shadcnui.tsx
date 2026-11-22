import { useState, type FormEvent } from "react";
import { Check, CreditCard, Lock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type PaymentMethod = "card" | "paypal" | "apple";

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
}

/**
 * The payment step for Ultra. Card details never leave the page: the button
 * below reports that checkout is not switched on yet rather than pretending a
 * charge went through.
 */
export function GlassCheckoutCard({
  amount = 1,
  className,
  onClose,
}: GlassCheckoutCardProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [orderId, setOrderId] = useState("");
  const total = `$${amount.toFixed(2)}`;
  const submitted = orderId !== "";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setOrderId(`MC-${Math.random().toString(36).slice(2, 8).toUpperCase()}`);
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

        {submitted ? (
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
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="cardName">Name on card</Label>
                  <Input
                    id="cardName"
                    name="cardName"
                    autoComplete="cc-name"
                    placeholder="John Doe"
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

            <Button type="submit" className="mt-5 w-full">
              Pay {total}
            </Button>
            <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-[11px] leading-relaxed text-zinc-500">
              <Lock aria-hidden="true" className="h-3 w-3 shrink-0" />
              One-time payment of {total}. No subscription.
            </p>
          </form>
        )}
      </div>
    </Card>
  );
}
