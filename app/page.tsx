import { ArrowRight, CalendarDays, ChevronRight, MapPin } from 'lucide-react';
import type { CSSProperties } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { NowNext } from '@/components/now-next';
import { INSTITUTION_GROUPS, INSTITUTION_ROLE_SOURCE, type Institution } from '@/data/institutions';
import { withBasePath } from '@/lib/base-path';

/** The three destinations, as a directory rather than a shortcut bar. */
const DESTINATIONS = [
  { href: '/programme/', title: 'Programme', detail: 'Sessions and daily schedule' },
  { href: '/materials/', title: 'Materials', detail: 'Presentations and documents' },
  { href: '/practical/', title: 'Practical information', detail: 'Stay, meals, transport and maps' },
] as const;

/**
 * Marks are drawn to a shared optical area, not a shared height. At one height
 * a three-to-one wordmark reads far larger than an upright emblem, which is
 * what a hand-tuned `max-height` per logo was papering over. The cap stops a
 * tall mark from setting the height of the whole row.
 */
const MARK_AREA = 3200;
const MARK_MAX_HEIGHT = 56;

function markHeight({ width, height }: Institution) {
  return Math.min(MARK_MAX_HEIGHT, Math.round(Math.sqrt((MARK_AREA * height) / width)));
}

export default function Home() {
  return (
    <>
      <section className="institutional-hero" id="top">
        <div className="event-summary">
          <p className="event-label">Time2Graze Project · Internal technical workshop</p>
          <h1>Time2Graze<br />Brazil Workshop</h1>
          <p className="event-objective">Strengthening collaboration across partner teams by connecting data development and decision support for improved grazing management.</p>
          <div className="hero-meta" aria-label="Event information">
            <span><CalendarDays aria-hidden="true" />14–18 September 2026</span>
            <span><MapPin aria-hidden="true" />Goiânia, Goiás · Brazil</span>
          </div>
          <div className="hero-actions">
            <Link href="/programme/">View programme <ArrowRight aria-hidden="true" /></Link>
            <Link href="/practical/">Practical information <ArrowRight aria-hidden="true" /></Link>
          </div>
        </div>
        <div className="event-visual">
          {/* basePath does not reach a plain img; it has to be prefixed here.
              The intrinsic 1440×1080 lets the browser reserve the box before
              the file arrives, and the hero is the largest thing on the page. */}
          <img
            src={withBasePath('/time2graze-hero.webp')}
            alt="Aerial view of pastureland documented by LAPIG"
            width={1440}
            height={1080}
            fetchPriority="high"
          />
          <a className="image-credit" href="https://jornal.ufg.br/n/80658-radiografia-das-pastagens-do-brasil" target="_blank" rel="noreferrer">Photo: LAPIG · Jornal UFG</a>
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

      <section className="institutions section-pad" aria-labelledby="institutions-title">
        <div className="section-title">
          <p>Institutions</p>
          <h2 id="institutions-title">Project leadership and workshop host</h2>
        </div>
        <div className="institution-groups">
          {INSTITUTION_GROUPS.map((group) => (
            <section className="institution-group" key={group.label}>
              <h3>{group.label}</h3>
              <div className="institution-list">
                {group.institutions.map((institution) => (
                  <a
                    className="institution-mark"
                    href={institution.href}
                    key={institution.name}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${institution.name} website`}
                    style={{ '--mark-h': `${markHeight(institution)}px` } as CSSProperties}
                  >
                    <Image
                      src={withBasePath(institution.logo)}
                      alt={institution.name}
                      width={institution.width}
                      height={institution.height}
                      loading="lazy"
                    />
                  </a>
                ))}
              </div>
            </section>
          ))}
        </div>
        {/* The announcement documents the funder and the leads; the hosts come
            from the event brief. Neither places Land & Carbon Lab, so the note
            says the list is still to be confirmed rather than crediting a
            source for all of it. */}
        <p className="institution-source">
          Roles follow the <a href={INSTITUTION_ROLE_SOURCE} target="_blank" rel="noreferrer">public Time2Graze project announcement</a> and the event brief. The final partner list is pending confirmation.
        </p>
      </section>
    </>
  );
}
