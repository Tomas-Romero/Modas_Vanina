"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Loader2, Send, XCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { publishToSocialAction, type PublishToSocialResult } from "@/app/admin/productos/actions";
import type { Product } from "@/lib/types";

export function PublishToSocialButton({ product }: { product: Product }) {
  const [open, setOpen] = useState(false);
  const [instagram, setInstagram] = useState(true);
  const [facebook, setFacebook] = useState(true);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PublishToSocialResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  function openDialog() {
    setResult(null);
    setError(null);
    setOpen(true);
  }

  async function handlePublish() {
    setLoading(true);
    setError(null);
    const res = await publishToSocialAction(product.id, { instagram, facebook });
    setLoading(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setResult(res.result);
  }

  return (
    <>
      <button
        type="button"
        onClick={openDialog}
        aria-label="Publicar en redes"
        title="Publicar en Instagram/Facebook"
        className="rounded-full p-2 text-ink-soft hover:bg-surface-2 hover:text-accent"
      >
        <Send className="h-4 w-4" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/40 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !loading && setOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ type: "spring", stiffness: 340, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-2xl bg-surface p-6 shadow-soft"
            >
              <h2 className="font-display text-lg text-ink">Publicar &quot;{product.name}&quot;</h2>
              <p className="mt-1.5 text-sm text-ink-soft">
                Sube la primera foto del producto con una descripción armada automáticamente.
              </p>

              {!result && (
                <div className="mt-5 space-y-2.5">
                  <label className="flex items-center gap-3 rounded-xl border border-line px-3 py-2.5">
                    <input
                      type="checkbox"
                      checked={instagram}
                      onChange={(e) => setInstagram(e.target.checked)}
                      className="h-4 w-4 rounded accent-[var(--accent)]"
                    />
                    <span className="text-sm text-ink">Instagram</span>
                  </label>
                  <label className="flex items-center gap-3 rounded-xl border border-line px-3 py-2.5">
                    <input
                      type="checkbox"
                      checked={facebook}
                      onChange={(e) => setFacebook(e.target.checked)}
                      className="h-4 w-4 rounded accent-[var(--accent)]"
                    />
                    <span className="text-sm text-ink">Página de Facebook</span>
                  </label>
                </div>
              )}

              {error && <p className="mt-4 text-sm text-accent">{error}</p>}

              {result && (
                <div className="mt-5 space-y-2.5">
                  <PlatformResultRow label="Instagram" result={result.instagram} />
                  <PlatformResultRow label="Facebook" result={result.facebook} />
                </div>
              )}

              <div className="mt-6 flex justify-end gap-3">
                <Button variant="ghost" onClick={() => setOpen(false)} disabled={loading}>
                  {result ? "Cerrar" : "Cancelar"}
                </Button>
                {!result && (
                  <Button onClick={handlePublish} disabled={loading || (!instagram && !facebook)}>
                    {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                    Publicar
                  </Button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function PlatformResultRow({
  label,
  result,
}: {
  label: string;
  result?: { ok: true; postId: string } | { ok: false; error: string };
}) {
  if (!result) return null;
  return (
    <div className="flex items-start gap-2.5 rounded-xl border border-line px-3 py-2.5">
      {result.ok ? (
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-good" />
      ) : (
        <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
      )}
      <div className="text-sm">
        <p className="font-medium text-ink">{label}</p>
        <p className="text-ink-soft">{result.ok ? "Publicado correctamente." : result.error}</p>
      </div>
    </div>
  );
}
