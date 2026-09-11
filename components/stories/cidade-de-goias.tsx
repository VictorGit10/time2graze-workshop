import { StoryChapters, StoryFacts, StoryViews, type StoryBodyProps } from '@/components/story-parts';

/**
 * The town's heritage argument is a relationship between the river, the hills
 * and what was built between them, so the panel reads as a walk: the two
 * views first, the dated spine, then the chapters in the order a visitor
 * meets them — the streets, the river, the poet.
 *
 * This is the one panel that prints with the page (`data-print-always`), and
 * what prints is the text: the facts and the chapters are server-rendered, and
 * the two views are not, so paper gets the history without the photographs —
 * which is what it got before the stories existed. Anything added here that
 * carries a fact rather than an image should be server-rendered, or it will be
 * missing from the one panel a reader can hold.
 */
export function CidadeDeGoiasStory({ story, ChapterHeading }: StoryBodyProps) {
  return (
    <>
      <StoryViews
        views={[
          { label: 'Historic centre', place: 'The streets of Goiás', image: 'M05' },
          { label: 'Cora Coralina', place: 'The house across the river', image: 'M06' },
        ]}
      />
      <StoryFacts story={story} />
      <StoryChapters story={story} ChapterHeading={ChapterHeading} />
    </>
  );
}
