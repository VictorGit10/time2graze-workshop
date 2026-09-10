import { ArrowUpRight, ArrowRight } from 'lucide-react';
import type { Story } from '@/data/optional-content';
import { STORY_IMAGES } from '@/data/optional-media';
import { StoryGallery } from '@/components/story-gallery';
import { StoryExplorer, type ExplorerView } from '@/components/story-explorer';
import { StoryLink } from '@/components/story-link';

/**
 * The pieces every subject may use, so that a panel differs by what it is
 * made of rather than by a branch inside one component.
 *
 * `components/stories/` holds one composition per subject and each decides its
 * own order. That is the point: seven panels running the same sequence with a
 * different widget in slot two read as one template, which is what these were
 * before 9 September 2026.
 */

export type ChapterTag = 'h4' | 'h5';
export type StoryBodyProps = { story: Story; ChapterHeading: ChapterTag };

export function StoryChapters({ story, ChapterHeading }: StoryBodyProps) {
  if (!story.chapters.length) return null;
  return (
    <div className="story-chapters" data-count={story.chapters.length}>
      {story.chapters.map((chapter) => (
        <section key={chapter.title}>
          <ChapterHeading>{chapter.title}</ChapterHeading>
          <p>{chapter.text}</p>
        </section>
      ))}
    </div>
  );
}

export function StoryFacts({ story }: { story: Story }) {
  if (!story.facts) return null;
  return (
    <dl className="story-facts">
      {story.facts.map((fact) => (
        <div key={fact.label}>
          <dt>{fact.label}</dt>
          <dd>{fact.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Photographs the story owns, in the registry order it declares. */
export function StoryPhotos({ story }: { story: Story }) {
  return <StoryGallery photos={story.images.flatMap((key) => (STORY_IMAGES[key] ? [STORY_IMAGES[key]] : []))} />;
}

/** Two named views of a subject, chosen rather than dissolved between. */
export function StoryViews({ views }: { views: { label: string; place: string; image: string }[] }) {
  const resolved: ExplorerView[] = views.flatMap((view) =>
    STORY_IMAGES[view.image] ? [{ label: view.label, place: view.place, photo: STORY_IMAGES[view.image] }] : [],
  );
  return <StoryExplorer views={resolved} />;
}

export function StoryReferences({ story }: { story: Story }) {
  return (
    <div className="story-references">
      <div>
        <p className="story-eyebrow">Further reading</p>
        <ul>
          {story.sources.map((source) => (
            <li key={source.href}>
              <a href={source.href} target="_blank" rel="noreferrer">
                {source.label}
                <ArrowUpRight aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
      </div>
      {story.related && (
        <div>
          <p className="story-eyebrow">Related</p>
          <ul>
            {story.related.map((link) => (
              <li key={link.href}>
                <StoryLink href={link.href}>
                  {link.label}
                  <ArrowRight aria-hidden="true" />
                </StoryLink>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
