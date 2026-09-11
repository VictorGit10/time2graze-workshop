/**
 * When a split session is still open to be answered.
 *
 * Three surfaces need the same answer to that question — the chip on the
 * programme, the notice above the day and the form below it — and they must
 * never disagree: a day that says "choose one" over a form that has already
 * closed is worse than saying nothing. It lives here rather than in
 * `lib/track-choice.ts` because that module is the transport and is loaded in
 * a bare VM by `scripts/apps-script-fixture.mjs`, which resolves no `@/`
 * imports.
 */

import { TRACK_CHOICE_CLOSES } from '@/data/agenda';
import type { Day, Session } from '@/data/types';
import type { Clock } from './now';
import { toMinutes } from './schedule';
import { trackChoiceEnabled } from './track-choice';

/** The day's parallel-activity sessions, in programme order. */
export function splitSessions(day: Day) {
  return day.sessions.filter((s) => s.tracks?.length);
}

/**
 * True while an answer would still mean something: the endpoint exists, the
 * workshop has not passed the closing date, and the session has not started —
 * once it has, the room is what it is.
 */
export function choosingOpen(session: Session, clock: Clock | null) {
  if (!trackChoiceEnabled) return false;
  if (!clock) return true;
  if (clock.date > TRACK_CHOICE_CLOSES) return false;
  if (clock.date !== session.date) return clock.date < session.date;
  return clock.minutes < toMinutes(session.start);
}

/**
 * The anchor the day's chooser answers to. One function so the notice above
 * the programme and the block below it can never disagree about it.
 */
export function splitAnchor(day: Day) {
  return `split-day-${day.index}`;
}
