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
  return path.startsWith('/') ? `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}${path}` : path;
}

/**
 * The same path as an absolute URL, for the few places a relative one cannot
 * work: a social preview image, and a calendar subscription, which Google and
 * Apple fetch from their own servers rather than from the reader's browser.
 *
 * `NEXT_PUBLIC_SITE_URL` is supplied by the deploy workflow and already
 * carries the base path. It is absent under `npm run dev`, where the site has
 * no public address — callers render what they can without one.
 */
export function absoluteUrl(path: string): string | null {
  const origin = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '');
  return origin ? `${origin}${path}` : null;
}
