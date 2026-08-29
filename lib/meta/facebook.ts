import { graphGet, graphPost, hasFacebookConfig } from "./client";

export { hasFacebookConfig };

interface PageTokenResponse {
  access_token?: string;
}

interface PhotoUploadResponse {
  id?: string;
}

interface FeedPostResponse {
  id?: string;
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
  const token = pageToken.access_token;

  // Posting straight to /{page}/photos with a caption is supposed to also
  // generate a normal timeline story (Meta's own default is no_story=false),
  // but confirmed 2026-08-29 against this exact Page: the photo lands in
  // the Photos tab and never shows up as a Post. The reliable fix is the
  // two-step flow Meta documents for multi-photo posts — upload the photo
  // unpublished, then create the actual feed Post attaching it.
  const uploaded = await graphPost<PhotoUploadResponse>(`${pageId}/photos`, {
    url: imageUrl,
    published: "false",
    access_token: token,
  });
  if (!uploaded.id) {
    throw new Error("Facebook no devolvió un ID al subir la foto.");
  }

  const posted = await graphPost<FeedPostResponse>(`${pageId}/feed`, {
    message: caption,
    "attached_media[0]": JSON.stringify({ media_fbid: uploaded.id }),
    access_token: token,
  });

  const postId = posted.id;
  if (!postId) {
    throw new Error("Facebook no devolvió un ID de publicación — no se pudo confirmar que se haya creado.");
  }

  // Don't trust the creation response alone — Meta has returned a
  // valid-looking success that didn't stick (confirmed on this Page
  // 2026-08-28). Read the post back before telling the admin it worked.
  const verify = await graphGet<PostExistsResponse>(postId, {
    fields: "id",
    access_token: token,
  }).catch(() => null);

  if (!verify?.id) {
    throw new Error(
      "Facebook confirmó la creación pero la publicación no aparece al volver a consultarla — puede haber sido removida automáticamente. No la des por publicada.",
    );
  }

  return { postId };
}
