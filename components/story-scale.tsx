'use client';

import { useState } from 'react';
import { CERRADO_SCALES } from '@/data/story-features';
import { STORY_IMAGES } from '@/data/optional-media';
import { StoryGallery } from '@/components/story-gallery';
import { useStoryOpen } from '@/components/story-disclosure';
import { withBasePath } from '@/lib/base-path';

/**
 * The same question asked by three instruments: a person, an aircraft, a
 * satellite. It is the working method of the laboratory hosting the workshop,
 * and it is the one device on this site that shows what "remote sensing" means
 * rather than naming it.
 *
 * These are deliberately NOT three views of one place, and the device is built
 * so it cannot pretend otherwise: rungs are chosen, never swiped or dissolved
 * between, and every rung names its own location. A slider or a continuous
 * zoom would assert a single site across three photographs and would be a lie
 * told by an interaction.
 *
 * Only Landsat's 30 m is a published figure. The other rungs describe what the
 * instrument is, because no ground coverage is documented for them.
 */
function Ladder() {
  const [active, setActive] = useState(0);
  const rung = CERRADO_SCALES[active];
  const photo = STORY_IMAGES[rung.image];
  return (
    <div className="story-scale">
      <ol className="story-scale-rungs" aria-label="Choose a scale of observation">
        {CERRADO_SCALES.map((item, index) => (
          <li key={item.id}>
            <button type="button" aria-pressed={index === active} onClick={() => setActive(index)}>
              <span className="story-scale-rung">{item.rung}</span>
              <span className="story-scale-instrument">{item.instrument}</span>
              <span className="story-scale-resolution">{item.resolution}</span>
            </button>
          </li>
        ))}
      </ol>
      <output className="story-scale-status">{rung.rung}: {rung.instrument}. {rung.note}</output>
      <div className="story-scale-view" key={rung.id}>
        <StoryGallery photos={photo ? [photo] : []} />
      </div>
      <p className="story-scale-note">{rung.note}</p>
    </div>
  );
}

export function StoryScale() {
  const open = useStoryOpen();
  return (
    <>
      {open && <Ladder />}
      <noscript>
        <ul>
          {CERRADO_SCALES.map((item) => {
            const photo = STORY_IMAGES[item.image];
            return (
              <li key={item.id}>
                <a href={withBasePath(photo.src)}>{item.rung} — {item.instrument} ({item.resolution})</a>: {item.note}
              </li>
            );
          })}
        </ul>
      </noscript>
    </>
  );
}
