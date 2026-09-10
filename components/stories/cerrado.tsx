import { StoryChapters, type StoryBodyProps } from '@/components/story-parts';
import { StoryScale } from '@/components/story-scale';

/**
 * The panel that shows what the people around the reader actually do: one
 * question, three instruments. The chapters follow the rungs and close with
 * the note that these are three places rather than one — which is the reason
 * the device is a set of choices and not a slider.
 */
export function CerradoStory({ story, ChapterHeading }: StoryBodyProps) {
  return (
    <>
      <StoryScale />
      <StoryChapters story={story} ChapterHeading={ChapterHeading} />
    </>
  );
}
