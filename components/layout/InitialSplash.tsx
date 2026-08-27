"use client";

import { useEffect, useState } from "react";
import { LogoMark } from "./Logo";

// One-time branded splash for the very first paint of a fresh visit.
// Plain client state, not Suspense — see RouteProgressBar for why.
export function InitialSplash() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const alreadyVisited = window.sessionStorage.getItem("modas-vanina:visited");
    if (alreadyVisited) {
      // sessionStorage only exists client-side, so this check — and hiding
      // the splash for repeat views in the same tab — can only happen post-mount.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVisible(false);
      return;
    }
    window.sessionStorage.setItem("modas-vanina:visited", "1");
    const timeout = setTimeout(() => setVisible(false), 650);
    return () => clearTimeout(timeout);
  }, []);

  if (!visible) return null;

  return (
    <div
      aria-hidden
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center gap-3 bg-bg"
      style={{ animation: "splash-out 0.4s ease-in 0.5s forwards" }}
    >
      <LogoMark size="lg" />
      <div className="mt-2 h-1 w-24 overflow-hidden rounded-full bg-surface-2">
        <div className="h-full w-1/3 animate-[loading-bar_0.9s_ease-in-out_infinite] rounded-full bg-accent" />
      </div>
      <style>{`
        @keyframes loading-bar {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
        @keyframes splash-out {
          to { opacity: 0; visibility: hidden; }
        }
      `}</style>
    </div>
  );
}
