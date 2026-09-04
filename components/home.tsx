import { ArrowRight, CalendarDays, ChevronRight, MapPin } from 'lucide-react';
import type { CSSProperties } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AGENDA } from '@/data/agenda';
import {
  DISPLAYED_INSTITUTIONS,
  type Institution,
} from '@/data/institutions';
import { withBasePath } from '@/lib/base-path';
import { materialsByDay } from '@/lib/materials';

const SCHEDULED_ITEMS = AGENDA.reduce(
  (total, day) => total + day.sessions.length,
  0,
);
const EXPECTED_FILES = materialsByDay().reduce(
  (total, group) => total + group.entries.length,
  0,
);

const DESTINATIONS = [
  {
    href: '/programme/',
    title: 'Programme',
    detail: `${AGENDA.length} days · ${SCHEDULED_ITEMS} scheduled items`,
    status: 'Draft programme',
    tone: 'neutral',
  },
  {
    href: '/materials/',
    title: 'Materials',
    detail: `${EXPECTED_FILES} expected files linked to sessions`,
    status: 'Publication pending',
    tone: 'pending',
  },
  {
    href: '/practical/',
    title: 'Practical information',
    detail: 'Stay, meals, transport and venue maps',
    status: 'Key details pending',
    tone: 'pending',
  },
] as const;

const MARK_AREA = 7200;
const MARK_MAX_HEIGHT = 64;

function markHeight({ width, height }: Institution) {
  return Math.min(
    MARK_MAX_HEIGHT,
    Math.round(Math.sqrt((MARK_AREA * height) / width)),
  );
}

function HeroMeta() {
  return (
    <div className="landscape-meta" aria-label="Event information">
      <span>
        <CalendarDays aria-hidden="true" />
        14–18 September 2026
      </span>
      <span>
        <MapPin aria-hidden="true" />
        Goiânia, Goiás · Brazil
      </span>
    </div>
  );
}

function Directory() {
  return (
    <nav className="home-directory" aria-label="Workshop information">
      {DESTINATIONS.map(({ href, title, detail, status, tone }, index) => (
        <Link key={href} href={href} data-status={tone}>
          <span className="home-directory-index">
            {String(index + 1).padStart(2, '0')}
          </span>
          <div>
            <strong>{title}</strong>
            <small>{detail}</small>
            <em>{status}</em>
          </div>
          <ChevronRight aria-hidden="true" />
        </Link>
      ))}
    </nav>
  );
}

function Institutions() {
  return (
    <section
      className="institutions section-pad"
      aria-labelledby="institutions-title"
    >
      <div className="section-title">
        <p>Institutions</p>
        <h2 id="institutions-title">Institutional affiliations</h2>
      </div>
      <div className="institution-list">
        {DISPLAYED_INSTITUTIONS.map((institution) => (
          <a
            className="institution-mark"
            href={institution.href}
            key={institution.name}
            target="_blank"
            rel="noreferrer"
            aria-label={`${institution.name} website`}
            style={
              {
                '--mark-h': `${markHeight(institution)}px`,
              } as CSSProperties
            }
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
      <p className="institution-source">
        Additional institutional marks will be included only after approval.
      </p>
    </section>
  );
}

export function HomeLanding() {
  return (
    <>
      <section className="landscape-hero" aria-labelledby="landscape-title">
        <div className="landscape-photo">
          <Image
            src={withBasePath('/time2graze-hero.webp')}
            alt="Aerial view of green pastureland"
            width={1440}
            height={1080}
            priority
          />
          <p>Goiânia · Goiás · Brazil</p>
        </div>

        <div className="landscape-card">
          <p className="landscape-eyebrow">
            Time2Graze Project · Internal technical workshop
          </p>
          <h1 id="landscape-title">
            Time2Graze
            <br />
            <span>Brazil Workshop</span>
          </h1>
          <p className="landscape-intro">
            An internal workshop for partner teams working on data and decision
            support for grazing management in the Global South.
          </p>
          <HeroMeta />
          <Link className="landscape-action" href="/programme/">
            View programme <ArrowRight aria-hidden="true" />
          </Link>
        </div>

        <div
          className="landscape-date"
          aria-label="14 to 18 September 2026"
        >
          <strong>14—18</strong>
          <span>
            September
            <br />
            2026
          </span>
        </div>
      </section>

      <Directory />

      <section className="overview section-pad" id="about">
        <div className="section-title">
          <p>Workshop overview</p>
          <h2>Purpose and format</h2>
        </div>
        <div className="overview-layout">
          <div className="objective-block">
            <h3>Objective</h3>
            <p>
              The primary objective of this workshop is to strengthen
              collaboration across our partner teams by integrating data
              development and decision support to advance our main goal of
              improving grazing management and decision-making in livestock
              systems in the Global South.
            </p>
          </div>
          <dl className="fact-list">
            <div>
              <dt>Format</dt>
              <dd>In-person technical workshop</dd>
            </div>
            <div>
              <dt>Participation</dt>
              <dd>Internal to the Time2Graze project</dd>
            </div>
            <div>
              <dt>Participants</dt>
              <dd>Representatives from each partner country</dd>
            </div>
            <div>
              <dt>Host</dt>
              <dd>LAPIG · Federal University of Goiás</dd>
            </div>
          </dl>
        </div>
      </section>

      <Institutions />
    </>
  );
}
