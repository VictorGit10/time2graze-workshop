/**
 * Which half of a split session a participant will actually be in.
 *
 * Two sessions run two activities at the same hour — Day 1 at 10:00 and Day 4
 * at 14:00 — and the rooms have to be sized before the day starts. A
 * participant picks one and sends their name; the Apps Script keeps one row
 * per person per session in a private sheet, so changing your mind rewrites
 * that row rather than leaving the organiser two answers to reconcile.
 *
 * Nothing sent here is ever read back on the site: the page shows a reader
 * their own choice from their own browser, never anyone else's, and never a
 * count. Transport and endpoint are shared with calendar sharing and recap
 * flagging — see `lib/apps-script.ts`.
 */

import { appsScriptEnabled, jsonp } from './apps-script';

export const trackChoiceEnabled = appsScriptEnabled;

/** The name travels in a URL, and is the only field the sheet is keyed by. */
export const CHOICE_NAME_MAX = 60;

export type ChoiceStatus =
  /** First answer for this person and session. */
  | 'recorded'
  /** They had already chosen; the row now says something else. */
  | 'changed'
  | 'invalid'
  | 'limit'
  /** Choosing has closed for good — the workshop is over. */
  | 'closed'
  | 'timeout'
  | 'error';

const ANSWERS = ['recorded', 'changed', 'invalid', 'limit', 'closed'];

export async function chooseTrack(
  session: string,
  track: string,
  name: string,
): Promise<ChoiceStatus> {
  const result = await jsonp(
    {
      action: 'choose',
      session,
      track,
      name: name.trim().slice(0, CHOICE_NAME_MAX),
    },
    't2gTrackChoice',
  );
  if (!result.ok) return result.reason;
  return ANSWERS.includes(result.status) ? (result.status as ChoiceStatus) : 'error';
}
