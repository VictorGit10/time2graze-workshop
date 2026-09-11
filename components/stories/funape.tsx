import Image from 'next/image';
import { StoryChapters, StoryFacts, StoryPhotos, type StoryBodyProps } from '@/components/story-parts';
import { StorySequence } from '@/components/story-sequence';
import { StoryPark } from '@/components/story-park';
import { withBasePath } from '@/lib/base-path';

/**
 * This was the shortest panel of the seven and deliberately so, because the
 * foundation had no cleared photography and no documented role in this
 * workshop. The first is now fixed: it has a building, and the building is
 * photographed and creditable.
 *
 * The second is not, and the panel still does not claim one. Everything here
 * describes what FUNAPE is and does in general, and what stands around it on
 * the campus — no sentence says it organises, funds or manages this event.
 * That question is still open with the organiser.
 */
export function FunapeStory({ story, ChapterHeading }: StoryBodyProps) {
  return (
    <>
      <div className="story-foundation-mark">
        <Image
          src={withBasePath('/logos/institutions/funape.png')}
          alt="FUNAPE — Fundação de Apoio à Pesquisa"
          width={256}
          height={71}
          loading="lazy"
        />
      </div>
      <StoryPhotos story={story} />
      <StoryChapters story={story} ChapterHeading={ChapterHeading} />
      <StorySequence />
      <StoryPark ChapterHeading={ChapterHeading} />
      <StoryFacts story={story} />
    </>
  );
}
