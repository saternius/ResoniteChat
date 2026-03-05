import { ASSETS_BASE } from "../constants";

/**
 * Converts a resdb:// URI to an HTTPS URL for browser display.
 * resdb:///hash -> https://assets.resonite.com/hash
 */
export function resdbToHttps(uri: string | undefined | null): string | null {
  if (!uri) return null;

  if (uri.startsWith("resdb:///")) {
    const hash = uri.slice(9).replace(/\.[^.]+$/, "");
    return `${ASSETS_BASE}/${hash}`;
  }

  if (uri.startsWith("https://") || uri.startsWith("http://") || uri.startsWith("/")) {
    return uri;
  }

  return null;
}

/**
 * Gets the thumbnail URL for a session or record.
 */
export function getThumbnailUrl(thumbnailUri: string | undefined | null): string {
  const url = resdbToHttps(thumbnailUri);
  return url ?? "/placeholder-world.svg";
}

/**
 * Gets the icon URL for a user profile.
 */
export function getProfileIconUrl(iconUrl: string | undefined | null): string {
  const url = resdbToHttps(iconUrl);
  return url ?? "/placeholder-avatar.svg";
}
