/**
 * Reader corrections to a daily recap.
 *
 * A participant flags one line and says what is wrong with it. The Apps Script
 * appends that to a private sheet the organiser reads in the evening; nothing
 * a reader writes is ever shown back on the site. Transport and endpoint are
 * shared with calendar sharing — see `lib/apps-script.ts`.
 */

import { appsScriptEnabled, jsonp } from './apps-script';

export const recapFeedbackEnabled = appsScriptEnabled;

/** The note travels in a URL, so it is capped well inside a safe GET length. */
export const NOTE_MAX = 400;
export const NAME_MAX = 60;

export type FlagStatus =
  | 'received'
  | 'invalid'
  | 'limit'
  /** Flagging has closed for good — the workshop is over. */
  | 'closed'
  | 'timeout'
  | 'error';

const ANSWERS = ['received', 'invalid', 'limit', 'closed'];

export async function flagRecapItem(
  item: string,
  note: string,
  name: string,
): Promise<FlagStatus> {
  const params: Record<string, string> = {
    action: 'flag',
    item,
    note: note.trim().slice(0, NOTE_MAX),
  };
  const from = name.trim().slice(0, NAME_MAX);
  if (from) params.name = from;

  const result = await jsonp(params, 't2gRecapFlag');
  if (!result.ok) return result.reason;
  return ANSWERS.includes(result.status) ? (result.status as FlagStatus) : 'error';
}
