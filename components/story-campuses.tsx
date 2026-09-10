import { ArrowUpRight } from 'lucide-react';
import { UFG_CAMPUSES } from '@/data/story-features';
import { VENUES } from '@/data/venues';
import { greatCircleKm } from '@/lib/places';

/**
 * Where the reader stands inside the university, and where else it reaches.
 *
 * The distance is computed from the two recorded pins, so it cannot drift from
 * the coordinates the rest of the site navigates by, and it is labelled as a
 * straight line: the coach takes three and a half hours to cover it on Friday.
 * Nothing here says the group visits the Cidade de Goiás campus — it does not.
 */
export function StoryCampuses() {
  const km = Math.round(greatCircleKm(VENUES.lapig.coords, VENUES.cidadeDeGoias.coords));
  return (
    <section className="story-campuses" aria-label="UFG campuses">
      <div className="story-campuses-heading">
        <p className="story-eyebrow">One university, several places</p>
        <p className="story-campuses-note">
          The workshop sits on one of these. Friday’s destination town has another,
          about <strong>{km} km</strong> away in a straight line.
        </p>
      </div>
      <ul>
        {UFG_CAMPUSES.map((campus) => (
          <li key={campus.name} data-week={'week' in campus ? '' : undefined}>
            <strong>{campus.name}</strong>
            <small>{campus.city}</small>
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
