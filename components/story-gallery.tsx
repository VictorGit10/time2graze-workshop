'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Expand, X } from 'lucide-react';
import type { StoryImage } from '@/data/optional-media';
import { withBasePath } from '@/lib/base-path';
import { useStoryOpen } from '@/components/story-disclosure';
import { lockStoryScroll } from '@/lib/story-navigation';

function Credit({ photo }: { photo: StoryImage }) {
  return <span className="story-photo-credit">
    <a href={photo.sourcePage} target="_blank" rel="noreferrer">{photo.credit}</a>
    {photo.licenseUrl && <> · <a href={photo.licenseUrl} target="_blank" rel="noreferrer">{photo.license}</a></>}
  </span>;
}

export function StoryGallery({ photos }: { photos: StoryImage[] }) {
  const expanded = useStoryOpen();
  const [selected, setSelected] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const photo = selected === null ? null : photos[selected];
  const isOpen = selected !== null;

  useEffect(() => {
    const closeForNavigation = () => setSelected(null);
    window.addEventListener('popstate', closeForNavigation);
    window.addEventListener('hashchange', closeForNavigation);
    return () => {
      window.removeEventListener('popstate', closeForNavigation);
      window.removeEventListener('hashchange', closeForNavigation);
    };
  }, []);

  useEffect(() => {
    const node = dialog.current;
    if (!isOpen || !node) return;
    const release = lockStoryScroll();
    node.showModal();
    const closeBackdrop = (event: MouseEvent) => {
      if (event.target === node) setSelected(null);
    };
    const navigate = (event: KeyboardEvent) => {
      if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
      event.preventDefault();
      const step = event.key === 'ArrowRight' ? 1 : -1;
      setSelected(current => current === null ? null : (current + step + photos.length) % photos.length);
    };
    node.addEventListener('click', closeBackdrop);
    node.addEventListener('keydown', navigate);
    return () => {
      node.removeEventListener('click', closeBackdrop);
      node.removeEventListener('keydown', navigate);
      node.close();
      release();
      returnFocus.current?.focus({ preventScroll: true });
    };
  }, [isOpen, photos.length]);

  if (!photos.length) return null;
  return <>
    {expanded && <div className="story-gallery" data-count={photos.length}>
      {photos.map((item, index) => <figure className="story-photo" key={item.id}>
        <button type="button" className="story-photo-open" aria-label={`Enlarge photo: ${item.caption}`}
          onClick={(event) => { returnFocus.current = event.currentTarget; setSelected(index); }}>
          {/* Static export: responsive local files, without an image server. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={withBasePath(item.src)}
            srcSet={item.thumbnail ? `${withBasePath(item.thumbnail)} 640w, ${withBasePath(item.src)} ${item.width}w` : undefined}
            sizes="(max-width: 700px) 90vw, 60vw" width={item.width} height={item.height} alt={item.alt} loading="lazy" />
          <span className="story-photo-expand"><Expand aria-hidden="true" /><span>Enlarge</span></span>
        </button>
        <figcaption><span>{item.caption}</span><Credit photo={item} /></figcaption>
      </figure>)}
    </div>}
    <noscript><p className="story-noscript">{photos.map(item => <a key={item.id} href={withBasePath(item.src)}>{item.caption} · {item.credit} </a>)}</p></noscript>
    <dialog ref={dialog} className="story-lightbox" aria-label="Photograph gallery"
      onCancel={(event) => { event.stopPropagation(); setSelected(null); }}>
      {photo && <div className="story-lightbox-inner">
        <header><span>Photographs <span aria-live="polite">{(selected ?? 0) + 1} / {photos.length}</span></span>
          <button type="button" aria-label="Close photograph gallery" onClick={() => setSelected(null)} autoFocus><X aria-hidden="true" /></button>
        </header>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img key={photo.id} src={withBasePath(photo.src)} width={photo.width} height={photo.height} alt={photo.alt} />
        <footer>
          <div aria-live="polite"><p>{photo.caption}</p><Credit photo={photo} /></div>
          {photos.length > 1 && <nav aria-label="Photograph navigation">
            <button type="button" aria-label="Previous photograph" onClick={() => setSelected(current => ((current ?? 0) - 1 + photos.length) % photos.length)}><ArrowLeft aria-hidden="true" /></button>
            <button type="button" aria-label="Next photograph" onClick={() => setSelected(current => ((current ?? 0) + 1) % photos.length)}><ArrowRight aria-hidden="true" /></button>
          </nav>}
        </footer>
      </div>}
    </dialog>
  </>;
}
