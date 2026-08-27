// Derives a Cloudinary public_id from a stored secure_url on demand.
// Kept separate from the schema (which stores full secure_url strings, per
// the product spec) so future consumers — e.g. an Instagram Graph API
// integration — can get a public_id without a migration.
export function publicIdFromUrl(secureUrl: string): string | null {
  const match = secureUrl.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z0-9]+$/);
  return match ? match[1] : null;
}

export function cloudNameFromUrl(secureUrl: string): string | null {
  const match = secureUrl.match(/res\.cloudinary\.com\/([^/]+)\//);
  return match ? match[1] : null;
}
