/**
 * Writes the programme's `.ics` files into `public/calendar/`, from the same
 * agenda the pages render. Runs out of `prebuild` and `predev`, so the files
 * are generated rather than maintained by hand and can never drift from
 * `data/agenda.ts`.
 *
 * Nothing is written while the agenda is unapproved: a calendar built from a
 * draft programme puts provisional times into thirty phones, where nobody
 * goes back to re-check them. `AGENDA_APPROVED` in `data/agenda.ts` is the
 * single gate, and this script clears the directory when it is off so a file
 * from an earlier build cannot survive as a live URL.
 *
 * Node loads `data/` and `lib/` directly here, stripping the types. That is
 * why `lib/calendar.ts` keeps every import type-only: the `@/` alias is a
 * bundler feature and does not exist in this process.
 */
import { mkdir, rm, stat, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { AGENDA, AGENDA_APPROVED } from '../data/agenda.ts';
import { VENUES } from '../data/venues.ts';
import { icsCalendar } from '../lib/calendar.ts';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'public', 'calendar');

if (!AGENDA_APPROVED) {
  await rm(outDir, { recursive: true, force: true });
  console.log('calendar: agenda not approved — no .ics written (AGENDA_APPROVED in data/agenda.ts).');
  process.exit(0);
}

/** Absent under `npm run dev`; the events then carry no link back. */
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '');
const stamp = new Date();

const files = [
  {
    name: 'time2graze-workshop.ics',
    title: 'Time2Graze Brazil Workshop',
    days: AGENDA,
  },
  ...AGENDA.map((day) => ({
    name: `day-${day.index}.ics`,
    title: `Time2Graze Brazil Workshop · Day ${day.index}`,
    days: [day],
  })),
];

await mkdir(outDir, { recursive: true });

for (const file of files) {
  const ics = icsCalendar(file.days, VENUES, { name: file.title, stamp, siteUrl });
  const path = join(outDir, file.name);

  // A silent 404 or a short calendar is exactly the failure this site cannot
  // afford, so the build proves what it wrote rather than assuming it.
  const expected = file.days.reduce((n, day) => n + day.sessions.length, 0);
  const written = (ics.match(/BEGIN:VEVENT/g) ?? []).length;
  if (written !== expected) {
    throw new Error(`${file.name}: ${written} events written for ${expected} scheduled items`);
  }

  await writeFile(path, ics, 'utf8');
  const { size } = await stat(path);
  if (size === 0) throw new Error(`${file.name}: written empty`);

  console.log(`calendar: ${file.name} — ${written} events, ${size} bytes`);
}
