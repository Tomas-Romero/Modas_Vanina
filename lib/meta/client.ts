// Shared Meta Graph API config + fetch helper for Instagram/Facebook
// publishing. One long-lived User token (META_ACCESS_TOKEN, ~60 days) is
// used for both — see the admin note in .env.local about renewing it.
export const GRAPH_VERSION = "v21.0";
export const GRAPH_BASE = `https://graph.facebook.com/${GRAPH_VERSION}`;

export function hasMetaToken(): boolean {
  return Boolean(process.env.META_ACCESS_TOKEN);
}

export function hasInstagramConfig(): boolean {
  return hasMetaToken() && Boolean(process.env.META_INSTAGRAM_ACCOUNT_ID);
}

export function hasFacebookConfig(): boolean {
  return hasMetaToken() && Boolean(process.env.META_FACEBOOK_PAGE_ID);
}

interface GraphError {
  error?: { message: string; type?: string; code?: number };
}

export async function graphPost<T>(path: string, params: Record<string, string>): Promise<T> {
  const res = await fetch(`${GRAPH_BASE}/${path}`, {
    method: "POST",
    body: new URLSearchParams(params),
  });
  const data = (await res.json()) as T & GraphError;
  if (!res.ok || data.error) {
    throw new Error(data.error?.message ?? "Meta devolvió un error inesperado.");
  }
  return data;
}

export async function graphGet<T>(path: string, params: Record<string, string>): Promise<T> {
  const url = new URL(`${GRAPH_BASE}/${path}`);
  for (const [key, value] of Object.entries(params)) url.searchParams.set(key, value);
  const res = await fetch(url.toString());
  const data = (await res.json()) as T & GraphError;
  if (!res.ok || data.error) {
    throw new Error(data.error?.message ?? "Meta devolvió un error inesperado.");
  }
  return data;
}
