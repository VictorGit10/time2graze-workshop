import Link from 'next/link';
import { ArrowRight, CalendarClock } from 'lucide-react';
import { weekMoment } from '@/lib/story-week';

/**
 * What this subject is in the reader's own week, and a way into the programme.
 *
 * Optional reading earns its place when it pays something back operationally.
 * The time and title are resolved from `AGENDA`, never restated here, so this
 * line cannot disagree with the programme it links to. A story with no session
 * renders nothing rather than an invented appointment.
 */
export function StoryWeekLink({ sessionId, note }: { sessionId?: string; note?: string }) {
  const moment = weekMoment(sessionId);
  if (!moment) return null;
  return (
    <aside className="story-week">
      <p className="story-eyebrow">In your week</p>
      <Link href={moment.href} className="story-week-card">
        <CalendarClock aria-hidden="true" />
        <span>
          <strong>{moment.title}</strong>
          <small>Day {moment.day} · {moment.when}{moment.venue ? ` · ${moment.venue}` : ''}</small>
        </span>
        <span className="story-week-go">Open in the programme <ArrowRight aria-hidden="true" /></span>
      </Link>
      {note && <p className="story-week-note">{note}</p>}
    </aside>
  );
}
