import { createClient, hasSupabaseConfig } from "@/lib/supabase/server";
import { SAMPLE_PRODUCTS } from "@/lib/sample-data";
import type { Availability, Category, Product } from "@/lib/types";

export interface ProductInput {
  name: string;
  category: Category;
  subcategory?: string;
  images: string[];
  description?: string;
  availability: Availability;
}

let demoIdCounter = SAMPLE_PRODUCTS.length;

export async function getVisibleProducts(): Promise<Product[]> {
  if (!hasSupabaseConfig()) {
    return SAMPLE_PRODUCTS.filter((p) => !p.hidden);
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("hidden", false)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data as Product[]) ?? [];
}

export async function getProductsByIds(ids: string[]): Promise<Product[]> {
  if (ids.length === 0) return [];

  if (!hasSupabaseConfig()) {
    return SAMPLE_PRODUCTS.filter((p) => ids.includes(p.id));
  }

  const supabase = await createClient();
  const { data, error } = await supabase.from("products").select("*").in("id", ids);

  if (error) throw error;
  return (data as Product[]) ?? [];
}

export async function getAllProductsForAdmin(): Promise<Product[]> {
  if (!hasSupabaseConfig()) {
    return SAMPLE_PRODUCTS;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data as Product[]) ?? [];
}

export async function getProductById(id: string): Promise<Product | null> {
  if (!hasSupabaseConfig()) {
    return SAMPLE_PRODUCTS.find((p) => p.id === id) ?? null;
  }

  const supabase = await createClient();
  const { data, error } = await supabase.from("products").select("*").eq("id", id).maybeSingle();

  if (error) throw error;
  return (data as Product | null) ?? null;
}

export async function createProduct(input: ProductInput): Promise<string> {
  if (!hasSupabaseConfig()) {
    const id = `sample-demo-${++demoIdCounter}`;
    SAMPLE_PRODUCTS.unshift({
      id,
      name: input.name,
      category: input.category,
      subcategory: input.subcategory || null,
      images: input.images,
      description: input.description ?? "",
      availability: input.availability,
      hidden: false,
      created_at: new Date().toISOString(),
    });
    return id;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .insert({
      name: input.name,
      category: input.category,
      subcategory: input.subcategory || null,
      images: input.images,
      description: input.description ?? "",
      availability: input.availability,
    })
    .select("id")
    .single();

  if (error) throw error;
  return data.id as string;
}

export async function updateProduct(id: string, input: ProductInput): Promise<void> {
  if (!hasSupabaseConfig()) {
    const product = SAMPLE_PRODUCTS.find((p) => p.id === id);
    if (!product) throw new Error("Producto no encontrado.");
    Object.assign(product, {
      name: input.name,
      category: input.category,
      subcategory: input.subcategory || null,
      images: input.images,
      description: input.description ?? "",
      availability: input.availability,
    });
    return;
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("products")
    .update({
      name: input.name,
      category: input.category,
      subcategory: input.subcategory || null,
      images: input.images,
      description: input.description ?? "",
      availability: input.availability,
    })
    .eq("id", id);

  if (error) throw error;
}

export async function setProductHidden(id: string, hidden: boolean): Promise<void> {
  if (!hasSupabaseConfig()) {
    const product = SAMPLE_PRODUCTS.find((p) => p.id === id);
    if (product) product.hidden = hidden;
    return;
  }

  const supabase = await createClient();
  const { error } = await supabase.from("products").update({ hidden }).eq("id", id);
  if (error) throw error;
}

export async function deleteProduct(id: string): Promise<void> {
  if (!hasSupabaseConfig()) {
    const index = SAMPLE_PRODUCTS.findIndex((p) => p.id === id);
    if (index !== -1) SAMPLE_PRODUCTS.splice(index, 1);
    return;
  }

  const supabase = await createClient();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
}
