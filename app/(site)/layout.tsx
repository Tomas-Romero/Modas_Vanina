import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { Footer } from "@/components/layout/Footer";
import { FloatingWhatsAppButton } from "@/components/layout/FloatingWhatsAppButton";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      <main className="flex-1 pb-24 md:pb-0">{children}</main>
      <div className="hidden md:block">
        <Footer />
      </div>
      <FloatingWhatsAppButton />
      <BottomNav />
    </div>
  );
}
