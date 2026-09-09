'use client';

import { useSyncExternalStore } from 'react';

/**
 * Which recap lines this browser has already flagged.
 *
 * A courtesy, not a control — the Apps Script endpoint decides what it
 * accepts. Without it, a reader who flags a line and then reloads the page is
 * shown a fresh "Flag" button and sends the same correction a second time, and
 * the organiser reads it twice on a night when time is the scarce thing.
 *
 * An external store rather than an effect: the site is prerendered, so the
 * markup says "Flag" and only the client knows better — the same reason
 * `use-workshop-clock` is built this way.
 */
const STORE_KEY = 't2g-recap-flagged';

/** Read once, then kept in memory: this is read on every render of every line. */
let cached: Set<string> | null = null;
const listeners = new Set<() => void>();

/**
 * Every access is guarded. Private windows, and browsers set to block site
 * data, throw on the accessor itself — and a reader in one of them must still
 * be able to read the recap.
 */
function flagged(): Set<string> {
  if (cached) return cached;
  try {
    const raw = localStorage.getItem(STORE_KEY);
    cached = new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    cached = new Set();
  }
  return cached;
}

/** Records an accepted flag and tells every line about it. */
export function rememberFlagged(id: string) {
  const all = flagged();
  if (all.has(id)) return;
  all.add(id);
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify([...all]));
  } catch {
    /* Nothing to do: the flag is already recorded on the server. */
  }
  for (const listener of listeners) listener();
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
  };
}

/** False while prerendering and hydrating, then the truth from this browser. */
export function useFlagged(id: string) {
  return useSyncExternalStore(
    subscribe,
    () => flagged().has(id),
    () => false,
  );
}
