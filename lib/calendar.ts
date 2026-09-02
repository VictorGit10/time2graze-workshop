import type { Day, Session, Track } from '@/data/types';
import type { Venue, VenueId } from '@/data/venues';

/**
 * The programme as calendar data: the `.ics` files themselves, and the links
 * that hand them to Google Calendar and Apple Calendar.
 *
 * Two constraints shape everything here.
 *
 * The first is the rule about invented facts. 20 of the 45 scheduled items
 * carry a start and no recorded end, and those events are written with
 * `DTSTART` alone — RFC 5545 allows an event with no `DTEND`, and a guessed
 * one would push a duration nobody set into someone's phone, where it is
 * never re-read.
 *
 * The second is that this module is loaded twice: by the pages, and by
 * `scripts/build-calendar.mjs`, which Node reads directly. Node strips the
 * types but does not resolve the `@/` alias, so every import here is
 * type-only and the venue registry arrives as an argument rather than being
 * imported.
 */

/** The workshop's own clock. Every time in the agenda is stated in it. */
export const TIMEZONE = 'America/Sao_Paulo';

/** The venue registry, passed in rather than imported — see the note above. */
export type VenueRegistry = Record<VenueId, Venue>;

export type CalendarOptions = {
  /** How Google and Apple name the calendar once it is subscribed. */
  name: string;
  /** The instant the file was generated, for `DTSTAMP`. */
  stamp: Date;
  /** Absolute site address, so each event can link back to its session. */
  siteUrl?: string;
};

const CRLF = '\r\n';
const encoder = new TextEncoder();
const decoder = new TextDecoder();

/** RFC 5545 §3.3.11: backslash, semicolon, comma and newline are escaped. */
function escapeText(value: string) {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');
}

/**
 * RFC 5545 §3.1: a content line is folded at 75 octets, and a continuation
 * line begins with a space that counts towards its own 75. The limit is in
 * UTF-8 bytes rather than characters, so the split has to land on a character
 * boundary — "Goiânia" must not be cut down the middle of its â.
 */
function fold(line: string) {
  const bytes = encoder.encode(line);
  if (bytes.length <= 75) return line;

  const parts: string[] = [];
  let cut = 0;
  while (cut < bytes.length) {
    let take = Math.min(cut === 0 ? 75 : 74, bytes.length - cut);
    // 0b10xxxxxx is a UTF-8 continuation byte: back off until it is not one.
    while (take > 1 && (bytes[cut + take] & 0xc0) === 0x80) take -= 1;
    parts.push(decoder.decode(bytes.subarray(cut, cut + take)));
    cut += take;
  }
  return parts.join(`${CRLF} `);
}

/** A property whose value is TEXT, and therefore escaped. */
function text(name: string, value: string) {
  return fold(`${name}:${escapeText(value)}`);
}

/** A property whose value is a URI or an enumeration: folded, never escaped. */
function raw(name: string, value: string) {
  return fold(`${name}:${value}`);
}

/** '2026-09-14' + '08:30' -> '20260914T083000', in the workshop's own clock. */
function localStamp(date: string, time: string) {
  return `${date.replace(/-/g, '')}T${time.replace(':', '')}00`;
}

/** A UTC instant as '20260902T210000Z'. */
function utcStamp(at: Date) {
  return `${at.toISOString().replace(/[-:]/g, '').slice(0, 15)}Z`;
}

/**
 * Brazil abolished daylight saving in 2019, so `America/Sao_Paulo` is a fixed
 * UTC−03:00 across the workshop week and one STANDARD observance describes it
 * exactly. Writing the component out instead of trusting the reader's client
 * to know the zone is what makes the file open correctly in Outlook as well.
 */
const VTIMEZONE = [
  'BEGIN:VTIMEZONE',
  `TZID:${TIMEZONE}`,
  'BEGIN:STANDARD',
  'DTSTART:20200101T000000',
  'TZOFFSETFROM:-0300',
  'TZOFFSETTO:-0300',
  'TZNAME:-03',
  'END:STANDARD',
  'END:VTIMEZONE',
];

function speakerLine(item: Session | Track) {
  return item.speakers?.map((s) => (s.org ? `${s.name}/${s.org}` : s.name)).join(' and ');
}

/**
 * What the event is called in a calendar.
 *
 * A split session keeps both activities in the title, mirroring the single
 * block the programme draws: at 10:00 the reader is in one room choosing
 * between two courses, not attending two overlapping events.
 */
export function calendarSummary(session: Session) {
  let summary = session.title;

  if (session.tracks) {
    summary = `${summary}: ${session.tracks.map((t) => t.title).join(' — ')}`;
  }
  if (session.status === 'tbd') summary = `${summary} (TBD)`;
  if (session.venueNote) summary = `${summary} (${session.venueNote})`;

  return summary;
}

