import { StoryChapters, StoryPhotos, type StoryBodyProps } from '@/components/story-parts';
import { StoryFounding } from '@/components/story-founding';
import { StoryObservatories } from '@/components/story-observatories';
import { StoryCampuses } from '@/components/story-campuses';

/**
 * UFG is the subject the reader is standing inside, so the panel is built
 * around what the university does rather than around how it looks: five
 * schools became one, that one keeps observatories, and those reach as far as
 * the town Friday goes to.
 *
 * The photographs are deliberately not a campus tour. They are a monkey on the
 * walkway of the campus where the workshop runs, a weather station seen from
 * directly above, a case of fossils and a music school — the range of one
 * university, which is a truer thing to show than its facades.
 *
 * Two earlier photographs were withdrawn on 10 September 2026: one showed the
 * Central Library behind protest graffiti naming the rector, the other an
 * empty road. Look at every frame at full size before it goes in.
 */
export function UfgStory({ story, ChapterHeading }: StoryBodyProps) {
  return (
    <>
      <StoryFounding />
      <StoryChapters story={story} ChapterHeading={ChapterHeading} />
      <StoryObservatories ChapterHeading={ChapterHeading} />
      <StoryPhotos story={story} natural />
      <StoryCampuses ChapterHeading={ChapterHeading} />
    </>
  );
}
