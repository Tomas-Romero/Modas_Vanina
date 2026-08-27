"use client";

import { motion } from "framer-motion";

// Generic scroll-triggered reveal, used for home/nosotros sections. Plain
// whileInView (not tied to route Suspense), so it's safe on mobile scroll
// and doesn't interact with the loading.tsx bug — see project memory.
export function RevealSection({
  children,
  className,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <motion.section
      id={id}
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {children}
    </motion.section>
  );
}
