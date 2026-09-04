import type { VenueId } from './venues';

export type MaterialKind = 'slides' | 'document' | 'protocol';

/**
 * A file a session is expected to produce. Declaring one before it exists is
 * how the site says "this is coming"; `href` stays absent until the file is
 * actually published, and is never invented.
 */
export type Material = {
  kind: MaterialKind;
  /** Only when the file needs a name of its own beyond its kind. */
  title?: string;
  /** Absent means not published yet. */
  href?: string;
  /** 'PDF', 'PPTX'. Only meaningful once there is an href. */
  format?: string;
  /** Open to workshop participants only, rather than to anyone with the link. */
  restricted?: boolean;
};

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
  materials?: Material[];
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
  /** End of the display interval. See `endStatus` before treating it as confirmed. */
  end?: string;
  /** A provisional end keeps the programme legible but must not drive "Now" or calendar files. */
  endStatus?: 'provisional';
  title: string;
  speakers?: Speaker[];
  /** Explicit for every item. `null` means no location is published for it. */
  venueId: VenueId | null;
  /** Parenthetical after the venue, e.g. "Pizza" in "Welcome Dinner @ LAPIG (Pizza)". */
  venueNote?: string;
  kind: SessionKind;
  /** Present only for split sessions; `title` then acts as the group label. */
  tracks?: Track[];
  /** What a participant must bring or prepare beforehand. */
  requirements?: string[];
  materials?: Material[];
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
  /** Files belonging to the day as a whole rather than to one session. */
  materials?: Material[];
};
