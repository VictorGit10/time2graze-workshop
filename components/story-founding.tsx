import { UFG_FOUNDERS } from '@/data/story-features';

/**
 * Five schools becoming one university, drawn rather than described.
 *
 * Static on purpose: five names is a composition, not an interaction, and a
 * reader who prints the panel gets the same list. The rule below the names is
 * the join — do not turn it into a decorative divider between other blocks.
 */
export function StoryFounding() {
  return (
    <section className="story-founding" aria-label="The five schools UFG was created from">
      <p className="story-eyebrow">14 December 1960</p>
      <ol>
        {UFG_FOUNDERS.map((school, index) => (
          <li key={school.name}>
            <span className="story-founding-index">{String(index + 1).padStart(2, '0')}</span>
            <strong>{school.name}</strong>
            <small>{school.gloss}</small>
          </li>
        ))}
      </ol>
      <p className="story-founding-result">
        <span>joined to create</span>
        <strong>Universidade Federal de Goiás</strong>
      </p>
    </section>
  );
}
