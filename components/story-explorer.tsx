'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { StoryGallery } from '@/components/story-gallery';
import { useStoryOpen } from '@/components/story-disclosure';
import { withBasePath } from '@/lib/base-path';
import type { StoryImage } from '@/data/optional-media';

export type ExplorerView = { label: string; place: string; photo: StoryImage };

function Explorer({ views }: { views: ExplorerView[] }) {
  const [active, setActive] = useState(0);
  return <div className="story-explorer">
    <div className="story-explorer-choices" aria-label="Choose a view">
      {views.map((view, index) => <button key={view.photo.id} type="button" aria-pressed={index === active}
        aria-label={`Show ${view.label}: ${view.place}`} onClick={() => setActive(index)}>
        <Image src={withBasePath(view.photo.thumbnail || view.photo.src)} alt="" width={view.photo.width} height={view.photo.height} loading="lazy" />
        <span><small>{view.label}</small><strong>{view.place}</strong></span><ArrowRight aria-hidden="true" />
      </button>)}
    </div>
    <output className="story-explorer-status">{views[active].label}: {views[active].place}</output>
    <div className="story-explorer-view" key={views[active].photo.id}>
      <StoryGallery photos={[views[active].photo]} />
    </div>
  </div>;
}

/** Mount on demand; native buttons retain familiar keyboard and touch behaviour. */
export function StoryExplorer({ views }: { views: ExplorerView[] }) {
  const open = useStoryOpen();
  return <>{open && <Explorer views={views} />}<noscript><ul>{views.map(view => <li key={view.photo.id}><a href={withBasePath(view.photo.src)}>{view.label}: {view.place} — {view.photo.credit}</a></li>)}</ul></noscript></>;
}
