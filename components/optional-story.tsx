import { STORIES, type StoryId } from '@/data/optional-content';
import { STORY_IMAGES } from '@/data/optional-media';
import { StoryDisclosure } from '@/components/story-disclosure';
import { StoryReferences, type ChapterTag } from '@/components/story-parts';
import { StoryWeekLink } from '@/components/story-week-link';
import { UfgStory } from '@/components/stories/ufg';
import { LapigStory } from '@/components/stories/lapig';
import { FunapeStory } from '@/components/stories/funape';
import { GoianiaStory } from '@/components/stories/goiania';
import { CidadeDeGoiasStory } from '@/components/stories/cidade-de-goias';
import { FicaStory } from '@/components/stories/fica';
import { CerradoStory } from '@/components/stories/cerrado';

const BODIES = {
  ufg: UfgStory,
  lapig: LapigStory,
  funape: FunapeStory,
  goiania: GoianiaStory,
  'cidade-de-goias': CidadeDeGoiasStory,
  fica: FicaStory,
  cerrado: CerradoStory,
} as const;

/** Matches scripts/build-entry-thumbs.mjs. Changing one means changing both. */
const ENTRY_THUMB = { width: 260, height: 186 };

/**
 * The frame every optional subject shares: the entry, the opening, its own
 * composition, what it is in the reader's week, and its sources.
 *
 * Only the opening and the references are fixed. The middle belongs to
 * `components/stories/<id>.tsx`, which is why this file has no `id ===`
 * branches any more: it had four, and each new subject wanted a fifth.
 *
 * Text is server-rendered; galleries, films and the scale ladder mount behind
 * `useStoryOpen()`, so a closed panel downloads nothing.
 */
export function OptionalStory({ id, headingLevel = 3 }: { id: StoryId; headingLevel?: 3 | 4 }) {
  const story = STORIES[id];
  const Heading = headingLevel === 3 ? 'h3' : 'h4';
  const ChapterHeading: ChapterTag = headingLevel === 3 ? 'h4' : 'h5';
  const Body = BODIES[id];
  const image = story.thumbnail ? STORY_IMAGES[story.thumbnail] : undefined;
  /* The entry crop when one has been built, and the image's own dimensions
     when it has not, so a new story shows something before the script is run. */
  const thumbnail = image
    ? image.entry
      ? { src: image.entry, width: ENTRY_THUMB.width, height: ENTRY_THUMB.height }
      : { src: image.thumbnail ?? image.src, width: image.width, height: image.height }
    : undefined;

  return (
    <StoryDisclosure
      id={`about-${id}`}
      label={story.label}
      category={story.category}
      teaser={story.teaser}
      thumbnail={thumbnail}
      printAlways={id === 'cidade-de-goias'}
    >
      <div className="story-opening">
        <p className="story-eyebrow">{story.category}</p>
        <Heading className="story-title">
          {id === 'fica' ? (
            <>
              <span className="story-festival-name">FICA</span>{' '}
              <span className="story-festival-subtitle">Cinema, culture &amp; environment</span>
            </>
          ) : (
            story.title
          )}
        </Heading>
        <p className="story-lead">{story.lead}</p>
      </div>
      <Body story={story} ChapterHeading={ChapterHeading} />
      <StoryWeekLink sessionId={story.weekSessionId} note={story.weekNote} />
      <StoryReferences story={story} />
    </StoryDisclosure>
  );
}