/**
 * Where the event is. An address is printed only once the venue or the host
 * has confirmed it; until then the registry's locality is what there is, and
 * the rest stays blank rather than plausible.
 */
function calendarLocation(session: Session, venues: VenueRegistry) {
  if (!session.venueId) return null;

  const venue = venues[session.venueId];
  const where = venue.address ?? venue.locality;
  return where ? `${venue.name} — ${where}` : venue.name;
}

/**
 * The body of the entry. Everything the programme shows about the session
 * that does not fit in a title, plus what is still unknown about it — a
 * calendar entry is read alone, away from the page that qualified it.
 */
function calendarDescription(session: Session, options: CalendarOptions) {
  const lines = ['Time2Graze Brazil Workshop · LAPIG, Universidade Federal de Goiás.'];
  const who = speakerLine(session);

  if (who) lines.push(`Presented by ${who}.`);

  if (session.tracks) {
    lines.push('Split session — choose one:');
    for (const track of session.tracks) {
      const speakers = speakerLine(track);
      lines.push(speakers ? `- ${track.title} (${speakers})` : `- ${track.title}`);
    }
  }

  if (session.requirements?.length) {
    lines.push(`Bring: ${session.requirements.join(' ')}`);
  }
  if (!session.end) lines.push('No end time has been recorded for this item.');
  if (session.status === 'tbd') lines.push('This activity is not confirmed yet.');

  lines.push(`All times are Goiânia time (${TIMEZONE}).`);
  if (options.siteUrl) lines.push(`${options.siteUrl}/programme/#${session.id}`);

  return lines.join('\n');
}

function event(session: Session, venues: VenueRegistry, options: CalendarOptions) {
  const rows = [
    'BEGIN:VEVENT',
    // The session id is hand-written and stable, so re-importing the file
    // updates the entries a reader already has instead of duplicating them.
    raw('UID', `${session.id}@time2graze-workshop`),
    raw('DTSTAMP', utcStamp(options.stamp)),
    raw(`DTSTART;TZID=${TIMEZONE}`, localStamp(session.date, session.start)),
  ];

  // No DTEND for an item with no recorded end: the event marks the moment it
  // starts and claims nothing about when it finishes.
  if (session.end) {
    rows.push(raw(`DTEND;TZID=${TIMEZONE}`, localStamp(session.date, session.end)));
  }

  rows.push(text('SUMMARY', calendarSummary(session)));
  rows.push(text('DESCRIPTION', calendarDescription(session, options)));

  const where = calendarLocation(session, venues);
  if (where) rows.push(text('LOCATION', where));

  rows.push(raw('CATEGORIES', session.kind.toUpperCase()));
  rows.push(raw('STATUS', session.status === 'tbd' ? 'TENTATIVE' : 'CONFIRMED'));
  if (options.siteUrl) rows.push(raw('URL', `${options.siteUrl}/programme/#${session.id}`));

  rows.push('END:VEVENT');
  return rows;
}

/** One `.ics` file covering the days given, in agenda order. */
export function icsCalendar(days: Day[], venues: VenueRegistry, options: CalendarOptions) {
  const rows = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//LAPIG UFG//Time2Graze Brazil Workshop//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    text('X-WR-CALNAME', options.name),
    raw('X-WR-TIMEZONE', TIMEZONE),
    // A subscribed calendar is re-read on the client's own schedule. Both the
    // standard property and Apple's older one ask for twice a day; neither is
    // a promise, and Google in particular takes its time.
    'REFRESH-INTERVAL;VALUE=DURATION:PT12H',
    'X-PUBLISHED-TTL:PT12H',
    ...VTIMEZONE,
    ...days.flatMap((day) => day.sessions.flatMap((s) => event(s, venues, options))),
    'END:VCALENDAR',
  ];

  return `${rows.join(CRLF)}${CRLF}`;
}

/**
 * Google Calendar's documented "add by URL" entry point. It subscribes the
 * reader to the file rather than copying it once, so a corrected time reaches
 * them — on Google's own refresh schedule, which is not immediate.
 */
export function googleSubscribeUrl(icsUrl: string) {
  return `https://calendar.google.com/calendar/r?cid=${encodeURIComponent(icsUrl)}`;
}

/**
 * Apple Calendar — and every other client that registered the scheme —
 * subscribes through `webcal://`. It is the same file, fetched over https.
 */
export function webcalUrl(icsUrl: string) {
  return icsUrl.replace(/^https?:\/\//, 'webcal://');
}
