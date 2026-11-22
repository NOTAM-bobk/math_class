import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "h-11 w-full rounded-lg border border-white/[0.1] bg-[#0c0c0e] px-3 text-sm text-zinc-100",
      "placeholder:text-zinc-500",
      "transition-colors duration-150 ease-out",
      "focus:border-amber-400/70 focus:outline-none focus:ring-2 focus:ring-amber-400/20",
      className
    )}
    {...props}
  />
));
Input.displayName = "Input";
