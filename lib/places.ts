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

/**
 * The recorded pin in Google Maps. Maps URLs are universal links, so they open
 * the Google Maps app where supported and its website otherwise. Coordinates
 * keep the destination exact without asking Google's search to resolve a name.
 */
export function googleMapsLink({ lat, lon }: Coordinates): string {
  const query = new URLSearchParams({
    api: '1',
    query: `${lat},${lon}`,
  });
  return `https://www.google.com/maps/search/?${query}`;
}

/**
 * Uber's documented universal link, in its current form: the ride-request
 * path, with `pickup=my_location` and the first stop as an encoded location
 * object. It opens the app where supported and falls back to the mobile site
 * otherwise, with no API key or integration account on our side.
 * https://developer.uber.com/docs/riders/ride-requests/tutorials/deep-links/introduction
 *
 * It carries the reader to a point, not to a name they can re-read, so it is
 * only ever built for a venue marked `ride` in the registry — a coordinate and
 * an address we are willing to stand behind.
 */
export function uberLink({ lat, lon }: Coordinates, nickname: string, address: string): string {
  /* `addressLine1` is the dropoff's name and `addressLine2` the address a
     driver reads, in the location object the link parameters specify. */
  const dropoff = {
    latitude: lat,
    longitude: lon,
    addressLine1: nickname,
    addressLine2: address,
  };
  const query = new URLSearchParams({
    pickup: 'my_location',
    'drop[0]': JSON.stringify(dropoff),
  });
  return `https://m.uber.com/looking?${query}`;
}

/** Six decimals is about 0.1 m — precise enough to paste into any app. */
export function formatCoordinates({ lat, lon }: Coordinates): string {
  return `${lat.toFixed(6)}, ${lon.toFixed(6)}`;
}

/**
 * Straight-line distance between two pins. Indicative only: it is not a
 * driving distance and must never be published as a travel time — see
 * `research/venues.md`.
 */
export function straightLineKm(from: Coordinates, to: Coordinates): string {
  const R = 6371; // Mean Earth radius, km.
  const rad = (d: number) => (d * Math.PI) / 180;
  const dLat = rad(to.lat - from.lat);
  const dLon = rad(to.lon - from.lon);
  const a = Math.sin(dLat / 2) ** 2
    + Math.cos(rad(from.lat)) * Math.cos(rad(to.lat)) * Math.sin(dLon / 2) ** 2;
  return `${(2 * R * Math.asin(Math.sqrt(a))).toFixed(1)} km`;
}
