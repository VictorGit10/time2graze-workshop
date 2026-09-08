import { Landmark, Trees } from 'lucide-react';
import {
  GOIANIA_FACTS,
  GOIANIA_HISTORY,
  GOIANIA_INTRO,
  GOIANIA_MAP,
  GOIANIA_PLACES,
  GOIAS_FACTS,
  GOIAS_INTRO,
  GOIAS_MAP,
  GOIAS_PLACES,
  type Fact,
  type MapPlace,
} from '@/data/geography';

/**
 * Where the workshop is: the city, and the state around it.
 *
 * A server component — nothing here has state, and `/practical/` should keep
 * shipping only the venue card's JavaScript.
 *
 * Each map is drawn twice over: as an SVG, and as the numbered legend beside
 * it. The SVG is `aria-hidden` and the legend is what assistive technology
 * reads, the same division the programme grid makes — a shape with pins in it
 * is not a source anyone can be left alone with. Marker and legend entry come
 * from one record in `data/geography.ts`, so the map cannot carry a pin the
 * list does not explain.
 */

/** Height of the strip below the frame holding the scale and the compass. */
const FOOT = 48;

/** A round distance whose bar lands near a tenth of the map's width. */
function scaleBar(kmPerUnit: number) {
  const steps = [1, 2, 5, 10, 20, 25, 50, 100, 200, 250, 500];
  const target = 110 * kmPerUnit;
  const km = steps.reduce((a, b) =>
    Math.abs(b - target) < Math.abs(a - target) ? b : a,
  );
  return { km, units: km / kmPerUnit };
}

function Marker({ place }: { place: MapPlace }) {
  return (
    <g className={place.workshop ? 'orient-pin is-workshop' : 'orient-pin'}>
      {place.workshop && <circle cx={place.x} cy={place.y} r={21} />}
      <circle cx={place.x} cy={place.y} r={16} />
      <text x={place.x} y={place.y} dy="0.34em">
        {place.n}
      </text>
    </g>
  );
}

/**
 * `water` is clipped to `land`. The Overpass query that produced the Meia
 * Ponte covers a bounding box, not the municipality, so the river arrives
 * longer than the city: unclipped it left the frame at the top and drew
 * straight through the scale bar. Clipping it to the boundary is also the
 * truer drawing — the neighbouring municipalities are not on this map.
 */
function Chart({
  id,
  map,
  places,
  land,
  water,
  inset,
}: {
  id: string;
  map: { width: number; height: number; kmPerUnit: number };
  places: MapPlace[];
  land: string;
  water?: string;
  inset?: string;
}) {
  const bar = scaleBar(map.kmPerUnit);
  const baseline = map.height + 26;
  return (
    <svg
      className="orient-map"
      viewBox={`0 0 ${map.width} ${map.height + FOOT}`}
      aria-hidden="true"
      focusable="false"
    >
      {water && (
        <defs>
          <clipPath id={`${id}-land`}>
            <path d={land} />
          </clipPath>
        </defs>
      )}
      <path className="orient-land" d={land} />
      {water && (
        <path
          className="orient-water"
          d={water}
          clipPath={`url(#${id}-land)`}
        />
      )}
      {inset && <path className="orient-inset" d={inset} />}
      {places.map((place) => (
        <Marker key={place.n} place={place} />
      ))}
      <g className="orient-scale">
        <path
          d={`M0 ${baseline - 6}V${baseline}H${bar.units}V${baseline - 6}`}
        />
        <text x={bar.units + 12} y={baseline} dy="-0.05em">
          {bar.km} km
        </text>
        <path
          d={`M${map.width - 11} ${baseline}V${baseline - 24}M${map.width - 18} ${baseline - 17}L${map.width - 11} ${baseline - 26}L${map.width - 4} ${baseline - 17}`}
          className="orient-compass"
        />
        <text
          className="orient-compass-label"
          x={map.width - 11}
          y={baseline + 14}
          textAnchor="middle"
        >
          N
        </text>
      </g>
    </svg>
  );
}

/**
 * The origin carries no distance: it is the place the others are measured
 * from, and the caption names it. Printing the origin's own name in the
 * distance column read as though the hotel were 'Golden Lis' away from itself.
 */
