"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Shirt, SprayCan, Droplet, Package, Sparkles } from "lucide-react";
import { CATEGORIES, CATEGORY_LABELS, type Category } from "@/lib/types";

const ICONS: Record<Category, typeof Shirt> = {
  indumentaria: Shirt,
  perfumeria: SprayCan,
  cremas: Droplet,
  tuppers: Package,
  varios: Sparkles,
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
};

export function CategoryShortcuts() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      className="grid grid-cols-3 gap-3 sm:grid-cols-5"
    >
      {CATEGORIES.map((category) => {
        const Icon = ICONS[category];
        return (
          <motion.div key={category} variants={item} whileTap={{ scale: 0.94 }}>
            <Link
              href={`/catalogo?categoria=${category}`}
              className="group flex flex-col items-center gap-2.5 rounded-2xl border border-line bg-surface p-4 text-center transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-soft"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-2 text-accent transition-colors group-hover:bg-accent group-hover:text-[var(--accent-ink)]">
                <Icon className="h-5 w-5" />
              </span>
              <span className="text-xs font-medium text-ink-soft group-hover:text-ink">
                {CATEGORY_LABELS[category]}
              </span>
            </Link>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
