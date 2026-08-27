import Link from "next/link";
import { cn } from "@/lib/cn";

// Single swappable brand mark. Replace this wordmark with an <img>/<Image>
// pointing at the real logo file once it's available — every other
// component renders the store name through this component.
export function Logo({ className, href = "/" }: { className?: string; href?: string }) {
  return (
    <Link
      href={href}
      className={cn("font-display text-xl tracking-tight text-ink whitespace-nowrap", className)}
    >
      Modas <span className="text-accent">Vanina</span>
    </Link>
  );
}
