import { ArrowUpRight } from 'lucide-react';
import { StoryChapters, StoryFacts, StoryPhotos, type StoryBodyProps } from '@/components/story-parts';
import { StoryCinema } from '@/components/story-cinema';
import { STORY_FILMS } from '@/data/story-films';
import { STORY_IMAGES } from '@/data/optional-media';

/**
 * The laboratory speaks for itself: three of its own films lead, and the
 * photographs are from its thirty-year retrospective. This composition was
 * already the strongest of the seven and is left alone apart from the week
 * link the frame adds.
 */
export function LapigStory({ story, ChapterHeading }: StoryBodyProps) {
  return (
    <>
      <StoryCinema films={STORY_FILMS.lapig} poster={STORY_IMAGES['lapig-team']} />
      <StoryFacts story={story} />
      <section className="story-photo-essay">
        <div className="story-essay-heading">
          <p className="story-eyebrow">People &amp; practice</p>
          <ChapterHeading>Inside the laboratory</ChapterHeading>
          <p>
            Research takes place around a table, in shared workspaces and through
            collaboration. Photographs from LAPIG’s 2024 anniversary retrospective.
          </p>
        </div>
        <StoryPhotos story={story} natural />
      </section>
      <StoryChapters story={story} ChapterHeading={ChapterHeading} />
      <section className="story-research-paths">
        <p className="story-eyebrow">Explore the work</p>
        <ChapterHeading>From observation to shared knowledge</ChapterHeading>
        <div>
          <a href="https://lapig.iesa.ufg.br/p/38950-programa-de-pesquisa-em-pastagens-ppp?atr=pt-BR&locale=pt-BR" target="_blank" rel="noreferrer">
            <span>01 / Pastures</span>
            <strong>Mapping &amp; monitoring</strong>
            <p>Research on pasture condition and productivity, and the Atlas of Pastures.</p>
            <ArrowUpRight aria-hidden="true" />
          </a>
          <a href="https://www.youtube.com/watch?v=ejSyEkKsdyU" target="_blank" rel="noreferrer">
            <span>02 / Native vegetation</span>
            <strong>Landscapes of Goiás</strong>
            <p>A field perspective from the laboratory’s vegetation atlas film series.</p>
            <ArrowUpRight aria-hidden="true" />
          </a>
          <a href="https://www.youtube.com/watch?v=nihnic0in_o" target="_blank" rel="noreferrer">
            <span>03 / Education</span>
            <strong>Learning geotechnologies</strong>
            <p>Meet Geocursos through TV UFG’s report on the training programme.</p>
            <ArrowUpRight aria-hidden="true" />
          </a>
        </div>
      </section>
    </>
  );
}
