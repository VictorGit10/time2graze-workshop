# Working on this site

Read this before changing anything.

## What this is

A single-page site for the **Time2Graze Brazil Workshop** — an internal
technical workshop of the Time2Graze project, held at LAPIG / Federal
University of Goiás in Goiânia, 14–18 September 2026.

The audience is roughly 20–30 researchers travelling from Uruguay, Argentina,
Colombia, Tanzania, Nigeria, Uganda, Zimbabwe and Brazil. Many of them will
read this page on a phone, on hotel wi-fi, deciding what time to be in a lobby.

That audience is the whole design brief. The site exists to answer four
questions: *what is this, when is my session, where do I sleep and eat, how do
I get there.*

## The brief

The stated ambition is a **complete, refined, professional** site, and the
resources to get there are available — generating and optimising images,
choosing a different icon set (Phosphor was offered; the site currently uses
lucide-react), whatever the work actually needs. This is not a minimal site by
policy.

Two things were explicitly rejected, and they are narrower than "keep it
simple":

1. **Generic AI aesthetics** — ugly dark backgrounds, neon effects, the look of
   a template.
2. **Advertising copy** — loose, near-metaphorical or promotional sentences.
   In the client's words, phrasing "a commercial guy" would write. The site is
   institutional.

Refinement is wanted. Decoration and salesmanship are not. Those are
compatible, and the difference between them is the main judgement call on this
project.

**Reference:** the previous workshop's site, given as inspiration —
https://sites.google.com/view/gpw-brazil-workshop/home

## History — please read

In August 2026 an AI assistant rewrote this site into a six-page "map sheet"
system: a cartographic metaphor with sheet numbers, a graticule background on
every surface, a coordinate plot, a gazetteer, and pages of prose explaining
the site's own navigation. It was internally consistent and it was worse. It
cost 1,555 lines of CSS, it made people translate "Sheet 05" into "hotel", and
along the way it dropped the presenter names out of the agenda.

That version was reverted on 1 September 2026. The current version is the one
that was there before.

**The failure mode to avoid is applying craft where content is missing.** When
this site looks unfinished, it is usually because a fact has not been confirmed
yet, not because a section needs a richer treatment. Reach for the missing
fact first.

## Rules

- **Keep it one page.** One URL, one Ctrl+F, one link to paste into a group
  chat. The content fits in a scroll; it does not need routing.
- **Plain words for section names.** "Programme", "Materials", "Stay & meals",
  "Maps". No metaphor, no house vocabulary a reader has to learn.
- **Never invent a fact.** Unconfirmed details render as "Pending
  confirmation", "To be published" or "TBD" — visibly. Someone will act on this
  while standing in an arrivals hall. A plausible guess is worse than a blank.
- **Keep the names.** Sessions carry their presenter and institution
  (`Priorities, Barriers, and Partner Needs (Lindsey/WRI)`). That is how a
  participant knows what is expected of them. Do not compress them away.
- **No prose explaining the interface.** If a section needs a paragraph telling
  the reader how to use it, the section is wrong.
- **English only.** The working language of the workshop.

## Design direction

The register is **sober institutional**, in the manner of Land & Carbon Lab
(landcarbonlab.org) — the consortium's parent brand. Restraint, real
photography, generous whitespace, no ornament. The previous edition's site
(Global Pasture Watch, Pirenópolis) is the content model; this one should
carry the same information with far better execution.

**Palette and type are settled.** Cream-green paper (`--paper: #f5f6f2`), dark
forest (`--forest: #184b39`), pale lime accent (`--accent: #dce89b`) — the lime
deliberately rhymes with Land & Carbon Lab's accent. Cormorant Garamond for
display, Manrope for text.

**Know this hazard:** cream background plus high-contrast serif is the single
most common look in AI-generated design right now. This palette sits next to
it. What keeps the site from reading as generated is not the colour — it is
structure and detail. Do not try to fix "it looks AI-made" by changing the
palette; fix it by making the structure specific to this content.

**The thesis is measured time.** Five days, 45 scheduled items, a strict clock,
people arriving from seven time zones. The programme is not one section among
others — it is why the site exists. Everything else is reference material.

