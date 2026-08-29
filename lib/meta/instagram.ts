import { graphGet, graphPost, hasInstagramConfig } from "./client";

export { hasInstagramConfig };

interface CreationResponse {
  id?: string;
}

interface ContainerStatus {
  status_code: "IN_PROGRESS" | "FINISHED" | "ERROR" | "EXPIRED";
}

interface PostExistsResponse {
  id?: string;
  permalink?: string;
}

async function waitForContainerReady(creationId: string, token: string, attempts = 6): Promise<void> {
  for (let i = 0; i < attempts; i++) {
    const status = await graphGet<ContainerStatus>(creationId, {
      fields: "status_code",
      access_token: token,
    });
    if (status.status_code === "FINISHED") return;
    if (status.status_code === "ERROR" || status.status_code === "EXPIRED") {
      throw new Error("Instagram no pudo procesar la imagen.");
    }
    await new Promise((resolve) => setTimeout(resolve, 1500));
  }
  // Single-image containers are near-instant in practice; if it's still not
  // ready after ~9s something's off, but attempt the publish anyway rather
  // than blocking forever — Meta will reject it with a clear error if not ready.
}

export async function publishToInstagram({
  imageUrl,
  caption,
}: {
  imageUrl: string;
  caption: string;
}): Promise<{ postId: string }> {
  if (!hasInstagramConfig()) throw new Error("Instagram no está configurado.");

  const token = process.env.META_ACCESS_TOKEN!;
  const igAccountId = process.env.META_INSTAGRAM_ACCOUNT_ID!;

  const created = await graphPost<CreationResponse>(`${igAccountId}/media`, {
    image_url: imageUrl,
    caption,
    access_token: token,
  });
  if (!created.id) throw new Error("Instagram no devolvió un ID de contenedor al crear la publicación.");

  await waitForContainerReady(created.id, token);

  const published = await graphPost<CreationResponse>(`${igAccountId}/media_publish`, {
    creation_id: created.id,
    access_token: token,
  });
  if (!published.id) throw new Error("Instagram no devolvió un ID de publicación.");

  // Don't trust the publish response alone — confirm the media is really
  // there before reporting success (Meta has returned a valid-looking
  // success that didn't stick, confirmed 2026-08-28 on the Facebook side).
  const verify = await graphGet<PostExistsResponse>(published.id, {
    fields: "id",
    access_token: token,
  }).catch(() => null);

  if (!verify?.id) {
    throw new Error(
      "Instagram confirmó la publicación pero no aparece al volver a consultarla — puede haber sido removida automáticamente. No la des por publicada.",
    );
  }

  return { postId: published.id };
}
