"use client";

import { cn } from "@/lib/cn";

export function Chip({
  active,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }) {
  return (
    <button
      type="button"
      className={cn(
        "shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
        active
          ? "border-accent bg-accent text-[var(--accent-ink)]"
          : "border-line bg-surface text-ink-soft hover:border-accent/40 hover:text-ink",
        className,
      )}
      {...props}
    />
  );
}
