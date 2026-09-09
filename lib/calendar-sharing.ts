/**
 * Google Calendar access requests for the live workshop calendar.
 *
 * The endpoint is an Apps Script web app deployed with "execute as owner";
 * it shares the workshop calendar with the address as a reader and Google
 * sends the invitation. The transport and the endpoint URL live in
 * `lib/apps-script.ts`, which explains why this is JSONP.
 */

import { appsScriptEnabled, jsonp } from './apps-script';

export const calendarShareEnabled = appsScriptEnabled;

export type ShareStatus =
  | 'shared'
  | 'already'
  | 'invalid'
  | 'limit'
  | 'timeout'
  | 'error';

const ANSWERS = ['shared', 'already', 'invalid', 'limit'];

export async function requestCalendarAccess(email: string): Promise<ShareStatus> {
  const result = await jsonp({ action: 'share', email }, 't2gCalendarShare');
  if (!result.ok) return result.reason;
  return ANSWERS.includes(result.status) ? (result.status as ShareStatus) : 'error';
}
