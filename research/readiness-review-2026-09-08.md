# Participant release review — 8 September 2026

> Follow-up: the organiser subsequently confirmed accommodation (13–18), hotel
> boarding, 08:00 Mon–Thu departures, Uber from the airport and intercom access
> at LAPIG. Farm details are not required, and presenter/material delivery does
> not block website acceptance. The owner enabled calendar sync every four
> hours. The original findings below are retained as the audit record; current
> content decisions are in `pending-information.md` and the dated AGENTS entry.
>
> Implemented: compact calendar invitation above the day tabs, one whole-week
> download, visible pending/success/error states, native page-anchor handling,
> confirmed Home status, updated travel facts, and Materials copy/day index.
> Eight calendar/sharing tests passed. Sending, success and error were also
> checked in the mobile browser against a local simulated service; no invitation
> was sent to a real address. Existing unrelated regional-content edits were
> preserved.

Reviewed the published GitHub Pages site and current local source. This is an
audit, not a release or a redesign. No application source or published service
was changed. The pre-existing change to `apps-script/sync.gs` was preserved.

## Release assessment

The site has a sound working structure, but is not yet ready to be described as
fully final. The main outstanding issues are arrival logistics, assurance that
the live calendar actually updates, and the calendar form's position and states.
Presentation files that will be produced during the event need not block an
initial participant announcement; preparation files required beforehand do.

## Before describing the site as final

| Priority | Finding | Required completion |
| --- | --- | --- |
| High | Live calendar freshness is unverified. The deployed `action=ping` endpoint returned `status: ok`, but `lastSync: 2026-09-05T23:41:34.606Z` on 8 September. | Inspect the daily trigger and execution failures. Confirm a successful current sync, compare the Google calendar against the published feed, and verify a later scheduled run. The old timestamp does not prove the visible events are wrong, but does not substantiate the promise of automatic updates. |
| High | Travel states both that the 13–18 September hotel booking is organised and that coverage of the full stay is pending. | Confirm dates and payment coverage, including breakfast, with the organiser. Publish a single unambiguous statement. Do not restore the check-in/check-out placeholders removed by the organiser. |
| High | Mon–Thu shuttle departure at 08:00 is provisional; exact boarding points and return times are pending. | Confirm departures, boarding and returns, including Friday's operational arrangements. Friday's 06:30 departure is already confirmed. |
| High | Airport-to-hotel self-arranged transport is implied by the Uber action, but the internal checklist still requests confirmation. | Confirm the arrangement and who is responsible for it; give participants one short factual instruction. |
| Medium | LAPIG's entrance, visitor address and campus access remain pending; the two Friday farms are unnamed. | Obtain operational confirmations. Existing authorised Uber actions may remain; do not invent an entrance or farm address. |
| Medium | Several teaching/presentation activities have no presenter information. | Confirm GEE/GEE App short course, Field Protocol Alignment, DST Data Production, and Tanzania, Nigeria, Uganda and Zimbabwe presentations. Preserve all existing names and institutions. Uruguay, Argentina and Colombia currently identify institutions without individual presenters. |

The expected shared folder and field visit information sheet are still absent.
Decide which materials participants need before arrival and publish those first.
The complete set currently contains 21 expected files and zero published files.
The programme PDF also remains a visible pending item. A dated PDF would offer
a useful offline reference; the static website itself does not guarantee offline
access.

## Calendar experience: proposed final interaction

Place a compact calendar block near the top of Programme, after the title and
timezone and before the day tabs. Keep the schedule easy to reach on a phone.
Do not simply move the existing large block unchanged.

- Primary action: a visibly labelled email field and `Send calendar invitation`.
- Brief context: identify that this is the live Google Calendar; explain the
  need to accept Google's invitation without the current multi-paragraph guide.
- One secondary link: `Download programme (.ics)` for all five days.
- Remove the competing per-day download, Apple button and Google URL-copy
  instructions from the main block. Preserve stable existing download URLs.
- Keep print as a quiet programme action; the printable PDF, when supplied,
  remains a document on Materials.

Required form states:

| State | Visible response |
| --- | --- |
| Ready | Persistent email label; clear submit action. |
| Sending | Loading indicator and `Sending invitation…`; prevent repeat submits and associate the request with the submitted address. Announce progress accessibly. |
| Shared | Persistent success treatment with a check icon, the submitted address and the next step: accept Google's invitation. Do not claim that the user has already subscribed. |
| Already shared | Explain that access already exists; do not imply that another invitation was sent. |
| Invalid | Error associated with the email field and a clear way to correct it. |
| Service error or timeout | Specific failure feedback, retry action and the existing download alternative. A timed-out response must not be described as proof that no invitation was sent. |
| Daily limit | Explain when retry is possible and keep download available. |

