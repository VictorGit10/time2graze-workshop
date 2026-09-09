import type { DayRecap } from './types';

/**
 * The daily recaps, keyed by `Day.index`.
 *
 * One entry is added each evening of the workshop week, after the day's
 * summary session, from the notes and recordings — see `docs/daily-recap.md`
 * for the whole procedure, which is the only place this file should be
 * edited from. A day with no entry renders as "to be published"; nothing here
 * is ever written ahead of the day it describes.
 *
 * Item ids are `d<day>-r<serial>`, unique within the day and never reused.
 * `scripts/recap.test.mjs` enforces both, and that every `sessionId` names a
 * real session or track — a recap block pointing at nothing would render a
 * heading with a dead link.
 */
export const RECAPS: Record<number, DayRecap> = {};

/**
 * Reader flagging closes at the end of this day (America/Sao_Paulo). After it
 * the recaps stay readable and the controls come off, so a public write
 * endpoint is not left open on a site nobody is watching any more. The Apps
 * Script enforces the same date — this constant only stops the site offering
 * a control that would be refused.
 */
export const RECAP_FEEDBACK_CLOSES = '2026-09-21';
