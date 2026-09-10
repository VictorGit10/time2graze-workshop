import { ArrowUpRight } from 'lucide-react';
import { UFG_CAMPUSES, UFG_FIGURES } from '@/data/story-features';
import { VENUES } from '@/data/venues';
import { greatCircleKm } from '@/lib/places';
import type { ChapterTag } from '@/components/story-parts';

/**
 * Where the reader stands inside the university, and where else it reaches.
 *
 * The distance to Cidade de Goiás is computed from the two recorded pins, so
 * it cannot drift from the coordinates the rest of the site navigates by, and
 * it is labelled as a straight line: the coach takes three and a half hours to
 * cover it on Friday. Nothing here says the group visits that campus — it does
 * not, and the entry says so.
 *
 * Câmpus Colemar Natal e Silva gets the longer note because it is the one a
 * visitor will not otherwise notice: a university campus with no gate and no
 * perimeter, spread through an ordinary neighbourhood four kilometres from
 * the one they are working on.
 */
export function StoryCampuses({ ChapterHeading }: { ChapterHeading: ChapterTag }) {
  const km = Math.round(greatCircleKm(VENUES.lapig.coords, VENUES.cidadeDeGoias.coords));
  return (
    <section className="story-campuses" aria-label="UFG campuses">
      <div className="story-campuses-heading">
        <p className="story-eyebrow">One university, several places</p>
        <ChapterHeading>Five campuses, six cities</ChapterHeading>
        <p className="story-campuses-note">
          The workshop sits on one of them. Friday’s destination town has another,
          about <strong>{km} km</strong> away in a straight line — three and a half
          hours by coach.
        </p>
        <dl className="story-campuses-figures">
          {UFG_FIGURES.map((figure) => (
            <div key={figure.label}>
              <dt>{figure.label}</dt>
              <dd>{figure.value}</dd>
            </div>
          ))}
        </dl>
      </div>
      <ul>
        {UFG_CAMPUSES.map((campus) => (
          <li key={campus.name} data-week={'week' in campus ? '' : undefined}>
            <p className="story-campuses-name">{campus.name}</p>
            <p className="story-campuses-city">{campus.city}</p>
            <p className="story-campuses-text">{campus.text}</p>
            {'note' in campus && campus.note && <p className="story-campuses-aside">{campus.note}</p>}
            {'week' in campus && <span className="story-campuses-mark">{campus.week}</span>}
            {'href' in campus && campus.href && (
              <a href={campus.href} target="_blank" rel="noreferrer">
                Campus site <ArrowUpRight aria-hidden="true" />
              </a>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
