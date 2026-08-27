import { createClient, hasSupabaseConfig } from "@/lib/supabase/server";

export interface ProductInquiryCount {
  productId: string;
  count: number;
}

// Demo-mode click counts, kept in memory for the life of the dev process —
// same pattern as the other lib/data/* fallbacks (see sample-data.ts).
const demoInquiryCounts = new Map<string, number>();

export async function recordWhatsAppClick(productId: string): Promise<void> {
  if (!hasSupabaseConfig()) {
    demoInquiryCounts.set(productId, (demoInquiryCounts.get(productId) ?? 0) + 1);
    return;
  }

  const supabase = await createClient();
  const { error } = await supabase.from("product_inquiries").insert({ product_id: productId });
  if (error) throw error;
}

export async function getTopProductInquiries(limit = 20): Promise<ProductInquiryCount[]> {
  if (!hasSupabaseConfig()) {
    return Array.from(demoInquiryCounts.entries())
      .map(([productId, count]) => ({ productId, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }

  const supabase = await createClient();
  const { data, error } = await supabase.from("product_inquiries").select("product_id");
  if (error) throw error;

  const counts = new Map<string, number>();
  for (const row of data ?? []) {
    counts.set(row.product_id, (counts.get(row.product_id) ?? 0) + 1);
  }

  return Array.from(counts.entries())
    .map(([productId, count]) => ({ productId, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}
