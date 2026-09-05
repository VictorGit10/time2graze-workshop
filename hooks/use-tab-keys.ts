'use client';

/**
 * Arrow-key navigation between tabs, which `role="tab"` requires and the
 * browser does not provide. Left/right move between tabs, Home/End jump to the
 * ends, and focus follows selection. The one tablist on the site — the day
 * tabs on /programme/ — is horizontal; a vertical variant existed for the
 * venue selector and went with it.
 */
export function useTabKeys(
  count: number,
  active: number,
  setActive: (i: number) => void,
) {
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
    // Anchors or buttons, whichever the tablist renders: focus follows selection.
    const list = event.currentTarget.querySelectorAll<HTMLElement>('[role="tab"]');
    list[next]?.focus();
  };
}
