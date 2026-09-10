'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { Play, ArrowUpRight } from 'lucide-react';
import { useStoryOpen } from '@/components/story-disclosure';
import { withBasePath } from '@/lib/base-path';
import type { StoryFilm } from '@/data/story-films';
import type { StoryImage } from '@/data/optional-media';

/**
 * Screen, then the film's own line, then the chooser, then the small print.
 *
 * The order was screen → description → three notes → chooser until 10 September
 * 2026, and on a phone that put a wall of grey type between the screen and the
 * control that drives it: reported as the chooser reading like three unrelated
 * cards rather than as a way of changing what is on screen. The credit and the
 * caption note are small print about the poster, so they go last, where small
 * print goes.
 *
 * Three things carry the relationship now, and none of them is a paragraph
 * explaining the interface: the chooser is labelled, every row wears a play
 * badge over its own frame, and the row already on screen says so.
 */
function Player({ films, poster }: { films: StoryFilm[]; poster: StoryImage }) {
  const [selected, setSelected] = useState(0);
  const [playing, setPlaying] = useState(false);
  const frame = useRef<HTMLIFrameElement>(null);
  const film = films[selected];
  return <>
    <div className="story-screen">
      {playing ? <iframe ref={frame} key={film.id} title={film.title}
        src={`https://www.youtube-nocookie.com/embed/${film.id}?autoplay=1&rel=0&cc_load_policy=1&hl=en`}
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin" onLoad={() => frame.current?.focus({ preventScroll: true })} />
        : <button type="button" className="story-screen-play" onClick={() => setPlaying(true)} aria-label={`Play ${film.title}`}>
          <Image src={withBasePath(poster.src)} width={poster.width} height={poster.height} alt="" />
          <span className="story-screen-caption"><span className="story-play-icon"><Play aria-hidden="true" /></span><span><small>Watch the film</small><strong>{film.title}</strong></span></span>
        </button>}
    </div>
    <div className="story-film-caption">
      <p aria-live="polite">{film.description}</p>
      <a href={`https://www.youtube.com/watch?v=${film.id}`} target="_blank" rel="noreferrer">{film.publisher} · Watch on YouTube <ArrowUpRight aria-hidden="true" /></a>
    </div>
    {/* fieldset/legend, not a div with role="group": the native pair is what
        the linter asks for and what assistive technology reads without an id
        to wire up. The reset in the stylesheet is load-bearing — a fieldset
        defaults to min-width: min-content and would refuse to shrink. */}
    <fieldset className="story-film-picker">
      <legend className="story-film-picker-label">Choose a film</legend>
      <div className="story-film-selection">
        {films.map((item, index) => {
          const current = selected === index;
          return (
            <button type="button" key={item.id} aria-pressed={current}
              aria-label={current ? `${item.title} — on screen now` : `Play ${item.title}`}
              onClick={() => { setSelected(index); setPlaying(true); }}>
              <span className="story-film-thumb">
                <Image src={`https://i.ytimg.com/vi/${item.id}/hqdefault.jpg`} alt="" width={480} height={360} loading="lazy" unoptimized />
                <span className="story-film-badge"><Play aria-hidden="true" /></span>
              </span>
              <span className="story-film-meta">
                <small>{current ? 'On screen now' : 'Watch next'}</small>
                <strong>{item.title}</strong>
                <span>{item.publisher}</span>
              </span>
            </button>
          );
        })}
      </div>
    </fieldset>
    <div className="story-film-notes">
      <small>Original-language video. Caption options are available in the player.</small>
      {!playing && <small>Cover photograph: <a href={poster.sourcePage} target="_blank" rel="noreferrer">{poster.credit}</a>. {poster.caption}</small>}
    </div>
  </>;
}

/** Unmount the player on close so a reopened story never resumes autoplay. */
export function StoryCinema(props: { films: StoryFilm[]; poster: StoryImage }) {
  const expanded = useStoryOpen();
  return <section className="story-cinema" aria-label="Films">
    {expanded && <Player {...props} />}
    <noscript><p><a href={`https://www.youtube.com/watch?v=${props.films[0].id}`}>Watch {props.films[0].title} on YouTube</a></p></noscript>
  </section>;
}
