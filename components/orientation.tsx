import Image from 'next/image';
import { CITY_STORIES } from '@/data/city-guide';
import { VENUES } from '@/data/venues';
import { withBasePath } from '@/lib/base-path';
import { FreeTimeMap } from '@/components/free-time-map';

export function Orientation() {
  const city = CITY_STORIES.goiania;
  const town = CITY_STORIES.goias;
  const photo = VENUES.cidadeDeGoias.photo;
  return (
    <section className="travel-section city-guide" id="orientation" aria-labelledby="city-guide-title">
      <header className="travel-section-heading">
        <h2 id="city-guide-title">Goiânia and Cidade de Goiás</h2>
      </header>
      <article className="city-introduction" aria-labelledby="goiania-history-title">
        <div>
          <p className="travel-eyebrow">{city.subtitle}</p>
          <h3 id="goiania-history-title">{city.title}</h3>
          <p className="city-date">Founded in 1933</p>
        </div>
        <div className="city-prose">
          {city.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          <a className="city-source" href={city.source.href} target="_blank" rel="noreferrer">{city.source.label}</a>
        </div>
      </article>
      <section className="city-free-time" id="recommendations" aria-labelledby="free-time-title">
        <header className="city-free-time-heading">
          <h3 id="free-time-title">Free time in Goiânia</h3>
          <p>Cafés, parks, culture and shopping. Check opening hours with each place before setting out.</p>
        </header>
        <FreeTimeMap />
      </section>
      <article className="city-history" aria-labelledby="goias-history-title">
        <figure className="city-photo">
          <Image src={withBasePath(photo.src)} alt={photo.alt} width={1200} height={795}
            sizes="(max-width: 760px) 100vw, 50vw" loading="lazy" />
          <figcaption><a href={photo.creditHref} target="_blank" rel="noreferrer">{photo.credit}</a></figcaption>
        </figure>
        <div className="city-prose">
          <p className="travel-eyebrow">{town.subtitle}</p>
          <h3 id="goias-history-title">{town.title}</h3>
          {town.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          <p className="city-heritage">UNESCO World Heritage · 2001</p>
        </div>
        <div className="city-history-details">
          {town.details.map((detail) => (
            <section key={detail.title}>
              <h4>{detail.title}</h4>
              <p>{detail.text}</p>
            </section>
          ))}
        </div>
        <div className="city-sources">
          {town.sources.map((source) => <a className="city-source" key={source.href} href={source.href} target="_blank" rel="noreferrer">{source.label}</a>)}
        </div>
      </article>
    </section>
  );
}
