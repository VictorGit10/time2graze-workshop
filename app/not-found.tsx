import type { Metadata } from 'next';
import Link from 'next/link';
// A wrong URL on hotel wi-fi should not strand a reader on a bare 404 — the way
// back is the whole site, one tap away, in the header's own order and wording.
import { DESTINATIONS } from '@/data/navigation';

export const metadata: Metadata = {
  title: 'Page not found · Time2Graze Brazil Workshop',
  description: 'This page could not be found. The four destinations of the workshop site are listed below.',
};

export default function NotFound() {
  return (
    <section className="not-found section-pad">
      <p className="not-found-code">404</p>
      <h1>This page could not be found.</h1>
      <p className="not-found-lede">The link may be old or mistyped. The workshop site is these four pages:</p>
      <nav className="not-found-nav" aria-label="Back to the site">
        {DESTINATIONS.map(({ href, label }) => (
          <Link key={href} href={href}>{label}</Link>
        ))}
      </nav>
    </section>
  );
}
