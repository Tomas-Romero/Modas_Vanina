"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, Grid2x2, ShoppingBag, MapPin } from "lucide-react";
import { cn } from "@/lib/cn";
import { useMiLista } from "@/lib/hooks/useMiLista";

const LINKS = [
  { href: "/", label: "Inicio", icon: Home },
  { href: "/catalogo", label: "Catálogo", icon: Grid2x2 },
  { href: "/mi-lista", label: "Mi lista", icon: ShoppingBag },
  { href: "/nosotros", label: "Nosotros", icon: MapPin },
];

export function BottomNav() {
  const pathname = usePathname();
  const { items } = useMiLista();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-line/70 bg-surface/95 backdrop-blur-md pb-[env(safe-area-inset-bottom)] md:hidden"
      aria-label="Navegación principal"
    >
      <div className="flex items-center justify-around">
        {LINKS.map(({ href, label, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className="relative flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium"
            >
              {active && (
                <motion.span
                  layoutId="bottom-nav-pill"
                  className="absolute inset-x-3 top-0.5 bottom-0.5 rounded-2xl bg-accent/10"
                  transition={{ type: "spring", stiffness: 420, damping: 32 }}
                />
              )}
              <span
                className={cn(
                  "relative z-10 transition-colors",
                  active ? "text-accent" : "text-ink-soft",
                )}
              >
                <Icon className="h-5 w-5" strokeWidth={active ? 2.4 : 2} />
                {href === "/mi-lista" && items.length > 0 && (
                  <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[9px] font-semibold text-[var(--accent-ink)]">
                    {items.length}
                  </span>
                )}
              </span>
              <span className={cn("relative z-10 transition-colors", active ? "text-accent" : "text-ink-soft")}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
