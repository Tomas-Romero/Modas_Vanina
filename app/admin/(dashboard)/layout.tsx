import Link from "next/link";
import { LogOut, Package, Tag, ExternalLink } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { logoutAction } from "@/app/admin/actions";
import { hasSupabaseConfig } from "@/lib/supabase/client";

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const configured = hasSupabaseConfig();

  return (
    <div className="min-h-dvh bg-bg">
      <header className="sticky top-0 z-40 border-b border-line/70 bg-surface/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-6">
            <Logo href="/admin/productos" />
            <nav className="hidden items-center gap-1 sm:flex">
              <Link
                href="/admin/productos"
                className="flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-ink-soft hover:bg-surface-2 hover:text-ink"
              >
                <Package className="h-4 w-4" /> Productos
              </Link>
              <Link
                href="/admin/ofertas"
                className="flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-ink-soft hover:bg-surface-2 hover:text-ink"
              >
                <Tag className="h-4 w-4" /> Ofertas
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              target="_blank"
              className="hidden items-center gap-1.5 text-sm text-ink-soft hover:text-ink sm:flex"
            >
              Ver sitio <ExternalLink className="h-3.5 w-3.5" />
            </Link>
            {configured && (
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-ink-soft hover:bg-surface-2 hover:text-ink"
                >
                  <LogOut className="h-4 w-4" /> Salir
                </button>
              </form>
            )}
          </div>
        </div>
        <nav className="flex items-center gap-1 border-t border-line/70 px-4 py-2 sm:hidden">
          <Link
            href="/admin/productos"
            className="flex flex-1 items-center justify-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-ink-soft hover:bg-surface-2 hover:text-ink"
          >
            <Package className="h-4 w-4" /> Productos
          </Link>
          <Link
            href="/admin/ofertas"
            className="flex flex-1 items-center justify-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-ink-soft hover:bg-surface-2 hover:text-ink"
          >
            <Tag className="h-4 w-4" /> Ofertas
          </Link>
        </nav>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8 md:px-8">{children}</main>
    </div>
  );
}
