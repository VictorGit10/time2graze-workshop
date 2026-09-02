import type { Coordinates } from '@/data/venues';

/**
 * Links built from a venue's coordinates.
 *
 * Pins come from coordinates, never from a search string. A search string is
 * re-resolved by someone else's geocoder on every load, so the place a reader
 * sees is whatever that query returns today. A coordinate is the pin we
 * recorded, sourced in `research/venues.md`.
 */

/** Latitude span of an embedded map, in degrees. Roughly 650 m. */
const DEFAULT_SPAN = 0.006;

/**
 * OpenStreetMap's embed takes a bounding box rather than a centre and a zoom.
 * The longitude span is widened by 1/cos(latitude) so the box covers a square
 * of ground instead of stretching as it leaves the equator.
 *
 * No API key, and no third-party cookies for a reader in another country.
 * Attribution to OpenStreetMap contributors is required wherever it is shown.
 */
export function osmEmbedSrc({ lat, lon }: Coordinates, span = DEFAULT_SPAN): string {
  const lonSpan = span / Math.cos((lat * Math.PI) / 180);
  const bbox = [lon - lonSpan / 2, lat - span / 2, lon + lonSpan / 2, lat + span / 2]
    .map((n) => n.toFixed(6))
    .join(',');
  return `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bbox)}&layer=mapnik&marker=${lat},${lon}`;
}

/** The same pin on the full OpenStreetMap site, for directions and detail. */
export function osmLink({ lat, lon }: Coordinates, zoom = 17): string {
  return `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=${zoom}/${lat}/${lon}`;
}

/**
 * Uber's documented universal link: it opens the app when installed and falls
 * back to m.uber.com otherwise, with no API key and no account on our side.
 * https://developer.uber.com/docs/deep-linking
 *
 * It carries the reader to a point, not to a name they can re-read, so it is
 * only ever built from a coordinate we are willing to stand behind.
 */
export function uberLink({ lat, lon }: Coordinates, nickname: string, address?: string): string {
  const query = new URLSearchParams({
    action: 'setPickup',
    pickup: 'my_location',
    'dropoff[latitude]': String(lat),
    'dropoff[longitude]': String(lon),
    'dropoff[nickname]': nickname,
  });
  /* The nickname alone satisfies Uber, but a driver reads the address. */
  if (address) query.set('dropoff[formatted_address]', address);
  return `https://m.uber.com/ul/?${query}`;
}

/** Six decimals is about 0.1 m — precise enough to paste into any app. */
export function formatCoordinates({ lat, lon }: Coordinates): string {
  return `${lat.toFixed(6)}, ${lon.toFixed(6)}`;
}