In one line: **an international operational document, with editorial finish and
temporal behaviour.**

Count carefully. "45 sessions" is wrong — the 45 includes meals, coffee breaks,
transfers and receptions. Say *scheduled items*.

**The signature is the programme, drawn to scale — on large screens only.**
The vertical axis is real time, so a three-hour workshop occupies three times
the height of a forty-five minute country presentation and the shape of a day
is visible at a glance. Parallel activities sit in adjacent columns, because
that is what they are.

**The constraint that governs this: 20 of the 45 items have no end time.**
Lunches, coffee breaks, check-ins, daily summaries, dinners and both Day 5
transfers carry only a start. Drawing them to a guessed height would invent
duration for 44% of the schedule and break the site's central rule. So the
grid renders four distinct states:

| State | Rendering |
|---|---|
| Confirmed interval (`start` + `end`) | Block, height proportional to duration |
| Start only | Point marker on the axis, no implied height |
| Parallel activities | Separate blocks in adjacent columns, same interval |
| Unconfirmed item (`status: 'tbd'`) | Visibly marked as not yet fixed |

Two of those — a genuinely instantaneous check-in and a lunch whose end nobody
recorded — render identically as point markers. Do not add a field to tell them
apart; it would change nothing on screen. If the team later confirms that lunch
runs 12:00–14:00, it simply becomes an interval.

**Do not force this diagram onto a phone.** Below the desktop breakpoint, and
in print, use a compact chronological list — very well composed, carrying time,
duration, presenter and institution, venue, materials, requirements, calendar
action, and parallel activities grouped under their shared start. Making the
signature work at 375px would turn it into an obstacle. Responsive adaptation
here is correct, not a compromise.

Everything around the programme stays quiet. Structure should encode something
true about the content; if a device is only decorative, cut it.

### How the grid is built

Decisions that came out of building it, and that are easy to break:

- **The two representations live in the same DOM.** The grid is `aria-hidden`;
  the chronological list is what assistive technology reads at every width. On
  large screens the list is clipped out of sight rather than `display: none`,
  so screen-reader users are never left with an absolutely-positioned diagram
  as their only source.
- **The time sits in a column inside each block, not stacked above the title.**
  Stacking costs about 20px of height, which a 45-minute block at 76px/hour
  does not have — that alone clipped 11 of the blocks.
- **Blocks under 45 minutes lay out on one row** (`data-compact`), because
  three stacked lines do not fit in 38px.
- **Session titles are Manrope in both representations.** They are functional
  data, and Cormorant Garamond loses legibility at 13–14px in a narrow block.
  The serif stays for section titles and day names.
- 76px per hour, half-hour rules, hours labelled.

### The "now" state

Only exists during the workshop week. Before and after, nothing is marked and
the panel opens on Day 1.

- **The clock is Goiânia's**, via `Intl` with `America/Sao_Paulo`, whatever
  time it is where the reader is.
- **Null while prerendering.** The site is static, so the build has no "now".
  `useSyncExternalStore` returns null for the server snapshot and the real
  clock arrives after hydration — no mismatch, no effect pushing state.
- **The displayed day is derived, not stored**: `picked ?? today ?? 0`. During
  the week the panel follows the clock on its own; a link or a reader's choice
  sets `picked` and outranks it from then on. Syncing this in an effect was the
  first attempt and it was wrong.
- **Only a session with a recorded end can be "running".** A start alone would
  mean guessing when it finishes. Items without an end can still be "next".
- The now line sits behind the blocks, so it does not strike through their
  text, and its label lives in the axis gutter showing the actual time rather
  than repeating the word.

### Print

- **A separate block, `ProgrammeForPrint`, holds all five days.** The
  interactive panel carries one day, so printing it would quietly produce a
  single day. The print stylesheet hides the panel and shows this block.
- **The print lists carry no `data-session`.** Duplicating the anchors would
  give the deep-link lookup two matches for the same session.
- One day per page (`break-before: page`, `auto` on the first), no session
  split across a page break.
