'use client';

import { CalendarPlus } from 'lucide-react';
import { useState } from 'react';
import { CALENDAR_RELEASE } from '@/data/agenda';
import type { Day } from '@/data/types';
import { absoluteUrl, withBasePath } from '@/lib/base-path';
import { webcalUrl } from '@/lib/calendar';
import { dayShort } from '@/lib/schedule';

export function AddToCalendar({ day }: { day: Day }) {
  const workshopFile = '/calendar/time2graze-workshop.ics';
  const publicCalendarUrl = absoluteUrl(workshopFile);
  const beta = CALENDAR_RELEASE === 'beta';
  const [copyState, setCopyState] = useState<'ready' | 'copied' | 'failed'>(
    'ready',
  );

  async function copyCalendarUrl() {
    if (!publicCalendarUrl) return;
    try {
      await navigator.clipboard.writeText(publicCalendarUrl);
      setCopyState('copied');
    } catch {
      setCopyState('failed');
    }
  }

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
        <a
          className="calendar-primary"
          href={withBasePath(workshopFile)}
          download
        >
          Download all five days
        </a>
        <a href={withBasePath(`/calendar/day-${day.index}.ics`)} download>
          {dayShort(day)} only (.ics)
        </a>
        {publicCalendarUrl && (
          <>
            <a href={webcalUrl(publicCalendarUrl)}>Apple Calendar</a>
            <button type="button" onClick={copyCalendarUrl}>
              {copyState === 'copied'
                ? 'Google URL copied'
                : copyState === 'failed'
                  ? 'Could not copy URL'
                  : 'Copy URL for Google'}
            </button>
          </>
        )}
      </div>

      <p className="calendar-note">
        {beta
          ? 'Beta entries are tentative. Provisional end times are omitted; downloaded copies must be imported again after programme updates. Events appear on 14–18 September 2026.'
          : 'All entries use the approved programme in Brasília Time (UTC−3) and appear on 14–18 September 2026.'}
      </p>
      {publicCalendarUrl && (
        <p className="calendar-help">
          Google Calendar: on a computer, copy the URL, then use Other calendars
          → From URL. The subscribed calendar will sync to the mobile app.
        </p>
      )}
    </aside>
  );
}
