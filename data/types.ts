import type { VenueId } from './venues';

export type Speaker = {
  name: string;
  /** Institution, rendered after the name as "Name/ORG". */
  org?: string;
};

export type SessionKind =
  | 'technical'
  | 'meal'
  | 'break'
  | 'transport'
  | 'field'
  | 'social';

/** One activity inside a split session. Parallel activities are never a single title. */
export type Track = {
  id: string;
  title: string;
  speakers?: Speaker[];
};

export type Session = {
  /**
   * Hand-written and stable. Never derive it from the title: materials, deep
   * links and calendar entries all point at this value.
   */
  id: string;
  /** Full ISO date. All times are America/Sao_Paulo. */
  date: string;
  start: string;
  /**
   * Absent means no end time has been recorded — 20 of the 45 items are in
   * this state. Render those as a point on the axis, never as a guessed
   * duration.
   */
  end?: string;
  title: string;
  speakers?: Speaker[];
  venueId?: VenueId;
  /** Parenthetical after the venue, e.g. "Pizza" in "Welcome Dinner @ LAPIG (Pizza)". */
  venueNote?: string;
  kind: SessionKind;
  /** Present only for split sessions; `title` then acts as the group label. */
  tracks?: Track[];
  /** What a participant must bring or prepare beforehand. */
  requirements?: string[];
  /** Omitted means confirmed. 'tbd' renders visibly as unresolved. */
  status?: 'tbd';
};

export type Day = {
  index: number;
  /** Full ISO date; the weekday label is derived from it. */
  date: string;
  /** 'Welcome' | 'Retreat' | 'Field' */
  label: string;
  sessions: Session[];
};
