import { ArrowUp } from 'lucide-react';
import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer>
      <Link className="brand footer-brand" href="/">
        <strong>Time2Graze</strong><small>Brazil Workshop</small>
      </Link>
      <p>Internal technical workshop · 14–18 September 2026 · Goiânia, Goiás, Brazil</p>
      {/* `#top` is the document top even with no element carrying that id, so
          this works on every page without one. */}
      <a href="#top">Back to top <ArrowUp aria-hidden="true" /></a>
    </footer>
  );
}
