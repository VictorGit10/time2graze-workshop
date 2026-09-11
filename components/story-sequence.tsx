import { FUNAPE_SEQUENCE } from '@/data/story-features';

/**
 * What a research support foundation does, as a sequence.
 *
 * FUNAPE has no cleared photography and no documented role in this workshop,
 * so this panel stays the shortest of the seven. The heading says "generally"
 * because that is what the source supports; do not quietly promote it into a
 * description of this event's arrangements.
 */
export function StorySequence() {
  return (
    <section className="story-sequence" aria-label="How a support foundation works">
      <p className="story-eyebrow">Generally, how the support works</p>
      <ol>
        {FUNAPE_SEQUENCE.map((item, index) => (
          <li key={item.step}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <strong>{item.step}</strong>
            <p>{item.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
