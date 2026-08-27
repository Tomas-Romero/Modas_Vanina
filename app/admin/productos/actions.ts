"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/supabase/requireAdmin";
import { productFormSchema } from "@/lib/validation/product";
import {
  createProduct as createProductInDb,
  updateProduct as updateProductInDb,
  setProductHidden,
  deleteProduct as deleteProductInDb,
} from "@/lib/data/products";

type ActionResult = { ok: true; id?: string } | { ok: false; error: string };

function revalidateProductPaths() {
  revalidatePath("/catalogo");
  revalidatePath("/");
  revalidatePath("/admin/productos");
}

export async function createProductAction(input: unknown): Promise<ActionResult> {
  const admin = await requireAdmin();
  if (!admin.ok) return { ok: false, error: admin.error };

  const parsed = productFormSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos." };

  try {
    const id = await createProductInDb(parsed.data);
    revalidateProductPaths();
    return { ok: true, id };
  } catch (err) {
    console.error("createProductAction", err);
    return { ok: false, error: "No se pudo crear el producto." };
  }
}

export async function updateProductAction(id: string, input: unknown): Promise<ActionResult> {
  const admin = await requireAdmin();
  if (!admin.ok) return { ok: false, error: admin.error };

  const parsed = productFormSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos." };

  try {
    await updateProductInDb(id, parsed.data);
    revalidateProductPaths();
    return { ok: true };
  } catch (err) {
    console.error("updateProductAction", err);
    return { ok: false, error: "No se pudo actualizar el producto." };
  }
}

export async function toggleProductHiddenAction(id: string, hidden: boolean): Promise<ActionResult> {
  const admin = await requireAdmin();
  if (!admin.ok) return { ok: false, error: admin.error };

  try {
    await setProductHidden(id, hidden);
    revalidateProductPaths();
    return { ok: true };
  } catch (err) {
    console.error("toggleProductHiddenAction", err);
    return { ok: false, error: "No se pudo actualizar el producto." };
  }
}

export async function deleteProductAction(id: string): Promise<ActionResult> {
  const admin = await requireAdmin();
  if (!admin.ok) return { ok: false, error: admin.error };

  try {
    await deleteProductInDb(id);
    revalidateProductPaths();
    return { ok: true };
  } catch (err) {
    console.error("deleteProductAction", err);
    return { ok: false, error: "No se pudo borrar el producto." };
  }
}
