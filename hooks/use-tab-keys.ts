'use client';

/**
 * Arrow-key navigation between tabs, which `role="tab"` requires and the
 * browser does not provide. The arrow keys follow the tablist orientation,
 * Home/End jump to the ends, and focus follows selection.
 */
export function useTabKeys(
  count: number,
  active: number,
  setActive: (i: number) => void,
  orientation: 'horizontal' | 'vertical' = 'horizontal',
) {
  return (event: React.KeyboardEvent<HTMLDivElement>) => {
    const previous = orientation === 'vertical' ? 'ArrowUp' : 'ArrowLeft';
    const following = orientation === 'vertical' ? 'ArrowDown' : 'ArrowRight';
    const keys: Record<string, number> = {
      [previous]: (active - 1 + count) % count,
      [following]: (active + 1) % count,
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
