import { ArrowUpRight } from 'lucide-react';
import { StoryChapters, StoryFacts, StoryPhotos, type StoryBodyProps } from '@/components/story-parts';
import { StoryCinema } from '@/components/story-cinema';
import { STORY_FILMS } from '@/data/story-films';
import { STORY_IMAGES } from '@/data/optional-media';

/**
 * The festival runs in June and the workshop is in September. Nothing in this
 * panel may read as an invitation: the prose is past tense, the fact row says
 * "most recent edition", and the frame gives it no entry in the reader's week,
 * because it has none.
 */
export function FicaStory({ story, ChapterHeading }: StoryBodyProps) {
  return (
    <>
      <StoryCinema films={STORY_FILMS.fica} poster={STORY_IMAGES['fica-city']} />
      <StoryFacts story={story} />
      <section className="story-festival-programme">
        <p className="story-eyebrow">Different places. Different perspectives.</p>
        <ChapterHeading>Four competition sections</ChapterHeading>
        <ol>
          <li>
            <span>01</span>
            <strong>International films</strong>
            <p>The Washington Novaes competition brings environmental filmmaking from different countries.</p>
          </li>
          <li>
            <span>02</span>
            <strong>Cinema from Goiás</strong>
            <p>A dedicated competition for filmmaking from the state.</p>
          </li>
          <li>
            <span>03</span>
            <strong>Becos da Minha Terra</strong>
            <p>Stories made in Cidade de Goiás, the festival’s home.</p>
          </li>
          <li>
            <span>04</span>
            <strong>Indigenous &amp; traditional peoples</strong>
            <p>A competition dedicated to Indigenous cinema and traditional peoples.</p>
          </li>
        </ol>
        <a href="https://filmfreeway.com/FICA-Brazil" target="_blank" rel="noreferrer">
          Explore the festival’s film sections <ArrowUpRight aria-hidden="true" />
        </a>
      </section>
      <StoryChapters story={story} ChapterHeading={ChapterHeading} />
      <section className="story-photo-essay">
        <div className="story-essay-heading">
          <p className="story-eyebrow">The festival in photographs</p>
          <ChapterHeading>From the screen to the city</ChapterHeading>
          <p>
            Speakers, audiences and filmmakers share the festival. These archive
            photographs show earlier editions; the films above cover 2026.
          </p>
        </div>
        <StoryPhotos story={story} natural />
      </section>
    </>
  );
}
