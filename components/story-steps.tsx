import { ArrowRight } from 'lucide-react';
import { GOIANIA_STEPS } from '@/data/story-features';
import { StoryLink } from '@/components/story-link';

/**
 * Three dates as a sequence rather than as a row of large numbers.
 *
 * The city was drawn before it was built, so its story is an order of events;
 * a statistics row said the same dates and implied no order at all. 1937 is
 * the hinge the two city stories share — the capital arriving here is the
 * capital leaving there — and it carries the link across at that step, where
 * it means something, not only in the list at the foot of the panel.
 */
export function StorySteps() {
  return (
    <ol className="story-steps">
      {GOIANIA_STEPS.map((step) => (
        <li key={step.year}>
          <p className="story-steps-year">{step.year}</p>
          <div>
            <strong>{step.title}</strong>
            <p>{step.text}</p>
            {'hinge' in step && step.hinge && (
              <StoryLink href={step.hinge.href} className="story-steps-hinge">
                {step.hinge.label} <ArrowRight aria-hidden="true" />
              </StoryLink>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
