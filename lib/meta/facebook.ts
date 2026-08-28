import { graphGet, graphPost, hasFacebookConfig } from "./client";

export { hasFacebookConfig };

interface PageTokenResponse {
  access_token: string;
}

interface PhotoPostResponse {
  id: string;
  post_id?: string;
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

  const posted = await graphPost<PhotoPostResponse>(`${pageId}/photos`, {
    url: imageUrl,
    caption,
    access_token: pageToken.access_token,
  });

  return { postId: posted.post_id ?? posted.id };
}
