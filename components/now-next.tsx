'use client';

import Link from 'next/link';
import { AGENDA } from '@/data/agenda';
import { useWorkshopClock } from '@/hooks/use-workshop-clock';
import { nextSessionId, stateOf, todayIndex } from '@/lib/now';
import { dayLabel, sessionTitle, timeLabel } from '@/lib/schedule';

/**
 * What is happening right now, on the home page, during the workshop week.
 *
 * It renders nothing outside those five days, and nothing once the last item
 * of a day has started: an empty band is honest, a stale one is not. Only one
 * state can appear, since `nextSessionId` stands down while a session runs.
 */
export function NowNext() {
  const clock = useWorkshopClock();
  const today = todayIndex(AGENDA, clock);
  if (!clock || today === null) return null;

  const day = AGENDA[today];
  const running = day.sessions.find((s) => stateOf(s, clock) === 'running');
  const nextId = nextSessionId(day, clock);
  const session = running ?? day.sessions.find((s) => s.id === nextId);
  if (!session) return null;

  return (
    <aside className="now-band" aria-label="Happening today">
      <p className="now-band-day">Day {day.index} · {dayLabel(day.date)}</p>
      <p className="now-band-item">
        <span className={running ? 'tl-mark' : 'tl-mark tl-mark--next'}>
          {running ? 'Now' : 'Next'}
        </span>
        <span className="now-band-time">{timeLabel(session)}</span>
        <Link href={`/programme/#${session.id}`}>{sessionTitle(session)}</Link>
      </p>
    </aside>
  );
}