- Interactive chrome, the hero image, the materials list and the map iframes
  are dropped; venue names, practical information and recommendations stay.
  Section backgrounds are forced white — tinted bands spend ink and say
  nothing on paper.

### Deep links

`#day-3` opens that day; a session id opens its day and scrolls to it.

- **No element carries an `id`** — both representations use `data-session`.
  An `id` makes the browser jump to the element on its own, before React has
  switched days, and it fights the scroll.
- **Scroll from an effect, never from `requestAnimationFrame`.** rAF does not
  wait for React to commit, so the session is not in the DOM yet and the scroll
  silently does nothing.
- **`history.scrollRestoration` goes to `manual`** when a session link is
  followed. Otherwise the browser restores the previous position after load and
  lands on top of the one the link asked for.
- **Evening sessions live outside the axis**, so the lookup covers the evening
  block as well as the grid — it picks whichever match is not inside
  `.session-list`.
- `scrollIntoView` is called without `behavior`, letting the CSS decide; the
  `prefers-reduced-motion` rule already switches it to instant.

## Functional standard

Refinement here means utility executed well, not features added:

- **"Today" state**, computed in `America/Sao_Paulo`. Before the workshop the
  site opens on Day 1 and marks nothing as current. From 14–18 September it
  opens on the right day and marks the running session. Afterwards it returns
  to being an institutional archive.
- **Deep links.** `#day-3` and a stable anchor per session, so a material or a
  message can point at one session.
- **Print.** People print agendas. All five days in sequence, one per page
  where possible — which means every day must reach the print output, not only
  the selected tab. Printing the active panel alone would be a bug.
- **Requirements, stated early.** Day 1 includes a Google Earth Engine course;
  participants need a laptop and a registered account before Monday morning.
- **Add to calendar** (`.ics`, per day and per session). High value, but **only
  after times, venues and timezone are confirmed.** Generating calendar files
  from provisional data pushes wrong times into thirty people's phones, which
  is worse than not offering it.
- **Accessibility section**, with a route to ask for support.

## Data model

Extract content into typed data before any redesign. Keep the model small:

```ts
type WorkshopSession = {
  id: string;                  // hand-written, stable, never derived from the title
  date: string;                // full ISO date, not "Day 3"
  start: string;
  end?: string;                // absent = point marker, never a guessed duration
  title: string;
  speakers?: Speaker[];
  venueId?: string;            // into the single venue registry
  kind: 'technical' | 'meal' | 'break' | 'transport' | 'field' | 'social';
  tracks?: ParallelTrack[];    // parallel activities modelled explicitly
  materials?: Material[];
  requirements?: string[];
  status?: 'confirmed' | 'tbd';
};
```

- IDs are written by hand and never change once a material links to one.
- Official timezone is `America/Sao_Paulo`.
- One venue registry, referenced by both the agenda and the maps.
- Parallel activities are two entries sharing an interval — never one combined
  title. Day 1 at 10:00 is currently a single string holding two courses; that
  is a modelling error to fix, not a formatting choice.
- Unknown fields stay absent or `tbd`. Never filled with a plausible value.
- **Materials is an aggregated view of files attached to sessions**, not a
  second list maintained by hand. `lib/materials.ts` reads the agenda; there is
  nothing to keep in step.
- A material's `href` is absent until the file exists. Never invent one, and
  never write a path for a file that has not been uploaded.
- Files belonging to a whole day rather than a session go on `Day.materials` —
  the Day 5 field visit sheet is one. Forcing it onto an arbitrary session
  would be a small lie.
- A track's files link back to the session that holds it, because that is what
  the programme anchors.

Extract the data with no visual change at all, as its own step.

## Type and detail rules

- **12px is the floor for metadata only** — eyebrows, captions, labels.
  Functional text belongs at **14–17px**. The current CSS bottoms out at 8px
  for uppercase labels (`.event-label`, `.information-nav span`,
  `.event-visual p`), which is both an accessibility failure and one of the
  most recognisable tells of generated layout.
- **Tabular numerals for times** (`font-variant-numeric: tabular-nums`) so the
  time column aligns exactly.
