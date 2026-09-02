import { AGENDA } from '@/data/agenda';
import type { Session } from '@/data/types';
import { sessionTitle, shortDate, timeLabel } from './schedule';

/**
 * The meals and movements the practical page lists, read out of the agenda.
 *
 * There is no second list to keep in step: the agenda is the single source,
 * and these lines change when it changes. Meals carry their venue inside the
 * agenda line ("Lunch @ Samauma"); movements carry their time, because a
 * participant catches a bus, not a session.
 */

/** One row of the list: the days it covers, and what happens on each of them. */
export type DayLines = { day: string; lines: string[] };

const MEAL_KINDS = new Set(['meal', 'social']);
const MOVEMENT_KINDS = new Set(['transport', 'field']);

function linesOf(kinds: Set<string>, withTime: boolean): DayLines[] {
  const days = AGENDA.map((day) => ({
    date: day.date,
    lines: day.sessions
      .filter((s): s is Session => kinds.has(s.kind))
      .map((s) => (withTime ? `${timeLabel(s)} · ${sessionTitle(s)}` : sessionTitle(s))),
  })).filter((d) => d.lines.length > 0);

  // Consecutive days with identical lines share one row ("15–16 Sep"), which
  // is the compact form a hand-written list would have used anyway.
  const rows: { dates: string[]; lines: string[] }[] = [];
  for (const day of days) {
    const last = rows.at(-1);
    if (last && last.lines.join(' ') === day.lines.join(' ')) {
      last.dates.push(day.date);
    } else {
      rows.push({ dates: [day.date], lines: day.lines });
    }
  }

  return rows.map((row) => ({
    day: row.dates.length === 1
      ? shortDate(row.dates[0])
      // '15 Sep' + '16 Sep' -> '15–16 Sep'
      : `${shortDate(row.dates[0]).split(' ')[0]}–${shortDate(row.dates.at(-1) ?? row.dates[0])}`,
    lines: row.lines,
  }));
}

/** Where participants eat and raise a glass, by day. */
export function mealsByDay(): DayLines[] {
  return linesOf(MEAL_KINDS, false);
}

/** Where the workshop takes them, by day — with the times that catch a bus. */
export function movementsByDay(): DayLines[] {
  return linesOf(MOVEMENT_KINDS, true);
}