import { StoryLink } from '@/components/story-link';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import { STORIES, type StoryId } from '@/data/optional-content';
import { STORY_IMAGES } from '@/data/optional-media';
import { StoryDisclosure } from '@/components/story-disclosure';
import { StoryGallery } from '@/components/story-gallery';

/** Text is server-rendered; disclosure and gallery are small client boundaries. */
export function OptionalStory({ id, headingLevel = 3 }: { id: StoryId; headingLevel?: 3 | 4 }) {
  const story = STORIES[id];
  const Heading = headingLevel === 3 ? 'h3' : 'h4';
  const ChapterHeading = headingLevel === 3 ? 'h4' : 'h5';
  return <StoryDisclosure id={`about-${id}`} label={story.label} category={story.category} printAlways={id === 'cidade-de-goias'}>
    <div className="story-opening">
      <p className="story-eyebrow">{story.category}</p>
      <Heading className="story-title">{story.title}</Heading>
      <p className="story-lead">{story.lead}</p>
    </div>
    <StoryGallery photos={story.images.flatMap(key => STORY_IMAGES[key] ? [STORY_IMAGES[key]] : [])} />
    {story.facts && <dl className="story-facts">{story.facts.map(fact => <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}</dl>}
    <div className="story-chapters">{story.chapters.map(chapter => <section key={chapter.title}>
      <ChapterHeading>{chapter.title}</ChapterHeading><p>{chapter.text}</p>
    </section>)}</div>
    <div className="story-references">
      <div><p className="story-eyebrow">Further reading</p><ul>{story.sources.map(source => <li key={source.href}><a href={source.href} target="_blank" rel="noreferrer">{source.label}<ArrowUpRight aria-hidden="true" /></a></li>)}</ul></div>
      {story.related && <div><p className="story-eyebrow">Related</p><ul>{story.related.map(link => <li key={link.href}><StoryLink href={link.href}>{link.label}<ArrowRight aria-hidden="true" /></StoryLink></li>)}</ul></div>}
    </div>
  </StoryDisclosure>;
}
