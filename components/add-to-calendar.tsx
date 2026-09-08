'use client';

import { CheckCircle2, CircleAlert, Download, LoaderCircle } from 'lucide-react';
import { useRef, useState, type SyntheticEvent } from 'react';
import { CALENDAR_RELEASE } from '@/data/agenda';
import { withBasePath } from '@/lib/base-path';
import { calendarShareEnabled, requestCalendarAccess, type ShareStatus } from '@/lib/calendar-sharing';

export function AddToCalendar() {
  const [email, setEmail] = useState('');
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [state, setState] = useState<ShareStatus | 'sending' | null>(null);
  const inFlight = useRef(false);
  const sending = state === 'sending';
  const success = state === 'shared' || state === 'already';
  const failed = state === 'invalid' || state === 'limit' || state === 'error' || state === 'timeout';

  async function requestAccess(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current || success) return;
    inFlight.current = true;
    const address = email.trim();
    setSubmittedEmail(address);
    setState('sending');
    try {
      setState(await requestCalendarAccess(address));
    } catch {
      setState('error');
    } finally {
      inFlight.current = false;
    }
  }

  const messages = {
    sending: 'Sending your calendar invitation…',
    shared: `Invitation sent to ${submittedEmail}. Accept the invitation from Google Calendar in your inbox.`,
    already: `${submittedEmail} already has access. Check your Google Calendar or the original invitation in your inbox.`,
    invalid: 'Enter a valid email address and try again.',
    limit: 'Invitations have reached today’s limit. Download the programme below or try again tomorrow.',
    error: 'We could not confirm your invitation. Check your inbox, try again or download the programme below.',
    timeout: 'This is taking longer than expected. Check your inbox before trying again, or download the programme below.',
  };
  const StatusIcon = sending ? LoaderCircle : success ? CheckCircle2 : CircleAlert;

  return (
    <aside className="calendar-actions" id="calendar" aria-labelledby="calendar-actions-title">
      <div className="calendar-intro">
        <h2 id="calendar-actions-title">Add to calendar</h2>
        <p id="calendar-help">
          {calendarShareEnabled
            ? 'Get the Google Calendar invitation by email. Programme updates sync automatically.'
            : 'Download all five days for your calendar.'}
          {CALENDAR_RELEASE === 'beta' && ' This programme is provisional.'}
        </p>
      </div>
      {calendarShareEnabled && (
        <form className="calendar-share" onSubmit={requestAccess} aria-busy={sending}>
          <label htmlFor="calendar-email">Email address</label>
          <div className="calendar-share-field">
            <input
              id="calendar-email"
              type="email"
              name="email"
              autoComplete="email"
              autoCapitalize="none"
              spellCheck={false}
              required
              readOnly={sending}
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setState(null);
              }}
              placeholder="name@example.org"
              aria-describedby="calendar-help calendar-share-status"
              aria-invalid={state === 'invalid' || undefined}
            />
            <button type="submit" disabled={sending || success}>
              {sending && <LoaderCircle className="calendar-spinner" aria-hidden="true" />}
              {sending ? 'Sending…' : success ? 'Access granted' : failed ? 'Try again' : 'Send invitation'}
            </button>
          </div>
        </form>
      )}
      <output
        id="calendar-share-status"
        className="calendar-share-status"
        data-state={sending ? 'sending' : success ? 'success' : failed ? 'error' : undefined}
        aria-live="polite"
        aria-atomic="true"
      >
        {state && <><StatusIcon className={sending ? 'calendar-spinner' : undefined} aria-hidden="true" /><span>{messages[state]}</span></>}
      </output>
      <a className="calendar-download" href={withBasePath('/calendar/time2graze-workshop.ics')} download>
        <Download aria-hidden="true" /> Download programme (.ics)
      </a>
    </aside>
  );
}
