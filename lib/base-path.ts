/**
 * `basePath` prefixes `next/link` hrefs and everything under `_next/` on its
 * own. It does not reach a plain `<a href>`, an `<img src>` or a metadata
 * icon — those go through here.
 *
 * Only site-rooted paths are prefixed; an external URL passes through
 * untouched. Never write the repository name into a path: it comes from
 * `NEXT_PUBLIC_BASE_PATH` at build time, and hardcoding it breaks `npm run
 * dev` and any move to a host serving the site from its root.
 */
export function withBasePath(path: string): string {
  return path.startsWith('/')
    ? `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}${path}`
    : path;
}

/**
 * Calendar subscriptions are fetched by the calendar provider, not by the
 * reader's browser, so they need the deployed absolute address. The deploy
 * environment already includes the repository base path in this value.
 */
export function absoluteUrl(path: string): string | null {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '');
  return siteUrl ? `${siteUrl}${path}` : null;
}
