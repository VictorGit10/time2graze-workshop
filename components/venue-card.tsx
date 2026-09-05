'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  ArrowUpRight,
  Car,
  Check,
  ChevronDown,
  Copy,
  MapPin,
  Phone,
} from 'lucide-react';
import { ACCOMMODATION_PLAN, SHUTTLE_PLAN } from '@/data/practical';
import type { MapVenue } from '@/data/venues';
import { withBasePath } from '@/lib/base-path';
import {
  directionsLink,
  formatCoordinates,
  googleMapsLink,
  osmEmbedSrc,
  uberLink,
} from '@/lib/places';

/** Real anchors preserve the destination when sharing or reloading. */
export function VenueCard({
  venue,
  anchor,
}: {
  venue: MapVenue;
  anchor: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const [copyState, setCopyState] = useState<'ready' | 'copied' | 'failed'>(
    'ready',
  );
  const hotel = venue.id === 'hotel';
  const Heading = hotel ? 'h2' : 'h3';
  const ridable = venue.ride === true && !venue.organisedTransport;
  const copyValue = venue.address ?? formatCoordinates(venue.coords);
  async function copy() {
    try {
      await navigator.clipboard.writeText(copyValue);
      setCopyState('copied');
    } catch {
      setCopyState('failed');
    }
  }
  return (
    <article
      className={`travel-place${hotel ? ' travel-hotel' : ''}`}
      id={anchor}
      aria-labelledby={`${anchor}-title`}
    >
      <p className="travel-eyebrow">
        <MapPin aria-hidden="true" />
        {hotel
          ? 'Your hotel'
          : venue.organisedTransport
            ? 'Friday field visit'
            : 'University laboratory'}
      </p>
      <Heading id={`${anchor}-title`}>{venue.name}</Heading>
      <p className="travel-place-context">
        {hotel ? 'From the airport or back to the hotel' : venue.locality}
      </p>
      <div className="travel-place-actions">
        {ridable && (
          <a
            className="travel-uber"
            href={uberLink(
              venue.coords,
              venue.name,
              venue.address ?? venue.locality,
            )}
            target="_blank"
            rel="noreferrer"
          >
            <Car aria-hidden="true" />
            Open Uber to {hotel ? 'hotel' : venue.short}
            <ArrowUpRight aria-hidden="true" />
          </a>
        )}
        <a
          href={
            venue.address
              ? directionsLink(venue.coords)
              : googleMapsLink(venue.coords)
          }
          target="_blank"
          rel="noreferrer"
        >
          <MapPin aria-hidden="true" />
          {venue.address ? 'Directions' : 'Open map'}
        </a>
        {venue.phone && (
          <a href={`tel:${venue.phone.replace(/[^+\d]/g, '')}`}>
            <Phone aria-hidden="true" />
            {hotel ? 'Call hotel' : 'Call LAPIG'}
          </a>
        )}
      </div>
      {venue.organisedTransport && (
        <p className="travel-organised">
          Travel by workshop shuttle · Friday departure {SHUTTLE_PLAN[1].time}{' '}
          from Golden Lis.
        </p>
      )}
      <div className="travel-address">
        <p>{copyValue}</p>
        <button type="button" onClick={copy}>
          {copyState === 'copied' ? (
            <Check aria-hidden="true" />
          ) : (
            <Copy aria-hidden="true" />
          )}
          {copyState === 'copied'
            ? 'Copied'
            : venue.address
              ? 'Copy address'
              : 'Copy coordinates'}
        </button>
        <output
          className={
            copyState === 'failed' ? 'travel-copy-error' : 'visually-hidden'
          }
        >
          {copyState === 'failed'
            ? 'Could not copy. Select and copy the text above.'
            : copyState === 'copied'
              ? `${venue.address ? 'Address' : 'Coordinates'} copied`
              : ''}
        </output>
      </div>
      {hotel && (
        <dl className="hotel-stay">
          <div>
            <dt>Stay</dt>
            <dd>{ACCOMMODATION_PLAN.dates}</dd>
          </div>
          <div>
            <dt>Booking</dt>
            <dd>{ACCOMMODATION_PLAN.payment}</dd>
          </div>
        </dl>
      )}
      {venue.pending && <p className="travel-pending">{venue.pending}</p>}
      <details
        className="place-map"
        onToggle={(event) => setExpanded(event.currentTarget.open)}
      >
        <summary>
          Map &amp; photograph
          <ChevronDown aria-hidden="true" />
        </summary>
        {expanded && (
          <div className="place-map-content">
            <iframe
              title={`Map of ${venue.name}`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={osmEmbedSrc(venue.coords, venue.mapSpan)}
            />
            {venue.photo ? (
              <figure>
                <Image
                  src={withBasePath(venue.photo.src)}
                  alt={venue.photo.alt}
                  width={720}
                  height={420}
                  sizes="(max-width: 760px) 100vw, 50vw"
                  loading="lazy"
                />
                <figcaption>
                  {venue.photo.creditHref ? (
                    <a
                      href={venue.photo.creditHref}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {venue.photo.credit}
                    </a>
                  ) : (
                    venue.photo.credit
                  )}
                </figcaption>
              </figure>
            ) : (
              <p>Photograph pending.</p>
            )}
            <p className="map-credit">
              Map data ©{' '}
              <a
                href="https://www.openstreetmap.org/copyright"
                target="_blank"
                rel="noreferrer"
              >
                OpenStreetMap contributors
              </a>
            </p>
          </div>
        )}
      </details>
      {venue.website && (
        <a
          className="travel-text-link place-website"
          href={venue.website}
          target="_blank"
          rel="noreferrer"
        >
          {hotel ? 'Hotel website' : 'LAPIG website'}
          <ArrowUpRight aria-hidden="true" />
        </a>
      )}
    </article>
  );
}
