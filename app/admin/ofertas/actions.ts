"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/supabase/requireAdmin";
import { offerFormSchema } from "@/lib/validation/offer";
import {
  createOffer as createOfferInDb,
  updateOffer as updateOfferInDb,
  deleteOffer as deleteOfferInDb,
  moveOfferPosition,
} from "@/lib/data/offers";

type ActionResult = { ok: true; id?: string } | { ok: false; error: string };

function revalidateOfferPaths() {
  revalidatePath("/");
  revalidatePath("/admin/ofertas");
}

export async function createOfferAction(input: unknown): Promise<ActionResult> {
  const admin = await requireAdmin();
  if (!admin.ok) return { ok: false, error: admin.error };

  const parsed = offerFormSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos." };

  try {
    const id = await createOfferInDb(parsed.data);
    revalidateOfferPaths();
    return { ok: true, id };
  } catch (err) {
    console.error("createOfferAction", err);
    return { ok: false, error: "No se pudo crear la oferta." };
  }
}

export async function updateOfferAction(id: string, input: unknown): Promise<ActionResult> {
  const admin = await requireAdmin();
  if (!admin.ok) return { ok: false, error: admin.error };

  const parsed = offerFormSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos." };

  try {
    await updateOfferInDb(id, parsed.data);
    revalidateOfferPaths();
    return { ok: true };
  } catch (err) {
    console.error("updateOfferAction", err);
    return { ok: false, error: "No se pudo actualizar la oferta." };
  }
}

export async function deleteOfferAction(id: string): Promise<ActionResult> {
  const admin = await requireAdmin();
  if (!admin.ok) return { ok: false, error: admin.error };

  try {
    await deleteOfferInDb(id);
    revalidateOfferPaths();
    return { ok: true };
  } catch (err) {
    console.error("deleteOfferAction", err);
    return { ok: false, error: "No se pudo borrar la oferta." };
  }
}

export async function moveOfferPositionAction(id: string, direction: "up" | "down"): Promise<ActionResult> {
  const admin = await requireAdmin();
  if (!admin.ok) return { ok: false, error: admin.error };

  try {
    await moveOfferPosition(id, direction);
    revalidateOfferPaths();
    return { ok: true };
  } catch (err) {
    console.error("moveOfferPositionAction", err);
    return { ok: false, error: "No se pudo reordenar la oferta." };
  }
}
