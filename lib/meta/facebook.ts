import { graphGet, graphPost, hasFacebookConfig } from "./client";

export { hasFacebookConfig };

interface PageTokenResponse {
  access_token?: string;
}

interface PhotoPostResponse {
  id?: string;
  post_id?: string;
}

interface PostExistsResponse {
  id?: string;
}

export async function publishToFacebookPage({
  imageUrl,
  caption,
}: {
  imageUrl: string;
  caption: string;
}): Promise<{ postId: string }> {
  if (!hasFacebookConfig()) throw new Error("Facebook no está configurado.");

  const userToken = process.env.META_ACCESS_TOKEN!;
  const pageId = process.env.META_FACEBOOK_PAGE_ID!;

  // Page mutations need a page-scoped token, not the raw user token — derive
  // it fresh each time so a renewed user token keeps working automatically.
  const pageToken = await graphGet<PageTokenResponse>(pageId, {
    fields: "access_token",
    access_token: userToken,
  });
  if (!pageToken.access_token) {
    throw new Error(
      "No se pudo obtener un token de acceso para la página (revisá que el token tenga permiso pages_manage_posts sobre esta página específica).",
    );
  }

  const posted = await graphPost<PhotoPostResponse>(`${pageId}/photos`, {
    url: imageUrl,
    caption,
    access_token: pageToken.access_token,
  });

  const postId = posted.post_id ?? posted.id;
  if (!postId) {
    throw new Error("Facebook no devolvió un ID de publicación — no se pudo confirmar que se haya creado.");
  }

  // Meta has been known to accept a photo POST (200 + valid id) and then not
  // actually keep it — verified 2026-08-28 against this exact page. Don't
  // trust the creation response alone: read the object back before telling
  // the admin it worked.
  const verify = await graphGet<PostExistsResponse>(postId, {
    fields: "id",
    access_token: pageToken.access_token,
  }).catch(() => null);

  if (!verify?.id) {
    throw new Error(
      "Facebook confirmó la creación pero la publicación no aparece al volver a consultarla — puede haber sido removida automáticamente. No la des por publicada.",
    );
  }

  return { postId };
}
