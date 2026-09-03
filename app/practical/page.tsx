'use client';

import { useState, type ReactNode } from 'react';
import Image from 'next/image';
import {
  BookOpen, BusFront, Camera, Car, Check, ChevronRight, CircleAlert, Copy,
  ExternalLink, Globe, Hotel, MapPin, Phone, UtensilsCrossed,
} from 'lucide-react';
import { ACCOMMODATION_PLAN, LOCAL_GUIDES, SHUTTLE_PLAN } from '@/data/practical';
import { MAP_VENUES, VENUES, type VenueId } from '@/data/venues';
import { useTabKeys } from '@/hooks/use-tab-keys';
import { withBasePath } from '@/lib/base-path';
import { mealsByDay } from '@/lib/practical';
import { formatCoordinates, osmEmbedSrc, osmLink, uberLink } from '@/lib/places';

const hotel = VENUES.hotel;
const ADDITIONAL_VENUES: VenueId[] = ['funape', 't2gArea'];

/** `tel:` wants digits and a plus, not the spacing a reader needs. */
function telHref(phone: string) {
  return `tel:${phone.replace(/[^+\d]/g, '')}`;
}

function PlaceLink({
  venueId,
  children,
  onSelect,
}: {
  venueId: VenueId;
  children: ReactNode;
  onSelect: (index: number) => void;
}) {
  const mapIndex = MAP_VENUES.findIndex((item) => item.id === venueId);
  const href = mapIndex >= 0 ? '#map-panel' : `#venue-${venueId}`;
  return (
    <a className="place-link" href={href} onClick={() => { if (mapIndex >= 0) onSelect(mapIndex); }}>
      {children}<ChevronRight aria-hidden="true" />
    </a>
  );
}

