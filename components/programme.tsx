import { Clock3 } from 'lucide-react';
import type { Day, Session, Track } from '@/data/types';
import { VENUES } from '@/data/venues';
import {
  axisBounds, axisTicks, durationOf, isEvening, sessionTitle, timeLabel, toMinutes,
} from '@/lib/schedule';

/** Minutes offset from the top of the axis, as a CSS custom property. */
function offset(session: Session, from: number) {
  return { '--start': toMinutes(session.start) - from } as React.CSSProperties;
}

function span(session: Session, from: number) {
  return {
    '--start': toMinutes(session.start) - from,
    '--dur': durationOf(session) ?? 0,
  } as React.CSSProperties;
}

function venueOf(session: Session) {
  return session.venueId ? VENUES[session.venueId].short : null;
}

function speakerOf(item: Session | Track) {
  if (!item.speakers) return null;
  return item.speakers.map((s) => (s.org ? `${s.name}/${s.org}` : s.name)).join(' and ');
}

/** One activity inside a split session. */
function TrackCard({ track }: { track: Track }) {
  return (
    <div className="tl-track">
      <p className="tl-track-title">{track.title}</p>
      {speakerOf(track) && <p className="tl-who">{speakerOf(track)}</p>}
    </div>
  );
}

/**
 * A session whose start and end are both recorded: drawn as a block whose
 * height is its real duration.
 */
function Block({ session, from }: { session: Session; from: number }) {
  const venue = venueOf(session);
  const who = speakerOf(session);
  /* Under 45 minutes there is no room to stack time, title and venue, so the
     block lays them out on one row instead of clipping them. */
  const compact = (durationOf(session) ?? 0) < 45;

  return (
    <article
      className="tl-block"
      data-session={session.id}
      data-kind={session.kind}
      data-compact={compact || undefined}
      style={span(session, from)}
    >
      <p className="tl-time">{timeLabel(session)}</p>

      <div className="tl-block-body">
        {session.tracks ? (
          <>
            <p className="tl-split-label">Split session · choose one</p>
            <div className="tl-tracks">
              {session.tracks.map((t) => <TrackCard key={t.id} track={t} />)}
            </div>
          </>
        ) : (
          <>
            <h4 className="tl-title">{session.title}</h4>
            {who && <p className="tl-who">{who}</p>}
          </>
        )}

        {(venue || session.status === 'tbd') && (
          <p className="tl-block-meta">
            {venue && <span className="tl-where">{venue}</span>}
            {session.status === 'tbd' && <em className="tl-tbd">To be confirmed</em>}
          </p>
        )}
      </div>
    </article>
  );
}

/**
 * A session with a start and no recorded end. Drawn as a mark on the axis and
 * given no height, so the page never implies a duration nobody has set.
 */
function Point({ session, from }: { session: Session; from: number }) {
  const venue = venueOf(session);

  return (
    <div
      className="tl-point"
      data-session={session.id}
      data-kind={session.kind}
      style={offset(session, from)}
    >
      <span className="tl-dot" aria-hidden="true" />
      <p className="tl-time">{session.start}</p>
      <p className="tl-point-title">
        {session.title}
        {venue && <span className="tl-where"> · {venue}</span>}
      </p>
    </div>
  );
}

/** The proportional grid. Large screens only — see the list below. */
function Timeline({ day }: { day: Day }) {
  const { from, to } = axisBounds(day);
  const daytime = day.sessions.filter((s) => !isEvening(s));
  const ticks = axisTicks(day);
  const height = { '--span': to - from } as React.CSSProperties;

  return (
    <div className="timeline" style={height} aria-hidden="true">
      <div className="tl-axis">
        {ticks.map((t) => (
          <span
            key={t.minutes}
            className="tl-tick"
            data-hour={t.onTheHour || undefined}
            style={{ '--start': t.minutes - from } as React.CSSProperties}
          >
            {t.onTheHour ? t.label : ''}
          </span>
        ))}
      </div>

      <div className="tl-body">
        {ticks.map((t) => (
          <i
            key={t.minutes}
            className="tl-rule"
            data-hour={t.onTheHour || undefined}
            style={{ '--start': t.minutes - from } as React.CSSProperties}
          />
        ))}
        {daytime.map((s) =>
          s.end
            ? <Block key={s.id} session={s} from={from} />
            : <Point key={s.id} session={s} from={from} />
        )}
      </div>
    </div>
  );
}

/**
 * The chronological list. It carries the same information without the
 * proportional axis, and is what small screens and print use — forcing the
 * diagram into 375px would turn the signature into an obstacle.
 */
function List({ sessions }: { sessions: Session[] }) {
  return (
    <ol className="session-list">
      {sessions.map((session) => {
        const venue = venueOf(session);
        const who = speakerOf(session);

        return (
          <li className="session" key={session.id} data-session={session.id}>
            <p className="session-time">
              <Clock3 aria-hidden="true" />
              <span>{timeLabel(session)}</span>
            </p>

            <div className="session-body">
              {session.tracks ? (
                <>
                  <p className="tl-split-label">Split session · choose one</p>
                  <ul className="session-tracks">
                    {session.tracks.map((t) => (
                      <li key={t.id}>
                        <strong>{t.title}</strong>
                        {speakerOf(t) && <span className="tl-who">{speakerOf(t)}</span>}
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <>
                  <h4>{session.title}</h4>
                  {who && <p className="tl-who">{who}</p>}
                </>
              )}

              <p className="session-meta">
                {venue && <span className="tl-where">{venue}</span>}
                {session.status === 'tbd' && <em className="tl-tbd">To be confirmed</em>}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export function Programme({ day }: { day: Day }) {
  const evening = day.sessions.filter(isEvening);

  return (
    <div className="programme">
      <Timeline day={day} />

      {evening.length > 0 && (
        <section className="tl-evening" aria-hidden="true">
          <h4 className="tl-evening-title">Evening</h4>
          <div className="tl-evening-items">
            {evening.map((s) => (
              <p key={s.id} data-session={s.id}>
                <span className="tl-time">{timeLabel(s)}</span>
                {sessionTitle(s)}
              </p>
            ))}
          </div>
        </section>
      )}

      {/* The same day as a list: the only version small screens and print show,
          and the one assistive technology reads. */}
      <List sessions={day.sessions} />
    </div>
  );
}
