import { ArrowUpRight } from 'lucide-react';
import { StoryChapters, StoryPhotos, type StoryBodyProps, type StoryOpeningProps } from '@/components/story-parts';
import { StoryCinema } from '@/components/story-cinema';
import { FICA_EDITION, FICA_SHOWCASES } from '@/data/story-features';
import { STORY_FILMS } from '@/data/story-films';
import { STORY_IMAGES } from '@/data/optional-media';

/**
 * The acronym, keyed back to the words it was made from.
 *
 * FICA is the only name on this site a reader is likely to meet without being
 * able to unpack it, and the unpacking is the identity: the mark is set large,
 * and the Portuguese name under it carries the four letters it gave up. The
 * walk is greedy and in order — every letter of the mark must land on a word
 * initial — and returns null if it does not, so a mark and a title that stop
 * agreeing render as plain text rather than as a wrong claim about the name.
 */
function keyed(mark: string, title: string) {
  const letters = mark.toUpperCase().split('');
  let next = 0;
  const words = title.split(' ').map((word) => {
    if (next < letters.length && word.slice(0, 1).toUpperCase() === letters[next]) {
      next += 1;
      return { initial: word.slice(0, 1), rest: word.slice(1) };
    }
    return { initial: '', rest: word };
  });
  return next === letters.length ? words : null;
}

/**
 * The masthead. The frame's shared opening puts a serif title beside a lead;
 * this subject has a wordmark instead, and the note it has to carry — a June
 * festival on a September workshop's site — belongs in the opening rather than
 * three bands further down, where a reader scanning the panel would miss it.
 */
export function FicaOpening({ story, Heading }: StoryOpeningProps) {
  const words = story.mark ? keyed(story.mark, story.title) : null;
  return (
    <header className="fica-masthead">
      <p className="story-eyebrow">{story.category}</p>
      <Heading className="fica-title">
        {/* The trailing space is collapsed on screen and separates the mark
            from the name in the heading's accessible text. */}
        {story.mark && <span className="fica-mark">{`${story.mark} `}</span>}
        <span className="fica-name" lang="pt-BR">
          {words
            ? words.map((word, index) => (
              <span key={`${word.initial}${word.rest}${index}`}>
                {word.initial && <b>{word.initial}</b>}
                {word.rest}{index < words.length - 1 ? ' ' : ''}
              </span>
            ))
            : story.title}
        </span>
      </Heading>
      <div className="fica-masthead-text">
        <p className="story-lead">{story.lead}</p>
        {story.note && <p className="fica-note">{story.note}</p>}
      </div>
    </header>
  );
}

export function FicaStory({ story, ChapterHeading }: StoryBodyProps) {
  return (
    <>
      {/* The billing sits flush on the film, so the title card and the screen
          read as one dark block: the room going down before the projector. */}
      <section className="fica-billing" aria-label="The 2026 edition">
        <p className="fica-billing-line">
          <span>{FICA_EDITION.ordinal}</span>
          <span>{FICA_EDITION.dates}</span>
          <span>{FICA_EDITION.venue}</span>
        </p>
        <p className="fica-theme" lang="pt-BR">{FICA_EDITION.theme}</p>
        <p className="fica-theme-gloss">{FICA_EDITION.themeGloss}</p>
        <dl className="fica-figures">
          {FICA_EDITION.figures.map((figure) => (
            <div key={figure.label}>
              <dt>{figure.label}</dt>
              <dd>{figure.value}</dd>
            </div>
          ))}
        </dl>
      </section>
      <StoryCinema films={STORY_FILMS.fica} poster={STORY_IMAGES['fica-city']} />
      <section className="fica-showcases">
        <p className="story-eyebrow">The 2026 competition</p>
        <ChapterHeading>Four competitive showcases</ChapterHeading>
        <ul>
          {FICA_SHOWCASES.map((showcase) => (
            <li key={showcase.name}>
              <p className="fica-showcase-name" lang="pt-BR">{showcase.name}</p>
              <p className="fica-showcase-gloss">{showcase.gloss}</p>
              <p className="fica-showcase-text">{showcase.text}</p>
              <p className="fica-showcase-award">
                <span>{showcase.award.name}</span>
                <span>{showcase.award.value}</span>
              </p>
            </li>
          ))}
        </ul>
        <p className="fica-showcase-note">Prize values as announced for the 2026 edition, which set the same top value across the four showcases.</p>
        <a href="https://fica.go.gov.br/n/201264-fica-2026-reune-38-filmes-de-sete-paises-em-mostras-competitivas" target="_blank" rel="noreferrer">
          The 2026 selection in full <ArrowUpRight aria-hidden="true" />
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
