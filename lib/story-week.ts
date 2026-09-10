import { AGENDA } from '@/data/agenda';
import { VENUES } from '@/data/venues';
import { dayLabel, timeLabel } from '@/lib/schedule';

export type WeekMoment = {
  sessionId: string;
  title: string;
  day: number;
  when: string;
  venue?: string;
  href: string;
};

/**
 * The programme entry an optional story belongs to, resolved from `AGENDA`
 * rather than restated beside it. A story that repeated "Friday, 16:30" in its
 * own copy would be the second place a time lives, and the programme is the
 * only one allowed to hold one.
 *
 * Returns null for a session id that no longer exists, so removing a session
 * silently drops the line instead of shipping a dead deep link. Three of the
 * seven stories declare no session at all, and that is the point: FICA is a
 * June festival and FUNAPE is not a place, so inventing an appointment for
 * them would say something untrue about the week.
 */
export function weekMoment(sessionId: string | undefined): WeekMoment | null {
  if (!sessionId) return null;
  for (const day of AGENDA) {
    const session = day.sessions.find((item) => item.id === sessionId);
    if (!session) continue;
    return {
      sessionId,
      title: session.title,
      day: day.index,
      when: `${dayLabel(session.date)} · ${timeLabel(session)}`,
      venue: session.venueId ? VENUES[session.venueId].name : undefined,
      href: `/programme/#${sessionId}`,
    };
  }
  return null;
}
