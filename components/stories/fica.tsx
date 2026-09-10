import { ArrowUpRight } from 'lucide-react';
import { StoryChapters, StoryPhotos, type StoryBodyProps, type StoryOpeningProps } from '@/components/story-parts';
import { StoryCinema } from '@/components/story-cinema';
import { FICA_EDITION, FICA_FIGURES, FICA_SHOWCASES } from '@/data/story-features';
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

/**
 * The order is the correction of 10 September 2026. Built around the 2026
 * edition, this panel read as a page about the 27th FICA and not about FICA:
 * a dated title card opened it, and the reader met a theme, a venue and a
 * selection before ever learning what the festival is.
 *
 * Now the festival comes first and the explanation comes early — its subject,
 * the journalist who set its line, what it does between screenings, who runs
 * it. The standing shape follows. One edition, clearly labelled as the most
 * recent of twenty-seven, sits near the foot where a fact about the subject
 * belongs rather than at the top where the subject belongs.
 */
export function FicaStory({ story, ChapterHeading }: StoryBodyProps) {
  return (
    <>
      {/* The billing sits flush on the film, so the card and the screen read
          as one dark block: the room going down before the projector. What it
          bills is the festival — three figures, none of them a single year's. */}
      <section className="fica-billing" aria-label="The festival">
        <p className="fica-billing-line">
          <span>Cidade de Goiás, Goiás</span>
        </p>
        {/* What the figures below cannot say, and what a reader who has never
            heard of FICA most needs: the environment is not a strand in the
            programme, it is the whole subject. The line repeats none of the
            three figures — a standfirst that restates the count beneath it is
            two things saying one thing. */}
        <p className="fica-standfirst">A film festival whose entire subject is the environment.</p>
        <dl className="fica-figures">
          {FICA_FIGURES.map((figure) => (
            <div key={figure.label}>
              <dt>{figure.label}</dt>
              <dd>{figure.value}</dd>
            </div>
          ))}
        </dl>
      </section>
      <StoryCinema films={STORY_FILMS.fica} poster={STORY_IMAGES['fica-city']} />
      <StoryChapters story={story} ChapterHeading={ChapterHeading} />
      <section className="fica-showcases">
        <p className="story-eyebrow">What the festival competes over</p>
        <ChapterHeading>Four competitive showcases</ChapterHeading>
        <ul>
          {FICA_SHOWCASES.map((showcase) => (
            <li key={showcase.name}>
              <p className="fica-showcase-name" lang="pt-BR">{showcase.name}</p>
              <p className="fica-showcase-gloss">{showcase.gloss}</p>
              <p className="fica-showcase-text">{showcase.text}</p>
            </li>
          ))}
        </ul>
        <a href="https://fica.go.gov.br/n/201264-fica-2026-reune-38-filmes-de-sete-paises-em-mostras-competitivas" target="_blank" rel="noreferrer">
          How the showcases were filled in 2026 <ArrowUpRight aria-hidden="true" />
        </a>
      </section>
      <section className="fica-edition">
        <p className="story-eyebrow">The most recent edition</p>
        <dl>
          <div>
            <dt>Edition</dt>
            <dd>{FICA_EDITION.ordinal}</dd>
          </div>
          <div>
            <dt>Dates</dt>
            <dd>{FICA_EDITION.dates}</dd>
          </div>
          <div>
            <dt>Opened at</dt>
            <dd>{FICA_EDITION.venue}</dd>
          </div>
          <div>
            <dt>Theme</dt>
            <dd lang="pt-BR">{FICA_EDITION.theme}<span>{FICA_EDITION.themeGloss}</span></dd>
          </div>
        </dl>
        <p>{FICA_EDITION.honour}</p>
      </section>
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
