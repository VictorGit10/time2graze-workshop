import { CalendarPlus } from 'lucide-react';
import { CALENDAR_RELEASE } from '@/data/agenda';
import type { Day } from '@/data/types';
import { absoluteUrl, withBasePath } from '@/lib/base-path';
import { googleCalendarUrl } from '@/lib/calendar';
import { dayShort } from '@/lib/schedule';

export function AddToCalendar({ day }: { day: Day }) {
  const workshopFile = '/calendar/time2graze-workshop.ics';
  const publicCalendarUrl = absoluteUrl(workshopFile);
  const beta = CALENDAR_RELEASE === 'beta';

  return (
    <aside
      className="calendar-actions"
      aria-labelledby="calendar-actions-title"
    >
      <div className="calendar-intro">
        <CalendarPlus aria-hidden="true" />
        <div>
          <p id="calendar-actions-title">
            Add to calendar
            {beta && <em>Beta</em>}
          </p>
          <span>
            {beta
              ? 'The programme may still change.'
              : 'The approved workshop programme.'}
          </span>
        </div>
      </div>

      <div className="calendar-links">
        {publicCalendarUrl && (
          <a
            className="calendar-primary"
            href={googleCalendarUrl(publicCalendarUrl)}
            target="_blank"
            rel="noreferrer"
          >
            Add all five days
          </a>
        )}
        <a
          className={publicCalendarUrl ? undefined : 'calendar-primary'}
          href={withBasePath(workshopFile)}
          download
        >
          All five days (.ics)
        </a>
        <a href={withBasePath(`/calendar/day-${day.index}.ics`)} download>
          {dayShort(day)} only (.ics)
        </a>
      </div>

      <p className="calendar-note">
        {beta
          ? 'Beta entries are tentative. Provisional end times are omitted; download again after programme updates.'
          : 'All entries use the approved programme in Brasília Time (UTC−3).'}
      </p>
    </aside>
  );
}
