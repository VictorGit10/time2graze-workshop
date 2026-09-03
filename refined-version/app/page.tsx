import { ArrowRightIcon } from '@phosphor-icons/react/ssr';
import type { CSSProperties } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { NowNext } from '@/components/now-next';
import { AGENDA } from '@/data/agenda';
import { INSTITUTION_GROUPS, INSTITUTION_ROLE_SOURCE, type Institution } from '@/data/institutions';
import { withBasePath } from '@/lib/base-path';
import { materialsByDay } from '@/lib/materials';
import { dayLabel } from '@/lib/schedule';

const SCHEDULED_ITEMS = AGENDA.reduce((total, day) => total + day.sessions.length, 0);
const EXPECTED_FILES = materialsByDay().reduce((total, group) => total + group.entries.length, 0);

/** Each destination carries a live operational summary rather than duplicating the header. */
const DESTINATIONS = [
  { href: '/programme/', title: 'Programme', detail: `${AGENDA.length} days · ${SCHEDULED_ITEMS} scheduled items`, status: 'Draft programme' },
  { href: '/materials/', title: 'Materials', detail: `${EXPECTED_FILES} expected files linked to sessions`, status: 'Publication pending' },
  { href: '/practical/', title: 'Practical information', detail: 'Stay, meals, transport and exact venue pins', status: 'Key details pending' },
] as const;

const COUNTRIES = ['Argentina', 'Brazil', 'Colombia', 'Nigeria', 'Tanzania', 'Uganda', 'Uruguay', 'Zimbabwe'];

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
        <div className="hero-grid">
          <div className="event-summary">
            <p className="event-label">Time2Graze Project · Internal technical workshop</p>
            <h1><span>Time2Graze</span><span>Brazil Workshop</span></h1>
            <p className="event-objective">Connecting data development and decision support across partner teams to improve grazing management in the Global South.</p>
            <div className="hero-actions">
              <Link href="/programme/">View programme <ArrowRightIcon aria-hidden="true" weight="regular" /></Link>
              <Link href="/practical/">Practical information <ArrowRightIcon aria-hidden="true" weight="regular" /></Link>
            </div>
          </div>

          <aside className="hero-docket" aria-label="Workshop facts">
            <p className="docket-date"><span>14—18</span><strong>September<br />2026</strong></p>
            <dl>
              <div><dt>Location</dt><dd>Goiânia, Goiás · Brazil</dd></div>
              <div><dt>Duration</dt><dd>5 working days</dd></div>
              <div><dt>Programme</dt><dd>{SCHEDULED_ITEMS} scheduled items</dd></div>
              <div><dt>Format</dt><dd>In person</dd></div>
              <div><dt>Host</dt><dd>LAPIG · UFG</dd></div>
            </dl>
          </aside>

          <figure className="event-visual">
            <Image
              src={withBasePath('/time2graze-hero.webp')}
              alt="Aerial view of pastureland documented by LAPIG"
              width={1440}
              height={1080}
              fetchPriority="high"
            />
            <figcaption>
              <span>Pastureland documented by LAPIG</span>
              <a className="image-credit" href="https://jornal.ufg.br/n/80658-radiografia-das-pastagens-do-brasil" target="_blank" rel="noreferrer">Photo: LAPIG · Jornal UFG</a>
            </figcaption>
          </figure>
        </div>
      </section>

      <nav className="week-index" aria-label="Five-day programme">
        <p><span>Workshop week</span><strong>14—18 September</strong></p>
        <div>
          {AGENDA.map((day) => (
            <Link href={`/programme/#day-${day.index}`} key={day.date}>
              <span>{String(day.index).padStart(2, '0')}</span>
              <strong>{dayLabel(day.date)}</strong>
              <small>{day.label}</small>
            </Link>
          ))}
        </div>
      </nav>

      <NowNext />

      <nav className="information-nav" aria-label="Workshop information">
        {DESTINATIONS.map(({ href, title, detail, status }, index) => (
          <Link key={href} href={href}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <div>
              <strong>{title}</strong>
              <small>{detail}</small>
              <em>{status}</em>
            </div>
            <ArrowRightIcon aria-hidden="true" weight="regular" />
          </Link>
        ))}
      </nav>

      <section className="overview section-pad" id="about">
        <div className="section-title"><p>Workshop overview</p><h2>Purpose and participation</h2></div>
        <div className="overview-layout">
          <div className="objective-block">
            <h3>Objective</h3>
            <p>The workshop brings partner teams together to integrate data development and decision support for improved grazing management and decision-making in livestock systems in the Global South.</p>
          </div>
          <dl className="fact-list">
            <div><dt>Format</dt><dd>In-person technical workshop</dd></div>
            <div><dt>Dates</dt><dd>Monday 14 to Friday 18 September 2026</dd></div>
            <div><dt>Host</dt><dd>LAPIG · Federal University of Goiás</dd></div>
            <div className="country-row"><dt>Partner teams</dt><dd>{COUNTRIES.map((country) => <span key={country}>{country}</span>)}</dd></div>
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
