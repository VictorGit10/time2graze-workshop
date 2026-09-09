/**
 * Reader corrections to the daily recaps.
 *
 * The site publishes each day's recap as a list of numbered lines. A reader
 * who thinks one is wrong or incomplete flags it and says why; this appends
 * that to a private spreadsheet the organiser reads before revising the recap.
 *
 * Nothing written here is ever read back by the site. The endpoint is public
 * and anonymous, like calendar sharing, so it is bounded on three sides: the
 * item id has to name a real line, the volume is capped per day, and the whole
 * thing closes for good after the workshop.
 */

const FLAG_SHEET_NAME = 'Time2Graze recap corrections';
const FLAG_HEADER = [
  'Received (Goiânia)',
  'Day',
  'Item',
  'What the reader says',
  'Name',
  'Applied',
];
/** Last day flagging is accepted, in the workshop's timezone. */
const FLAG_CLOSES = '2026-09-21';
const DAILY_FLAG_LIMIT = 200;
const FLAG_NOTE_MAX = 400;
const FLAG_NAME_MAX = 60;
/** `d3-r7`: the day, then a serial. Mirrors data/recaps.ts. */
const FLAG_ITEM_PATTERN = /^d[1-5]-r\d{1,3}$/;

/**
 * Records one flag. Returns `received`, `invalid`, `limit` or `closed`.
 *
 * `closed` is deliberately distinct from `invalid`: after the workshop the
 * site still renders the recaps, and a reader who reaches the endpoint anyway
 * should be told the window has shut rather than that their note was malformed.
 */
function recordFlag(params) {
  const item = String(params.item || '').trim();
  const note = String(params.note || '').trim().slice(0, FLAG_NOTE_MAX);
  const name = String(params.name || '').trim().slice(0, FLAG_NAME_MAX);

  if (!flagWindowOpen()) return { status: 'closed' };
  if (!FLAG_ITEM_PATTERN.test(item) || note.length === 0) {
    return { status: 'invalid' };
  }
  if (!withinDailyFlagLimit()) return { status: 'limit' };

  const sheet = getFlagSheet();
  sheet.appendRow([
    Utilities.formatDate(new Date(), CALENDAR_TIME_ZONE, 'yyyy-MM-dd HH:mm'),
    item.slice(0, item.indexOf('-')),
    item,
    note,
    name,
    '',
  ]);
  console.log('recap flag: %s (%s chars)', item, note.length);
  return { status: 'received' };
}

/** True until the end of FLAG_CLOSES, read in the workshop's timezone. */
function flagWindowOpen() {
  const today = Utilities.formatDate(
    new Date(),
    CALENDAR_TIME_ZONE,
    'yyyy-MM-dd',
  );
  return today <= FLAG_CLOSES;
}

/**
 * The corrections sheet, created once and then remembered. It is private to
 * the account running the script: a reader saying a line is wrong is writing
 * to the organiser, not publishing a comment.
 */
function getFlagSheet() {
  const props = PropertiesService.getScriptProperties();
  const stored = props.getProperty('FLAG_SHEET_ID');
  if (stored) return SpreadsheetApp.openById(stored).getSheets()[0];

  const spreadsheet = SpreadsheetApp.create(FLAG_SHEET_NAME);
  const sheet = spreadsheet.getSheets()[0];
  sheet.appendRow(FLAG_HEADER);
  sheet.getRange(1, 1, 1, FLAG_HEADER.length).setFontWeight('bold');
  sheet.setFrozenRows(1);
  sheet.setColumnWidth(4, 520);
  props.setProperty('FLAG_SHEET_ID', spreadsheet.getId());
  console.log('recap corrections sheet: %s', spreadsheet.getUrl());
  return sheet;
}

/** A soft cap so a public endpoint cannot be used to fill the sheet. */
function withinDailyFlagLimit() {
  const props = PropertiesService.getScriptProperties();
  const today = new Date().toISOString().slice(0, 10);
  if (props.getProperty('FLAG_DAY') !== today) {
    props.setProperty('FLAG_DAY', today);
    props.setProperty('FLAG_COUNT', '0');
  }
  const count = Number(props.getProperty('FLAG_COUNT') || 0);
  if (count >= DAILY_FLAG_LIMIT) return false;
  props.setProperty('FLAG_COUNT', String(count + 1));
  return true;
}

/** Run from the editor when you want the sheet's address. */
function flagSheetUrl() {
  const url = getFlagSheet().getParent().getUrl();
  console.log(url);
  return url;
}
