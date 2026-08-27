"use client";

import { useCallback, useEffect, useState } from "react";
import type { Category } from "@/lib/types";

const STORAGE_KEY = "modas-vanina:mi-lista";

export interface MiListaItem {
  id: string;
  name: string;
  category: Category;
}

function readStorage(): MiListaItem[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as MiListaItem[]) : [];
  } catch {
    return [];
  }
}

function writeStorage(items: MiListaItem[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // localStorage unavailable (private mode, etc.) — list just won't persist.
  }
}

export function useMiLista() {
  const [items, setItems] = useState<MiListaItem[]>([]);

  useEffect(() => {
    // localStorage doesn't exist during SSR, so the initial sync has to
    // happen post-mount — an intentional one-time extra render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(readStorage());
    function onStorage(e: StorageEvent) {
      if (e.key === STORAGE_KEY) setItems(readStorage());
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const add = useCallback((item: MiListaItem) => {
    setItems((prev) => {
      if (prev.some((p) => p.id === item.id)) return prev;
      const next = [...prev, item];
      writeStorage(next);
      return next;
    });
  }, []);

  const remove = useCallback((id: string) => {
    setItems((prev) => {
      const next = prev.filter((p) => p.id !== id);
      writeStorage(next);
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    setItems([]);
    writeStorage([]);
  }, []);

  const has = useCallback((id: string) => items.some((p) => p.id === id), [items]);

  return { items, add, remove, clear, has };
}
