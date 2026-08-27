"use client";

import Link from "next/link";
import { useRef, useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { ProductImage } from "@/components/ui/ProductImage";
import { cn } from "@/lib/cn";
import type { Offer, Product } from "@/lib/types";

export function OffersCarousel({
  offers,
  productsById,
}: {
  offers: Offer[];
  productsById: Map<string, Product>;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canScroll, setCanScroll] = useState({ left: false, right: false });

  const updateScrollState = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanScroll({
      left: el.scrollLeft > 8,
      right: el.scrollLeft < el.scrollWidth - el.clientWidth - 8,
    });
    const cardWidth = el.firstElementChild?.clientWidth ?? 1;
    setActiveIndex(Math.round(el.scrollLeft / (cardWidth + 16)));
  }, []);

  useEffect(() => {
    updateScrollState();
  }, [updateScrollState, offers.length]);

  function scrollByCard(direction: 1 | -1) {
    const el = scrollerRef.current;
    if (!el) return;
    const cardWidth = el.firstElementChild?.clientWidth ?? 320;
    el.scrollBy({ left: direction * (cardWidth + 16), behavior: "smooth" });
  }

  if (offers.length === 0) return null;

  return (
    <div className="relative">
      <div
        ref={scrollerRef}
        onScroll={updateScrollState}
        className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 md:mx-0 md:px-0"
      >
        {offers.map((offer, i) => {
          const products = offer.product_ids
            .map((id) => productsById.get(id))
            .filter((p): p is Product => Boolean(p));
          const cover = products[0];

          return (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.4, delay: i * 0.06, ease: "easeOut" }}
              className="shrink-0 snap-start"
            >
              <Link
                href={cover ? `/catalogo?producto=${cover.id}` : "/catalogo"}
                className="group relative block h-52 w-72 overflow-hidden rounded-2xl border border-line bg-surface-2 shadow-soft transition-shadow hover:shadow-lg sm:w-80"
              >
                {cover && (
                  <ProductImage
                    src={cover.images[0]}
                    alt={cover.name}
                    category={cover.category}
                    sizes="320px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/15 to-transparent" />
                <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-accent px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--accent-ink)]">
                  <Sparkles className="h-3 w-3" /> Oferta
                </span>
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <p className="font-display text-xl text-white">{offer.title}</p>
                  <p className="text-xs text-white/80">
                    {products.length} producto{products.length === 1 ? "" : "s"}
                  </p>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {offers.length > 1 && (
        <>
          <div className="mt-3 hidden items-center justify-center gap-2 sm:flex">
            {offers.map((_, i) => (
              <span
                key={i}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  i === activeIndex ? "w-5 bg-accent" : "w-1.5 bg-line",
                )}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            disabled={!canScroll.left}
            aria-label="Ofertas anteriores"
            className="absolute left-0 top-1/2 hidden -translate-x-4 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-surface p-2 shadow-soft transition-opacity disabled:pointer-events-none disabled:opacity-0 sm:flex"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => scrollByCard(1)}
            disabled={!canScroll.right}
            aria-label="Siguientes ofertas"
            className="absolute right-0 top-1/2 hidden -translate-y-1/2 translate-x-4 items-center justify-center rounded-full border border-line bg-surface p-2 shadow-soft transition-opacity disabled:pointer-events-none disabled:opacity-0 sm:flex"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </>
      )}
    </div>
  );
}
