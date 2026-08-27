import { createClient, hasSupabaseConfig } from "@/lib/supabase/server";
import { SAMPLE_OFFERS } from "@/lib/sample-data";
import type { Offer } from "@/lib/types";

export interface OfferInput {
  title: string;
  product_ids: string[];
  ends_at?: string | null;
}

let demoOfferIdCounter = SAMPLE_OFFERS.length;

export async function getAllOffers(): Promise<Offer[]> {
  if (!hasSupabaseConfig()) {
    return SAMPLE_OFFERS;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("offers")
    .select("*")
    .order("position", { ascending: true });

  if (error) throw error;
  return (data as Offer[]) ?? [];
}

export async function getOfferById(id: string): Promise<Offer | null> {
  if (!hasSupabaseConfig()) {
    return SAMPLE_OFFERS.find((o) => o.id === id) ?? null;
  }

  const supabase = await createClient();
  const { data, error } = await supabase.from("offers").select("*").eq("id", id).maybeSingle();

  if (error) throw error;
  return (data as Offer | null) ?? null;
}

export async function createOffer(input: OfferInput): Promise<string> {
  if (!hasSupabaseConfig()) {
    const id = `sample-offer-demo-${++demoOfferIdCounter}`;
    SAMPLE_OFFERS.push({
      id,
      title: input.title,
      product_ids: input.product_ids,
      starts_at: new Date().toISOString(),
      ends_at: input.ends_at || null,
      position: SAMPLE_OFFERS.length,
    });
    return id;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("offers")
    .insert({
      title: input.title,
      product_ids: input.product_ids,
      ends_at: input.ends_at || null,
      position: 0,
    })
    .select("id")
    .single();

  if (error) throw error;
  return data.id as string;
}

export async function updateOffer(id: string, input: OfferInput): Promise<void> {
  if (!hasSupabaseConfig()) {
    const offer = SAMPLE_OFFERS.find((o) => o.id === id);
    if (!offer) throw new Error("Oferta no encontrada.");
    Object.assign(offer, {
      title: input.title,
      product_ids: input.product_ids,
      ends_at: input.ends_at || null,
    });
    return;
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("offers")
    .update({
      title: input.title,
      product_ids: input.product_ids,
      ends_at: input.ends_at || null,
    })
    .eq("id", id);

  if (error) throw error;
}

export async function deleteOffer(id: string): Promise<void> {
  if (!hasSupabaseConfig()) {
    const index = SAMPLE_OFFERS.findIndex((o) => o.id === id);
    if (index !== -1) SAMPLE_OFFERS.splice(index, 1);
    return;
  }

  const supabase = await createClient();
  const { error } = await supabase.from("offers").delete().eq("id", id);
  if (error) throw error;
}

export async function moveOfferPosition(id: string, direction: "up" | "down"): Promise<void> {
  if (!hasSupabaseConfig()) {
    SAMPLE_OFFERS.sort((a, b) => a.position - b.position);
    const index = SAMPLE_OFFERS.findIndex((o) => o.id === id);
    const swapWith = direction === "up" ? index - 1 : index + 1;
    if (index === -1 || swapWith < 0 || swapWith >= SAMPLE_OFFERS.length) return;
    const a = SAMPLE_OFFERS[index];
    const b = SAMPLE_OFFERS[swapWith];
    [a.position, b.position] = [b.position, a.position];
    return;
  }

  const supabase = await createClient();
  const { data: offers, error: fetchError } = await supabase
    .from("offers")
    .select("id, position")
    .order("position", { ascending: true });
  if (fetchError) throw fetchError;

  const list = (offers ?? []) as { id: string; position: number }[];
  const index = list.findIndex((o) => o.id === id);
  const swapWith = direction === "up" ? index - 1 : index + 1;
  if (index === -1 || swapWith < 0 || swapWith >= list.length) return;

  const a = list[index];
  const b = list[swapWith];
  const { error: e1 } = await supabase.from("offers").update({ position: b.position }).eq("id", a.id);
  if (e1) throw e1;
  const { error: e2 } = await supabase.from("offers").update({ position: a.position }).eq("id", b.id);
  if (e2) throw e2;
}
