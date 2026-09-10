import Image from 'next/image';
import { StoryChapters, StoryFacts, type StoryBodyProps } from '@/components/story-parts';
import { StorySequence } from '@/components/story-sequence';
import { withBasePath } from '@/lib/base-path';

/**
 * The shortest panel of the seven, and it should stay that way. FUNAPE has no
 * cleared photography and no documented role in this workshop; the honest
 * response is a well-set page, not a gallery borrowed from somewhere else.
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
      <StoryChapters story={story} ChapterHeading={ChapterHeading} />
      <StorySequence />
      <StoryFacts story={story} />
    </>
  );
}
