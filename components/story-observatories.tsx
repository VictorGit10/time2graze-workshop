import { ArrowUpRight, ArrowRight } from 'lucide-react';
import { UFG_OBSERVATORIES } from '@/data/story-features';
import { StoryLink } from '@/components/story-link';
import type { ChapterTag } from '@/components/story-parts';

/**
 * Four centres, each labelled by what it does rather than by what it is
 * called. It is the shape of the whole panel's argument: this university keeps
 * instruments pointed at things, and one of them is pointed at itself.
 *
 * The role is the loud line and the name is quiet under it — the reverse of
 * how an institution normally lists its centres, and the reason the row can be
 * read in one pass by someone who has never heard of any of them.
 *
 * The heading tag is passed in rather than fixed, because this section sits
 * among the chapters and the panel's levels have to stay contiguous.
 *
 * Server-rendered, so it prints, and the LAPIG entry routes through StoryLink
 * because it is a story on this site rather than an outside address.
 */
export function StoryObservatories({ ChapterHeading }: { ChapterHeading: ChapterTag }) {
  return (
    <section className="story-observatories" aria-label="Centres and observatories at UFG">
      <div className="story-observatories-heading">
        <p className="story-eyebrow">Instruments</p>
        <ChapterHeading>A university that keeps observatories</ChapterHeading>
        <p>
          UFG is easier to describe by what it measures than by how many people
          it enrols. It keeps instruments pointed at the land, at the sky, and
          at its own use of artificial intelligence.
        </p>
      </div>
      <ol>
        {UFG_OBSERVATORIES.map((item) => (
          <li key={item.id}>
            <p className="story-observatories-role">{item.role}</p>
            <p className="story-observatories-figure">{item.figure}</p>
            <p className="story-observatories-name">{item.name}</p>
            <p className="story-observatories-full">{item.full}</p>
            <p className="story-observatories-text">{item.text}</p>
            {'internal' in item && item.internal ? (
              <StoryLink href={item.href} className="story-observatories-go">
                Read about it here <ArrowRight aria-hidden="true" />
              </StoryLink>
            ) : (
              <a className="story-observatories-go" href={item.href} target="_blank" rel="noreferrer">
                Visit <ArrowUpRight aria-hidden="true" />
              </a>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}