export default function PracticalPage() {
  const [activeMap, setActiveMap] = useState(0);
  const [copied, setCopied] = useState<string | null>(null);

  /** Selecting another venue drops the copy confirmation with it. */
  const selectVenue = (index: number) => {
    setActiveMap(index);
    setCopied(null);
  };
  const onMapKeys = useTabKeys(MAP_VENUES.length, activeMap, selectVenue, 'vertical');
  const venue = MAP_VENUES[activeMap];
  /** Locals rather than property reads: narrowing survives into the handlers. */
  const { address, coords, phone, photo, website } = venue;
  const ridable = venue.ride === true && !venue.organisedTransport && address !== undefined;

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
        <div className="section-title split-title">
          <div><p>Practical information</p><h1>Stay, meals and transport</h1></div>
          <span>Operational details for travelling participants</span>
        </div>

        <div className="practical-status-line">
          <strong>Current status</strong>
          <span>Stay and shuttle arranged</span>
          <em>Confirm the hotel coverage and the 08:00 Monday–Thursday departure time</em>
        </div>

        <div className="practical-grid">
          <article className="practical-card" id="stay">
            <header className="practical-card-head"><Hotel aria-hidden="true" /><em className="status confirmed">Arranged · confirm</em></header>
            <h3>Accommodation</h3>
            <p><strong>{hotel.name}</strong><br />{hotel.address}</p>
            <ul>
              <li><strong>Stay</strong><span>{ACCOMMODATION_PLAN.dates}</span></li>
              <li><strong>Payment</strong><span>{ACCOMMODATION_PLAN.payment}</span></li>
              <li><strong>Contact</strong><span><a href={telHref(hotel.phone)}>{hotel.phone}</a></span></li>
            </ul>
            <div className="arrival-advice">
              <Car aria-hidden="true" />
              <p><strong>Arriving from Goiânia Airport</strong>The hotel is close to the airport. We recommend requesting an Uber directly to Golden Lis.</p>
            </div>
            <PlaceLink venueId="hotel" onSelect={selectVenue}>View hotel map and arrival options</PlaceLink>
            <div className="empty-detail">
              <CircleAlert aria-hidden="true" />
              {ACCOMMODATION_PLAN.confirmation}
            </div>
          </article>

          <article className="practical-card" id="meals">
            <header className="practical-card-head"><UtensilsCrossed aria-hidden="true" /><em className="status confirmed">From the programme</em></header>
            <h3>Meals</h3>
            <ul>
              {mealsByDay().map((row) => (
                <li key={row.day}>
                  <strong>{row.day}</strong>
                  <span className="practical-lines">
                    {row.lines.map((line, index) => (
                      <span key={`${row.day}-${line.label}`}>
                        {index > 0 ? <i aria-hidden="true"> · </i> : null}
                        {line.venueId
                          ? <PlaceLink venueId={line.venueId} onSelect={selectVenue}>{line.label}</PlaceLink>
                          : line.label}
                      </span>
                    ))}
                  </span>
                </li>
              ))}
            </ul>
            <p className="card-note">Dietary requirement instructions and remaining meal details are still to be confirmed.</p>
          </article>

          <article className="practical-card" id="transport">
            <header className="practical-card-head"><BusFront aria-hidden="true" /><em className="status confirmed">Contracted</em></header>
            <h3>Workshop shuttle</h3>
            <p className="transport-intro">
              Transport is contracted between <PlaceLink venueId="hotel" onSelect={selectVenue}>Golden Lis</PlaceLink> and the workshop locations, including <PlaceLink venueId="cidadeDeGoias" onSelect={selectVenue}>Cidade de Goiás</PlaceLink>.
            </p>
            <ul>
              {SHUTTLE_PLAN.map((item) => (
                <li key={item.days}>
                  <strong>{item.days}</strong>
                  <span><b>{item.time}</b> · {item.detail}{item.provisional ? <em className="inline-confirm">Confirm time</em> : null}</span>
                </li>
              ))}
            </ul>
            <p className="card-note">Return transport is also organised. Exact pickup points and return times will follow the final programme.</p>
          </article>
        </div>
      </section>

      <section className="maps section-pad" id="maps">
        <div className="section-title split-title"><div><p>Maps and venues</p><h2>Workshop locations</h2></div><span>Select a place for its operational details</span></div>
        <div className="maps-layout">
          <div className="location-selector" role="tablist" aria-orientation="vertical" aria-label="Workshop locations" tabIndex={-1} onKeyDown={onMapKeys}>
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
                    <Image src={withBasePath(photo.src)} alt={photo.alt} fill sizes="(max-width: 760px) 100vw, (max-width: 1050px) 45vw, 28vw" loading="lazy" />
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
              <iframe key={venue.id} title={`Map of ${venue.name}`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" src={osmEmbedSrc(coords, venue.mapSpan)} />
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
                      ? <><span>{address}</span><button type="button" onClick={() => copy('address', address)}>{copied === 'address' ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}{copied === 'address' ? 'Copied' : 'Copy'}</button></>
                      : <em>To be confirmed</em>}
                  </dd>
                </div>
                <div>
                  <dt>Coordinates</dt>
                  <dd>
                    <span className="venue-coords">{formatCoordinates(coords)}</span>
                    <button type="button" onClick={() => copy('coords', formatCoordinates(coords))}>{copied === 'coords' ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}{copied === 'coords' ? 'Copied' : 'Copy'}</button>
                  </dd>
                </div>
              </dl>
              <output className="visually-hidden">{copied ? `${copied === 'address' ? 'Address' : 'Coordinates'} copied to the clipboard` : ''}</output>

              {venue.pending ? <p className="venue-pending"><CircleAlert aria-hidden="true" />{venue.pending}</p> : null}

              <div className="venue-actions">
                <a href={osmLink(coords)} target="_blank" rel="noreferrer"><MapPin aria-hidden="true" />Open map<ExternalLink aria-hidden="true" /></a>
                {ridable ? <a href={uberLink(coords, venue.name, address)} target="_blank" rel="noreferrer"><Car aria-hidden="true" />Ride to here<ExternalLink aria-hidden="true" /></a> : null}
                {website ? <a href={website} target="_blank" rel="noreferrer"><Globe aria-hidden="true" />Website<ExternalLink aria-hidden="true" /></a> : null}
                {phone ? <a href={telHref(phone)}><Phone aria-hidden="true" />{phone}</a> : null}
              </div>

              <p className="venue-note">
                Map data © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors.
                {venue.organisedTransport
                  ? ' The workshop provides transport to this location.'
                  : ridable
                    ? ' The ride link opens Uber; other apps accept the address and coordinates above.'
                    : ' The pin is shown for reference while the location is confirmed; no ride link is offered.'}
              </p>
            </div>
          </div>
        </div>

        <div className="additional-locations" aria-label="Locations awaiting map details">
          {ADDITIONAL_VENUES.map((venueId) => {
            const item = VENUES[venueId];
            return (
              <article key={venueId} id={`venue-${venueId}`}>
                <MapPin aria-hidden="true" />
                <div><h3>{item.name}</h3><p>{item.use}</p></div>
                <em>{'pending' in item ? item.pending : 'Address and map pin to be confirmed.'}</em>
              </article>
            );
          })}
        </div>
      </section>

      <section className="recommendations section-pad" id="recommendations">
        <div className="section-title split-title"><div><p>Local guide</p><h2>Useful references for free time</h2></div><span>A short, selected list — not another itinerary</span></div>
        <div className="recommendation-list">
          {LOCAL_GUIDES.map((guide, index) => (
            <a key={guide.href} href={guide.href} target="_blank" rel="noreferrer">
              <span>{String(index + 1).padStart(2, '0')}</span>
              <BookOpen aria-hidden="true" />
              <div><small>{guide.label}</small><h3>{guide.title}</h3><p>{guide.description}</p><em>{guide.source}</em></div>
              <ExternalLink aria-hidden="true" />
            </a>
          ))}
        </div>
        <p className="recommendations-pending"><CircleAlert aria-hidden="true" />Workshop-specific weather advice, the field checklist and emergency contacts are still to be published.</p>
      </section>
    </>
  );
}
