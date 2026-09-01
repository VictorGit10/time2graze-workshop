'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  ArrowDown, BusFront, CalendarDays, ChevronRight, CircleAlert, ExternalLink,
  FileText, FolderOpen, Hotel, Info, MapPin, Presentation, UtensilsCrossed,
} from 'lucide-react';
import { Programme, ProgrammeForPrint } from '@/components/programme';
import { AGENDA } from '@/data/agenda';
import { MATERIAL_GROUPS } from '@/data/materials';
import { MAP_VENUES } from '@/data/venues';
import { useWorkshopClock } from '@/hooks/use-workshop-clock';
import { dayFromHash, dayFromSessionHash, scrollToSession } from '@/lib/deep-link';
import { todayIndex } from '@/lib/now';
import { dayLabel, dayShort } from '@/lib/schedule';

/**
 * Arrow-key navigation between tabs, which `role="tab"` requires and the
 * browser does not provide. Left/right move, Home/End jump to the ends, and
 * focus follows selection.
 */
function useTabKeys(count: number, active: number, setActive: (i: number) => void) {
  return (event: React.KeyboardEvent<HTMLDivElement>) => {
    const keys: Record<string, number> = {
      ArrowLeft: (active - 1 + count) % count,
      ArrowRight: (active + 1) % count,
      Home: 0,
      End: count - 1,
    };
    const next = keys[event.key];
    if (next === undefined) return;
    event.preventDefault();
    setActive(next);
    const list = event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]');
    list[next]?.focus();
  };
}

