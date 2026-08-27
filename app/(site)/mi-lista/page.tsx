"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, ShoppingBag, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useMiLista } from "@/lib/hooks/useMiLista";
import { buildListWhatsAppLink } from "@/lib/whatsapp";
import { CATEGORY_LABELS } from "@/lib/types";

export default function MiListaPage() {
  const { items, remove, clear } = useMiLista();

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 md:px-8 md:py-12">
      <h1 className="font-display text-2xl text-ink md:text-3xl">Mi lista</h1>
      <p className="mt-1 text-sm text-ink-soft">
        Los productos que elegiste, listos para consultar disponibilidad y precio.
      </p>

      {items.length === 0 ? (
        <div className="mt-10 flex flex-col items-center rounded-2xl border border-dashed border-line py-16 text-center">
          <ShoppingBag className="h-8 w-8 text-ink-soft" />
          <p className="mt-3 font-display text-lg text-ink">Tu lista está vacía</p>
          <p className="mt-1 max-w-xs text-sm text-ink-soft">
            Explorá el catálogo y agregá los productos que te interesen.
          </p>
          <Link href="/catalogo" className="mt-5">
            <Button>Ver catálogo</Button>
          </Link>
        </div>
      ) : (
        <>
          <ul className="mt-6 divide-y divide-line">
            <AnimatePresence initial={false}>
              {items.map((item) => (
                <motion.li
                  key={item.id}
                  layout
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="flex items-center justify-between gap-3 overflow-hidden py-3.5"
                >
                  <div>
                    <p className="text-sm font-medium text-ink">{item.name}</p>
                    <p className="text-xs text-ink-soft">{CATEGORY_LABELS[item.category]}</p>
                  </div>
                  <button
                    onClick={() => remove(item.id)}
                    aria-label={`Quitar ${item.name}`}
                    className="rounded-full p-2 text-ink-soft hover:bg-surface-2 hover:text-accent"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>

          <div className="mt-8 flex flex-col gap-3">
            <a href={buildListWhatsAppLink(items)} target="_blank" rel="noopener noreferrer">
              <Button variant="whatsapp" size="lg" className="w-full">
                <MessageCircle className="h-4 w-4" /> Enviar consulta por WhatsApp
              </Button>
            </a>
            <Button variant="ghost" onClick={clear} className="text-ink-soft">
              <Trash2 className="h-4 w-4" /> Vaciar lista
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
