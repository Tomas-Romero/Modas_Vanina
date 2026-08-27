import type { Category } from "@/lib/types";

const PALETTES: [string, string][] = [
  ["var(--surface-2)", "var(--accent)"],
  ["var(--surface-2)", "var(--gold)"],
  ["#f0e6da", "var(--accent)"],
  ["#ece1d8", "var(--gold)"],
];

function Icon({ category }: { category: Category }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2.2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (category) {
    case "indumentaria":
      return (
        <path
          {...common}
          d="M38 24 L46 18 Q50 22 54 18 L62 24 L70 32 L62 38 L58 34 L58 78 Q50 80 42 78 L42 34 L38 38 L30 32 Z"
        />
      );
    case "perfumeria":
      return (
        <>
          <rect {...common} x="42" y="32" width="16" height="6" rx="1.5" />
          <path {...common} d="M46 38 L46 44 Q34 48 34 60 L34 76 Q34 80 38 80 L62 80 Q66 80 66 76 L66 60 Q66 48 54 44 L54 38 Z" />
          <line {...common} x1="50" y1="58" x2="50" y2="70" />
        </>
      );
    case "cremas":
      return (
        <>
          <rect {...common} x="30" y="38" width="40" height="38" rx="8" />
          <path {...common} d="M28 38 Q50 30 72 38" />
        </>
      );
    case "tuppers":
      return (
        <>
          <rect {...common} x="28" y="44" width="44" height="32" rx="6" />
          <path {...common} d="M26 44 Q50 34 74 44" />
        </>
      );
    default:
      return (
        <>
          <path {...common} d="M34 40 L66 40 L70 78 Q70 80 68 80 L32 80 Q30 80 30 78 Z" />
          <path {...common} d="M41 40 V33 Q41 25 50 25 Q59 25 59 33 V40" />
        </>
      );
  }
}

export function PlaceholderArt({
  category,
  seed = 0,
  className,
}: {
  category: Category;
  seed?: number;
  className?: string;
}) {
  const [bg, fg] = PALETTES[seed % PALETTES.length];
  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      role="img"
      aria-label={category}
    >
      <rect width="100" height="100" fill={bg} />
      <g style={{ color: fg }} opacity={0.75}>
        <Icon category={category} />
      </g>
    </svg>
  );
}

export function isPlaceholderImage(src: string): boolean {
  return src.startsWith("placeholder:");
}

export function parsePlaceholderImage(src: string): { category: Category; seed: number } {
  const [, category, seed] = src.split(":");
  return { category: category as Category, seed: Number(seed) || 0 };
}
