import Link from 'next/link';
import { ArrowUpRight, BusFront } from 'lucide-react';
import { Orientation } from '@/components/orientation';
import { VenueCard } from '@/components/venue-card';
import { LOCAL_GUIDES, SHUTTLE_PLAN } from '@/data/practical';
import { MAP_VENUES } from '@/data/venues';

export default function PracticalPage() {
  const hotel = MAP_VENUES.find((venue) => venue.id === 'hotel')!;
  const places = MAP_VENUES.filter((venue) => venue.id !== 'hotel');

  return (
    <section className="travel-page section-pad" id="practical">
      <header className="travel-heading">
        <h1>Travel &amp; stay</h1>
        <p>Goiânia, Brazil · 14–18 September 2026</p>
      </header>
      <nav className="page-index travel-index" aria-label="Travel information">
        <a href="#hotel">Hotel</a>
        <a href="#transport">Shuttle</a>
        <a href="#maps">Venues</a>
        <a href="#orientation">The region</a>
      </nav>
      <div className="travel-arrival">
        <div id="stay">
          <VenueCard venue={hotel} anchor="hotel" />
        </div>
        <section
          className="shuttle-card"
          id="transport"
          aria-labelledby="shuttle-title"
        >
          <p className="travel-eyebrow">
            <BusFront aria-hidden="true" />
            Daily transport
          </p>
          <h2 id="shuttle-title">Workshop shuttle</h2>
          <p>
            Take the workshop shuttle from Golden Lis each day. Transport to the
            activities and back is organised.
          </p>
          <dl className="shuttle-times">
            {SHUTTLE_PLAN.map((item) => (
              <div key={item.days}>
                <dt>{item.days}</dt>
                <dd>
                  <strong>{item.time}</strong>
                  <span>{item.detail}</span>
                  {item.provisional && (
                    <em className="shuttle-provisional">
                      Departure time to confirm
                    </em>
                  )}
                </dd>
              </div>
            ))}
          </dl>
          <Link className="travel-text-link" href="/programme/">
            View daily programme <ArrowUpRight aria-hidden="true" />
          </Link>
        </section>
      </div>
      <section
        className="travel-section"
        id="maps"
        aria-labelledby="venues-title"
      >
        <header className="travel-section-heading">
          <h2 id="venues-title">Workshop locations</h2>
          <p>Daily travel is by workshop shuttle.</p>
        </header>
        <div id="map-panel" className="travel-places">
          {places.map((venue) => (
            <VenueCard
              key={venue.id}
              venue={venue}
              anchor={
                venue.id === 'cidadeDeGoias' ? 'cidade-de-goias' : venue.id
              }
            />
          ))}
        </div>
      </section>
      <Orientation />
      <section
        className="travel-section"
        id="recommendations"
        aria-labelledby="guide-title"
      >
        <h2 id="guide-title">Useful references</h2>
        <div className="travel-guides">
          {LOCAL_GUIDES.map((guide) => (
            <a
              key={guide.href}
              href={guide.href}
              target="_blank"
              rel="noreferrer"
            >
              <strong>
                {guide.title}
                <ArrowUpRight aria-hidden="true" />
              </strong>
              <span>{guide.description}</span>
              <small>{guide.source}</small>
            </a>
          ))}
        </div>
      </section>
    </section>
  );
}
