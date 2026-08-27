import { createClient, hasSupabaseConfig } from "./server";

export async function requireAdmin(): Promise<{ ok: true } | { ok: false; status: number; error: string }> {
  if (!hasSupabaseConfig()) {
    // No real backend to protect yet — admin routes run in open demo mode
    // until Supabase is configured, so the panel stays fully clickable.
    return { ok: true };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, status: 401, error: "No autenticado." };
  }

  return { ok: true };
}
