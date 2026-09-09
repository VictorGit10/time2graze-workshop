# Working on this site

Read this before changing anything.

## What this is

An information site for the **Time2Graze Brazil Workshop** — an internal
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

That version was reverted on 1 September 2026.

**What was rejected there was the metaphor, not the existence of routes.** On
2 September 2026 the site was deliberately split into four pages — see
[Architecture](#architecture). Do not read the paragraph above as an argument
against that split. The test is the name: `Programme` is a destination a
participant already understands; `Sheet 05` is one they have to learn.

**The failure mode to avoid is applying craft where content is missing.** When
this site looks unfinished, it is usually because a fact has not been confirmed
yet, not because a section needs a richer treatment. Reach for the missing
fact first.

## Rules

- **Four pages, no more.** Home, Programme, Materials, Practical information —
  see [Architecture](#architecture). Do not add a fifth destination, and never
  give a single day, session, venue or hotel a page of its own.
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

## Architecture

Four pages, literal names:

| Path          | Holds |
| ------------- | ----- |
| `/`           | What, when and where; the overview; partners; and during the week, the session running now and the one due next. |
| `/programme/` | The five days, the proportional grid, print, and `.ics` once times are approved. |
| `/materials/` | Presentations and documents by day, each linked to the session that produces it. |
| `/practical/` | Hotel, transfers, daily transport, maps and recommendations. |

The same navigation appears on every page: `Home`, `Programme`, `Materials`,
`Practical information`. On small screens it stays in the sticky header as a
compact scrollable row — not a drawer. Four links in a row beat four links
behind a hamburger.

**`Home` is a link of its own, not only the wordmark.** The wordmark returns
home as well, but a reader three pages deep should not have to know that.

**Why it stopped being one page.** It was one page until September 2026, and
that was right while the content was short. Measured just before the split, it
ran 10 screens on a 1440px desktop and **15.6 screens on a 375px phone**, with
the main navigation set to `display: none` below 760px — so the only shortcuts
sat near the top and disappeared the moment a reader entered the programme.
Several hotel, transport, accessibility and partner details still depend on
confirmation; the corresponding sections already exist and remain visibly
pending.

**Links between pages carry their anchor**: a material points at
`/programme/#d3-country-uganda`, and the programme resolves the day from the
hash on load. Route with `next/link` and write the path from the site root —
`href="/programme/"` — letting `basePath` supply the repository subpath. The
repository name is never written by hand.

**Print belongs to `/programme/`** and covers all five days. There is no
"print the whole site".

**Static is not offline.** A participant in the field with no signal gets only
what their browser already cached. If offline access matters it needs a service
worker or a downloadable PDF — an explicit decision, not something the static
export gives for free.

## Design direction

The register is **sober institutional**, in the manner of Land & Carbon Lab
(landcarbonlab.org) — the consortium's parent brand. Restraint, real
photography, generous whitespace, no ornament. The previous edition's site
(Global Pasture Watch, Pirenópolis) is the content model; this one should
carry the same information with far better execution.

**The workshop has no mark of its own, and must not be given one.** The header
and footer carry the name set in type; an invented badge next to real
institutional marks reads as a logo the project does not have. The favicon is a
plain monogram because a browser tab needs an icon — that is a tab marker, not
a brand.

**Palette and type are settled.** Cream-green paper (`--paper: #f5f6f2`), dark
forest (`--forest: #184b39`), pale lime accent (`--accent: #dce89b`) — the lime
deliberately rhymes with Land & Carbon Lab's accent. Cormorant Garamond for
display, Manrope for text.

**Know this hazard:** cream background plus high-contrast serif is the single
most common look in AI-generated design right now. This palette sits next to
it. What keeps the site from reading as generated is not the colour — it is
structure and detail. Do not try to fix "it looks AI-made" by changing the
palette; fix it by making the structure specific to this content.

**The thesis is measured time.** Five days, 44 scheduled items, a strict clock,
people arriving from seven time zones. The programme is not one section among
others — it is why the site exists. Everything else is reference material.

In one line: **an international operational document, with editorial finish and
temporal behaviour.**

Count carefully. "44 sessions" is wrong — the 44 includes meals, coffee breaks,
transfers and receptions. Say *scheduled items*.

**The signature is the programme, drawn to scale — on large screens only.**
The vertical axis is real time, so a three-hour workshop occupies three times
the height of a forty-five minute country presentation and the shape of a day
is visible at a glance. Parallel activities sit in adjacent columns, because
that is what they are.

**All 45 end times are confirmed.** Twenty of them were logical display
intervals for lunches, coffee breaks, check-ins, summaries, dinners and Day 5
transfers, chosen so every item had the same visual grammar; the organiser
approved them as real on 5 September 2026 and the `endStatus: 'provisional'`
markers came off. The two Day 5 farm visits are confirmed as sessions — which
farm hosts them stays pending on the venue field. The grid still renders the
states below whenever a future item needs one:

| State | Rendering |
|---|---|
| Confirmed interval (`start` + `end`) | Block, height proportional to duration |
| Provisional interval (`endStatus: 'provisional'`) | Proportional block, visibly labelled |
| Start only (fallback) | Point marker on the axis, no implied height |
| Parallel activities | Separate blocks in adjacent columns, same interval |
| Unconfirmed item (`status: 'tbd'`) | Visibly marked as not yet fixed |

Removing `endStatus` after approval promotes the interval to confirmed — that
is exactly what happened here. Until then, visual continuity is not
operational certainty.

**Do not force this diagram onto a phone.** Below the desktop breakpoint, and
in print, use a compact chronological list — very well composed, carrying time,
duration, presenter and institution, venue, materials, calendar
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
- **Blocks of 45 minutes or less lay out on one row** (`data-compact`), because
  the labelled presenter and venue fields do not fit as three stacked lines.
- **Session titles are Manrope in both representations.** They are functional
  data, and Cormorant Garamond loses legibility at 13–14px in a narrow block.
  The serif stays for section titles and day names.
- **The heading levels are h1 → h2 → h3 and must stay contiguous.** The page
  title is the h1, the day name in `.day-summary` and each printed day title
  are h2, and every session title — grid, list and evening alike — is an h3.
  Until September 2026 the day was an h3 and sessions h4, with no h2 anywhere:
  the site's only axe violation, on the one page it exists for. The CSS is
  keyed on those elements (`.day-summary h2`, `.session-body h3`), so changing
  a level means changing the selector with it.
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
- **Only a session with a confirmed end can be "running".** Provisional ends
  are layout data until approved. Start-only items can still be "next".
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
- Interactive chrome, the hero image and the map iframes are dropped; venue
  names, practical information, recommendations and the materials list stay —
  `/materials/` is a page of its own now, and printing it blank would be a
  bug. Only the "prepared to receive" notice is screen-only.
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
- **The day tabs are anchors, not buttons** — `<a role="tab" href="#day-N">`
  with the click intercepted, so modifier-click, open-in-new-tab and copy-link
  all work while the tab semantics (roving tabindex, arrow keys) stay intact.
- **A hash that resolves to nothing is announced** (`role="status"`), not
  silently dropped — a stale session link landing on Day 1 now says so.
- **`[data-session]` carries `scroll-margin-top: 160px`** so a deep-linked
  session clears the sticky header. The session scroll uses `block: center`,
  which ignores scroll-margin — 160px covers the header plus half a block.

### One rail

Every full-width band on the site measures from the same two vertical lines,
and the tokens exist so that stays true: `--gutter` is the calha, `--wide` caps
the band, and `--rail` is `--wide` minus two gutters — the width the content of
a padded section is allowed to reach.

There are two shapes, and they must not be mixed:

- **A band** (`.now-band`, the home hero, the footer) is the
  element itself: `max-width: var(--wide)`,
  `margin: 0 auto`, `padding-inline: var(--gutter)`.
- **A section** (`.section-pad`) keeps its background full-bleed and pads
  itself by `var(--gutter)`; its children are capped at `var(--rail)` and
  centred.

Both put the content edge in the same place at every width. Padding the outer
element in one and the inner element in the other does not: below `--wide` the
two agree, and above it they diverge by exactly one gutter, so the page looks
correct on a laptop and comes apart on a wide monitor. That is how it broke the
first time.

The same trap has a second form. `.section-pad > *` centres with
`margin-inline: auto`, so any child that later sets the `margin` shorthand —
`.programme-facts` needed a negative top margin — has to write `auto` for the
inline sides. Writing `0` silently left-aligns that one band while everything
around it stays centred, which is invisible until the viewport is wider than
`--rail`.

**The first band on a page takes less padding above it.** `.section-pad`'s
`clamp(90px, 10vw, 145px)` is the distance between two bands, and mid-page
there are two things to hold apart. At the top of a page there are not: the
header has just closed with its own rule. Measured on a 1680px monitor, the
inner pages opened with 146px of blank between the header and the word
`Programme` — that is not breathing room, it is a wait before the page says
what it is. `main > .section-pad:first-child` takes `clamp(46px, 5.2vw, 88px)`
instead.

Two things about that rule are load-bearing. It is keyed on
`:first-child` of `main`, so it reaches `/programme/`, `/materials/` and
`/practical/`, which open straight into a band, and not the home page, which
opens with the hero — the hero's whitespace is inside a drawn frame and reads
as composition rather than as a gap, which is why the home never felt empty.
And it sits inside `@media screen`: the selector outranks the `.section-pad`
in the print block, so without that fence it would win on paper too and swap
the printed `14pt` for screen pixels.

### The home page

The home page carries three bands before the overview, in this order, and the
order is the argument: what is happening now, what this is, where to go next.

- **`NowNext` comes first, above the hero.** During the workshop week it is the
  most useful thing on the site, and it renders nothing on the other 360 days,
  so it costs no space when it has nothing to say. It is not sticky: it is an
  announcement, not a control.
- **The hero is a two-column grid** — summary and photograph — capped at
  `--wide`. It remains side by side through wide tablets and stacks below
  960px; stacking it at 1050px made the opening nearly a screen taller at the
  exact width where space was already scarce.
- **Operational facts are distributed without a separate docket.** Date and
  location stay in `.hero-meta` at every width; duration and scheduled-item
  count live in the Programme card; format and host live in the overview. The
  same facts must not be restated in a third visual panel.
- **The hero has one primary action: `View programme`.** It remains available
  before the photograph on a phone, while Materials and Practical information
  belong to the directory immediately below. Repeating both Programme and
  Practical information as buttons and cards weakened the hierarchy.
- **The hero closes with one continuous ink rule.** The directory touches that
  rule and completes the same editorial frame. Do not restore a caption strip
  on the photograph or leave the rule drawn under only one column; either one
  recreates the visual step this composition removed.
- **There is one navigation block, not two.** A strip of five day links to
  `/programme/#day-1…5` sat here until September 2026 and was removed: it put
  eight links in two stacked rows before any content, and it offered a second
  route to the page the `Programme` card already leads to. `#day-3` is still a
  public deep link — the programme rewrites the hash as the reader changes day,
  and arriving on one scrolls to the day tabs — it just is not advertised as a
  menu of its own.
- **The directory carries a status per destination**, `data-status="neutral"`
  or `"pending"`. `Draft programme` is neutral because a draft is a normal
  state, not an outstanding item; only genuinely missing information is amber.
- **The band names no venue.** It used to, for meals, breaks and social items
  (`Lunch @ Cidade de Goiás`), which left it as the one surface on the site
  naming a place after the programme and the `.ics` went silent on 5 September
  2026. The organiser removed it: what a participant needs from the band is
  that the interval exists, not where to stand. Daily movement is the workshop
  shuttle, and Travel & stay holds the places.

`/programme/` and `/practical/` each carry one band of the same kind —
`.programme-facts` and `.practical-status-line`. The programme's includes the
official timezone, which is the one fact a reader in another country cannot
infer. All four bands are hidden in print.

### Motion

Movement was added in September 2026 and is deliberately small. One curve and
three durations live in `:root` as `--m-ease`, `--m-quick` (a state returning
under the cursor), `--m-move` (a change the reader asked for) and `--m-enter`
(the page opening). Every transition on the site uses them; a new one written
in loose seconds re-forks the vocabulary the tokens exist to hold together.

The wordmark in the header carries the hero eyebrow's two-colour rule — pale
lime and dark forest — to its left, and it stands upright: the eyebrow lies
down because it opens a line of text, this one stands because it marks a
two-line wordmark. The colours keep their reading order in both — pale first,
forest second, which is top-to-bottom in the hero and left-to-right here, so
the darker line is the one touching the name. It takes no declared height;
spanning both grid rows with `align-self: stretch` makes it exactly as tall as
the lockup whatever the type size. The footer repeats the name but not the
rule: the footer is not an opening.

Four decisions here are easy to undo by accident:

- **Nothing animates in print.** `@media print` nulls `animation` on
  everything. An entrance using `both` that a print renderer does not run would
  freeze on its first frame, and the first frame is opacity zero — a blank
  agenda on paper.
- **The scroll entrances are CSS, not JavaScript**, via `animation-timeline:
  view()` behind `@supports`. A browser without it drops the rule and opens the
  page fully visible, which is the correct state and not a fallback. An
  IntersectionObserver has no such exit, and `/materials/` is a server
  component that must keep shipping no script of its own.
- **They are also inside `prefers-reduced-motion: no-preference`.** The global
  rule at the top of the stylesheet zeroes durations, and a scroll timeline
  ignores duration entirely — without that media query, a reader who asked for
  less movement would get exactly the effect they asked not to see.
- **Only blocks shorter than the viewport get a scroll entrance.** The `entry`
  phase lasts the element's own height, so a tall one — a day of materials, a
  card on the practical page — would still be fading while it is being read.
  `.resource-group` and `.practical-card` are excluded for that reason.

The day panel on `/programme/` fades on a day change because the panel is
keyed by the active day and remounts. That animation is opacity only, and must
stay that way: `scrollToSession` measures the same commit, and a transform
would move the target under it.

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
- **Add to calendar** (`.ics`, per day and per session). High value, but **only
  after times and timezone are confirmed** — venues are never exposed. The
  calendar went final on 5 September 2026 once the organiser approved every
  interval; generating files from provisional data pushes wrong times into
  thirty people's phones. The live Google Calendar is generated from the same
  files and inherits this gate — see
  [The live Google Calendar](#the-live-google-calendar).

## Data model

Extract content into typed data before any redesign. Keep the model small:

```ts
type WorkshopSession = {
  id: string;                  // hand-written, stable, never derived from the title
  date: string;                // full ISO date, not "Day 3"
  start: string;
  end?: string;                // display interval; inspect endStatus before operational use
  endStatus?: 'provisional';   // visibly provisional; never drives Now or .ics
  title: string;
  speakers?: Speaker[];
  venueId: string | null;      // registry id, recorded but not rendered — see below
  kind: 'technical' | 'meal' | 'break' | 'transport' | 'field' | 'social';
  tracks?: ParallelTrack[];    // parallel activities modelled explicitly
  materials?: Material[];
  status?: 'confirmed' | 'tbd';
};
```

- IDs are written by hand and never change once a material links to one.
- Official timezone is `America/Sao_Paulo`.
- One venue registry, referenced by both the agenda and the maps.
- Parallel activities are two entries sharing an interval — never one combined
  title. Day 1 at 10:00 is currently a single string holding two courses; that
  is a modelling error to fix, not a formatting choice.
- Unknown fields stay absent or `tbd`. The calendar build fails while any
  item carries a provisional end or `tbd` status, so a new unresolved session
  breaks the build rather than shipping a wrong time.
- **`venueId` is carried on every session and rendered nowhere.** It is
  required rather than optional so a place is recorded where one is known, but
  no surface reads it any more: the programme and the `.ics` dropped venues on
  5 September 2026 and the home band followed. `data/venues.ts` still feeds
  Travel & stay, keyed by its own ids. Do not read this as a field to revive
  on a whim — putting a venue back on the agenda is an organiser's decision,
  and the one place that would render it is `sessionTitle` in
  `lib/schedule.ts`.
- **Materials is an aggregated view of files attached to sessions**, not a
  second list maintained by hand. `lib/materials.ts` reads the agenda; there is
  nothing to keep in step.
- A material's `href` is absent until the file exists. Never invent one, and
  never write a path for a file that has not been uploaded. When the file does
  arrive under `public/`, write it site-rooted (`/files/day-1-slides.pdf`, not
  under `/materials/`, which is a route); the materials page adds `basePath`
  to it, because a plain `<a href>` does not get it for free — see
  [Running and deploying](#running-and-deploying).
- Files belonging to a whole day rather than a session go on `Day.materials` —
  the Day 5 field visit sheet is one. Forcing it onto an arbitrary session
  would be a small lie.
- A track's files link back to the session that holds it, because that is what
  the programme anchors.

Extract the data with no visual change at all, as its own step.

## Type and detail rules

- **12px is the floor for metadata only** — eyebrows, captions, labels.
  Functional text belongs at **14–17px**. This was written when the CSS bottomed
  out at 8px for uppercase labels, which was both an accessibility failure and
  one of the most recognisable tells of generated layout. The scale now lives in
  `:root` as `--t-label` (12px), `--t-meta` (13px), `--t-meta-lg` (14px) and
  `--t-body` (15px); reach for a token rather than a literal. `.fact-list dd`
  was the last literal 12px on functional text and became `--t-meta-lg` in
  September 2026 — the `dt` beside it keeps the floor, which is what the floor
  is for.
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
9. Hotel and transport, as data is confirmed.
10. Toolchain migration to Next.js, so that routes actually emit HTML.
11. The four-page split and its persistent navigation.
12. Offline: a service worker or a downloadable PDF — decide, do not assume.

## Planned scope

The empty-looking sections are **deliberate stubs**, not clutter to remove.
The site is meant to grow into a full workshop hub and will receive:

- the actual files for the 21 materials already declared on their sessions
- hotel details, booking and check-in information
- detailed maps of the venues and the region
- participant recommendations: arrival and local guidance

Build these out as the real content arrives. Do not delete the placeholders,
and do not fill them with invented detail in the meantime.

## Layout

```
app/layout.tsx               Fonts, metadata, and the header/footer every page gets.
app/page.tsx                 Home: today's session, hero, directory, overview.
app/programme/layout.tsx     Route metadata. The page is a client component.
app/programme/page.tsx       Day tabs, deep links and the printable programme.
app/materials/page.tsx       Materials by day. A server component: no state.
app/practical/layout.tsx     Route metadata for the stable /practical/ route.
app/practical/page.tsx       Travel & stay: hotel, shuttle, venues. A server component.
app/not-found.tsx            404, listing the same four destinations.
app/globals.css              Shared tokens, screen, responsive and print styles.
app/travel.css               Styles owned by Travel & stay.
components/site-header.tsx   Persistent navigation, with the current page marked.
components/site-footer.tsx   Footer, shared by every page.
components/now-next.tsx      The home page's "happening now", workshop week only.
components/programme.tsx     Proportional, chronological and print programmes.
components/venue-card.tsx    One venue on Travel: actions, copy feedback, map disclosure.
components/add-to-calendar.tsx  .ics downloads, subscription URL and the share form.
hooks/use-tab-keys.ts        Arrow-key movement for the day tablist. Horizontal only.
data/agenda.ts               The five days, sessions, tracks and materials.
data/types.ts                Content contracts.
data/venues.ts               The single venue registry: names, pins, addresses.
data/practical.ts            Accommodation, contracted shuttle and selected guide links.
data/institutions.ts         The marks cleared for display, with their artwork sizes.
data/navigation.ts           The four destinations. The header and the 404 share it.
hooks/use-workshop-clock.ts  Client clock with a null server snapshot.
lib/base-path.ts             The one place a raw path gets the Pages basePath.
lib/deep-link.ts             Day/session hash resolution and scrolling.
lib/materials.ts             Materials view derived from the agenda.
lib/now.ts                   Goiânia clock and Today/Now/Next rules.
lib/places.ts                Map embed, map link and ride link, from coordinates.
lib/schedule.ts              Time, duration and programme-axis helpers.
lib/calendar.ts              RFC 5545 .ics generation for the agenda.
scripts/build-calendar.mjs   Writes public/calendar/ before dev and build.
next.config.ts               Static export, trailing slash and the Pages basePath.
postcss.config.mjs           Tailwind, imported by globals.css for its reset only.
public/                      Hero, social preview, favicon, logos and calendar files.
research/logos/              Logo provenance and previous-site references.
research/venues.md           Where every address, pin and photo licence came from.
apps-script/                clasp project: live calendar sharing + daily .ics sync.
lib/calendar-sharing.ts     JSONP request to the Apps Script web app.
```

Only what needs the browser is a client component. `/programme/` is one, for
day selection, deep links and the clock. `/practical/` is not: it became a
server component when Travel was rebuilt around venue cards, and
`components/venue-card.tsx` is the client part, owning the copy feedback and
the map disclosure. `/materials/` is a plain server component and ships no
JavaScript of its own; keep both that way. Content stays in typed data modules
rather than being declared inside a component.

## Where content lives

- Edit `data/agenda.ts` to change a session, presenter, track or expected
  material. It feeds `/programme/`, `/materials/`, the home page's
  "happening now" band and the calendar files at once.
- Edit `data/venues.ts` to change a venue, its pin or its address. The
  programme, the agenda lines and the location panel share this registry.
  Record where a new fact came from in `research/venues.md` at the same time.
- Materials are declared on the day, session or track that produces them.
  `lib/materials.ts` aggregates them; do not recreate a hand-maintained list.
- The four page components compose the data. Do not move operational facts
  back into their JSX.

## Locations

The location panel on `/practical/` presents each venue: a photograph, a map,
the address, the coordinates and a way to get there. Rules that came out of
building it, and that are easy to break:

- **Pins come from coordinates, never from a search string.** A search string
  is re-resolved by someone else's geocoder on every load, so the place a
  reader sees is whatever that query returns today. The registry carries
  `coords`; the `mapQuery` it used to carry is gone.
- **A sourced pin is not a confirmed pin.** `research/venues.md` records where
  each one came from and what cross-checked it. A venue with no sourced
  coordinate stays off the panel rather than being given an approximate one.
- **Maps are OpenStreetMap embeds** — coordinate-exact and with no API key to
  expose in a static export. They remain a third-party surface governed by
  OpenStreetMap's privacy terms. ODbL attribution is required, and is rendered
  under the panel.
- **An address is printed only once the venue or the host has confirmed it.**
  LAPIG's published address carries a probable typo and a Caixa Postal CEP, so
  the panel shows its locality and a visible pending note instead. A plausible
  address is worse than a blank one for someone reading it out to a driver.
  Candidate addresses stay in `research/venues.md`, not in operational fields
  on the page. Centro de Eventos and Favo de Mel were removed from the registry
  in September 2026 as unconfirmed; their research notes remain in that file and
  a venue returns to `data/venues.ts` only with a sourced pin.
- **A photograph has to be authorised.** Google Maps and Places photographs are
  third-party copyright and cannot be republished — a screenshot does not
  create a licence. Until a venue supplies one, the panel shows a visibly empty
  slot. Wikimedia Commons holds CC BY-SA 4.0 photographs of the campus if an
  interim image is ever wanted; candidates are listed in `research/venues.md`.
  Every published photograph follows its recorded permission terms; the
  LAPIG-owned hero is explicitly cleared for use without visible attribution.
- **The ride link is Uber's documented universal link** (`m.uber.com/looking`,
  with `pickup=my_location` and `drop[0]` as an encoded location object), built
  from the coordinate and confirmed address: the site needs no API key or Uber
  integration account, though the passenger still signs in to Uber to request
  the trip. 99 has no documented equivalent, so the panel says the link opens
  Uber and offers the address and coordinates for every other app. Never
  generate a ride link for a pin that is not right — it
  carries someone to a point, not to a name they can re-read. In the registry
  this gate is the `ride` flag. Golden Lis carries it because its own source
  confirms address, pin and phone; LAPIG carries it by the organiser's explicit
  authorisation of 5 September 2026 over its existing sourced pin, which is not
  the same as a confirmed street address — the card still says so. Cidade de
  Goiás gets no ride: see the next rule.
- **A venue the workshop drives people to carries `organisedTransport: true`
  and gets no ride link.** Cidade de Goiás is reached by the 06:30 bus on day
  5; offering a ride there would propose a 130 km taxi for a journey that is
  already arranged.

## Images

**The hero is now real photography.** `public/time2graze-hero.webp` is a crop of
an aerial pasture photograph owned by LAPIG. The site owner confirmed on 3
September 2026 that it requires no visible attribution. `public/og.png` uses
the same source in an editorial social-preview card with the confirmed event
name, date and location; `public/time2graze-whatsapp-card.png` is its published,
cache-independent copy. The provenance is recorded in `research/venues.md`.

The practical page also carries sourced photographs of the LAPIG façade and
the historic centre of Cidade de Goiás. The latter is contextual — it does not
stand in for either Day 5 farm. Never use stock imagery or a decorative picture
as if it depicted a workshop location.

Serve new raster images as WebP. `og.png` stays PNG for social-preview
compatibility.

### Institutional marks

The home page groups the marks by role. Two rules came out of drawing them, and
both are easy to undo by accident:

- **No plate under a mark.** Each logo used to sit in a bordered white tile on
  a white section — a box drawn around every logo that said nothing about it.
  The marks sit directly on the section, separated by the role columns alone.
- **Every asset is cropped to its own artwork, and the marks are drawn to a
  shared optical area** (`MARK_AREA` in `app/page.tsx`), not a shared height:
  at one height a three-to-one wordmark reads far larger than an upright
  emblem. The `width`/`height` in `data/institutions.ts` are the artwork's own
  dimensions and are what the scaling reads, so a new logo must be cropped to
  its ink before its numbers go in. `research/logos/README.md` records the crop
  applied to each file.

## Running and deploying

```
npm run dev           Local dev server on :3000
npm run build         Static export into out/
npm run lint          oxlint
npm run format:check  oxfmt, reporting only — see below
```

**There is deliberately no `npm run format`.** It existed, it was one word, and
`oxfmt` writes in place by default with no preview. On 9 September 2026 it was
run across the repository and committed as `Apply oxfmt across the repository`:
38 files, 3020 insertions, including 2628 lines of `app/globals.css` and the
deployed Apps Script sources. Nothing was broken by it — but it buried the
feature it travelled with in mechanical churn, and it collided with every other
branch in flight, four days before the workshop.

The script is now split: `format:check` reports and never writes, and
`format:write` exists for someone who has decided to reformat on purpose.
`.oxfmtrc.json` additionally keeps the formatter away from `*.css`, `*.md`,
`*.json` and `apps-script/**`. Three of those are composed by hand and one is
live code — `apps-script/sync.gs` carries a literal NUL byte as the separator
in its content hash, which is why git reports that file as binary and why it
must not be casually rewritten.

**This repository has never been formatted, and that is not a defect to fix.**
`format:check` reports 31 files, and it will keep reporting them. Reformatting
is a decision to take on its own, in its own commit, when nothing else is in
flight — not a tidy-up bundled into someone else's change.

Pushing to `main` triggers `.github/workflows/deploy-pages.yml`, which builds
and publishes `out/` to https://victorgit10.github.io/time2graze-workshop/

**Why Next.js and not `vinext`.** The site was built on `vinext`
1.0.0-beta.5 until September 2026. Its static export could not emit a second
route: a throwaway `/probe` returning nothing but an `<h1>` was classified
`? Unknown` and skipped, no `probe/index.html` was written anywhere in
`dist/`, **and the build still exited successfully.** A silent 404 in
production is not an acceptable failure mode for a site people read while
travelling. Next.js `output: 'export'` writes one HTML file per route. If the
toolchain is ever changed again, prove routing with a throwaway route and a
real deploy before moving any content.

GitHub Pages is the **current** host, chosen to get the site up quickly; it is
not a permanent commitment. The Cloudflare Workers configuration was removed
with `vinext`, since it depended on that server; moving host again means
choosing a new target, not restoring the old one.

`NEXT_PUBLIC_BASE_PATH` is set by the deploy workflow from the repository name.
Know what it does and does not cover:

- `basePath` in `next.config.ts` prefixes `next/link` hrefs and everything
  under `_next/` automatically. Route with `next/link`, and give it the path
  from the site root: `href="/programme/"`, not `href="programme/"`.
- It does **not** touch a plain `<img src>`, a raw `<a href>` or a metadata
  icon. Those go through `withBasePath` in `lib/base-path.ts` — the hero image,
  the favicon, the material downloads and the venue photographs all call it.
  Add a new raw path to that helper rather than reading the environment
  variable again.

**Never write the repository name into a path.** `/time2graze-workshop/…` is
what the browser sees and the wrong thing to put in the source: `basePath`
supplies it at build time, and hardcoding it breaks `npm run dev` and any move
to a host that serves the site from its root.

**This will matter when the material files arrive.** A material's `href`
renders in a plain `<a href>`, so a file under `public/` would 404 on Pages
without the prefix. `withBasePath` handles it, for site-rooted paths only;
external URLs pass through untouched. Keep material files out of
`public/materials/`, which collides with the `/materials/` route.

## The live Google Calendar

`apps-script/` is a Google Apps Script project, pushed with `clasp` (installed
and authenticated on the working machine). It owns one dedicated calendar —
*Time2Graze Brazil Workshop*, never the organiser's own — and does two jobs:

- **Sharing.** The deployed web app receives `?action=share&email=…` and shares
  that calendar with the address as a reader, `sendNotifications: true`, so
  Google sends the invitation and the participant accepts it. An account
  cannot be subscribed silently. The address is checked against the calendar's
  ACL list first, so a repeat request answers "already" and sends nothing.
  A soft daily cap (`DAILY_SHARE_LIMIT` in `apps-script/code.gs`) keeps this
  public endpoint from being used to mass-mail invitations.
- **Sync.** `syncFromSite()` fetches the published
  `/calendar/time2graze-workshop.ics` and makes the Google Calendar match it:
  events are matched by UID, patched only where a content hash changed, and
  deleted when they leave the feed. A daily trigger (armed once by `setup()`)
  keeps it current. **The published .ics is the single source of truth** — the
  script holds no second copy of the programme, and a feed with fewer than
  five events is refused rather than wiping the calendar. Changing the agenda
  and pushing the site is the whole update procedure; the script is not
  touched again.

**Why JSONP and not fetch.** Apps Script responses carry no CORS headers: a
POST from the site is unreadable and a plain GET fails. The site loads a
`<script>` tag with a validated callback name (`lib/calendar-sharing.ts`) and
the endpoint answers `callback({...});` as JavaScript. The address is visible
in the URL — accepted because it is a single field for a workshop of thirty,
not a credential.

**Never import the .ics into Google Calendar manually.** Importing creates a
second, frozen workshop agenda that never syncs again. On 5 September 2026 a
manual import of the beta feed ("Time2Graze Brazil Workshop · Beta",
`…@import.calendar.google.com`) duplicated the agenda with stale locations
next to the synced one; it was deleted with `removeImportedBetaCalendar()` in
`apps-script/sync.gs`, which is guarded to only ever remove an @import
calendar. `syncFromSite()` now ends with
`warnOnDuplicateWorkshopCalendars()`, which logs a warning whenever another
"Time2Graze…" calendar is visible to the account — a recurrence is seen in
the next daily sync's log, not discovered by a participant. Participants
importing the .ics into *their own* calendar apps is fine and intended; the
damage is only a second calendar in the account that hosts the synced one.

**Deploying the script.** Only when the endpoint logic changes — never for a
programme change. `cd apps-script && clasp push`. The first deployment is a
web app: script.google.com → Deploy → New deployment → Web app, "Execute as
me", access "Anyone" — `appsscript.json` already carries these defaults and
the scopes, and running `setup` once in the editor accepts the authorisation
prompt on the owner's side. The `/exec` URL goes into `SHARE_ENDPOINT` in
`lib/calendar-sharing.ts`; the first deployment went live on 5 September 2026
(deployed with `clasp deploy`, version 1), so the share form on `/programme/`
renders. Redeploy only when the endpoint logic changes, and update the constant
to the new `/exec` URL. Never put the organiser's main calendar's ID in
`getWorkshopCalendarId`.

## Waiting on the LAPIG team

Unresolved on the live site, and not answerable by guessing. Filling these in
is the highest-value work available on this project. The complete, dated
checklist is in `research/pending-information.md`; keep that file and this
summary aligned.

- Hotel: accommodation is reported paid and organised for 13–18 September;
  confirm that coverage, what it includes, and check-in/check-out times
- Confirmation of the LAPIG pin, its street address and its CEP — the address
  LAPIG publishes carries a probable typo and a Caixa Postal CEP. See
  `research/venues.md`
- Authorised photographs of any venue that returns to the registry, with
  credit lines
- Confirm that participants arrange their own airport-to-hotel Uber/taxi
- Confirm the contracted shuttle's 08:00 Monday–Thursday departure, pickup
  points and returns; Friday leaves at 06:30
- Day 5: which farms host the two grazing livestock visits — the sessions and
  their times are confirmed since 5 September 2026; only the venue identity
  is pending
- Final partner matrix beyond the publicly documented funder, project leads
  and workshop hosts already grouped on the home page
- The 21 expected presentation/document files, the shared-folder route and the
  final programme PDF
- Written guidance on where in Goiânia participants can move around on
  their own. The self-guided Art Deco route was removed from the local
  guide on 3 September 2026 because the organiser judged the central
  district unsafe for visitors; nothing replaced it, so the site is now
  silent on the question rather than reassuring or warning

**Superseded by the organiser's 8 September confirmations below.** The hotel
dates and daily transport are confirmed. Remaining presenter/material delivery
is owned by session teams and does not block acceptance of the website.

## Known technical debt

**The shadcn scaffold is gone.** `components/ui/` held 60 generated components
nothing imported, `lib/utils.ts` and `hooks/use-mobile.ts` served only them, and
14 packages in `dependencies` were loaded by none of it. All of it was removed
in September 2026 as the single mechanical commit this section had been asking
for; the lockfile went from 541 packages to 155 and `npm run lint` now reports
nothing at all. What ships is `next`, `react`, `react-dom` and `lucide-react`.
Restoring the scaffold is `npx shadcn init`, not a revert. Adding a UI library
back means arguing for it first.

**The two raw `<img>` tags are gone.** Both the hero and the venue photographs
render through `next/image` under `images: { unoptimized: true }`, which is what
static export requires. Two attributes carry decisions and must not be dropped:
the hero is `loading="eager"` with `fetchPriority="high"` because it is the LCP
— `next/image` defaults to `loading="lazy"`, and `fetchPriority` alone does not
undo that — and the venue photograph uses `fill` with `sizes`, which works only
because `.venue-photo` is already `position: relative`. `withBasePath` still has
to prefix both sources: `next/image` does not apply `basePath` to a string
`src` when images are unoptimised.

## Current UX decisions — 5 September 2026

These organiser-approved decisions supersede the earlier navigation and location
presentation rules in this document:

- Four routes remain; navigation is Home, Programme, Travel, Materials. Travel
  uses the existing `/practical/` URL and is titled Travel & stay. All four
  navigation links fit on a phone without horizontal scrolling.
- Programme and ICS do not expose venue fields. Participants use the daily
  workshop shuttle. Preserve session titles, speakers and times.
- Hotel check-in/check-out confirmation has been removed from the site at the
  organiser's request. Other unconfirmed operational facts remain pending.
- The organiser explicitly authorised an Uber link to LAPIG's existing sourced
  coordinates. `ride: true` records that authorisation, not a newly verified
  street address or entrance; do not invent either. Golden Lis also offers Uber;
  Cidade de Goiás continues to use organised transport.
- Travel uses anchored venue blocks, with hotel actions in its opening screen.
  Essential details precede optional map/photo disclosures. No venue selector.
  Existing #stay, #transport, #maps and #map-panel links still resolve; new
  destination links are #hotel, #lapig and #cidade-de-goias.
- `components/venue-card.tsx` owns copy feedback and map disclosure. The Travel
  page itself is a server component; its styles live in `app/travel.css`.
- Mobile days are five compact visible choices. Materials has a day index,
  stable file-entry anchors and explicit View session links. All five print
  days remain available; no venue navigation is added to Programme.
- The Meals section was removed from Travel & stay at the organiser's request
  on 5 September 2026, together with the meals lines in `lib/practical.ts`.
  Meal items remain in the programme as agenda sessions; the `#meals` anchor
  no longer resolves.
- The Participant support section (emergency contact, accessibility contact,
  field checklist & weather) was removed at the organiser's request on
  5 September 2026. `SUPPORT_DETAILS` is gone from `data/practical.ts` and the
  `#help` anchor no longer resolves. Do not restore these placeholders.
- The "Before you arrive" preparation block and the `requirements` session
  field were removed at the organiser's request on 5 September 2026. The
  `.ics` export no longer emits "Bring:" lines. If a session ever needs a
  stated requirement again, reintroduce the field rather than writing it into
  a title.
- The organiser approved all twenty inferred end times and the two Day 5 farm
  visit times on 5 September 2026. Every `endStatus: 'provisional'` and
  `status: 'tbd'` marker came off `data/agenda.ts` and `CALENDAR_RELEASE` is
  `final`: the `.ics` carries confirmed ends, events are CONFIRMED, and the
  "· Beta" suffix is gone from titles. The build now fails on any new
  unresolved item — keep it that way.
- The calendar share web app is deployed (version 1, 5 September 2026) and
  `SHARE_ENDPOINT` in `lib/calendar-sharing.ts` is live, so the
  "get the live calendar by email" form on `/programme/` renders. It is
  idempotent: a repeat request answers `already` and sends nothing.

## Release decisions — 8 September 2026

These organiser confirmations supersede older pending-information lists above:

- Accommodation is 13–18 September 2026. Do not show a coverage warning or
  invent a breakfast/payment breakdown. Check-in/check-out details stay omitted.
- Depart from Golden Lis at 08:00 Monday–Thursday and 06:30 Friday. Hotel
  boarding is confirmed. Return boarding follows the group's activity location;
  no list of return points or pending return details is needed.
- Recommend Uber from the airport to the hotel. Keep the existing Uber, maps,
  call and copy actions.
- If the LAPIG gate is closed, ring the intercom. Do not publish an invented
  postal address. The existing authorised pin remains.
- No farm-identification information or farm-pending warning is required.
- Presenter names and material files are supplied by the session teams. Preserve
  existing names and file placeholders; delivery is not a website acceptance
  blocker. Materials describes files being published as teams supply them.
- The organiser enabled the Google Calendar trigger to run every four hours.
  The older daily-trigger descriptions are historical. Do not recreate the
  trigger or run setup as part of a frontend change.
- Calendar invitations are a compact block at the top of Programme, before
  the day tabs. One labelled email field, clear sending/success/error states,
  and one whole-workshop ICS download replace the multiple subscription choices.
  Existing per-day ICS URLs remain available for previously shared links.
- Home derives its programme publication label from CALENDAR_RELEASE. Remove
  internal institutional-approval prose from the participant-facing page.
- Shared page anchors (#top, #content, #calendar) are not invalid sessions;
  preserve native anchor behaviour and warnings for truly unknown session links.

## City guide — 9 September 2026

The organiser replaced the final illustrated city maps and Useful references
with a city guide, scoped to the end of Practical information. This supersedes
the old orientation presentation described above.

- Goiânia gets brief historical context: the new planned capital, founded in
  1933, contrasted with the older Cidade de Goiás. Its free-time guide adapts
  a selected set of points from the supplied GMH Workshop My Maps.
- Cidade de Goiás gets historical context, its existing licensed photograph,
  the Rio Vermelho, Cora Coralina and living heritage. It is not a second
  free-time itinerary.
- `data/city-guide.ts` holds participant copy and selected points;
  `components/orientation.tsx` composes the section as a server component.
  `components/free-time-map.tsx` owns the interactive Leaflet map and filters.
  The practical page remains a server component.
- Names and coordinates from the reference map are retained with provenance
  in `research/free-time.md`. The original My Maps was not modified.
  Golden Lis is read from the venue registry. No new workshop venues, rides,
  opening times or walking routes are inferred from leisure pins.
- The map loads when its section enters the viewport, with an explicit load
  button fallback. This observer loads a map; it does not animate content.
  All place links render in HTML before map loading. A map failure must not
  remove the list. OSM tile attribution stays visible.
- Preserve the existing restriction on recommending an independent centre
  walking route. Historical discussion of the city is not such a route.
- The old map assets and geography research remain as source history, not
  as a second visible section. Useful references has been removed by request;
  inline history sources and photographic attribution remain.
