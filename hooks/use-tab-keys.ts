'use client';

/**
 * Arrow-key navigation between tabs, which `role="tab"` requires and the
 * browser does not provide. Left/right move, Home/End jump to the ends, and
 * focus follows selection.
 */
export function useTabKeys(count: number, active: number, setActive: (i: number) => void) {
  return (event: React.KeyboardEvent<HTMLDivElement>) => {
    const keys: Record<string, number> = {
      ArrowLeft: (active - 1 + count) % count,
      ArrowRight: (active + 1) % count,
      Home: 0,
      End: count - 1,
    };
    const next = keys[event.key];
    if (next === undefined) return;
    event.preventDefault();
    setActive(next);
    const list = event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]');
    list[next]?.focus();
  };
}
