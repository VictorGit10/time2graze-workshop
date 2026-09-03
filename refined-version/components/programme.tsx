import { ClockIcon } from '@phosphor-icons/react';
import { AGENDA } from '@/data/agenda';
import type { Day, Session, Track } from '@/data/types';
import { VENUES } from '@/data/venues';
import { type Clock, nextSessionId, stateOf } from '@/lib/now';
import {
  axisBounds, axisTicks, dayLabel, durationOf, fromMinutes, isEvening, sessionTitle,
  timeLabel, toMinutes,
} from '@/lib/schedule';

type SessionMark = 'running' | 'next' | null;

/** "Now" while a session is running, "Next" for the one due after it. */
function Mark({ state }: { state: SessionMark }) {
  if (!state) return null;
  return (
    <span className={state === 'next' ? 'tl-mark tl-mark--next' : 'tl-mark'}>
      {state === 'next' ? 'Next' : 'Now'}
    </span>
  );
}

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
function Block(
  { session, from, state }: { session: Session; from: number; state: SessionMark },
) {
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
      data-state={state ?? undefined}
      style={span(session, from)}
    >
      <p className="tl-time">{timeLabel(session)}</p>

      <div className="tl-block-body">
        {session.tracks ? (
          <>
            <p className="tl-split-label">
              Split session · choose one
              <Mark state={state} />
            </p>
            <div className="tl-tracks">
              {session.tracks.map((t) => <TrackCard key={t.id} track={t} />)}
            </div>
          </>
        ) : (
          <>
            <h4 className="tl-title">
              {session.title}
              <Mark state={state} />
            </h4>
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
function Point(
  { session, from, state }: { session: Session; from: number; state: SessionMark },
) {
  const venue = venueOf(session);

  return (
    <div
      className="tl-point"
      data-session={session.id}
      data-kind={session.kind}
      data-state={state ?? undefined}
      style={offset(session, from)}
    >
      <span className="tl-dot" aria-hidden="true" />
      <p className="tl-time">{session.start}</p>
      <p className="tl-point-title">
        {session.title}
        {venue && <span className="tl-where"> · {venue}</span>}
        <Mark state={state} />
      </p>
    </div>
  );
}

/** The proportional grid. Large screens only — see the list below. */
function Timeline({ day, clock }: { day: Day; clock: Clock | null }) {
  const { from, to } = axisBounds(day);
  const daytime = day.sessions.filter((s) => !isEvening(s));
  const ticks = axisTicks(day);
  const height = { '--span': to - from } as React.CSSProperties;
  const nextId = nextSessionId(day, clock);
  const mark = (s: Session): SessionMark =>
    stateOf(s, clock) ?? (s.id === nextId ? 'next' : null);

  // The now line only exists while the day is running and inside the axis.
  const isToday = clock !== null && clock.date === day.date;
  const onAxis = isToday && clock.minutes >= from && clock.minutes <= to;

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
        {onAxis && (
          <div className="tl-now" style={{ '--start': clock.minutes - from } as React.CSSProperties}>
            <span className="tl-now-label">{fromMinutes(clock.minutes)}</span>
          </div>
        )}
        {daytime.map((s) =>
          s.end
            ? <Block key={s.id} session={s} from={from} state={mark(s)} />
            : <Point key={s.id} session={s} from={from} state={mark(s)} />
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
function List(
  { sessions, anchors = true, marks }: {
    sessions: Session[];
    anchors?: boolean;
    marks?: (s: Session) => SessionMark;
  },
) {
  return (
    <ol className="session-list">
      {sessions.map((session) => {
        const venue = venueOf(session);
        const who = speakerOf(session);

        return (
          <li className="session" key={session.id} data-session={anchors ? session.id : undefined}>
            <p className="session-time">
              <ClockIcon aria-hidden="true" weight="regular" />
              <span>{timeLabel(session)}</span>
            </p>

            <div className="session-body" data-state={marks?.(session) ?? undefined}>
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
                <Mark state={marks?.(session) ?? null} />
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export function Programme({ day, clock }: { day: Day; clock: Clock | null }) {
  const evening = day.sessions.filter(isEvening);
  const nextId = nextSessionId(day, clock);
  const marks = (s: Session): SessionMark =>
    stateOf(s, clock) ?? (s.id === nextId ? 'next' : null);

  return (
    <div className="programme">
      <Timeline day={day} clock={clock} />

      {evening.length > 0 && (
        <section className="tl-evening" aria-hidden="true">
          <h4 className="tl-evening-title">Evening</h4>
          <div className="tl-evening-items">
            {evening.map((s) => (
              <p key={s.id} data-session={s.id} data-state={marks(s) ?? undefined}>
                <span className="tl-time">{timeLabel(s)}</span>
                {sessionTitle(s)}
                <Mark state={marks(s)} />
              </p>
            ))}
          </div>
        </section>
      )}

      {/* The same day as a list: the only version small screens and print show,
          and the one assistive technology reads. */}
      <List sessions={day.sessions} marks={marks} />
    </div>
  );
}

/**
 * Every day, in order, for paper. The interactive panel holds one day at a
 * time, so printing it would silently produce a single day — this block is
 * what the print stylesheet shows instead.
 */
export function ProgrammeForPrint() {
  return (
    <div className="print-programme" aria-hidden="true">
      {AGENDA.map((day) => (
        <section className="print-day" key={day.date}>
          <h3 className="print-day-title">
            Day {day.index} — {dayLabel(day.date)} — {day.label}
          </h3>
          <List sessions={day.sessions} anchors={false} />
        </section>
      ))}
    </div>
  );
}
