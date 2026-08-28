import { graphGet, graphPost, hasInstagramConfig } from "./client";

export { hasInstagramConfig };

interface CreationResponse {
  id: string;
}

interface ContainerStatus {
  status_code: "IN_PROGRESS" | "FINISHED" | "ERROR" | "EXPIRED";
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

  await waitForContainerReady(created.id, token);

  const published = await graphPost<CreationResponse>(`${igAccountId}/media_publish`, {
    creation_id: created.id,
    access_token: token,
  });

  return { postId: published.id };
}
