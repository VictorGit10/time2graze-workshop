'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { DESTINATIONS } from '@/data/navigation';

/**
 * The same navigation on every page, staying in the sticky header on small
 * screens with all four destinations visible — no drawer, no scroll.
 *
 * `Home` is a link of its own, not only the wordmark. The wordmark returns
 * home as well, but a reader three pages deep should not have to know that,
 * and it costs one slot in a row of four.
 */
export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="site-header">
      <div className="header-bar">
        {/* The workshop has no mark of its own, and inventing one would put a
            logo next to real institutional marks. The name is the brand. */}
        <Link className="brand" href="/" aria-label="Time2Graze Brazil Workshop — home">
          <strong>Time2Graze</strong><small>Brazil Workshop</small>
        </Link>

        <nav className="site-nav" aria-label="Main navigation">
          {DESTINATIONS.map(({ href, label }) => {
            const here = pathname === href || pathname === href.replace(/\/$/, '');
            return (
              <Link key={href} href={href} aria-current={here ? 'page' : undefined}>
                {label}
              </Link>
            );
          })}
        </nav>

        <Link className="header-date" href="/programme/">14–18 Sep <span>2026</span></Link>
      </div>
    </header>
  );
}
