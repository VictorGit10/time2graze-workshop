import { StoryChapters, StoryViews, type StoryBodyProps } from '@/components/story-parts';
import { StorySteps } from '@/components/story-steps';

/**
 * A city that was drawn before it was built, so its panel is an order of
 * events. The three dates used to sit in a statistics row, which stated them
 * and implied nothing; as steps they carry the argument, and the chapters are
 * down to the one that is not a date — the plan itself.
 */
export function GoianiaStory({ story, ChapterHeading }: StoryBodyProps) {
  return (
    <>
      <StorySteps />
      <StoryViews
        views={[
          { label: 'Parque Flamboyant', place: 'Parks and the city skyline', image: 'M03' },
          { label: 'Parque Vaca Brava', place: 'Water and urban green space', image: 'M04' },
        ]}
      />
      <StoryChapters story={story} ChapterHeading={ChapterHeading} />
    </>
  );
}
