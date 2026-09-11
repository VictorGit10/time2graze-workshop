import { ArrowUpRight } from 'lucide-react';
import { PARQUE_TECNOLOGICO } from '@/data/story-features';
import type { ChapterTag } from '@/components/story-parts';

/**
 * The address turns out to be the argument.
 *
 * FUNAPE is easy to describe as paperwork and easy to forget. It is also a
 * building, on the campus where the workshop runs, in a science park, next
 * door to the innovation agency and a few hundred metres from the
 * supercomputer that the Cerrado weather centre runs its forecasts on. Listing
 * the neighbours says what the foundation is for better than any sentence
 * about administrative support does.
 *
 * FUNAPE leads the list because this is its panel. Server-rendered, so it
 * prints.
 */
export function StoryPark({ ChapterHeading }: { ChapterHeading: ChapterTag }) {
  return (
    <section className="story-park" aria-label="The Parque Tecnológico Samambaia">
      <div className="story-park-heading">
        <p className="story-eyebrow">Parque Tecnológico Samambaia · 179,000 m²</p>
        <ChapterHeading>The foundation has neighbours</ChapterHeading>
        <p>
          FUNAPE is not an office somewhere else. It has a building on the campus
          where this workshop runs, inside UFG’s science park — discussed from
          2004, built out from 2011 — among the laboratories and centres whose
          projects it administers.
        </p>
      </div>
      <ol>
        {PARQUE_TECNOLOGICO.map((item, index) => (
          <li key={item.name} data-lead={index === 0 ? '' : undefined}>
            <span className="story-park-index">{String(index + 1).padStart(2, '0')}</span>
            <strong>{item.name}</strong>
            <p>{item.text}</p>
          </li>
        ))}
      </ol>
      <a className="story-park-go" href="https://parquesamambaia.ufg.br/" target="_blank" rel="noreferrer">
        Parque Tecnológico Samambaia <ArrowUpRight aria-hidden="true" />
      </a>
    </section>
  );
}
