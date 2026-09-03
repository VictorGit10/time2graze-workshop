'use client';

import { ArrowRight, CalendarDays, ChevronRight, MapPin } from 'lucide-react';
import type { CSSProperties, ReactNode } from 'react';
import { useSyncExternalStore } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AGENDA } from '@/data/agenda';
import {
  INSTITUTION_GROUPS,
  INSTITUTION_ROLE_SOURCE,
  type Institution,
} from '@/data/institutions';
import { withBasePath } from '@/lib/base-path';
import { materialsByDay } from '@/lib/materials';

type Concept = 'brief' | 'programme' | 'landscape';

const CONCEPTS: { id: Concept; short: string; label: string }[] = [
  { id: 'brief', short: 'A', label: 'Field brief' },
  { id: 'programme', short: 'B', label: 'Programme first' },
  { id: 'landscape', short: 'C', label: 'Landscape frame' },
];

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

const MARK_AREA = 3200;
const MARK_MAX_HEIGHT = 56;

function markHeight({ width, height }: Institution) {
  return Math.min(
    MARK_MAX_HEIGHT,
    Math.round(Math.sqrt((MARK_AREA * height) / width)),
  );
}

function readConcept(): Concept {
  const value = new URLSearchParams(window.location.search).get('concept');
  return value === 'programme' || value === 'landscape' ? value : 'brief';
}

function subscribe(onChange: () => void) {
  window.addEventListener('popstate', onChange);
  window.addEventListener('home-concept-change', onChange);
  return () => {
    window.removeEventListener('popstate', onChange);
    window.removeEventListener('home-concept-change', onChange);
  };
}

function setConcept(concept: Concept) {
  const url = new URL(window.location.href);
  url.searchParams.set('concept', concept);
  url.hash = '';
  window.history.pushState({}, '', url);
  window.dispatchEvent(new Event('home-concept-change'));
  window.scrollTo({ top: 0 });
}

function ConceptSwitcher({ active }: { active: Concept }) {
  return (
    <aside
      className="concept-switcher"
      aria-label="Choose a home-page direction"
    >
      <p>
        <span>Design preview</span>
        <strong>Choose a direction</strong>
      </p>
      <div>
        {CONCEPTS.map((concept) => (
          <button
            key={concept.id}
            type="button"
            aria-pressed={active === concept.id}
            onClick={() => setConcept(concept.id)}
            title={concept.label}
          >
            <span>{concept.short}</span>
            {concept.label}
          </button>
        ))}
      </div>
    </aside>
  );
}

