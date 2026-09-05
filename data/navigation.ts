/**
 * The four destinations, in the order they are read, named as the organiser
 * approved them on 5 September 2026.
 *
 * One list, because two drifted: the 404 page kept its own copy and still
 * called `/practical/` "Practical information" months after the header had
 * become "Travel", and listed the four in a different order. `Travel` uses the
 * existing `/practical/` URL — the route is stable, the label is not.
 */
export type Destination = { href: string; label: string };

export const DESTINATIONS: readonly Destination[] = [
  { href: '/', label: 'Home' },
  { href: '/programme/', label: 'Programme' },
  { href: '/practical/', label: 'Travel' },
  { href: '/materials/', label: 'Materials' },
] as const;
