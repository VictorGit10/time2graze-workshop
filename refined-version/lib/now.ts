import type { Day, Session } from '@/data/types';
import { toMinutes } from './schedule';

/** The workshop runs on Goiânia time, whatever time it is where you are. */
const ZONE = 'America/Sao_Paulo';

export type Clock = {
  /** ISO date in the workshop's timezone. */
  date: string;
  /** Minutes since midnight, in the workshop's timezone. */
  minutes: number;
};

const FORMAT = new Intl.DateTimeFormat('en-CA', {
  timeZone: ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});

/**
 * The current date and time in Goiânia. Client-only: the site is prerendered,
 * so "now" cannot exist in the build output.
 */
export function workshopNow(): Clock {
  const parts: Record<string, string> = {};
  for (const p of FORMAT.formatToParts(new Date())) parts[p.type] = p.value;

  // Intl gives 24 for midnight in some engines.
  const hour = Number(parts.hour) % 24;

  return {
    date: `${parts.year}-${parts.month}-${parts.day}`,
    minutes: hour * 60 + Number(parts.minute),
  };
}

/** The day being held today, or null outside the workshop week. */
export function todayIndex(days: Day[], clock: Clock | null) {
  if (!clock) return null;
  const index = days.findIndex((d) => d.date === clock.date);
  return index >= 0 ? index : null;
}

export type SessionState = 'running' | 'next' | null;

/**
 * Only a session with a recorded end can be called running: a start alone
 * would mean guessing when it finishes, which is the one thing this site does
 * not do. Items without an end can still be the next thing due.
 */
export function stateOf(session: Session, clock: Clock | null): SessionState {
  if (!clock || session.date !== clock.date) return null;

  const start = toMinutes(session.start);
  if (session.end) {
    const end = toMinutes(session.end);
    if (clock.minutes >= start && clock.minutes < end) return 'running';
  }
  return null;
}

/** The next item due today, once nothing is running. */
export function nextSessionId(day: Day, clock: Clock | null) {
  if (!clock || day.date !== clock.date) return null;

  const running = day.sessions.some((s) => stateOf(s, clock) === 'running');
  if (running) return null;

  const upcoming = day.sessions
    .filter((s) => toMinutes(s.start) > clock.minutes)
    .sort((a, b) => toMinutes(a.start) - toMinutes(b.start));

  return upcoming[0]?.id ?? null;
}
