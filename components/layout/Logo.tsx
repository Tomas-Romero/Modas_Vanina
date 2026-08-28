import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/cn";

// Source artwork is 640x537 (trimmed/downsized from the client's original
// export, see public/logo.png) — keep every rendered size on that same
// ~1.19:1 ratio so the mark never looks stretched.
const MARK_RATIO = 640 / 537;

function markDimensions(height: number) {
  return { height, width: Math.round(height * MARK_RATIO) };
}

// Icon-only isotipo, for compact/frequent chrome (nav headers) where the
// full stacked wordmark would be too tall or fight the surrounding nav.
export function LogoIcon({
  className,
  height = 40,
}: {
  className?: string;
  height?: number;
}) {
  const { width } = markDimensions(height);
  return (
    <Image
      src={height > 96 ? "/logo-mark.png" : "/logo-mark-sm.png"}
      alt="Modas Vanina"
      width={width}
      height={height}
      style={{ height, width: "auto" }}
      className={cn("shrink-0", className)}
    />
  );
}

const STACK_SIZES = {
  sm: { top: "text-[7px] tracking-[0.45em]", bottom: "text-sm", rule: "w-6 mt-1", markHeight: 36 },
  default: { top: "text-[9px] tracking-[0.55em]", bottom: "text-xl", rule: "w-10 mt-2", markHeight: 48 },
  lg: { top: "text-xs tracking-[0.6em]", bottom: "text-4xl", rule: "w-16 mt-3", markHeight: 96 },
} as const;

// Full imagotipo: the isotipo stacked above "MODAS / VANINA" — the
// client's real icon paired with a code-drawn wordmark since we don't have
// the text baked into the artwork. For ceremonial spots (footer, login,
// splash, Nosotros) rather than every-page chrome — see LogoIcon for that.
export function LogoMark({
  className,
  size = "default",
}: {
  className?: string;
  size?: keyof typeof STACK_SIZES;
}) {
  const s = STACK_SIZES[size];
  const { width } = markDimensions(s.markHeight);

  return (
    <span className={cn("inline-flex flex-col items-center leading-none", className)}>
      <Image
        src={s.markHeight > 96 ? "/logo-mark.png" : "/logo-mark-sm.png"}
        alt=""
        width={width}
        height={s.markHeight}
        style={{ height: s.markHeight, width: "auto" }}
        priority={size === "lg"}
        className="mb-2 shrink-0"
      />
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
  variant = "icon",
  size = "default",
  iconHeight = 40,
}: {
  className?: string;
  href?: string;
  variant?: "icon" | "full";
  size?: keyof typeof STACK_SIZES;
  iconHeight?: number;
}) {
  return (
    <Link href={href} className={cn("shrink-0", className)} aria-label="Modas Vanina — Inicio">
      {variant === "full" ? <LogoMark size={size} /> : <LogoIcon height={iconHeight} />}
    </Link>
  );
}
