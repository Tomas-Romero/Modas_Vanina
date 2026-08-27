import type { Metadata } from "next";
import Link from "next/link";
import { Info } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { LoginForm } from "@/components/admin/LoginForm";
import { Button } from "@/components/ui/Button";
import { hasSupabaseConfig } from "@/lib/supabase/client";

export const metadata: Metadata = {
  title: "Ingresar",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  const configured = hasSupabaseConfig();

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-8 bg-bg px-4">
      <Logo href="/" size="lg" />

      {configured ? (
        <LoginForm />
      ) : (
        <div className="w-full max-w-sm space-y-4 text-center">
          <div className="flex items-start gap-2 rounded-xl bg-surface-2 p-4 text-left text-sm text-ink-soft">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
            <span>
              Supabase todavía no está configurado, así que el panel corre en{" "}
              <strong className="text-ink">modo demo</strong>: podés probar todo, pero los cambios
              usan datos de muestra en memoria (se resetean si el server se reinicia).
            </span>
          </div>
          <Link href="/admin/productos">
            <Button size="lg" className="w-full">
              Entrar al panel (demo)
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
