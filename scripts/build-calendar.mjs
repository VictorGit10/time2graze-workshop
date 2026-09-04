/**
 * Generates the workshop and per-day calendar files from the typed agenda.
 * Beta files keep every item tentative and omit provisional end times. The
 * final state refuses to build while any operational field is unresolved.
 */
import { mkdir, rm, stat, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { AGENDA, CALENDAR_RELEASE } from '../data/agenda.ts';
import { VENUES } from '../data/venues.ts';
import { icsCalendar } from '../lib/calendar.ts';

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const outputDirectory = join(projectRoot, 'public', 'calendar');

if (CALENDAR_RELEASE === 'final') {
  const unresolved = AGENDA.flatMap((day) => day.sessions).filter(
    (session) =>
      !session.end ||
      session.endStatus === 'provisional' ||
      session.status === 'tbd' ||
      session.venueId === null,
  );

  if (unresolved.length) {
    throw new Error(
      `calendar: final release blocked by unresolved sessions: ${unresolved.map((session) => session.id).join(', ')}`,
    );
  }
}

await rm(outputDirectory, { recursive: true, force: true });
await mkdir(outputDirectory, { recursive: true });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '');
const stamp = new Date();
const suffix = CALENDAR_RELEASE === 'beta' ? ' · Beta' : '';
const files = [
  {
    name: 'time2graze-workshop.ics',
    title: `Time2Graze Brazil Workshop${suffix}`,
    days: AGENDA,
  },
  ...AGENDA.map((day) => ({
    name: `day-${day.index}.ics`,
    title: `Time2Graze Brazil Workshop · Day ${day.index}${suffix}`,
    days: [day],
  })),
];

for (const file of files) {
  const contents = icsCalendar(file.days, VENUES, {
    name: file.title,
    release: CALENDAR_RELEASE,
    stamp,
    siteUrl,
  });
  const expected = file.days.reduce(
    (total, day) => total + day.sessions.length,
    0,
  );
  const written = (contents.match(/BEGIN:VEVENT/g) ?? []).length;
  if (written !== expected)
    throw new Error(
      `${file.name}: expected ${expected} events, wrote ${written}`,
    );

  const path = join(outputDirectory, file.name);
  await writeFile(path, contents, 'utf8');
  const { size } = await stat(path);
  if (!size) throw new Error(`${file.name}: generated file is empty`);
  console.log(
    `calendar (${CALENDAR_RELEASE}): ${file.name} — ${written} events`,
  );
}
