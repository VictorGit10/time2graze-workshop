'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { Play, ArrowUpRight } from 'lucide-react';
import { useStoryOpen } from '@/components/story-disclosure';
import { withBasePath } from '@/lib/base-path';
import type { StoryFilm } from '@/data/story-films';
import type { StoryImage } from '@/data/optional-media';

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
      <small>Original-language video. Caption options are available in the player.</small>
      {!playing && <small>Cover photograph: <a href={poster.sourcePage} target="_blank" rel="noreferrer">{poster.credit}</a>. {poster.caption}</small>}
    </div>
    <div className="story-film-selection" aria-label="Choose a film">
      {films.map((item, index) => <button type="button" key={item.id} aria-label={`Play ${item.title}`} aria-pressed={selected === index}
        onClick={() => { setSelected(index); setPlaying(true); }}>
        <Image src={`https://i.ytimg.com/vi/${item.id}/hqdefault.jpg`} alt="" width={480} height={360} loading="lazy" unoptimized />
        <span><small>{index === 0 ? 'Featured film' : 'Watch next'}</small><strong>{item.title}</strong><span>{item.publisher} <Play aria-hidden="true" /></span></span>
      </button>)}
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