function Meta() {
  return (
    <div className="concept-meta" aria-label="Event information">
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

function ProgrammeAction({ inverse = false }: { inverse?: boolean }) {
  return (
    <Link
      className={
        inverse ? 'concept-action concept-action--inverse' : 'concept-action'
      }
      href="/programme/"
    >
      View programme <ArrowRight aria-hidden="true" />
    </Link>
  );
}

function Directory({ mode }: { mode: Concept }) {
  return (
    <nav
      className={`concept-directory concept-directory--${mode}`}
      aria-label="Workshop information"
    >
      {DESTINATIONS.map(({ href, title, detail, status, tone }, index) => (
        <Link key={href} href={href} data-status={tone}>
          <span className="concept-directory-index">
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

function FieldBrief() {
  return (
    <div className="home-concept home-concept--brief">
      <section className="brief-hero" aria-labelledby="brief-title">
        <div className="brief-date" aria-label="14 to 18 September 2026">
          <span>14—18</span>
          <strong>SEP</strong>
          <small>2026</small>
        </div>
        <div className="brief-copy">
          <p className="concept-eyebrow">
            Time2Graze Project · Internal technical workshop
          </p>
          <h1 id="brief-title">
            <span>Time2Graze</span>
            <span>Brazil Workshop</span>
          </h1>
          <p className="concept-intro">
            A five-day technical workshop connecting data development and
            decision support for improved grazing management.
          </p>
          <Meta />
          <ProgrammeAction />
        </div>
        <figure className="brief-image">
          <Image
            src={withBasePath('/time2graze-hero.webp')}
            alt="Aerial view of green pastureland"
            width={1440}
            height={1080}
            priority
          />
          <figcaption>Hosted by LAPIG · Federal University of Goiás</figcaption>
        </figure>
      </section>
      <Directory mode="brief" />
    </div>
  );
}

function ProgrammeFirst() {
  return (
    <div className="home-concept home-concept--programme">
      <section
        className="programme-hero"
        aria-labelledby="programme-concept-title"
      >
        <div className="programme-hero-date" aria-hidden="true">
          <small>September</small>
          <strong>14</strong>
          <span>to</span>
          <strong>18</strong>
          <em>2026</em>
        </div>
        <div className="programme-hero-copy">
          <p className="concept-eyebrow">
            Time2Graze Project · Internal technical workshop
          </p>
          <h1 id="programme-concept-title">
            Time2Graze
            <br />
            <span>Brazil Workshop</span>
          </h1>
          <p className="concept-intro">
            Five working days for partner teams to align data, methods and
            decision support for grazing management.
          </p>
          <div className="programme-place">
            <MapPin aria-hidden="true" />
            <span>
              Goiânia, Goiás
              <br />
              <small>Brazil · America/Sao_Paulo</small>
            </span>
          </div>
          <ProgrammeAction inverse />
        </div>
        <div className="programme-hero-image" aria-hidden="true">
          <Image
            src={withBasePath('/time2graze-hero.webp')}
            alt=""
            width={1440}
            height={1080}
            priority
          />
        </div>
        <div className="programme-counts" aria-label="Workshop scale">
          <span>
            <strong>05</strong> days
          </span>
          <span>
            <strong>{SCHEDULED_ITEMS}</strong> scheduled items
          </span>
          <span>
            <strong>07</strong> partner time zones
          </span>
        </div>
      </section>
      <Directory mode="programme" />
    </div>
  );
}

function LandscapeFrame() {
  return (
    <div className="home-concept home-concept--landscape">
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
          <p className="concept-eyebrow">
            Time2Graze Project · Internal technical workshop
          </p>
          <h1 id="landscape-title">
            Time2Graze
            <br />
            <span>Brazil Workshop</span>
          </h1>
          <p className="concept-intro">
            An internal workshop for partner teams working on data and decision
            support for grazing management in the Global South.
          </p>
          <Meta />
          <ProgrammeAction />
        </div>
        <div className="landscape-date" aria-label="14 to 18 September 2026">
          <strong>14—18</strong>
          <span>
            September
            <br />
            2026
          </span>
        </div>
      </section>
      <Directory mode="landscape" />
    </div>
  );
}

function SharedHomeContent() {
  return (
    <>
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

      <section
        className="institutions section-pad"
        aria-labelledby="institutions-title"
      >
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
            </section>
          ))}
        </div>
        <p className="institution-source">
          Roles follow the{' '}
          <a href={INSTITUTION_ROLE_SOURCE} target="_blank" rel="noreferrer">
            public Time2Graze project announcement
          </a>{' '}
          and the event brief. The final partner list is pending confirmation.
        </p>
      </section>
    </>
  );
}

const CONCEPT_COMPONENTS: Record<Concept, () => ReactNode> = {
  brief: FieldBrief,
  programme: ProgrammeFirst,
  landscape: LandscapeFrame,
};

export function HomeConcepts() {
  const concept = useSyncExternalStore(
    subscribe,
    readConcept,
    () => 'brief' as Concept,
  );
  const ActiveConcept = CONCEPT_COMPONENTS[concept];

  return (
    <div className={`home-preview home-preview--${concept}`}>
      <ConceptSwitcher active={concept} />
      <ActiveConcept />
      <SharedHomeContent />
    </div>
  );
}
