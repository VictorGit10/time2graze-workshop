import { AGENDA } from '@/data/agenda';
import { RECAPS } from '@/data/recaps';
import type { DayRecap, RecapItem, RecapSection } from '@/data/types';

/** The recap for a day index, or null while the day has not been summarised. */
export function recapForDay(dayIndex: number): DayRecap | null {
  return RECAPS[dayIndex] ?? null;
}

/** Every flaggable line of a section, in the order it is rendered. */
export function sectionItems(section: RecapSection): RecapItem[] {
  return [
    ...(section.summary ? [section.summary] : []),
    ...(section.decisions ?? []),
    ...(section.questions ?? []),
    ...(section.actions ?? []),
  ];
}

/** Every flaggable line of a recap. */
export function recapItems(recap: DayRecap): RecapItem[] {
  return recap.sections.flatMap(sectionItems);
}

/**
 * The heading of a recap block: the title of the session it covers, taken from
 * the agenda so the two can never drift, or the block's own title when it
 * belongs to the day rather than to one session.
 */
export function sectionHeading(section: RecapSection): string {
  if (!section.sessionId) return section.title ?? 'The day';

  for (const day of AGENDA) {
    for (const session of day.sessions) {
      if (session.id === section.sessionId) return session.title;
      for (const track of session.tracks ?? []) {
        if (track.id === section.sessionId) return track.title;
      }
    }
  }
  return section.title ?? section.sessionId;
}

/**
 * The session a recap block links back to. A track is not an anchor on the
 * programme — the session holding it is — so a track id resolves to its
 * parent, which is what `/programme/#…` can actually scroll to.
 */
export function sectionAnchor(section: RecapSection): string | null {
  if (!section.sessionId) return null;

  for (const day of AGENDA) {
    for (const session of day.sessions) {
      if (session.id === section.sessionId) return session.id;
      if (session.tracks?.some((t) => t.id === section.sessionId)) return session.id;
    }
  }
  return null;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/**
 * '2026-09-16T18:12' -> '16 September, 18:12'.
 *
 * Parsed by hand rather than through `Date`: the stamp is already Goiânia
 * time by contract, and letting the runtime interpret it would render one
 * value on the build machine and another in a reader's browser.
 */
export function formatRecapStamp(iso: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(iso);
  if (!match) return iso;
  const [, , month, day, hour, minute] = match;
  return `${Number(day)} ${MONTHS[Number(month) - 1]}, ${hour}:${minute}`;
}
