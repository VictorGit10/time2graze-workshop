'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

/** The three destinations besides the home page. */
const DESTINATIONS = [
  { href: '/programme/', label: 'Programme' },
  { href: '/materials/', label: 'Materials' },
  { href: '/practical/', label: 'Practical information' },
] as const;

/**
 * The same navigation on every page. It stays in the sticky header on small
 * screens as a scrollable row rather than collapsing into a drawer: three
 * links are quicker to read than a button that hides three links.
 */
export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="site-header">
      <div className="header-bar">
        <Link className="brand" href="/" aria-label="Time2Graze Brazil Workshop — home">
          <span className="brand-mark">T2G</span>
          <span className="brand-copy"><strong>Time2Graze</strong><small>Brazil Workshop</small></span>
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

        <Link className="header-date" href="/programme/">14—18 Sep <span>2026</span></Link>
      </div>
    </header>
  );
}
