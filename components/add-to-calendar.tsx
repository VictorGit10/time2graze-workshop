import { CalendarPlus } from 'lucide-react';
import { AGENDA_APPROVED } from '@/data/agenda';
import type { Day } from '@/data/types';
import { absoluteUrl, withBasePath } from '@/lib/base-path';
import { googleSubscribeUrl, webcalUrl } from '@/lib/calendar';
import { dayShort } from '@/lib/schedule';

/**
 * The calendar actions under the programme.
 *
 * Nothing is offered until the agenda is approved: the page says the action is
 * coming, the way an unpublished file says "To be published". A calendar entry
 * built from a draft would sit uncorrected in thirty phones.
 *
 * The two groups behave differently, and the labels are what say so rather
 * than a paragraph. Downloading is a one-time copy that opens everywhere and
 * needs no account — iOS offers "Add All", Android hands the file to Google
 * Calendar, Outlook imports it. Subscribing points the reader's calendar at
 * the same file, so a later correction reaches them on that service's own
 * refresh schedule.
 */
export function AddToCalendar({ day }: { day: Day }) {
  if (!AGENDA_APPROVED) {
    return (
      <p className="calendar-pending">
        <CalendarPlus aria-hidden="true" />
        Add to calendar — published once the programme is approved.
      </p>
    );
  }

  const whole = '/calendar/time2graze-workshop.ics';
  /* Google and Apple fetch a subscription from their own servers, so this one
     needs the site's public address rather than a path the browser resolves. */
  const subscribe = absoluteUrl(whole);

  return (
    <div className="calendar-actions">
      <p className="calendar-actions-title">
        <CalendarPlus aria-hidden="true" />
        Add to calendar
      </p>

      <div className="calendar-group">
        <p className="calendar-group-label" id="calendar-download">Download</p>
        <ul aria-labelledby="calendar-download">
          <li>
            <a href={withBasePath(whole)} download>Five days (.ics)</a>
          </li>
          <li>
            <a href={withBasePath(`/calendar/day-${day.index}.ics`)} download>
              {dayShort(day)} only (.ics)
            </a>
          </li>
        </ul>
      </div>

      {subscribe && (
        <div className="calendar-group">
          <p className="calendar-group-label" id="calendar-subscribe">Subscribe</p>
          <ul aria-labelledby="calendar-subscribe">
            <li>
              <a href={googleSubscribeUrl(subscribe)} target="_blank" rel="noreferrer">
                Google Calendar
              </a>
            </li>
            <li>
              <a href={webcalUrl(subscribe)}>Apple Calendar</a>
            </li>
          </ul>
        </div>
      )}

      <p className="calendar-note">All times are Goiânia time · America/Sao_Paulo, UTC−3.</p>
    </div>
  );
}