- **No third typeface.** Cormorant Garamond and Manrope are enough. Reach for
  weight, size and spacing before reaching for a new family.

## Implementation order

1. Typed data structure, no visual change.
2. Typography and accessibility corrections.
3. Proportional agenda on desktop, chronological list on mobile.
4. `#day-3` links and per-session IDs.
5. Print output covering all five days.
6. "Today / Now / Next" state in `America/Sao_Paulo`.
7. `.ics` files — once times are confirmed.
8. Materials linked to their sessions.
9. Hotel, meals, transport and accessibility, as data is confirmed.

## Planned scope

The empty-looking sections are **deliberate stubs**, not clutter to remove.
The site is meant to grow into a full workshop hub and will receive:

- the actual files for the 22 materials already declared on their sessions
- hotel details, booking and check-in information
- meals and dietary arrangements
- detailed maps of the venues and the region
- participant recommendations: arrival, weather, local guidance

Build these out as the real content arrives. Do not delete the placeholders,
and do not fill them with invented detail in the meantime.

## Layout

```
app/page.tsx      The entire site. Content arrays at the top, JSX below.
app/globals.css   All styles (~230 lines). Imports Tailwind for its reset only;
                  the markup uses semantic class names, not utility classes.
app/layout.tsx    Fonts and metadata (title, description, Open Graph).
public/           Hero image, favicon, og.png.
components/ui/    60 unused shadcn components. Nothing imports them.
```

`app/page.tsx` is `'use client'` because the day tabs and map selector use
`useState`. That is the only reason.

## Content lives at the top of app/page.tsx

Three arrays, before the component:

- `agenda` — the five days and every session
- materials — declared on the session or track that produces them
- `locations` — venues shown in the map panel

To change a session time or add a presenter, edit `agenda`. Nothing else needs
to move.

## Images

**The hero image is temporary.** `public/time2graze-hero.webp` and
`public/og.png` were generated, not photographed. They match the institutional
design and are fine as placeholders, but this is a site about measuring real
land, published by a laboratory that photographs and maps it — a synthetic
Cerrado undercuts that.

Replace it with an authorised photograph of LAPIG, the Samambaia campus, the
Cerrado or Cidade de Goiás. **If no real photograph is available, a sober
typographic header is more honest than a plausible synthetic landscape.**
Never stock imagery, and never a decorative picture standing in for a place.

The prompt
behind the hero, kept so it can be regenerated at another crop or size:

> authentic aerial editorial photograph of well-managed pasture in the Cerrado
> near Goiânia, green and ochre mosaic, native trees and a small herd at
> natural scale, soft morning light, 16:9 composition with negative space; no
> text, logos, neon or stock-photo look

Serve new raster images as WebP. `og.png` stays PNG for social-preview
compatibility.

## Running and deploying

```
npm run dev     Local dev server on :3000
npm run build   Production build into dist/
npm run lint    oxlint
```

Pushing to `main` triggers `.github/workflows/deploy-pages.yml`, which builds
and publishes to https://victorgit10.github.io/time2graze-workshop/

GitHub Pages is the **current** host, chosen to get the site up quickly; it is
not a permanent commitment. The project still carries a Cloudflare Workers
config (`wrangler`, `@cloudflare/vite-plugin`) if it needs to move — which it
would, for example, to serve a private site or a custom domain.

`NEXT_PUBLIC_BASE_PATH` is set by the deploy workflow from the repository name,
so every asset path goes through it — see the hero `<img>` in `page.tsx` and
the favicon in `layout.tsx`. Do not hardcode a leading `/`.

## Waiting on the LAPIG team

Blank on the live site, and not answerable by guessing. Filling these in is the
highest-value work available on this project:

- Hotel: name, address, what the rate covers, check-in and check-out
- Airport transfers: who arranges them, pickup times
- Daily transport between hotel and campus
- Dietary requirements: how participants report them, and by when
- Day 5: the two grazing livestock farms are still "TBD"
- Workshop emergency contact and nearest hospital

The hotel blocks everyone — participants from seven countries are booking
international flights.
