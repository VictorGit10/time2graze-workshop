/**
 * Time2Graze Brazil Workshop — calendar automation, web endpoint.
 *
 * The script owns one dedicated calendar (never the organiser's main one).
 * Participants request access from the workshop site; the script shares the
 * calendar with them as readers and Google e-mails the invitation. A daily
 * trigger repopulates the calendar from the workshop's published .ics feed,
 * so every programme change pushed to the site reaches subscribers on its own.
 */

const CALENDAR_NAME = 'Time2Graze Brazil Workshop';
const CALENDAR_DESCRIPTION =
  'Live programme of the Time2Graze Brazil Workshop, LAPIG, Universidade ' +
  'Federal de Goiás, 14–18 September 2026. Synced daily from the official ' +
  'workshop website.';
const CALENDAR_TIME_ZONE = 'America/Sao_Paulo';
const ICS_URL =
  'https://victorgit10.github.io/time2graze-workshop/calendar/time2graze-workshop.ics';
const DAILY_SHARE_LIMIT = 50;

/** The workshop calendar's id, found or created once and then remembered. */
function getWorkshopCalendarId() {
  const props = PropertiesService.getScriptProperties();
  const stored = props.getProperty('CALENDAR_ID');
  if (stored) return stored;

  const existing = CalendarApp.getCalendarsByName(CALENDAR_NAME);
  const calendar = existing.length
    ? existing[0]
    : CalendarApp.createCalendar(CALENDAR_NAME, {
        description: CALENDAR_DESCRIPTION,
        timeZone: CALENDAR_TIME_ZONE,
        color: CalendarApp.Color.GREEN,
      });
  props.setProperty('CALENDAR_ID', calendar.getId());
  console.log('Workshop calendar ready: %s', calendar.getId());
  return calendar.getId();
}

/** Web-app entry point. `action` is `share` (default) or `ping`. */
function doGet(e) {
  const action = String(e.parameter.action || 'share').toLowerCase();
  let payload;
  try {
    if (action === 'ping') {
      payload = {
        status: 'ok',
        calendar: CALENDAR_NAME,
        lastSync: PropertiesService.getScriptProperties()
          .getProperty('LAST_SYNC'),
      };
    } else if (action === 'share') {
      payload = shareCalendar(e.parameter.email);
    } else {
      payload = { status: 'error', message: 'Unknown action.' };
    }
  } catch (err) {
    payload = { status: 'error', message: String(err) };
  }

  const json = JSON.stringify(payload);
  const callback = e.parameter.callback;
  if (callback && /^[A-Za-z_$][\w$]*$/.test(callback)) {
    return ContentService.createTextOutput(`${callback}(${json});`)
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService.createTextOutput(json).setMimeType(
    ContentService.MimeType.JSON,
  );
}

/**
 * Shares the workshop calendar with `rawEmail` as a reader. Google sends the
 * invitation; the participant still has to accept it. Idempotent.
 * Returns `shared`, `already`, `invalid` or `limit`.
 */
function shareCalendar(rawEmail) {
  const email = String(rawEmail || '')
    .trim()
    .toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { status: 'invalid' };
  if (!withinDailyShareLimit()) return { status: 'limit' };

  const calendarId = getWorkshopCalendarId();
  if (hasAccess(calendarId, email)) return { status: 'already' };

  Calendar.Acl.insert(
    { role: 'reader', scope: { type: 'user', value: email } },
    calendarId,
    { sendNotifications: true },
  );
  console.log('Shared calendar with %s', email);
  return { status: 'shared' };
}

function hasAccess(calendarId, email) {
  let pageToken;
  do {
    const page = Calendar.Acl.list(calendarId, {
      maxResults: 100,
      pageToken: pageToken,
    });
    const granted = (page.items || []).some(
      (rule) =>
        rule.scope &&
        rule.scope.type === 'user' &&
        String(rule.scope.value).trim().toLowerCase() === email,
    );
    if (granted) return true;
    pageToken = page.nextPageToken;
  } while (pageToken);
  return false;
}

/** A soft cap so a public endpoint cannot mass-mail invitations. */
function withinDailyShareLimit() {
  const props = PropertiesService.getScriptProperties();
  const today = new Date().toISOString().slice(0, 10);
  if (props.getProperty('SHARE_DAY') !== today) {
    props.setProperty('SHARE_DAY', today);
    props.setProperty('SHARE_COUNT', '0');
  }
  const count = Number(props.getProperty('SHARE_COUNT') || 0);
  if (count >= DAILY_SHARE_LIMIT) return false;
  props.setProperty('SHARE_COUNT', String(count + 1));
  return true;
}

/**
 * Run once from the editor (or via `clasp run`): authorises the script,
 * creates the calendar, performs the first sync and arms the daily trigger.
 */
function setup() {
  const calendarId = getWorkshopCalendarId();
  const sync = syncFromSite();
  const armed = ScriptApp.getProjectTriggers().some(
    (trigger) => trigger.getHandlerFunction() === 'syncFromSite',
  );
  if (!armed) {
    ScriptApp.newTrigger('syncFromSite')
      .timeBased()
      .everyDays(1)
      .atHour(5)
      .create();
  }
  console.log(
    'Setup complete. Calendar %s, sync %s, daily trigger %s.',
    calendarId,
    JSON.stringify(sync),
    armed ? 'already armed' : 'armed',
  );
}