"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "whatsapp" | "danger";
type Size = "default" | "sm" | "lg" | "icon";

const variants: Record<Variant, string> = {
  primary: "bg-accent text-[var(--accent-ink)] hover:brightness-110 active:brightness-95",
  secondary: "bg-surface-2 text-ink hover:bg-line/60",
  ghost: "bg-transparent text-ink hover:bg-surface-2",
  whatsapp: "bg-good text-white hover:brightness-110 active:brightness-95",
  danger: "bg-transparent text-accent border border-accent/40 hover:bg-accent/10",
};

const sizes: Record<Size, string> = {
  default: "h-11 px-5 text-sm",
  sm: "h-9 px-4 text-sm",
  lg: "h-13 px-6 text-base",
  icon: "h-10 w-10",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
          variants[variant],
          sizes[size],
          className,
        )}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";
