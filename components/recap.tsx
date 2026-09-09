'use client';

import { CheckCircle2, CircleAlert, Flag, LoaderCircle } from 'lucide-react';
import Link from 'next/link';
import { useState, type SyntheticEvent } from 'react';
import { RECAP_FEEDBACK_CLOSES } from '@/data/recaps';
import type { Day, RecapItem, RecapSection } from '@/data/types';
import { rememberFlagged, useFlagged } from '@/hooks/use-flagged-lines';
import type { Clock } from '@/lib/now';
import {
  formatRecapStamp,
  recapForDay,
  sectionAnchor,
  sectionHeading,
} from '@/lib/recap';
import {
  flagRecapItem,
  NAME_MAX,
  NOTE_MAX,
  recapFeedbackEnabled,
  type FlagStatus,
} from '@/lib/recap-feedback';

const MESSAGES: Record<FlagStatus | 'sending', string> = {
  sending: 'Sending…',
  received:
    'Thank you. This is with the organisers, and the summary is corrected from it.',
  invalid: 'Say what is wrong with this line before sending.',
  limit: 'Corrections have reached today’s limit. Tell an organiser directly.',
  closed: 'Corrections have closed for this workshop.',
  timeout: 'That took too long. Check your connection and try again.',
  error: 'That did not send. Try again, or tell an organiser directly.',
};

/** One line of the recap, and the way to say it is wrong. */
function Item({ item, canFlag }: { item: RecapItem; canFlag: boolean }) {
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState('');
  const [name, setName] = useState('');
  const [state, setState] = useState<FlagStatus | 'sending' | null>(null);
  const sent = useFlagged(item.id);
  const sending = state === 'sending';

  const textId = `recap-${item.id}`;
  const formId = `recap-form-${item.id}`;

  async function send(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending || sent) return;
    setState('sending');
    const status = await flagRecapItem(item.id, note, name);
    setState(status);
    if (status === 'received') rememberFlagged(item.id);
  }

  /* The button says only "Flag": the line it sits on is what gives it meaning,
     so that line describes it rather than being repeated into a label a
     screen reader would then read out twice. */
  return (
    <div className="recap-item" data-flagged={sent || undefined}>
      <p className="recap-text" id={textId}>
        {item.owner && <b className="recap-owner">{item.owner}</b>}
        {item.text}
      </p>

      {canFlag && (
        <button
          type="button"
          className="recap-flag"
          aria-expanded={open}
          aria-controls={open ? formId : undefined}
          aria-describedby={textId}
          onClick={() => setOpen((was) => !was)}
        >
          <Flag aria-hidden="true" />
          {sent ? 'Flagged' : open ? 'Close' : 'Flag'}
        </button>
      )}

      {open && (
        <form
          className="recap-form"
          id={formId}
          onSubmit={send}
          aria-busy={sending}
        >
          <label htmlFor={`${formId}-note`}>What is wrong or missing?</label>
          <textarea
            id={`${formId}-note`}
            required
            rows={3}
            maxLength={NOTE_MAX}
            readOnly={sending || sent}
            value={note}
            onChange={(event) => setNote(event.target.value)}
          />
          <label htmlFor={`${formId}-name`}>Your name (optional)</label>
          <input
            id={`${formId}-name`}
            type="text"
            maxLength={NAME_MAX}
            autoComplete="name"
            readOnly={sending || sent}
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <div className="recap-form-actions">
            <button type="submit" disabled={sending || sent}>
              {sending && (
                <LoaderCircle className="calendar-spinner" aria-hidden="true" />
              )}
              {sending ? 'Sending…' : sent ? 'Sent' : 'Send correction'}
            </button>
            <button type="button" onClick={() => setOpen(false)}>
              {sent ? 'Close' : 'Cancel'}
            </button>
          </div>
          <output
            className="recap-form-status"
            data-state={
              state === 'received'
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
                {state === 'received' ? (
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

function ItemList({
  label,
  items,
  canFlag,
}: {
  label: string;
  items?: RecapItem[];
  canFlag: boolean;
}) {
  if (!items?.length) return null;
  return (
    <div className="recap-list">
      <p className="recap-list-label">{label}</p>
      {items.map((item) => (
        <Item key={item.id} item={item} canFlag={canFlag} />
      ))}
    </div>
  );
}

function Section({
  section,
  canFlag,
}: {
  section: RecapSection;
  canFlag: boolean;
}) {
  const anchor = sectionAnchor(section);
  const heading = sectionHeading(section);

  return (
    <section className="recap-section">
      <h4>
        {anchor ? (
          <Link href={`/programme/#${anchor}`}>{heading}</Link>
        ) : (
          heading
        )}
      </h4>
      {section.summary && (
        <ItemList
          label="What happened"
          items={[section.summary]}
          canFlag={canFlag}
        />
      )}
      <ItemList label="Decisions" items={section.decisions} canFlag={canFlag} />
      <ItemList
        label="Open questions"
        items={section.questions}
        canFlag={canFlag}
      />
      <ItemList label="Actions" items={section.actions} canFlag={canFlag} />
    </section>
  );
}

/**
 * The day's record, published the same evening.
 *
 * A day with no recap still shows the block and says when one is due: that is
 * how a reader learns the record exists at all, and the site never invents a
 * summary for a day it has not been given one for.
 */
export function DayRecap({ day, clock }: { day: Day; clock: Clock | null }) {
  const recap = recapForDay(day.index);
  const canFlag =
    recapFeedbackEnabled &&
    recap !== null &&
    (clock === null || clock.date <= RECAP_FEEDBACK_CLOSES);

  return (
    <section className="recap" aria-labelledby={`recap-day-${day.index}`}>
      <div className="recap-head">
        <h3 id={`recap-day-${day.index}`}>Day {day.index} summary</h3>
        {recap ? (
          <p className="recap-stamp">
            <span>Published {formatRecapStamp(recap.published)}</span>
            {recap.revised && (
              <span className="recap-revised">
                Revised {formatRecapStamp(recap.revised)}
                {recap.corrections
                  ? ` · ${recap.corrections} reader ${
                      recap.corrections === 1 ? 'correction' : 'corrections'
                    } applied`
                  : ''}
              </span>
            )}
          </p>
        ) : (
          <p className="recap-stamp">
            <em>To be published</em>
          </p>
        )}
      </div>

      {recap ? (
        <>
          {canFlag && (
            <p className="recap-invite">
              Something wrong or missing? Flag the line and say why. The summary
              is corrected from what you send.
            </p>
          )}
          <div className="recap-sections">
            {recap.sections.map((section, index) => (
              <Section
                key={section.sessionId ?? `${day.index}-${index}`}
                section={section}
                canFlag={canFlag}
              />
            ))}
          </div>
        </>
      ) : (
        <p className="recap-pending">
          Written up in the evening, from the day&rsquo;s notes and recordings.
        </p>
      )}
    </section>
  );
}
