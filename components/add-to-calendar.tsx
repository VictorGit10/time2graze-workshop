'use client';

import { CalendarPlus } from 'lucide-react';
import { useState, type SyntheticEvent } from 'react';
import { CALENDAR_RELEASE } from '@/data/agenda';
import type { Day } from '@/data/types';
import { absoluteUrl, withBasePath } from '@/lib/base-path';
import { webcalUrl } from '@/lib/calendar';
import {
  calendarShareEnabled,
  requestCalendarAccess,
  type ShareStatus,
} from '@/lib/calendar-sharing';
import { dayShort } from '@/lib/schedule';

export function AddToCalendar({ day }: { day: Day }) {
  const workshopFile = '/calendar/time2graze-workshop.ics';
  const publicCalendarUrl = absoluteUrl(workshopFile);
  const beta = CALENDAR_RELEASE === 'beta';
  const [copyState, setCopyState] = useState<'ready' | 'copied' | 'failed'>(
    'ready',
  );
  const [shareState, setShareState] = useState<ShareStatus | 'sending' | null>(
    null,
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

  async function requestAccess(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = new FormData(event.currentTarget).get('email');
    if (typeof email !== 'string') return;
    setShareState('sending');
    setShareState(await requestCalendarAccess(email.trim()));
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
      {calendarShareEnabled && (
        <form className="calendar-share" onSubmit={requestAccess}>
          <div>
            <p>Or get the live calendar by email</p>
            <span>
              {beta
                ? 'Google shares the workshop calendar with your account and e-mails the invitation; accept it once and every programme update reaches you without importing again.'
                : 'Google shares the approved workshop calendar with your account and e-mails the invitation; accept it once and any later change reaches you without importing again.'}
            </span>
          </div>
          <div className="calendar-share-field">
            <input
              type="email"
              name="email"
              autoComplete="email"
              required
              placeholder="name@example.org"
              aria-label="Your e-mail address"
            />
            <button type="submit" disabled={shareState === 'sending'}>
              {shareState === 'sending' ? 'Requesting…' : 'Request access'}
            </button>
          </div>
          <output className="calendar-share-status">
            {shareState === 'shared' &&
              'Access requested. Accept the invitation from Google Calendar in your inbox and the five days appear in your account.'}
            {shareState === 'already' &&
              'This address already has access. Open Google Calendar and accept the invitation if you have not yet.'}
            {shareState === 'invalid' && 'Enter a valid e-mail address.'}
            {shareState === 'limit' &&
              'The request could not be sent today. Use the download above, or try again tomorrow.'}
            {shareState === 'error' &&
              'The request could not be sent. Use the download above, or try again.'}
          </output>
        </form>
      )}
    </aside>
  );
}
