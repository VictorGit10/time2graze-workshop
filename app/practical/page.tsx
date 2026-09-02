'use client';

import { useState } from 'react';
import {
  BusFront, Camera, Car, Check, ChevronRight, CircleAlert, Copy, ExternalLink, Globe,
  Hotel, MapPin, Phone, UtensilsCrossed,
} from 'lucide-react';
import { MAP_VENUES, VENUES } from '@/data/venues';
import { withBasePath } from '@/lib/base-path';
import { formatCoordinates, osmEmbedSrc, osmLink, uberLink } from '@/lib/places';
import { useTabKeys } from '@/hooks/use-tab-keys';

const hotel = VENUES.hotel;

/** `tel:` wants digits and a plus, not the spacing a reader needs. */
function telHref(phone: string) {
  return `tel:${phone.replace(/[^+\d]/g, '')}`;
}

export default function PracticalPage() {
  const [activeMap, setActiveMap] = useState(0);
  const [copied, setCopied] = useState<string | null>(null);

  /** Selecting another venue drops the copy confirmation with it. */
  const selectVenue = (index: number) => {
    setActiveMap(index);
    setCopied(null);
  };
  const onMapKeys = useTabKeys(MAP_VENUES.length, activeMap, selectVenue);
  const venue = MAP_VENUES[activeMap];
  /** Locals rather than property reads: narrowing survives into the handlers. */
  const { address, coords, phone, photo, website } = venue;
  /** Reached by the workshop bus, so a ride link would be the wrong offer. */
  const ridable = !venue.organisedTransport;

  async function copy(field: string, value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(field);
      window.setTimeout(() => setCopied((current) => (current === field ? null : current)), 2500);
    } catch {
      /* Clipboard access can be refused. The text is on screen and selectable. */
    }
  }

  return (
    <>
      <section className="practical section-pad" id="practical">
        <div className="section-title"><p>Practical information</p><h2>Stay, meals and transport</h2></div>
        <div className="practical-grid">
          <article className="practical-card">
            <Hotel aria-hidden="true" /><span className="status">Booking pending</span><h3>Accommodation</h3>
            <p><strong>{hotel.name}</strong><br />{hotel.address}</p>
            <ul>
              <li><strong>Contact</strong><span><a href={telHref(hotel.phone)}>{hotel.phone}</a></span></li>
              <li><strong>Distance</strong><span>Between the airport district and Campus Samambaia</span></li>
            </ul>
            <div className="empty-detail">
              <CircleAlert aria-hidden="true" />
              Booking route, rate, what it covers, check-in and check-out times have not been provided yet.
            </div>
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
              <button key={location.id} type="button" role="tab" aria-selected={activeMap === index} aria-controls="map-panel" id={`map-tab-${index}`} tabIndex={activeMap === index ? 0 : -1} onClick={() => selectVenue(index)}>
                <MapPin aria-hidden="true" /><span><strong>{location.name}</strong><small>{location.use}</small></span><ChevronRight aria-hidden="true" />
              </button>
            ))}
          </div>

          <div className="venue-panel" id="map-panel" role="tabpanel" aria-labelledby={`map-tab-${activeMap}`}>
            <div className="venue-media">
              {photo
                ? (
                  <figure className="venue-photo">
                    <img src={withBasePath(photo.src)} alt={photo.alt} loading="lazy" />
                    <figcaption>
                      {photo.creditHref
                        ? <a href={photo.creditHref} target="_blank" rel="noreferrer">{photo.credit}</a>
                        : photo.credit}
                    </figcaption>
                  </figure>
                )
                : (
                  <div className="venue-photo photo-pending">
                    <Camera aria-hidden="true" />
                    <strong>Photograph pending</strong>
                    <small>No authorised photograph of this venue has been provided yet.</small>
                  </div>
                )}
              <iframe
                key={venue.id}
                title={`Map of ${venue.name}`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src={osmEmbedSrc(coords, venue.mapSpan)}
              />
            </div>

            <div className="venue-details">
              <div className="venue-identity">
                <h3>{venue.name}</h3>
                <p>{venue.use}</p>
                {venue.locality ? <p className="venue-locality">{venue.locality}</p> : null}
              </div>

              <dl className="venue-facts">
                <div>
                  <dt>Address</dt>
                  <dd>
                    {address
                      ? (
                        <>
                          <span>{address}</span>
                          <button type="button" onClick={() => copy('address', address)}>
                            {copied === 'address' ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
                            {copied === 'address' ? 'Copied' : 'Copy'}
                          </button>
                        </>
                      )
                      : <em>To be confirmed</em>}
                  </dd>
                </div>
                <div>
                  <dt>Coordinates</dt>
                  <dd>
                    <span className="venue-coords">{formatCoordinates(coords)}</span>
                    <button type="button" onClick={() => copy('coords', formatCoordinates(coords))}>
                      {copied === 'coords' ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
                      {copied === 'coords' ? 'Copied' : 'Copy'}
                    </button>
                  </dd>
                </div>
              </dl>
              <output className="visually-hidden">{copied ? `${copied === 'address' ? 'Address' : 'Coordinates'} copied to the clipboard` : ''}</output>

              {venue.pending
                ? <p className="venue-pending"><CircleAlert aria-hidden="true" />{venue.pending}</p>
                : null}

              <div className="venue-actions">
                <a href={osmLink(coords)} target="_blank" rel="noreferrer">
                  <MapPin aria-hidden="true" />Open map<ExternalLink aria-hidden="true" />
                </a>
                {ridable
                  ? (
                    <a href={uberLink(coords, venue.name, address)} target="_blank" rel="noreferrer">
                      <Car aria-hidden="true" />Ride to here<ExternalLink aria-hidden="true" />
                    </a>
                  )
                  : null}
                {website
                  ? <a href={website} target="_blank" rel="noreferrer"><Globe aria-hidden="true" />Website<ExternalLink aria-hidden="true" /></a>
                  : null}
                {phone
                  ? <a href={telHref(phone)}><Phone aria-hidden="true" />{phone}</a>
                  : null}
              </div>

              <p className="venue-note">
                Map data © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors.
                {ridable ? ' The ride link opens Uber; other apps accept the coordinates above.' : ' The workshop provides transport to this location.'}
              </p>
            </div>
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
