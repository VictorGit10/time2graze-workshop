import type { Day, Session, Speaker, Track } from '@/data/types';
import { VENUES } from '@/data/venues';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

/** Kinds that may carry their venue in compact derived labels. */
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

/** '2026-09-14' -> '14 Sep' */
export function shortDate(date: string) {
  const d = parseISO(date);
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}`;
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

/** Activities from this hour on move to the evening block, below the axis. */
export const EVENING_FROM = 18 * 60;

/** '14:30' -> 870 */
export function toMinutes(hhmm: string) {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

/** Display duration in minutes, including visibly provisional intervals. */
export function durationOf(session: Session) {
  return session.end ? toMinutes(session.end) - toMinutes(session.start) : null;
}

export function isEvening(session: Session) {
  return toMinutes(session.start) >= EVENING_FROM;
}

/**
 * The span the time axis has to cover: from the first start to the last
 * recorded moment, ignoring the evening block. A start-only fallback contributes
 * its start only.
 */
export function axisBounds(day: Day) {
  const daytime = day.sessions.filter((s) => !isEvening(s));
  const starts = daytime.map((s) => toMinutes(s.start));
  const ends = daytime.map((s) => (s.end ? toMinutes(s.end) : toMinutes(s.start)));
  return { from: Math.min(...starts), to: Math.max(...ends) };
}

/** Half-hour ticks across the axis, the hour ones labelled. */
export function axisTicks(day: Day) {
  const { from, to } = axisBounds(day);
  const ticks = [];
  for (let m = Math.floor(from / 30) * 30; m <= to; m += 30) {
    ticks.push({
      minutes: m,
      onTheHour: m % 60 === 0,
      label: `${String(Math.floor(m / 60)).padStart(2, '0')}:00`,
    });
  }
  return ticks;
}

/** 980 -> '16:20' */
export function fromMinutes(total: number) {
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}
