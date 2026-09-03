'use client';

import { useCallback, useEffect, useState } from 'react';
import { Programme, ProgrammeForPrint } from '@/components/programme';
import { AGENDA } from '@/data/agenda';
import { useTabKeys } from '@/hooks/use-tab-keys';
import { useWorkshopClock } from '@/hooks/use-workshop-clock';
import { dayFromHash, dayFromSessionHash, scrollToSession } from '@/lib/deep-link';
import { todayIndex } from '@/lib/now';
import { dayLabel, dayShort } from '@/lib/schedule';

const SCHEDULED_ITEMS = AGENDA.reduce((total, day) => total + day.sessions.length, 0);
const ITEMS_WITH_END_TIME = AGENDA.reduce(
  (total, day) => total + day.sessions.filter((session) => session.end).length,
  0,
);

export default function ProgrammePage() {
  /** A session waiting to be scrolled to, once its day has actually rendered. */
  const [pending, setPending] = useState<{ id: string } | null>(null);
  const clock = useWorkshopClock();
  const today = todayIndex(AGENDA, clock);

  /**
   * Null until a link or the reader picks a day. The displayed day is derived
   * rather than stored, so during the workshop week the panel follows the
   * clock without an effect having to push it there — and a choice, once made,
   * outranks the clock for good.
   */
  const [picked, setPicked] = useState<number | null>(null);
  const activeDay = picked ?? today ?? 0;

  /** Choosing a day rewrites the hash, so the address bar is always copyable. */
  const selectDay = useCallback((index: number) => {
    setPicked(index);
    history.replaceState(null, '', `#day-${AGENDA[index].index}`);
  }, []);

  /**
   * Deep links. `#day-3` opens that day; a session id opens the day holding it
   * and scrolls to it. Runs on load and whenever the hash changes, so a link
   * pasted into the address bar — or followed from the materials page — works
   * from any state.
   */
  useEffect(() => {
    const apply = () => {
      const hash = location.hash;
      const day = dayFromHash(hash);
      if (day !== null) {
        setPicked(day);
        return;
      }
      const owner = dayFromSessionHash(hash);
      if (owner !== null) {
        // The browser restores the previous scroll position after load, which
        // would land on top of ours. This link decides where the page goes.
        history.scrollRestoration = 'manual';
        setPicked(owner);
        setPending({ id: hash.slice(1) });
      }
    };

    apply();
    addEventListener('hashchange', apply);
    return () => removeEventListener('hashchange', apply);
  }, []);

  /**
   * Scrolling has to wait for the day panel to be in the DOM. An effect runs
   * after the commit; a requestAnimationFrame does not, and looked for the
   * session before React had rendered it.
   */
  useEffect(() => {
    if (!pending) return;
    scrollToSession(pending.id);
    // Not cleared: every link produces a fresh object, and it is that identity
    // change that runs this again.
  }, [pending]);

  const onDayKeys = useTabKeys(AGENDA.length, activeDay, selectDay);
  const day = AGENDA[activeDay];

  return (
    <section className="agenda-section section-pad" id="agenda">
      <div className="section-title split-title">
        <div><p>Programme</p><h1>Daily schedule</h1></div>
        <span>Draft programme · Five working days</span>
      </div>

      <dl className="programme-facts">
        <div><dt>Schedule</dt><dd>{SCHEDULED_ITEMS} items across {AGENDA.length} days</dd></div>
        <div><dt>With end time</dt><dd>{ITEMS_WITH_END_TIME} items with confirmed duration</dd></div>
        <div><dt>Official time</dt><dd>Goiânia · America/Sao_Paulo</dd></div>
        <div><dt>Status</dt><dd><em>Draft programme</em></dd></div>
      </dl>

      {/* Paper loses the header and the day tabs, so the printed agenda has to
          say for itself which workshop it belongs to. */}
      <p className="print-only print-heading">
        Time2Graze Brazil Workshop · 14–18 September 2026 · Goiânia, Goiás, Brazil
      </p>

      <div className="day-tabs" role="tablist" aria-label="Workshop days" tabIndex={-1} onKeyDown={onDayKeys}>
        {AGENDA.map((item, index) => (
          <button key={item.date} type="button" role="tab" aria-selected={activeDay === index} aria-controls="day-panel" id={`day-tab-${index}`} tabIndex={activeDay === index ? 0 : -1} onClick={() => selectDay(index)}>
            <span>{dayShort(item)}{today === index && <em className="tab-today">Today</em>}</span><strong>{dayLabel(item.date)}</strong><small>{item.label}</small>
          </button>
        ))}
      </div>

      <div className="agenda-panel" id="day-panel" role="tabpanel" aria-labelledby={`day-tab-${activeDay}`}>
        <aside className="day-summary"><span>{dayShort(day)}</span><p>{dayLabel(day.date)}</p><h3>{day.label}</h3><small>{day.sessions.length} scheduled items</small></aside>
        <Programme day={day} clock={clock} />
      </div>

      <ProgrammeForPrint />
    </section>
  );
}
