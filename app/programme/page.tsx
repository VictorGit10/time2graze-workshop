'use client';

import { useCallback, useEffect, useState } from 'react';
import { AddToCalendar } from '@/components/add-to-calendar';
import { Programme, ProgrammeForPrint } from '@/components/programme';
import { AGENDA } from '@/data/agenda';
import { useTabKeys } from '@/hooks/use-tab-keys';
import { useWorkshopClock } from '@/hooks/use-workshop-clock';
import { dayFromHash, dayFromSessionHash, scrollToDayPanel, scrollToSession } from '@/lib/deep-link';
import { todayIndex } from '@/lib/now';
import { dayLabel, dayShort } from '@/lib/schedule';

function clockLabel(minutes: number) {
  const hour = Math.floor(minutes / 60).toString().padStart(2, '0');
  const minute = (minutes % 60).toString().padStart(2, '0');
  return `${hour}:${minute}`;
}

export default function ProgrammePage() {
  /** What is waiting to be scrolled to, once the day it names has rendered. */
  const [pending, setPending] = useState<{ session: string } | { day: true } | null>(null);
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
        history.scrollRestoration = 'manual';
        setPicked(day);
        setPending({ day: true });
        return;
      }
      const owner = dayFromSessionHash(hash);
      if (owner !== null) {
        // The browser restores the previous scroll position after load, which
        // would land on top of ours. This link decides where the page goes.
        history.scrollRestoration = 'manual';
        setPicked(owner);
        setPending({ session: hash.slice(1) });
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
    if ('session' in pending) scrollToSession(pending.session);
    else scrollToDayPanel();
    // Not cleared: every link produces a fresh object, and it is that identity
    // change that runs this again.
  }, [pending]);

  const onDayKeys = useTabKeys(AGENDA.length, activeDay, selectDay);
  const day = AGENDA[activeDay];
  const currentTime = clock ? clockLabel(clock.minutes) : '—:—';

  return (
    <section className="agenda-section section-pad" id="agenda">
      <div className="section-title programme-title">
        <h1>Daily schedule</h1>
        <p className="programme-clock">
          <span>All times · Brasília Time (UTC−3)</span>
          <time
            dateTime={clock ? `${clock.date}T${currentTime}-03:00` : undefined}
            aria-label={clock ? `Current Brasília time: ${currentTime}` : 'Loading current Brasília time'}
          >
            <small>Now</small>
            {currentTime}
          </time>
        </p>
      </div>

      {/* Paper loses the header and the day tabs, so the printed agenda has to
          say for itself which workshop it belongs to. */}
      <p className="print-only print-heading">
        Time2Graze Brazil Workshop · 14–18 September 2026 · Goiânia, Goiás, Brazil · Brasília Time (UTC−3)
      </p>

      <div className="day-tabs" role="tablist" aria-label="Workshop days" tabIndex={-1} onKeyDown={onDayKeys}>
        {AGENDA.map((item, index) => (
          <button key={item.date} type="button" role="tab" aria-selected={activeDay === index} aria-controls="day-panel" id={`day-tab-${index}`} tabIndex={activeDay === index ? 0 : -1} onClick={() => selectDay(index)}>
            <span>{dayShort(item)}{today === index && <em className="tab-today">Today</em>}</span><strong>{dayLabel(item.date)}</strong><small>{item.label}</small>
          </button>
        ))}
      </div>

      {/* A chave remonta o painel a cada troca de dia, e e a montagem que dispara
          a passagem em .agenda-panel. Programme nao guarda estado proprio, e a
          animacao e so de opacidade: a rolagem de um link de sessao mede este
          mesmo commit e nao pode encontrar o alvo deslocado. */}
      <div className="agenda-panel" key={activeDay} id="day-panel" role="tabpanel" aria-labelledby={`day-tab-${activeDay}`}>
        <aside className="day-summary"><span>{dayShort(day)}</span><p>{dayLabel(day.date)}</p><h3>{day.label}</h3><small>{day.sessions.length} scheduled items</small></aside>
        <Programme day={day} clock={clock} />
      </div>

      <AddToCalendar day={day} />

      <ProgrammeForPrint />
    </section>
  );
}
