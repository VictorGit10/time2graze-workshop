'use client';

import { useState } from 'react';
import {
  ArrowDown, BusFront, CalendarDays, ChevronRight, CircleAlert, Clock3, Coffee,
  ExternalLink, FileText, FolderOpen, Hotel, Info, MapPin,
  Presentation, UtensilsCrossed,
} from 'lucide-react';

type Session = { time: string; title: string };
type Day = { short: string; date: string; label: string; sessions: Session[] };

const agenda: Day[] = [
  {
    short: 'Day 1', date: 'Mon · 14 Sep', label: 'Welcome',
    sessions: [
      { time: '08:30 – 10:00', title: 'UFG Tour — Welcome at LAPIG' },
      { time: '10:00 – 12:00', title: 'Split Session: Visual Inspection Workshop (Ana Paula/LAPIG) — GEE / GEE App short course' },
      { time: '12:00', title: 'Lunch @ Samauma' },
      { time: '14:00 – 15:30', title: 'Interactive Session: Field Protocol Alignment' },
      { time: '15:30', title: 'Coffee Break @ LAPIG' },
      { time: '16:00 – 18:00', title: 'Field Visit — T2G Biomass Experimental Area' },
      { time: '18:00 – 22:00', title: 'Welcome Dinner @ LAPIG (Pizza)' },
    ],
  },
  {
    short: 'Day 2', date: 'Tue · 15 Sep', label: 'Retreat',
    sessions: [
      { time: '08:30', title: 'Brief check-in' },
      { time: '09:00 – 09:30', title: 'Project Overview & Theory of Change (Santiago/GMH)' },
      { time: '09:30 – 11:00', title: 'Interactive Session: Priorities, Barriers, and Partner Needs (Lindsey/WRI)' },
      { time: '11:00 – 12:00', title: 'Open Agenda' },
      { time: '12:00', title: 'Lunch @ Centro de Eventos' },
      { time: '14:00 – 15:30', title: 'Biomass Data: Methodology and Updates (Leandro/OGH)' },
      { time: '15:30', title: 'Coffee Break @ FUNAPE' },
      { time: '16:00 – 16:45', title: 'Pasto Legal (Leandro/OGH and Tiago/LAPIG)' },
      { time: '16:45 – 17:30', title: 'Biomass Data for Management and Decision Making (Prof. Wilton Ladeira)' },
      { time: '17:30', title: 'Daily Summary' },
      { time: '19:00', title: 'Dinner @ Hotel' },
    ],
  },
  {
    short: 'Day 3', date: 'Wed · 16 Sep', label: 'Retreat',
    sessions: [
      { time: '08:30', title: 'Brief check-in' },
      { time: '09:00 – 09:45', title: 'State of the Art: Remote Sensing of Pasture & Decision Support Tools (Leandro/OGH and Emily/WWF)' },
      { time: '09:45 – 10:30', title: 'Country Presentation: Uruguay (INIA)' },
      { time: '10:30 – 11:15', title: 'Country Presentation: Argentina (UIB - INTA & UNMdP)' },
      { time: '11:15 – 12:00', title: 'Country Presentation: Colombia (CIAT)' },
      { time: '12:00', title: 'Lunch @ Centro de Eventos' },
      { time: '14:00 – 14:45', title: 'Country Presentation: Tanzania' },
      { time: '14:45 – 15:30', title: 'Country Presentation: Nigeria' },
      { time: '15:30 – 16:00', title: 'Coffee Break @ FUNAPE' },
      { time: '16:00 – 16:45', title: 'Country Presentation: Uganda' },
      { time: '16:45 – 17:30', title: 'Country Presentation: Zimbabwe' },
      { time: '17:30', title: 'Daily Summary' },
      { time: '19:00', title: 'Dinner @ Hotel' },
    ],
  },
  {
    short: 'Day 4', date: 'Thu · 17 Sep', label: 'Retreat',
    sessions: [
      { time: '08:30', title: 'Brief check-in' },
      { time: '09:00 – 12:00', title: 'Interactive workshop: Building a collaboration map and country uptake journey (Beatriz/OGH)' },
      { time: '12:00', title: 'Lunch @ Centro de Eventos' },
      { time: '14:00 – 15:30', title: 'Split Session: DST Data Production — Livestock Methane Emission Data (Humberto / LAPIG)' },
      { time: '15:30', title: 'Coffee Break @ FUNAPE' },
      { time: '16:00 – 17:30', title: "Building Together the Roadmap for the Project's Next Steps (Santiago/GMH and Lindsey/WRI)" },
      { time: '17:30', title: 'Wrap-up: Summary of Key Takeaways (Laerte/LAPIG)' },
      { time: '18:30', title: 'Closing Reception @ Churrascaria Favo de Mel' },
    ],
  },
  {
    short: 'Day 5', date: 'Fri · 18 Sep', label: 'Field',
    sessions: [
      { time: '06:30', title: 'Trip to Cidade de Goiás' },
      { time: '09:30 – 11:30', title: 'Field Visit: Grazing Livestock Farm (TBD)' },
      { time: '12:00', title: 'Lunch @ Cidade de Goiás' },
      { time: '14:00 – 17:30', title: 'Field Visit: Grazing Livestock Farm (TBD)' },
      { time: '17:30', title: 'Return trip to Goiânia' },
      { time: '19:00', title: 'Dinner @ Hotel' },
    ],
  },
];

