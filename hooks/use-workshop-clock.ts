'use client';

import { useSyncExternalStore } from 'react';
import { type Clock, workshopNow } from '@/lib/now';

/** Cached so the snapshot stays referentially stable between ticks. */
let cached: Clock | null = null;
let cachedKey = '';

function getSnapshot(): Clock | null {
  const now = workshopNow();
  const key = `${now.date}T${now.minutes}`;
  if (key !== cachedKey) {
    cachedKey = key;
    cached = now;
  }
  return cached;
}

/**
 * Null in the build output: the site is prerendered, so it has no "now", and
 * React uses this value while hydrating. The real clock arrives right after.
 */
function getServerSnapshot(): Clock | null {
  return null;
}

function subscribe(onChange: () => void) {
  const id = setInterval(onChange, 30_000);
  return () => clearInterval(id);
}

/**
 * The clock in Goiânia, whatever time it is where the reader is. Ticks every
 * 30 seconds — enough for a schedule measured in minutes.
 */
export function useWorkshopClock() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
