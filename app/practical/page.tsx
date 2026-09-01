'use client';

import { useState } from 'react';
import {
  BusFront, ChevronRight, CircleAlert, ExternalLink, Hotel, MapPin, UtensilsCrossed,
} from 'lucide-react';
import { MAP_VENUES } from '@/data/venues';
import { useTabKeys } from '@/hooks/use-tab-keys';

export default function PracticalPage() {
  const [activeMap, setActiveMap] = useState(0);
  const onMapKeys = useTabKeys(MAP_VENUES.length, activeMap, setActiveMap);
  const map = MAP_VENUES[activeMap];

  return (
    <>
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
    </>
  );
}
