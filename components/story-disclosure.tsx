'use client';

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowLeft, ArrowUpRight, Link as LinkIcon, Check } from 'lucide-react';
import { closeStory, lockStoryScroll, openStory } from '@/lib/story-navigation';

const StoryOpenContext = createContext(false);
export const useStoryOpen = () => useContext(StoryOpenContext);

/** Server-rendered reading, presented in a native modal with optional media. */
export function StoryDisclosure({ id, label, category, children, printAlways = false }: {
  id: string; label: string; category: string; children: ReactNode; printAlways?: boolean;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLAnchorElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [copyStatus, setCopyStatus] = useState('');

  useEffect(() => {
    const node = dialog.current;
    if (!node) return;
    let release: (() => void) | undefined;
    let returnFocus: HTMLElement | null = null;
    const followHash = () => {
      const matches = window.location.hash === `#${id}`;
      if (matches && !node.open) {
        returnFocus = document.activeElement instanceof HTMLElement && document.activeElement !== document.body
          ? document.activeElement : trigger.current;
        release = lockStoryScroll();
        node.showModal();
        queueMicrotask(() => {
          if (node.open) node.querySelector<HTMLButtonElement>('.story-back')?.focus({ preventScroll: true });
        });
        node.scrollTop = 0;
        setExpanded(true);
        setCopyStatus('');
      } else if (!matches && node.open) {
        node.close();
        release?.();
        release = undefined;
        setExpanded(false);
        if (!window.location.hash.startsWith('#about-')) {
          const target = returnFocus?.closest('dialog') ? trigger.current : returnFocus;
          target?.focus({ preventScroll: true });
        }
      }
    };
    followHash();
    window.addEventListener('hashchange', followHash);
    window.addEventListener('popstate', followHash);
    return () => {
      window.removeEventListener('hashchange', followHash);
      window.removeEventListener('popstate', followHash);
      node.close();
      release?.();
    };
  }, [id]);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopyStatus('Link copied');
    } catch {
      setCopyStatus('Copy the link from your address bar');
    }
  }

  return (
    <div className="story-disclosure" data-story={id} data-print-always={printAlways || undefined}>
      <a ref={trigger} id={id} href={`#${id}`} className="story-trigger" aria-haspopup="dialog"
        aria-controls={`${id}-panel`} onClick={(event) => {
          if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
          event.preventDefault();
          openStory(`#${id}`);
        }}>
        <span className="story-trigger-category">{category}</span>
        <span className="story-trigger-label">{label}</span>
        <span className="story-trigger-action">Learn more <ArrowUpRight aria-hidden="true" /></span>
      </a>
      <dialog ref={dialog} id={`${id}-panel`} className="story-panel" aria-label={label}
        onCancel={(event) => { event.preventDefault(); closeStory(); }}>
        <div className="story-panel-bar">
          <button type="button" className="story-back" onClick={closeStory} autoFocus><ArrowLeft aria-hidden="true" />Back to page</button>
          <span className="story-panel-category">{category}</span>
          <button type="button" className="story-share" onClick={copyLink} aria-label="Copy link to this story">
            {copyStatus === 'Link copied' ? <Check aria-hidden="true" /> : <LinkIcon aria-hidden="true" />}<span>{copyStatus === 'Link copied' ? 'Copied' : 'Copy link'}</span>
          </button>
          <output className="story-copy-status">{copyStatus}</output>
        </div>
        <StoryOpenContext.Provider value={expanded}>
          <div className="story-content">
            {children}
            <button className="story-close" type="button" onClick={closeStory}><ArrowLeft aria-hidden="true" />Back to page</button>
          </div>
        </StoryOpenContext.Provider>
      </dialog>
      <noscript><style>{`.story-panel { display:block; position:static; width:100%; max-height:none; } .story-panel-bar, .story-close { display:none; }`}</style></noscript>
    </div>
  );
}
