"use client";

import { Search, X } from "lucide-react";

export function SearchBox({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        type="search"
        placeholder="Buscar productos..."
        className="h-11 w-full rounded-full border border-line bg-surface pl-11 pr-10 text-sm text-ink placeholder:text-ink-soft/70 outline-none transition-colors focus:border-accent"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Limpiar búsqueda"
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-soft hover:text-ink"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
