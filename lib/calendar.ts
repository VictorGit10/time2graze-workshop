import type { Day, Session, Track } from '@/data/types';
import type { Venue, VenueId } from '@/data/venues';

export const CALENDAR_TIMEZONE = 'America/Sao_Paulo';

type VenueRegistry = Record<VenueId, Venue>;
type CalendarRelease = 'beta' | 'final';

type CalendarOptions = {
  name: string;
  release: CalendarRelease;
  stamp: Date;
  siteUrl?: string;
};

const CRLF = '\r\n';
const encoder = new TextEncoder();
const decoder = new TextDecoder();

function escapeText(value: string) {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');
}

/** RFC 5545 content lines are folded at 75 UTF-8 octets. */
function fold(line: string) {
  const bytes = encoder.encode(line);
  if (bytes.length <= 75) return line;

  const parts: string[] = [];
  let offset = 0;
  while (offset < bytes.length) {
    let length = Math.min(offset === 0 ? 75 : 74, bytes.length - offset);
    while (length > 1 && (bytes[offset + length] & 0xc0) === 0x80) length -= 1;
    parts.push(decoder.decode(bytes.subarray(offset, offset + length)));
    offset += length;
  }
  return parts.join(`${CRLF} `);
}

function text(name: string, value: string) {
  return fold(`${name}:${escapeText(value)}`);
}

function raw(name: string, value: string) {
  return fold(`${name}:${value}`);
}

function localStamp(date: string, time: string) {
  return `${date.replace(/-/g, '')}T${time.replace(':', '')}00`;
}

function utcStamp(at: Date) {
  return `${at.toISOString().replace(/[-:]/g, '').slice(0, 15)}Z`;
}

const VTIMEZONE = [
  'BEGIN:VTIMEZONE',
  `TZID:${CALENDAR_TIMEZONE}`,
  'BEGIN:STANDARD',
  'DTSTART:20200101T000000',
  'TZOFFSETFROM:-0300',
  'TZOFFSETTO:-0300',
  'TZNAME:-03',
  'END:STANDARD',
  'END:VTIMEZONE',
];

function speakerLine(item: Session | Track) {
  return item.speakers
    ?.map((speaker) =>
      speaker.org ? `${speaker.name}/${speaker.org}` : speaker.name,
    )
    .join(' and ');
}

function summary(session: Session, release: CalendarRelease) {
  let value = session.title;
  if (session.tracks)
    value = `${value}: ${session.tracks.map((track) => track.title).join(' — ')}`;
  if (session.venueNote) value = `${value} (${session.venueNote})`;
  if (release === 'beta') value = `${value} · Beta`;
  return value;
}

function location(session: Session, venues: VenueRegistry) {
  if (!session.venueId) return null;
  const venue = venues[session.venueId];
  const address = venue.address ?? venue.locality;
  return address ? `${venue.name} — ${address}` : venue.name;
}

function description(session: Session, options: CalendarOptions) {
  const lines = [
    'Time2Graze Brazil Workshop · LAPIG, Universidade Federal de Goiás.',
  ];
  const speakers = speakerLine(session);

  if (options.release === 'beta') {
    lines.push(
      'Beta calendar entry: the programme may change. Check the workshop website for updates.',
    );
  }
  if (speakers) lines.push(`Presented by ${speakers}.`);
  if (session.tracks) {
    lines.push('Split session — choose one:');
    for (const track of session.tracks) {
      const trackSpeakers = speakerLine(track);
      lines.push(
        trackSpeakers
          ? `- ${track.title} (${trackSpeakers})`
          : `- ${track.title}`,
      );
    }
  }
  if (session.requirements?.length)
    lines.push(`Bring: ${session.requirements.join(' ')}`);
  if (session.endStatus === 'provisional') {
    lines.push(
      'The displayed end time is provisional and is not included in this calendar entry.',
    );
  }
  if (session.status === 'tbd')
    lines.push('This activity is still to be confirmed.');
  lines.push(`All times follow Brasília Time (${CALENDAR_TIMEZONE}, UTC−3).`);
  if (options.siteUrl)
    lines.push(`${options.siteUrl}/programme/#${session.id}`);

  return lines.join('\n');
}

function event(
  session: Session,
  venues: VenueRegistry,
  options: CalendarOptions,
) {
  const generated = utcStamp(options.stamp);
  const rows = [
    'BEGIN:VEVENT',
    raw('UID', `${session.id}@time2graze-workshop`),
    raw('DTSTAMP', generated),
    raw('LAST-MODIFIED', generated),
    raw(
      `DTSTART;TZID=${CALENDAR_TIMEZONE}`,
      localStamp(session.date, session.start),
    ),
  ];

  // A provisional end is layout data only. It never becomes calendar data.
  if (session.end && session.endStatus !== 'provisional') {
    rows.push(
      raw(
        `DTEND;TZID=${CALENDAR_TIMEZONE}`,
        localStamp(session.date, session.end),
      ),
    );
  }

  rows.push(text('SUMMARY', summary(session, options.release)));
  rows.push(text('DESCRIPTION', description(session, options)));

  const eventLocation = location(session, venues);
  if (eventLocation) rows.push(text('LOCATION', eventLocation));

  rows.push(raw('CATEGORIES', session.kind.toUpperCase()));
  rows.push(
    raw(
      'STATUS',
      options.release === 'beta' || session.status === 'tbd'
        ? 'TENTATIVE'
        : 'CONFIRMED',
    ),
  );
  if (options.siteUrl)
    rows.push(raw('URL', `${options.siteUrl}/programme/#${session.id}`));
  rows.push('END:VEVENT');
  return rows;
}

export function icsCalendar(
  days: Day[],
  venues: VenueRegistry,
  options: CalendarOptions,
) {
  const rows = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//LAPIG UFG//Time2Graze Brazil Workshop//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    text('X-WR-CALNAME', options.name),
    raw('X-WR-TIMEZONE', CALENDAR_TIMEZONE),
    'REFRESH-INTERVAL;VALUE=DURATION:PT12H',
    'X-PUBLISHED-TTL:PT12H',
    ...VTIMEZONE,
    ...days.flatMap((day) =>
      day.sessions.flatMap((session) => event(session, venues, options)),
    ),
    'END:VCALENDAR',
  ];

  return `${rows.join(CRLF)}${CRLF}`;
}

export function webcalUrl(icsUrl: string) {
  return icsUrl.replace(/^https?:\/\//, 'webcal://');
}
