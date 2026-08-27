"use client";

import { Chip } from "@/components/ui/Chip";
import { CATEGORIES, CATEGORY_LABELS, type Category } from "@/lib/types";

export function CategoryFilterChips({
  value,
  onChange,
}: {
  value: Category | "todas";
  onChange: (value: Category | "todas") => void;
}) {
  return (
    <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:px-0">
      <Chip active={value === "todas"} onClick={() => onChange("todas")}>
        Todas
      </Chip>
      {CATEGORIES.map((category) => (
        <Chip key={category} active={value === category} onClick={() => onChange(category)}>
          {CATEGORY_LABELS[category]}
        </Chip>
      ))}
    </div>
  );
}
