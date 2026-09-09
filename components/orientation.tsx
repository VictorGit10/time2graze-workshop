import { CITY_STORIES } from '@/data/city-guide';
import { FreeTimeMap } from '@/components/free-time-map';

/**
 * Part two of Travel & stay: the city itself, for the hours the programme
 * does not claim. Cidade de Goiás is not repeated here — it is a Friday
 * workshop destination and lives in part one, with its own history.
 */
export function Orientation() {
  const city = CITY_STORIES.goiania;
  return (
    <section
      className="travel-part city-guide"
      id="orientation"
      aria-labelledby="goiania-title"
    >
      <h2 className="travel-part-title" id="goiania-title">
        Goiânia
      </h2>
      <p className="travel-part-lead">
        The city around the workshop, and what is within reach of the hotel on a
        free evening.
      </p>

      <article className="city-introduction">
        <div>
          <p className="travel-eyebrow">{city.subtitle}</p>
          <p className="city-date">Founded in 1933</p>
        </div>
        <div className="city-prose">
          {city.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <a
            className="city-source"
            href={city.source.href}
            target="_blank"
            rel="noreferrer"
          >
            {city.source.label}
          </a>
        </div>
      </article>

      <section
        className="city-free-time"
        id="recommendations"
        aria-labelledby="free-time-title"
      >
        <header className="city-free-time-heading">
          <h3 id="free-time-title">Free time in Goiânia</h3>
          <p>
            Cafés, parks, culture and shopping. Check opening hours with each
            place before setting out.
          </p>
        </header>
        <FreeTimeMap />
      </section>
    </section>
  );
}
