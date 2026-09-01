import type { Day, Session, Speaker, Track } from '@/data/types';
import { VENUES } from '@/data/venues';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

/** Kinds that carry their venue inside the agenda line, as "Lunch @ Samauma". */
const VENUE_IN_LINE = new Set(['meal', 'break', 'social']);

/** Parses an ISO date in UTC, so the weekday never shifts with the local zone. */
function parseISO(date: string) {
  const [y, m, d] = date.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

/** '2026-09-14' -> 'Mon · 14 Sep' */
export function dayLabel(date: string) {
  const d = parseISO(date);
  return `${WEEKDAYS[d.getUTCDay()]} · ${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}`;
}

/** '08:30' + '10:00' -> '08:30 – 10:00'; a start alone stays '08:30'. */
export function timeLabel(session: Session) {
  return session.end ? `${session.start} – ${session.end}` : session.start;
}

/** [Leandro/OGH, Tiago/LAPIG] -> 'Leandro/OGH and Tiago/LAPIG' */
function speakerLabel(speakers: Speaker[]) {
  return speakers.map((s) => (s.org ? `${s.name}/${s.org}` : s.name)).join(' and ');
}

function trackLabel(track: Track) {
  return track.speakers ? `${track.title} (${speakerLabel(track.speakers)})` : track.title;
}

/**
 * The full agenda line. Composed from the parts rather than stored, so the
 * data stays queryable — a title is never a blob holding a venue and a
 * presenter that nothing else can read.
 */
export function sessionTitle(session: Session) {
  let label = session.title;

  if (session.tracks) {
    label = `${label}: ${session.tracks.map(trackLabel).join(' — ')}`;
  } else if (session.speakers) {
    label = `${label} (${speakerLabel(session.speakers)})`;
  }

  if (session.status === 'tbd') label = `${label} (TBD)`;

  if (session.venueId && VENUE_IN_LINE.has(session.kind)) {
    label = `${label} @ ${VENUES[session.venueId].short}`;
  }

  if (session.venueNote) label = `${label} (${session.venueNote})`;

  return label;
}

/** 'Day 1' */
export function dayShort(day: Day) {
  return `Day ${day.index}`;
}
