"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

// Cosmetic top progress bar for route changes. Deliberately does NOT use
// Suspense/loading.tsx: pairing an ancestor loading.tsx with a page that
// calls useSearchParams (the catalog's product-sheet deep link) leaves the
// route permanently stuck on its fallback in this environment, so all
// "pantalla de carga" feedback here is plain client state instead.
export function RouteProgressBar() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setVisible(true);
    const timeout = setTimeout(() => setVisible(false), 500);
    return () => clearTimeout(timeout);
  }, [pathname]);

  return (
    <div
      aria-hidden
      className="fixed inset-x-0 top-0 z-[90] h-0.5 overflow-hidden"
      style={{ opacity: visible ? 1 : 0, transition: "opacity 200ms ease" }}
    >
      <div
        className="h-full bg-accent"
        style={{
          width: "40%",
          animation: visible ? "route-progress 0.5s ease-in-out" : "none",
        }}
      />
      <style>{`
        @keyframes route-progress {
          0% { transform: translateX(-100%); }
          60% { transform: translateX(150%); }
          100% { transform: translateX(350%); }
        }
      `}</style>
    </div>
  );
}
