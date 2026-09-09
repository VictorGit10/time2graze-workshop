'use client';

import { useSyncExternalStore } from 'react';

/**
 * The split-session choices this browser has already sent, and the name they
 * were sent under.
 *
 * The organiser's sheet is the record; this is what lets a reader's own
 * programme show which activity they are down for, and lets the second split
 * session open with their name already in it rather than asking a person on
 * hotel wi-fi to type it twice.
 *
 * An external store rather than an effect: the site is prerendered, so the
 * markup carries no choice at all and only the client knows better — the same
 * reason `use-flagged-lines` and `use-workshop-clock` are built this way.
 */
const STORE_KEY = 't2g-track-choice';

export type Choices = {
  /** Last name sent, reused as the default for the next session. */
  name: string;
  /** Session id -> the track id chosen in it. */
  picks: Record<string, string>;
};

/** The snapshot React holds while prerendering, and its identity must not move. */
const NONE: Choices = { name: '', picks: {} };

/** Read once, then kept: this is read on every render of the programme. */
let cached: Choices | null = null;
const listeners = new Set<() => void>();

/**
 * Every access is guarded. Private windows, and browsers set to block site
 * data, throw on the accessor itself — and a reader in one of them must still
 * be able to choose, they are simply not reminded of it afterwards.
 */
function choices(): Choices {
  if (cached) return cached;
  let stored: Partial<Choices> | null = null;
  try {
    const raw = localStorage.getItem(STORE_KEY);
    stored = raw ? (JSON.parse(raw) as Partial<Choices>) : null;
  } catch {
    stored = null;
  }
  cached = {
    name: typeof stored?.name === 'string' ? stored.name : '',
    picks: stored?.picks && typeof stored.picks === 'object' ? stored.picks : {},
  };
  return cached;
}

/**
 * Records an accepted choice and tells every surface showing it. The snapshot
 * is replaced rather than mutated: `useSyncExternalStore` compares identity,
 * and a mutated object is the same object.
 */
export function rememberChoice(session: string, track: string, name: string) {
  const all = choices();
  const trimmed = name.trim();
  if (all.picks[session] === track && all.name === trimmed) return;
  cached = { name: trimmed, picks: { ...all.picks, [session]: track } };
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(cached));
  } catch {
    /* Nothing to do: the choice is already recorded on the server. */
  }
  for (const listener of listeners) listener();
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
  };
}

/** Empty while prerendering and hydrating, then the truth from this browser. */
export function useChoices() {
  return useSyncExternalStore(subscribe, choices, () => NONE);
}
