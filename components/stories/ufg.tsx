import { StoryChapters, StoryViews, type StoryBodyProps } from '@/components/story-parts';
import { StoryFounding } from '@/components/story-founding';
import { StoryCampuses } from '@/components/story-campuses';

/**
 * UFG is the subject the reader is standing inside, so the panel is built
 * around position rather than around photographs: what the university was
 * made from, and where it reaches — including the town Friday goes to.
 */
export function UfgStory({ story, ChapterHeading }: StoryBodyProps) {
  return (
    <>
      <StoryViews
        views={[
          { label: 'On campus', place: 'Alameda Palmeiras', image: 'M01' },
          { label: 'Study & research', place: 'Central Library', image: 'M02' },
        ]}
      />
      <StoryFounding />
      <StoryChapters story={story} ChapterHeading={ChapterHeading} />
      <StoryCampuses />
    </>
  );
}
