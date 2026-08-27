"use server";

import { recordWhatsAppClick } from "@/lib/data/analytics";

// Public — no admin gate. Fire-and-forget inquiry tracking triggered from
// the "Preguntar por WhatsApp" buttons; failures are swallowed so a
// tracking hiccup never blocks the actual WhatsApp handoff.
export async function recordWhatsAppClickAction(productId: string): Promise<void> {
  try {
    await recordWhatsAppClick(productId);
  } catch (err) {
    console.error("recordWhatsAppClickAction", err);
  }
}
