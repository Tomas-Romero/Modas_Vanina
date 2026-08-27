import Link from "next/link";
import { cn } from "@/lib/cn";

const SIZES = {
  sm: { top: "text-[8px] tracking-[0.5em]", bottom: "text-base", rule: "w-8 mt-1.5" },
  default: { top: "text-[9px] tracking-[0.55em]", bottom: "text-xl", rule: "w-10 mt-2" },
  lg: { top: "text-xs tracking-[0.6em]", bottom: "text-4xl", rule: "w-16 mt-3" },
} as const;

// Single swappable brand mark. This is a code-drawn wordmark styled after
// the client's logo artwork (stacked "MODAS" / "VANINA" with a rule under
// it) — replace with the real illustrated isotipo (an <Image>) once that
// asset is exported; every other component renders the store name through
// this component, so the swap happens in one place.
export function LogoMark({
  className,
  size = "default",
}: {
  className?: string;
  size?: keyof typeof SIZES;
}) {
  const s = SIZES[size];
  return (
    <span className={cn("inline-flex flex-col items-center leading-none", className)}>
      <span className={cn("font-display font-medium uppercase text-ink-soft", s.top)}>Modas</span>
      <span className={cn("font-display font-semibold uppercase tracking-wide text-ink", s.bottom)}>
        Vanina
      </span>
      <span className={cn("h-px bg-gradient-to-r from-transparent via-gold to-transparent", s.rule)} />
    </span>
  );
}

export function Logo({
  className,
  href = "/",
  size = "default",
}: {
  className?: string;
  href?: string;
  size?: keyof typeof SIZES;
}) {
  return (
    <Link href={href} className={cn("shrink-0", className)}>
      <LogoMark size={size} />
    </Link>
  );
}
