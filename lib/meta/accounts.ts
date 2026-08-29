import { graphGet, hasFacebookConfig, hasInstagramConfig } from "./client";

export interface SocialAccountsInfo {
  instagram?: { username: string; name: string } | { error: string };
  facebook?: { name: string } | { error: string };
}

// Lets the admin see exactly which real account a "Publicar" click will hit
// before confirming — built after a mix-up where a product was published to
// the wrong linked Instagram account without anyone noticing beforehand.
export async function getSocialAccountsInfo(): Promise<SocialAccountsInfo> {
  const info: SocialAccountsInfo = {};
  const token = process.env.META_ACCESS_TOKEN;

  if (hasInstagramConfig() && token) {
    try {
      const ig = await graphGet<{ username?: string; name?: string }>(
        process.env.META_INSTAGRAM_ACCOUNT_ID!,
        { fields: "username,name", access_token: token },
      );
      if (ig.username) info.instagram = { username: ig.username, name: ig.name ?? "" };
      else info.instagram = { error: "No se pudo identificar la cuenta." };
    } catch (err) {
      info.instagram = { error: err instanceof Error ? err.message : "Error desconocido." };
    }
  }

  if (hasFacebookConfig() && token) {
    try {
      const page = await graphGet<{ name?: string }>(process.env.META_FACEBOOK_PAGE_ID!, {
        fields: "name",
        access_token: token,
      });
      if (page.name) info.facebook = { name: page.name };
      else info.facebook = { error: "No se pudo identificar la página." };
    } catch (err) {
      info.facebook = { error: err instanceof Error ? err.message : "Error desconocido." };
    }
  }

  return info;
}
