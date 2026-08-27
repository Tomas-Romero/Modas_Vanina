import { cn } from "@/lib/cn";
import { AVAILABILITY_LABELS, type Availability } from "@/lib/types";

const styles: Record<Availability, string> = {
  en_stock: "bg-good/15 text-good",
  ultimas_unidades: "bg-gold/20 text-gold",
  agotado: "bg-ink-soft/15 text-ink-soft",
};

export function AvailabilityBadge({ availability, className }: { availability: Availability; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
        styles[availability],
        className,
      )}
    >
      {AVAILABILITY_LABELS[availability]}
    </span>
  );
}
