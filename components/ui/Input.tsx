import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "h-11 w-full rounded-xl border border-line bg-surface px-4 text-sm text-ink placeholder:text-ink-soft/70 outline-none transition-colors focus:border-accent",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";
