import { ArrowUp } from 'lucide-react';
import Link from 'next/link';
import { PARTICIPANT_GROUP } from '@/data/contact';
import { WhatsAppMark } from '@/components/whatsapp-mark';

export function SiteFooter() {
  return (
    <footer>
      <Link className="brand footer-brand" href="/">
        <strong>Time2Graze</strong><small>Brazil Workshop</small>
      </Link>
      <p>Internal technical workshop · 14–18 September 2026 · Goiânia, Goiás, Brazil</p>
      {/* The group again, under the name it belongs to, so a reader on the
          programme or on a materials page does not have to go home for it.
          A direct child of the footer on purpose: the print rule hides
          `footer > a`, and a wrapper would put this link back on paper. */}
      <a
        className="footer-group"
        href={PARTICIPANT_GROUP.href}
        target="_blank"
        rel="noreferrer"
      >
        <WhatsAppMark />
        {PARTICIPANT_GROUP.short}
      </a>
      {/* `#top` is the document top even with no element carrying that id, so
          this works on every page without one. */}
      <a href="#top">Back to top <ArrowUp aria-hidden="true" /></a>
    </footer>
  );
}