Current implementation evidence: `components/add-to-calendar.tsx`,
`lib/calendar-sharing.ts`, and the `.calendar-share*` styles in `app/globals.css`.
Progress currently only changes and disables the button. Result text exists,
but uses the same small muted treatment for success and errors. The email field
has an accessible name but no persistent visible label. Responses do not name
the submitted address, and editing the field does not clear an old result.

The service timeout is ten seconds. A real invitation/acceptance test is still
required. No email invitation was sent during this review.

The endpoint's daily limit is 50; the current code consumes an attempt before
checking existing access. Repeat requests therefore consume the allowance too.
Account for that in the service review, particularly if users retry because the
interface does not clearly confirm the result.

## Other interface findings

1. **Contradictory programme status.** Home says `Draft programme`, although
   `CALENDAR_RELEASE` is `final` and the public feed has 44 confirmed events.
   Derive the status from the publication state rather than maintaining another
   literal label in `components/home.tsx`.
2. **False invalid-link warning.** Clicking `Back to top` on Programme produces
   `That link doesn’t match the current programme. Select a day from the tabs.`
   The hash resolver treats `#top` as an unknown session. Its logic also fails
   to distinguish the valid shared `#content` anchor from an invalid session.
   Handle page anchors separately while preserving feedback for stale session
   links. The Back to top case was reproduced in the published browser.
3. **Calendar options dominate the mobile footer.** At 375 × 812 on Day 1,
   the calendar block starts approximately 1,344 px down the document, occupies
   717 px, and the email form starts around 1,816 px. At the desktop viewport
   of 1280 × 720, the calendar block starts around 1,445 px. These are document
   positions, not scrolling distances from a fixed starting screenshot.
4. **Materials looks like an inventory awaiting delivery.** Keep the expected
   file entries, but clearly distinguish files needed before the event from
   presentations expected afterwards once the organiser supplies that policy.
   The day index wraps to two rows on a phone while Programme has five compact
   choices in one row; aligning their treatment would improve consistency.
5. **Some text describes internal publication work.** The home statement about
   adding institutional marks after approval does not help a participant plan
   their week. Keep approval notes in project documentation and retain only
   the approved marks in the participant-facing section.
6. **Keep useful controls on Travel.** Uber, directions, calling and copying
   the address serve distinct arrival tasks. The calendar's redundant choices
   do not justify removing these useful actions. Map/photo disclosure keeps
   the essential arrival information ahead of optional content.
7. **Small editorial defects.** Day 5's materials disclosure says `1 expected
   files`. The current-session mobile CSS still targets an `h4` despite session
   headings now being `h3`; the Now badge remains available, but the intended
   title colour selector no longer applies.

## What was verified

- Published Home, Programme, Travel and Materials all returned HTTP 200.
- Inspected all four routes in the browser at mobile width; inspected the home
  and programme on desktop, including Programme at 1680 px.
- Header navigation remains visible on mobile. Day selection and arrow-key
  movement worked. The material link for Uganda selected Day 3 and resolved
  the corresponding session; it was not silently left on Day 1.
- Address copying changed the hotel button to `Copied` and exposed an
  accessible confirmation.
- No horizontal document overflow was measured on the mobile programme
  scenarios checked. No overflowing Day 3 grid blocks were detected at 1680 px.
- No warning/error entries were returned by the inspected browser log.
- Production build with the GitHub Pages base path passed and exported HTML
  for all four routes. Lint, TypeScript and the three existing calendar tests
  passed.
- Additional checks passed for before/after-workshop dates, all five day
  selections, session start/end boundaries, provisional intervals and next
  item selection.
- The public whole-workshop feed returned 44 events, all `CONFIRMED`, with no
  location fields. The social-preview image returned HTTP 200.
- The print component contains all five days and separate print styles.

## Final acceptance still needed

- Receive and accept one real calendar invitation with an authorised test
  address; check repeat access, failure and pending states after the redesign.
- Confirm the daily sync in Google's execution history and the actual calendar.
- Visually verify the five-day printed output and the downloadable PDF, if
  supplied. Source inspection is not a print-layout test.
- Test Uber handoff and calendar import on a physical iPhone/Android. Desktop
  and resized-browser checks do not validate native-app behaviour.
- Run the final accessibility and slow-connection checks after interface edits.
  This audit did not run a full automated accessibility or performance audit.
- Reconcile `research/pending-information.md` with current content: its
  introduction still describes approved ends as provisional, and it still
  requests a hotel photograph although the registry now has a supplied one.
  Confirm provenance details rather than counting the photograph as absent.

No new destinations, participant-support placeholders, meal sections or venue
fields in the programme are proposed. Those removals remain organiser decisions.