const resourceGroups = [
  { day: 'Day 1 · Welcome', items: ['Visual Inspection Workshop', 'GEE / GEE App short course', 'Field Protocol Alignment'] },
  { day: 'Day 2 · Retreat', items: ['Project Overview & Theory of Change', 'Priorities, Barriers, and Partner Needs', 'Biomass Data: Methodology and Updates', 'Pasto Legal', 'Biomass Data for Management and Decision Making'] },
  { day: 'Day 3 · Retreat', items: ['Remote Sensing of Pasture & Decision Support Tools', 'Country presentations'] },
  { day: 'Day 4 · Retreat', items: ['Collaboration Map and Country Uptake Journey', 'DST Data Production & Livestock Methane Emission Data', 'Project Roadmap and Key Takeaways'] },
  { day: 'Day 5 · Field', items: ['Field visit information sheet'] },
];

const locations = [
  { name: 'LAPIG · UFG', use: 'Welcome, technical sessions and experimental area visit', query: 'LAPIG UFG Goiânia' },
  { name: 'Centro de Eventos · UFG', use: 'Lunches during the retreat', query: 'Centro de Eventos UFG Goiânia' },
  { name: 'Churrascaria Favo de Mel', use: 'Closing reception · 17 September', query: 'Churrascaria Favo de Mel Goiânia' },
  { name: 'Cidade de Goiás', use: 'Field visits · 18 September', query: 'Cidade de Goiás Goiás' },
];

function SessionIcon({ title }: { title: string }) {
  const value = title.toLowerCase();
  if (value.includes('lunch') || value.includes('dinner') || value.includes('reception')) return <UtensilsCrossed aria-hidden="true" />;
  if (value.includes('coffee')) return <Coffee aria-hidden="true" />;
  if (value.includes('trip') || value.includes('visit')) return <BusFront aria-hidden="true" />;
  return <ChevronRight aria-hidden="true" />;
}

export default function Home() {
  const [activeDay, setActiveDay] = useState(0);
  const [activeMap, setActiveMap] = useState(0);
  const day = agenda[activeDay];
  const map = locations[activeMap];
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

  return (
    <main>
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
        <div className="day-tabs" role="tablist" aria-label="Workshop days">
          {agenda.map((item, index) => (
            <button key={item.short} type="button" role="tab" aria-selected={activeDay === index} aria-controls="day-panel" id={`day-tab-${index}`} onClick={() => setActiveDay(index)}>
              <span>{item.short}</span><strong>{item.date}</strong><small>{item.label}</small>
            </button>
          ))}
        </div>
        <div className="agenda-panel" id="day-panel" role="tabpanel" aria-labelledby={`day-tab-${activeDay}`}>
          <aside className="day-summary"><span>{day.short}</span><p>{day.date}</p><h3>{day.label}</h3><small>{day.sessions.length} scheduled items</small></aside>
          <div className="session-list">
            {day.sessions.map((session, index) => (
              <article className="session" key={`${session.time}-${session.title}`}>
                <span className="session-index">{String(index + 1).padStart(2, '0')}</span>
                <time><Clock3 aria-hidden="true" />{session.time}</time>
                <h4>{session.title}</h4>
                <span className="session-icon"><SessionIcon title={session.title} /></span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="materials section-pad" id="materials">
        <div className="section-title split-title"><div><p>Workshop materials</p><h2>Presentations and documents</h2></div><span>Materials will be added as they are approved</span></div>
        <div className="materials-notice"><Info aria-hidden="true" /><p>This area is prepared to receive presentations, reading materials, protocols and supporting documents. Some files may be restricted to workshop participants.</p></div>
        <div className="resource-groups">
          {resourceGroups.map((group) => (
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
          <div className="location-selector" role="tablist" aria-label="Workshop locations">
            {locations.map((location, index) => (
              <button key={location.name} type="button" role="tab" aria-selected={activeMap === index} onClick={() => setActiveMap(index)}>
                <MapPin aria-hidden="true" /><span><strong>{location.name}</strong><small>{location.use}</small></span><ChevronRight aria-hidden="true" />
              </button>
            ))}
          </div>
          <div className="map-frame" role="tabpanel">
            <iframe key={map.query} title={`Map of ${map.name}`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" src={`https://www.google.com/maps?q=${encodeURIComponent(map.query)}&output=embed`} />
            <div><span><strong>{map.name}</strong><small>{map.use}</small></span><a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(map.query)}`} target="_blank" rel="noreferrer">Open in Google Maps <ExternalLink aria-hidden="true" /></a></div>
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
