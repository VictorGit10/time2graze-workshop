import { ArrowRight, CalendarDays, ChevronRight, MapPin } from 'lucide-react';
import Link from 'next/link';
import { NowNext } from '@/components/now-next';
import { withBasePath } from '@/lib/base-path';

/** The three destinations, as a directory rather than a shortcut bar. */
const DESTINATIONS = [
  { href: '/programme/', title: 'Programme', detail: 'Sessions and daily schedule' },
  { href: '/materials/', title: 'Materials', detail: 'Presentations and documents' },
  { href: '/practical/', title: 'Practical information', detail: 'Stay, meals, transport and maps' },
] as const;

export default function Home() {
  return (
    <>
      <section className="institutional-hero" id="top">
        <div className="event-summary">
          <p className="event-label">Time2Graze Project · Internal technical workshop</p>
          <h1>Time2Graze<br />Brazil Workshop</h1>
          <p className="event-objective">Strengthening collaboration across partner teams by connecting data development and decision support for improved grazing management.</p>
          <div className="hero-meta" aria-label="Event information">
            <span><CalendarDays aria-hidden="true" />14—18 September 2026</span>
            <span><MapPin aria-hidden="true" />Goiânia, Goiás · Brazil</span>
          </div>
          <div className="hero-actions">
            <Link href="/programme/">View programme <ArrowRight aria-hidden="true" /></Link>
            <Link href="/practical/">Practical information <ArrowRight aria-hidden="true" /></Link>
          </div>
        </div>
        <div className="event-visual">
          {/* basePath does not reach a plain img; it has to be prefixed here. */}
          <img src={withBasePath('/time2graze-hero.webp')} alt="Grazing lands in the Brazilian Cerrado" />
          <p><strong>In person</strong><span>Hosted by LAPIG · UFG</span></p>
        </div>
      </section>

      <NowNext />

      <nav className="information-nav" aria-label="Workshop information">
        {DESTINATIONS.map(({ href, title, detail }, index) => (
          <Link key={href} href={href}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <div><strong>{title}</strong><small>{detail}</small></div>
            <ChevronRight aria-hidden="true" />
          </Link>
        ))}
      </nav>

      <section className="overview section-pad" id="about">
        <div className="section-title"><p>Workshop overview</p><h2>Purpose and format</h2></div>
        <div className="overview-layout">
          <div className="objective-block">
            <h3>Objective</h3>
            <p>The primary objective of this workshop is to strengthen collaboration across our partner teams by integrating data development and decision support to advance our main goal of improving grazing management and decision-making in livestock systems in the Global South.</p>
          </div>
          <dl className="fact-list">
            <div><dt>Format</dt><dd>In-person technical workshop</dd></div>
            <div><dt>Participation</dt><dd>Internal to the Time2Graze project</dd></div>
            <div><dt>Participants</dt><dd>Representatives from each partner country</dd></div>
            <div><dt>Host</dt><dd>LAPIG · Federal University of Goiás</dd></div>
          </dl>
        </div>
      </section>
    </>
  );
}
