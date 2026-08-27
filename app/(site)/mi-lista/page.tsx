import type { Metadata } from "next";
import { MiListaClient } from "@/components/list/MiListaClient";

export const metadata: Metadata = {
  title: "Mi lista",
  robots: { index: false, follow: false },
};

export default function MiListaPage() {
  return <MiListaClient />;
}
