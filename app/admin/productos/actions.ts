"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/supabase/requireAdmin";
import { productFormSchema } from "@/lib/validation/product";
import {
  createProduct as createProductInDb,
  updateProduct as updateProductInDb,
  setProductHidden,
  deleteProduct as deleteProductInDb,
  getProductById,
} from "@/lib/data/products";
import { hasInstagramConfig, publishToInstagram } from "@/lib/meta/instagram";
import { hasFacebookConfig, publishToFacebookPage } from "@/lib/meta/facebook";
import { buildSocialCaption } from "@/lib/meta/caption";

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

type PlatformResult = { ok: true; postId: string } | { ok: false; error: string };

export interface PublishToSocialResult {
  instagram?: PlatformResult;
  facebook?: PlatformResult;
}

export async function publishToSocialAction(
  productId: string,
  platforms: { instagram: boolean; facebook: boolean },
): Promise<{ ok: true; result: PublishToSocialResult } | { ok: false; error: string }> {
  const admin = await requireAdmin();
  if (!admin.ok) return { ok: false, error: admin.error };

  const product = await getProductById(productId);
  if (!product) return { ok: false, error: "Producto no encontrado." };

  const imageUrl = product.images[0];
  if (!imageUrl || !imageUrl.startsWith("http")) {
    return {
      ok: false,
      error: "Este producto no tiene una foto pública todavía (configurá Cloudinary y subí una foto real).",
    };
  }

  const caption = buildSocialCaption(product);
  const result: PublishToSocialResult = {};

  if (platforms.instagram) {
    if (!hasInstagramConfig()) {
      result.instagram = { ok: false, error: "Instagram no está configurado." };
    } else {
      try {
        const { postId } = await publishToInstagram({ imageUrl, caption });
        result.instagram = { ok: true, postId };
      } catch (err) {
        console.error("publishToInstagram", err);
        result.instagram = { ok: false, error: err instanceof Error ? err.message : "Error desconocido." };
      }
    }
  }

  if (platforms.facebook) {
    if (!hasFacebookConfig()) {
      result.facebook = { ok: false, error: "Facebook no está configurado." };
    } else {
      try {
        const { postId } = await publishToFacebookPage({ imageUrl, caption });
        result.facebook = { ok: true, postId };
      } catch (err) {
        console.error("publishToFacebookPage", err);
        result.facebook = { ok: false, error: err instanceof Error ? err.message : "Error desconocido." };
      }
    }
  }

  return { ok: true, result };
}