export default function Home() {
  const [activeMap, setActiveMap] = useState(0);
  /** A session waiting to be scrolled to, once its day has actually rendered. */
  const [pending, setPending] = useState<{ id: string } | null>(null);
  const clock = useWorkshopClock();
  const today = todayIndex(AGENDA, clock);

  /**
   * Null until a link or the reader picks a day. The displayed day is derived
   * rather than stored, so during the workshop week the panel follows the
   * clock without an effect having to push it there — and a choice, once made,
   * outranks the clock for good.
   */
  const [picked, setPicked] = useState<number | null>(null);
  const activeDay = picked ?? today ?? 0;

  /** Choosing a day rewrites the hash, so the address bar is always copyable. */
  const selectDay = useCallback((index: number) => {
    setPicked(index);
    history.replaceState(null, '', `#day-${AGENDA[index].index}`);
  }, []);

  /**
   * Deep links. `#day-3` opens that day; a session id opens the day holding it
   * and scrolls to it. Runs on load and whenever the hash changes, so a link
   * pasted into the address bar works from any state.
   */
  useEffect(() => {
    const apply = () => {
      const hash = location.hash;
      const day = dayFromHash(hash);
      if (day !== null) {
        setPicked(day);
        return;
      }
      const owner = dayFromSessionHash(hash);
      if (owner !== null) {
        // The browser restores the previous scroll position after load, which
        // would land on top of ours. This link decides where the page goes.
        history.scrollRestoration = 'manual';
        setPicked(owner);
        setPending({ id: hash.slice(1) });
      }
    };

    apply();
    addEventListener('hashchange', apply);
    return () => removeEventListener('hashchange', apply);
  }, []);

  /**
   * Scrolling has to wait for the day panel to be in the DOM. An effect runs
   * after the commit; a requestAnimationFrame does not, and looked for the
   * session before React had rendered it.
   */
  useEffect(() => {
    if (!pending) return;
    scrollToSession(pending.id);
    // Not cleared: every link produces a fresh object, and it is that identity
    // change that runs this again.
  }, [pending]);

  const onDayKeys = useTabKeys(AGENDA.length, activeDay, selectDay);
  const onMapKeys = useTabKeys(MAP_VENUES.length, activeMap, setActiveMap);
  const day = AGENDA[activeDay];
  const map = MAP_VENUES[activeMap];
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

  return (
    <main>
      <a className="skip-link" href="#agenda">Skip to the programme</a>

      <header className="site-header">
        <a className="brand" href="#top" aria-label="Time2Graze Brazil Workshop — home">
          <span className="brand-mark">T2G</span>
          <span className="brand-copy"><strong>Time2Graze</strong><small>Brazil Workshop</small></span>
        </a>
        <nav className="desktop-nav" aria-label="Main navigation">
          <a href="#about">Overview</a><a href="#agenda">Programme</a><a href="#materials">Materials</a><a href="#practical">Practical information</a>
        </nav>
        <a className="header-date" href="#agenda">14—18 Sep <span>2026</span></a>
      </header>

      <section className="institutional-hero" id="top">
        <div className="event-summary">
          <p className="event-label">Time2Graze Project · Internal technical workshop</p>
          <h1>Time2Graze<br />Brazil Workshop</h1>
          <p className="event-objective">Strengthening collaboration across partner teams by connecting data development and decision support for improved grazing management.</p>
          <div className="hero-meta" aria-label="Event information">
            <span><CalendarDays aria-hidden="true" />14—18 September 2026</span>
            <span><MapPin aria-hidden="true" />Goiânia, Goiás · Brazil</span>
          </div>
          <div className="hero-actions"><a href="#agenda">View programme <ArrowDown aria-hidden="true" /></a><a href="#practical">Practical information <ArrowDown aria-hidden="true" /></a></div>
        </div>
        <div className="event-visual">
          <img src={`${basePath}/time2graze-hero.webp`} alt="Grazing lands in the Brazilian Cerrado" />
          <p><strong>In person</strong><span>Hosted by LAPIG · UFG</span></p>
        </div>
      </section>

      <nav className="information-nav" aria-label="Workshop information">
        <a href="#agenda"><span>01</span><div><strong>Programme</strong><small>Sessions and daily schedule</small></div><ChevronRight aria-hidden="true" /></a>
        <a href="#materials"><span>02</span><div><strong>Materials</strong><small>Presentations and documents</small></div><ChevronRight aria-hidden="true" /></a>
        <a href="#practical"><span>03</span><div><strong>Stay & meals</strong><small>Hotel, transport and catering</small></div><ChevronRight aria-hidden="true" /></a>
        <a href="#maps"><span>04</span><div><strong>Maps</strong><small>Venues and field locations</small></div><ChevronRight aria-hidden="true" /></a>
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

      <section className="agenda-section section-pad" id="agenda">
        <div className="section-title split-title"><div><p>Programme</p><h2>Daily schedule</h2></div><span>Draft programme · Five working days</span></div>
        <div className="day-tabs" role="tablist" aria-label="Workshop days" tabIndex={-1} onKeyDown={onDayKeys}>
          {AGENDA.map((item, index) => (
            <button key={item.date} type="button" role="tab" aria-selected={activeDay === index} aria-controls="day-panel" id={`day-tab-${index}`} tabIndex={activeDay === index ? 0 : -1} onClick={() => selectDay(index)}>
              <span>{dayShort(item)}{today === index && <em className="tab-today">Today</em>}</span><strong>{dayLabel(item.date)}</strong><small>{item.label}</small>
            </button>
          ))}
        </div>
        <div className="agenda-panel" id="day-panel" role="tabpanel" aria-labelledby={`day-tab-${activeDay}`}>
          <aside className="day-summary"><span>{dayShort(day)}</span><p>{dayLabel(day.date)}</p><h3>{day.label}</h3><small>{day.sessions.length} scheduled items</small></aside>
          <Programme day={day} clock={clock} />
        </div>

        <ProgrammeForPrint />
      </section>

      <section className="materials section-pad" id="materials">
        <div className="section-title split-title"><div><p>Workshop materials</p><h2>Presentations and documents</h2></div><span>Materials will be added as they are approved</span></div>
        <div className="materials-notice"><Info aria-hidden="true" /><p>This area is prepared to receive presentations, reading materials, protocols and supporting documents. Some files may be restricted to workshop participants.</p></div>
        <div className="resource-groups">
          {MATERIAL_GROUPS.map((group) => (
            <section className="resource-group" key={group.day}>
              <h3>{group.day}</h3>
              <div>
                {group.items.map((item) => (
                  <article className="resource-item" key={item}>
                    <Presentation aria-hidden="true" /><span><strong>{item}</strong><small>Presentation or supporting file</small></span><em>To be published</em>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
        <div className="document-placeholders">
          <article><FileText aria-hidden="true" /><div><strong>Full programme</strong><span>PDF version</span></div><small>Pending</small></article>
          <article><FolderOpen aria-hidden="true" /><div><strong>Shared workshop folder</strong><span>Participant access</span></div><small>Pending</small></article>
        </div>
      </section>

      <section className="practical section-pad" id="practical">
        <div className="section-title"><p>Practical information</p><h2>Stay, meals and transport</h2></div>
        <div className="practical-grid">
          <article className="practical-card pending-card">
            <Hotel aria-hidden="true" /><span className="status">Pending confirmation</span><h3>Accommodation</h3>
            <p>Hotel name, address, booking arrangements, check-in and check-out information will be published here when confirmed.</p>
            <div className="empty-detail"><CircleAlert aria-hidden="true" />No accommodation details have been provided yet.</div>
          </article>
          <article className="practical-card">
            <UtensilsCrossed aria-hidden="true" /><span className="status confirmed">From the programme</span><h3>Meals</h3>
            <ul>
              <li><strong>14 Sep</strong><span>Lunch at Samauma · Welcome dinner at LAPIG</span></li>
              <li><strong>15–16 Sep</strong><span>Lunch at Centro de Eventos · Dinner at hotel</span></li>
              <li><strong>17 Sep</strong><span>Lunch at Centro de Eventos · Closing reception</span></li>
              <li><strong>18 Sep</strong><span>Lunch in Cidade de Goiás · Dinner at hotel</span></li>
            </ul>
            <p className="card-note">Dietary requirement instructions and meal details are still to be confirmed.</p>
          </article>
          <article className="practical-card">
            <BusFront aria-hidden="true" /><span className="status confirmed">Field transport confirmed</span><h3>Transport</h3>
            <ul>
              <li><strong>14 Sep</strong><span>Field visit to T2G Biomass Experimental Area</span></li>
              <li><strong>18 Sep · 06:30</strong><span>Departure to Cidade de Goiás</span></li>
              <li><strong>18 Sep · 17:30</strong><span>Return trip to Goiânia</span></li>
            </ul>
            <p className="card-note">Airport transfers and daily transport arrangements have not yet been provided.</p>
          </article>
        </div>
      </section>

      <section className="maps section-pad" id="maps">
        <div className="section-title split-title"><div><p>Maps and venues</p><h2>Workshop locations</h2></div><span>Use the list to inspect each location</span></div>
        <div className="maps-layout">
          <div className="location-selector" role="tablist" aria-label="Workshop locations" tabIndex={-1} onKeyDown={onMapKeys}>
            {MAP_VENUES.map((location, index) => (
              <button key={location.id} type="button" role="tab" aria-selected={activeMap === index} aria-controls="map-panel" id={`map-tab-${index}`} tabIndex={activeMap === index ? 0 : -1} onClick={() => setActiveMap(index)}>
                <MapPin aria-hidden="true" /><span><strong>{location.name}</strong><small>{location.use}</small></span><ChevronRight aria-hidden="true" />
              </button>
            ))}
          </div>
          <div className="map-frame" id="map-panel" role="tabpanel" aria-labelledby={`map-tab-${activeMap}`}>
            <iframe key={map.mapQuery} title={`Map of ${map.name}`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" src={`https://www.google.com/maps?q=${encodeURIComponent(map.mapQuery)}&output=embed`} />
            <div><span><strong>{map.name}</strong><small>{map.use}</small></span><a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(map.mapQuery)}`} target="_blank" rel="noreferrer">Open in Google Maps <ExternalLink aria-hidden="true" /></a></div>
          </div>
        </div>
      </section>

      <section className="recommendations section-pad" id="recommendations">
        <div className="section-title"><p>Participant guidance</p><h2>Recommendations</h2></div>
        <div className="recommendation-list">
          <article><span>01</span><div><h3>Field visits</h3><p>Plan for outdoor activities. A final field checklist, clothing guidance and safety instructions will be added before the workshop.</p></div></article>
          <article><span>02</span><div><h3>Arrival in Goiânia</h3><p>Airport, transfer and arrival guidance will be published after the transport plan is confirmed.</p></div></article>
          <article><span>03</span><div><h3>Local information</h3><p>Weather guidance, useful contacts, nearby services and recommendations for free time will be added in this section.</p></div></article>
        </div>
      </section>

      <footer>
        <a className="brand footer-brand" href="#top"><span className="brand-mark">T2G</span><span className="brand-copy"><strong>Time2Graze</strong><small>Brazil Workshop</small></span></a>
        <p>Internal technical workshop · 14–18 September 2026 · Goiânia, Goiás, Brazil</p>
        <a href="#top">Back to top <ArrowDown aria-hidden="true" /></a>
      </footer>
    </main>
  );
}