function Legend({ places, origin }: { places: MapPlace[]; origin: string }) {
  return (
    <ol className="orient-legend">
      {places.map((place) => (
        <li key={place.n} className={place.workshop ? 'is-workshop' : undefined}>
          <span className="orient-legend-n" aria-hidden="true">
            {place.n}
          </span>
          <div>
            <strong>{place.name}</strong>
            <span>{place.detail}</span>
          </div>
          {place.distance && (
            <em>
              {place.distance}
              <span className="visually-hidden"> from {origin}</span>
            </em>
          )}
        </li>
      ))}
    </ol>
  );
}

function Facts({ facts }: { facts: Fact[] }) {
  return (
    <dl className="orient-facts">
      {facts.map((fact) => (
        <div key={fact.label}>
          <dt>{fact.label}</dt>
          <dd>
            <strong>{fact.value}</strong>
            {fact.note && <span>{fact.note}</span>}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/**
 * IBGE publishes the boundaries; the river is OpenStreetMap, so ODbL
 * attribution is required wherever it is drawn. The key names the one line on
 * the map that is not a boundary or a pin — without it the river is an
 * unexplained mark.
 */
function MapCredit({
  origin,
  waterway,
}: {
  origin: string;
  waterway?: string;
}) {
  return (
    <figcaption>
      {waterway && <span className="orient-key">{waterway}</span>}
      Straight-line distances from {origin}. Boundaries: IBGE territorial mesh.
      {waterway && (
        <>
          {' '}
          Watercourse:{' '}
          <a
            href="https://www.openstreetmap.org/copyright"
            target="_blank"
            rel="noreferrer"
          >
            © OpenStreetMap contributors
          </a>
          .
        </>
      )}
    </figcaption>
  );
}

export function Orientation() {
  return (
    <section
      className="travel-section orient"
      id="orientation"
      aria-labelledby="orient-title"
    >
      <header className="travel-section-heading">
        <h2 id="orient-title">Goiânia and Goiás</h2>
        <p>
          Where the workshop takes place, for participants arriving in central
          Brazil for the first time.
        </p>
      </header>

      <article className="orient-module" aria-labelledby="orient-city">
        <div className="orient-lede">
          <p className="travel-eyebrow">
            <Landmark aria-hidden="true" />
            The city
          </p>
          <h3 id="orient-city">Goiânia</h3>
          <p className="orient-intro">{GOIANIA_INTRO}</p>
        </div>
        <figure className="orient-figure">
          <Chart
            id="map-city"
            map={GOIANIA_MAP}
            places={GOIANIA_PLACES}
            land={GOIANIA_MAP.city}
            water={GOIANIA_MAP.river}
          />
          <MapCredit origin="Golden Lis" waterway="Rio Meia Ponte" />
        </figure>
        <div className="orient-aside">
          <Legend places={GOIANIA_PLACES} origin="Golden Lis" />
        </div>
        <div className="orient-detail">
          <h4>Chronology</h4>
          <ol className="orient-timeline">
            {GOIANIA_HISTORY.map((step) => (
              <li key={step.year}>
                <span className="orient-year">{step.year}</span>
                <p>{step.event}</p>
              </li>
            ))}
          </ol>
          <Facts facts={GOIANIA_FACTS} />
        </div>
      </article>

      <article className="orient-module is-mirrored" aria-labelledby="orient-state">
        <div className="orient-lede">
          <p className="travel-eyebrow">
            <Trees aria-hidden="true" />
            The state
          </p>
          <h3 id="orient-state">Goiás</h3>
          <p className="orient-intro">{GOIAS_INTRO}</p>
        </div>
        <figure className="orient-figure">
          <Chart
            id="map-state"
            map={GOIAS_MAP}
            places={GOIAS_PLACES}
            land={GOIAS_MAP.state}
            inset={GOIAS_MAP.df}
          />
          <MapCredit origin="Goiânia" />
        </figure>
        <div className="orient-aside">
          <Legend places={GOIAS_PLACES} origin="Goiânia" />
        </div>
        <div className="orient-detail">
          <Facts facts={GOIAS_FACTS} />
        </div>
      </article>
    </section>
  );
}
