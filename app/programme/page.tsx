'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { FileText, Printer } from 'lucide-react';
import { AddToCalendar } from '@/components/add-to-calendar';
import { Programme, ProgrammeForPrint } from '@/components/programme';
import { AGENDA } from '@/data/agenda';
import { useTabKeys } from '@/hooks/use-tab-keys';
import { useWorkshopClock } from '@/hooks/use-workshop-clock';
import {
  dayFromHash,
  dayFromSessionHash,
  scrollToDayPanel,
  scrollToSession,
} from '@/lib/deep-link';
import { todayIndex } from '@/lib/now';
import { dayLabel, dayShort } from '@/lib/schedule';
import { materialsByDay, materialDetail } from '@/lib/materials';

function clockLabel(minutes: number) {
  const hour = Math.floor(minutes / 60)
    .toString()
    .padStart(2, '0');
  const minute = (minutes % 60).toString().padStart(2, '0');
  return `${hour}:${minute}`;
}

export default function ProgrammePage() {
  /** What is waiting to be scrolled to, once the day it names has rendered. */
  const [pending, setPending] = useState<
    { session: string } | { day: true } | null
  >(null);
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
  /** Set when a link carries a hash that names no day and no session. */
  const [hashNotFound, setHashNotFound] = useState(false);

  /** Choosing a day rewrites the hash, so the address bar is always copyable. */
  const selectDay = useCallback((index: number) => {
    setPicked(index);
    history.replaceState(null, '', `#day-${AGENDA[index].index}`);
    setHashNotFound(false);
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
        history.scrollRestoration = 'manual';
        setPicked(day);
        setPending({ day: true });
        setHashNotFound(false);
        return;
      }
      const owner = dayFromSessionHash(hash);
      if (owner !== null) {
        // The browser restores the previous scroll position after load, which
        // would land on top of ours. This link decides where the page goes.
        history.scrollRestoration = 'manual';
        setPicked(owner);
        setPending({ session: hash.slice(1) });
        setHashNotFound(false);
        return;
      }
      // A live hash that resolves to nothing — a renamed session, a stale
      // link. The day falls back to the default and the reader is told why,
      // rather than landing somewhere silent and unexplained.
      setHashNotFound(hash.length > 1);
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
    if ('session' in pending) scrollToSession(pending.session);
    else scrollToDayPanel();
    // Not cleared: every link produces a fresh object, and it is that identity
    // change that runs this again.
  }, [pending]);

  const onDayKeys = useTabKeys(AGENDA.length, activeDay, selectDay);
  const day = AGENDA[activeDay];
  const resources =
    materialsByDay().find((group) => group.day.index === day.index)?.entries ??
    [];
  const currentTime = clock ? clockLabel(clock.minutes) : '—:—';

  return (
    <section className="agenda-section section-pad" id="agenda">
      <div className="section-title programme-title">
        <h1>Programme</h1>
        <p className="programme-clock">
          <span>All times · Brasília Time (UTC−3)</span>
          <time
            dateTime={clock ? `${clock.date}T${currentTime}-03:00` : undefined}
            aria-label={
              clock
                ? `Current Brasília time: ${currentTime}`
                : 'Loading current Brasília time'
            }
          >
            <small>Now</small>
            {currentTime}
          </time>
        </p>
      </div>

      <div className="programme-tools">
        <button type="button" onClick={() => window.print()}>
          <Printer aria-hidden="true" />
          Print programme
        </button>
        <Link href={`/materials/#materials-day-${day.index}`}>
          <FileText aria-hidden="true" />
          Day {day.index} materials
        </Link>
      </div>

      {/* Paper loses the header and the day tabs, so the printed agenda has to
          say for itself which workshop it belongs to. */}
      <p className="print-only print-heading">
        Time2Graze Brazil Workshop · 14–18 September 2026 · Goiânia, Goiás,
        Brazil · Brasília Time (UTC−3)
      </p>

      {/* The tablist must not tab-stop: the roving tabindex on the tabs owns
          the group, and a focusable container would add a stop with nothing
          in it. */}
      {/* oxlint-disable-next-line jsx-a11y/interactive-supports-focus */}
      <div
        className="day-tabs"
        role="tablist"
        aria-label="Workshop days"
        onKeyDown={onDayKeys}
      >
        {AGENDA.map((item, index) => (
          /* Anchors, not buttons: the hash is already the source of truth, so a
             real href buys modifier-click, open-in-new-tab and copy-link for
             free while the role keeps the tab semantics intact. The click is
             intercepted so the day switches in place instead of reloading. */
          <a
            key={item.date}
            href={`#day-${item.index}`}
            role="tab"
            aria-label={`${dayShort(item)}, ${dayLabel(item.date)}, ${item.label}${today === index ? ', Today' : ''}`}
            aria-selected={activeDay === index}
            aria-controls="day-panel"
            id={`day-tab-${index}`}
            tabIndex={activeDay === index ? 0 : -1}
            onClick={(e) => {
              if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
              e.preventDefault();
              selectDay(index);
            }}
          >
            <span className="day-tab-desktop">
              {dayShort(item)}
              {today === index && <em className="tab-today">Today</em>}
            </span>
            <strong className="day-tab-desktop">{dayLabel(item.date)}</strong>
            <small className="day-tab-desktop">{item.label}</small>
            <span className="day-tab-mobile" aria-hidden="true">
              {dayLabel(item.date).split(' · ')[0]}
              <b>{Number(item.date.slice(-2))}</b>
              {today === index && <i className="day-today-dot" />}
            </span>
          </a>
        ))}
      </div>

      {hashNotFound && (
        <output className="hash-notice">
          That link doesn&rsquo;t match the current programme. Select a day from
          the tabs.
        </output>
      )}

      {/* A chave remonta o painel a cada troca de dia, e e a montagem que dispara
          a passagem em .agenda-panel. Programme nao guarda estado proprio, e a
          animacao e so de opacidade: a rolagem de um link de sessao mede este
          mesmo commit e nao pode encontrar o alvo deslocado. */}
      <div
        className="agenda-panel"
        key={activeDay}
        id="day-panel"
        role="tabpanel"
        aria-labelledby={`day-tab-${activeDay}`}
      >
        <aside className="day-summary">
          <span>{dayShort(day)}</span>
          <p>{dayLabel(day.date)}</p>
          <h3>{day.label}</h3>
          <small>{day.sessions.length} scheduled items</small>
        </aside>
        <Programme day={day} clock={clock} />
      </div>

      {resources.length > 0 && (
        <details className="programme-resources">
          <summary>
            Materials for Day {day.index}
            <span> · {resources.length} expected files</span>
          </summary>
          <ul>
            {resources.map((entry) => (
              <li key={entry.id}>
                <Link href={`/materials/#${entry.id}`}>
                  {entry.context}
                  <small>
                    {materialDetail(entry)} ·{' '}
                    {entry.material.href ? 'Available' : 'To be published'}
                  </small>
                </Link>
              </li>
            ))}
          </ul>
        </details>
      )}

      <AddToCalendar day={day} />

      <ProgrammeForPrint />
    </section>
  );
}
