'use client';

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowUp, Plus } from 'lucide-react';

const StoryOpenContext = createContext(false);
export const useStoryOpen = () => useContext(StoryOpenContext);

/** Native text disclosure; only the optional media wait for an explicit opening. */
export function StoryDisclosure({ id, label, category, children, printAlways = false }: {
  id: string; label: string; category: string; children: ReactNode; printAlways?: boolean;
}) {
  const root = useRef<HTMLDetailsElement>(null);
  const scrollOnOpen = useRef(false);
  const fromHistory = useRef(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const followHash = () => {
      const node = root.current;
      if (!node) return;
      const matches = window.location.hash === `#${id}`;
      if (matches) {
        scrollOnOpen.current = true;
        if (node.open) {
          node.scrollIntoView({ block: 'start' });
          scrollOnOpen.current = false;
        }
      }
      if (node.open !== matches) {
        fromHistory.current = true;
        node.open = matches;
      }
    };
    followHash();
    window.addEventListener('hashchange', followHash);
    window.addEventListener('popstate', followHash);
    return () => {
      window.removeEventListener('hashchange', followHash);
      window.removeEventListener('popstate', followHash);
    };
  }, [id]);

  useEffect(() => {
    if (expanded && scrollOnOpen.current) {
      root.current?.scrollIntoView({ block: 'start' });
      scrollOnOpen.current = false;
    }
  }, [expanded]);

  function close() {
    const node = root.current;
    if (!node) return;
    node.open = false;
    node.querySelector('summary')?.focus({ preventScroll: true });
    node.scrollIntoView({ block: 'nearest' });
  }

  return (
    <details ref={root} id={id} className="story-disclosure" data-story={id} data-print-always={printAlways || undefined}
      onToggle={(event) => {
        const open = event.currentTarget.open;
        setExpanded(open);
        if (fromHistory.current) { fromHistory.current = false; return; }
        if (open && window.location.hash !== `#${id}`) {
          window.history.pushState(null, '', `#${id}`);
        } else if (!open && window.location.hash === `#${id}`) {
          window.history.pushState(null, '', window.location.pathname + window.location.search);
        }
      }}>
      <summary className="story-trigger">
        <span className="story-trigger-category">{category}</span>
        <span className="story-trigger-label">{label}</span>
        <Plus aria-hidden="true" />
      </summary>
      <StoryOpenContext.Provider value={expanded}>
        <div className="story-content">
          {children}
          <button className="story-close" type="button" onClick={close}>Close <ArrowUp aria-hidden="true" /></button>
        </div>
      </StoryOpenContext.Provider>
    </details>
  );
}
