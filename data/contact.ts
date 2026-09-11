/**
 * How participants reach each other. One entry, supplied by the organiser on
 * 11 September 2026.
 *
 * The invite arrived from WhatsApp's share sheet carrying its tracking
 * parameters — `?s=sw&p=i&mlu=4&ilr=4`. Only the code after `chat.whatsapp.com/`
 * identifies the group, so the canonical form is what is stored and published:
 * the parameters describe how the organiser happened to copy the link, not the
 * group, and they would be handed to every reader of a public page.
 *
 * `note` is deliberately factual rather than descriptive. What the group is
 * used for has not been stated, and an invite link is open to anyone holding
 * it — which is the one property a reader should know before tapping.
 */
export const PARTICIPANT_GROUP = {
  href: 'https://chat.whatsapp.com/L88hLHRaUECLTznuPah1cy',
  eyebrow: 'Participants',
  title: 'Workshop WhatsApp group',
  note: 'Opens in WhatsApp. Anyone with the link can join.',
  action: 'Join the group',
  /** The footer says it in two words; the home band has room for four. */
  short: 'WhatsApp group',
} as const;
