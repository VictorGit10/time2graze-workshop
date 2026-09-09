'use client';

import { CheckCircle2, CircleAlert, LoaderCircle } from 'lucide-react';
import { useState, type SyntheticEvent } from 'react';
import { TRACK_CHOICE_CLOSES } from '@/data/agenda';
import type { Day, Session } from '@/data/types';
import { rememberChoice, useChoices } from '@/hooks/use-track-choice';
import type { Clock } from '@/lib/now';
import { presenterLabel, timeLabel, toMinutes } from '@/lib/schedule';
import {
  CHOICE_NAME_MAX,
  chooseTrack,
  type ChoiceStatus,
  trackChoiceEnabled,
} from '@/lib/track-choice';

const MESSAGES: Record<ChoiceStatus | 'sending', string> = {
  sending: 'Sending…',
  recorded: 'Recorded with the organisers.',
  changed: 'Changed. The organisers hold this one instead.',
  invalid: 'Pick one activity and give the name you registered under.',
  limit: 'Choices have reached today’s limit. Tell an organiser directly.',
  closed: 'Choosing has closed for this workshop.',
  timeout: 'That took too long. Check your connection and try again.',
  error: 'That did not send. Try again, or tell an organiser directly.',
};

/** True once the session has started: from then on the room is what it is. */
function started(session: Session, clock: Clock | null) {
  if (!clock) return false;
  if (clock.date !== session.date) return clock.date > session.date;
  return clock.minutes >= toMinutes(session.start);
}

/**
 * One split session, and the answer to it. A choice already sent is shown as
 * a statement rather than a form: the common case is a reader coming back to
 * check what they picked, not to change it.
 */
function SessionChoice({
  session,
  sent,
  remembered,
  editable,
}: {
  session: Session;
  /** The track id already recorded from this browser, if any. */
  sent: string | undefined;
  /** The name the last choice went out under. */
  remembered: string;
  editable: boolean;
}) {
  /* Null until this reader touches the control, so the stored answer — which
     exists only after hydration — is what the fields show until then. */
  const [picked, setPicked] = useState<string | null>(null);
  const [typed, setTyped] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [state, setState] = useState<ChoiceStatus | 'sending' | null>(null);

  const tracks = session.tracks ?? [];
  const selected = picked ?? sent ?? '';
  const name = typed ?? remembered;
  const sending = state === 'sending';
  const chosen = tracks.find((t) => t.id === sent);

  async function send(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending) return;
    setState('sending');
    const status = await chooseTrack(session.id, selected, name);
    setState(status);
    if (status === 'recorded' || status === 'changed') {
      rememberChoice(session.id, selected, name);
      setEditing(false);
    }
  }

  const formId = `split-form-${session.id}`;

  return (
    <div className="split-session" data-answered={chosen ? '' : undefined}>
      <p className="split-when">
        <span className="tl-meta-label">Split session</span>
        <span>{timeLabel(session)}</span>
      </p>

      {chosen && !editing ? (
        <div className="split-answer">
          <p className="split-answer-title">
            <CheckCircle2 aria-hidden="true" />
            <span>
              You are down for <strong>{chosen.title}</strong>
            </span>
          </p>
          {editable && (
            <button type="button" onClick={() => setEditing(true)}>
              Change
            </button>
          )}
        </div>
      ) : (
        <form className="split-form" id={formId} onSubmit={send} aria-busy={sending}>
          <fieldset>
            <legend>Which one will you join?</legend>
            {tracks.map((track) => {
              const presenter = presenterLabel(track);
              return (
                <label className="split-option" key={track.id}>
                  <input
                    type="radio"
                    name={`split-${session.id}`}
                    value={track.id}
                    required
                    checked={selected === track.id}
                    disabled={sending}
                    onChange={() => {
                      setPicked(track.id);
                      setState(null);
                    }}
                  />
                  <span>
                    <strong>{track.title}</strong>
                    {presenter && <small>{presenter}</small>}
                  </span>
                </label>
              );
            })}
          </fieldset>

          <label className="split-name" htmlFor={`${formId}-name`}>
            Your name
          </label>
          <input
            id={`${formId}-name`}
            type="text"
            required
            maxLength={CHOICE_NAME_MAX}
            autoComplete="name"
            readOnly={sending}
            value={name}
            onChange={(event) => {
              setTyped(event.target.value);
              setState(null);
            }}
            aria-invalid={state === 'invalid' || undefined}
          />

          <div className="split-actions">
            <button type="submit" disabled={sending}>
              {sending && <LoaderCircle className="calendar-spinner" aria-hidden="true" />}
              {sending ? 'Sending…' : chosen ? 'Save change' : 'Send choice'}
            </button>
            {chosen && (
              <button type="button" onClick={() => setEditing(false)}>
                Cancel
              </button>
            )}
          </div>

          <output
            className="split-status"
            data-state={
              state === 'recorded' || state === 'changed'
                ? 'success'
                : state && !sending
                  ? 'error'
                  : undefined
            }
            aria-live="polite"
            aria-atomic="true"
          >
            {state && (
              <>
                {state === 'recorded' || state === 'changed' ? (
                  <CheckCircle2 aria-hidden="true" />
                ) : sending ? (
                  <LoaderCircle className="calendar-spinner" aria-hidden="true" />
                ) : (
                  <CircleAlert aria-hidden="true" />
                )}
                <span>{MESSAGES[state]}</span>
              </>
            )}
          </output>
        </form>
      )}
    </div>
  );
}

/**
 * The day's split sessions, and where a participant says which half they will
 * be in. Two activities run at the same hour and the rooms are sized from
 * these answers, so the name is required — a count alone does not tell an
 * organiser who has still not said.
 *
 * It sits outside `.agenda-panel` for the same reason the recap does: that
 * panel is a two-column grid, and a third child would land under the day
 * summary rather than beside it.
 */
export function SplitChoice({ day, clock }: { day: Day; clock: Clock | null }) {
  const { name, picks } = useChoices();
  const open = trackChoiceEnabled
    && (clock === null || clock.date <= TRACK_CHOICE_CLOSES);

  /* Once a session has started, or after choosing closes, it keeps its place
     only to state what this reader picked. A session with neither an open
     window nor an answer is dropped, and a day left with none renders
     nothing — the block never offers a control that has no effect left. */
  const splits = day.sessions
    .filter((s) => s.tracks?.length)
    .map((session) => ({ session, editable: open && !started(session, clock) }))
    .filter(({ session, editable }) => editable || picks[session.id]);

  if (splits.length === 0) return null;

  return (
    <section className="split-choice" aria-labelledby={`split-day-${day.index}`}>
      <div className="split-choice-head">
        <h3 id={`split-day-${day.index}`}>
          Day {day.index} ·{' '}
          {splits.length === 1 ? 'split session' : 'split sessions'}
        </h3>
        <p>
          Two activities run at the same hour. The rooms are sized from who says
          they are coming.
        </p>
      </div>
      {splits.map(({ session, editable }) => (
        <SessionChoice
          key={session.id}
          session={session}
          sent={picks[session.id]}
          remembered={name}
          editable={editable}
        />
      ))}
    </section>
  );
}
