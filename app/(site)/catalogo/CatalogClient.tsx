"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CategoryFilterChips } from "@/components/catalog/CategoryFilterChips";
import { SearchBox } from "@/components/catalog/SearchBox";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { ProductSheet } from "@/components/catalog/ProductSheet";
import { useProductSheetParam } from "@/lib/hooks/useProductSheetParam";
import type { Category, Product } from "@/lib/types";

function normalize(text: string): string {
  // Strip combining diacritical marks (U+0300–U+036F) after NFD
  // decomposition so "café" and "cafe" match the same search query.
  return text
    .toLowerCase()
    .normalize("NFD")
    .split("")
    .filter((ch) => {
      const code = ch.codePointAt(0) ?? 0;
      return code < 0x0300 || code > 0x036f;
    })
    .join("");
}

export function CatalogClient({ products }: { products: Product[] }) {
  const searchParams = useSearchParams();
  const initialCategory = (searchParams.get("categoria") as Category | null) ?? "todas";
  const [category, setCategory] = useState<Category | "todas">(initialCategory);
  const [search, setSearch] = useState("");
  const { productId, open, close } = useProductSheetParam();

  const filtered = useMemo(() => {
    const query = normalize(search.trim());
    return products.filter((p) => {
      const matchesCategory = category === "todas" || p.category === category;
      const matchesSearch = !query || normalize(p.name).includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [products, category, search]);

  const activeProduct = products.find((p) => p.id === productId) ?? null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 md:px-8 md:py-10">
      <h1 className="font-display text-2xl text-ink md:text-3xl">Catálogo</h1>

      <div className="sticky top-20 z-30 -mx-4 mt-5 space-y-3 bg-bg/95 px-4 py-3 backdrop-blur-md md:static md:mx-0 md:bg-transparent md:p-0 md:backdrop-blur-none">
        <SearchBox value={search} onChange={setSearch} />
        <CategoryFilterChips value={category} onChange={setCategory} />
      </div>

      <div className="mt-6">
        <ProductGrid products={filtered} onOpen={open} />
      </div>

      <ProductSheet product={activeProduct} onClose={close} />
    </div>
  );
}
