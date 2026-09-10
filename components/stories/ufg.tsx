import { StoryChapters, type StoryBodyProps } from '@/components/story-parts';
import { StoryFounding } from '@/components/story-founding';
import { StoryCampuses } from '@/components/story-campuses';

/**
 * UFG is the subject the reader is standing inside, so the panel is built
 * around position rather than around photographs: what the university was
 * made from, and where it reaches — including the town Friday goes to.
 *
 * It carries no photograph at present, and an empty slot is the right state
 * until a good one exists. The two it had were withdrawn on 10 September 2026:
 * M02 showed the Central Library behind a wall of protest graffiti naming the
 * rector, and M01 was an empty road on a dry day. Neither said anything true
 * about a university, and the first said something about it that this site has
 * no business publishing on the host's behalf. Do not restore either.
 */
export function UfgStory({ story, ChapterHeading }: StoryBodyProps) {
  return (
    <>
      <StoryFounding />
      <StoryChapters story={story} ChapterHeading={ChapterHeading} />
      <StoryCampuses />
    </>
  );
}
