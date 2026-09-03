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
| `/programme/` | The five days, the proportional grid, requirements, print, and `.ics` once times are approved. |
| `/materials/` | Presentations and documents by day, each linked to the session that produces it. |
| `/practical/` | Hotel, meals, transfers, daily transport, maps, recommendations, accessibility, emergency contact. |

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

**Twenty of the 45 end times are provisional.** The organiser explicitly chose
logical display intervals for lunches, coffee breaks, check-ins, summaries,
dinners and Day 5 transfers so every item has the same visual grammar. These
ends remain visibly labelled “End time to confirm”; they must not drive the
live `Now` state or calendar files. The grid renders five distinct states:

| State | Rendering |
|---|---|
| Confirmed interval (`start` + `end`) | Block, height proportional to duration |
| Provisional interval (`endStatus: 'provisional'`) | Proportional block, visibly labelled |
| Start only (fallback) | Point marker on the axis, no implied height |
| Parallel activities | Separate blocks in adjacent columns, same interval |
| Unconfirmed item (`status: 'tbd'`) | Visibly marked as not yet fixed |

Removing `endStatus` after approval promotes the interval to confirmed. Until
then, visual continuity is not operational certainty.

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
- **Blocks of 45 minutes or less lay out on one row** (`data-compact`), because
  the labelled presenter and venue fields do not fit as three stacked lines.
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

### One rail

Every full-width band on the site measures from the same two vertical lines,
and the tokens exist so that stays true: `--gutter` is the calha, `--wide` caps
the band, and `--rail` is `--wide` minus two gutters — the width the content of
a padded section is allowed to reach.

There are two shapes, and they must not be mixed:

- **A band** (`.institutional-hero`, `.now-band`, `.information-nav`) is the
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
  end?: string;                // display interval; inspect endStatus before operational use
  endStatus?: 'provisional';   // visibly provisional; never drives Now or .ics
  title: string;
  speakers?: Speaker[];
  venueId: string | null;      // registry id; null means visibly pending
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
- Unknown fields stay absent or `tbd`. Venue is the explicit exception: every
  session carries `venueId`, with `null` rendered as “Pending confirmation”.
  The other exception is the 20 explicitly authorised provisional end times,
  all carrying `endStatus: 'provisional'`.
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
10. Toolchain migration to Next.js, so that routes actually emit HTML.
11. The four-page split and its persistent navigation.
12. Offline: a service worker or a downloadable PDF — decide, do not assume.

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
app/layout.tsx               Fonts, metadata, and the header/footer every page gets.
app/page.tsx                 Home: today's session, hero, directory, overview.
app/programme/layout.tsx     Route metadata. The page is a client component.
app/programme/page.tsx       Day tabs, deep links and the printable programme.
app/materials/page.tsx       Materials by day. A server component: no state.
app/practical/layout.tsx     Route metadata. The page is a client component.
app/practical/page.tsx       Stay, meals, transport, maps and recommendations.
app/globals.css              Shared tokens, screen, responsive and print styles.
components/site-header.tsx   Persistent navigation, with the current page marked.
components/site-footer.tsx   Footer, shared by every page.
components/now-next.tsx      The home page's "happening now", workshop week only.
components/programme.tsx     Proportional, chronological and print programmes.
hooks/use-tab-keys.ts        Arrow-key movement for a tablist, horizontal or vertical.
data/agenda.ts               The five days, sessions, tracks and materials.
data/types.ts                Content contracts.
data/venues.ts               The single venue registry: names, pins, addresses.
data/practical.ts            Accommodation, contracted shuttle and selected guide links.
hooks/use-workshop-clock.ts  Client clock with a null server snapshot.
lib/base-path.ts             The one place a raw path gets the Pages basePath.
lib/deep-link.ts             Day/session hash resolution and scrolling.
lib/materials.ts             Materials view derived from the agenda.
lib/now.ts                   Goiânia clock and Today/Now/Next rules.
lib/places.ts                Map embed, map link and ride link, from coordinates.
lib/practical.ts             Meals and transport lines, derived from the agenda.
lib/schedule.ts              Time, duration and programme-axis helpers.
next.config.ts               Static export, trailing slash and the Pages basePath.
postcss.config.mjs           Tailwind, imported by globals.css for its reset only.
public/                      Hero, social preview, favicon and candidate logos.
research/logos/              Logo provenance and previous-site references.
research/venues.md           Where every address, pin and photo licence came from.
components/ui/               60 unused shadcn components. Nothing imports them.
```

Only the pages that need the browser are client components: `/programme/`
(day selection, deep links, the clock) and `/practical/` (the map tablist).
`/materials/` is a plain server component and ships no JavaScript of its own;
keep it that way. Content stays in typed data modules rather than being
declared inside a component.

## Where content lives

- Edit `data/agenda.ts` to change a session, presenter, track, requirement or
  expected material. It feeds `/programme/`, `/materials/`, the home page's
  "happening now" band, and the meals and transport lines on `/practical/`
  (`lib/practical.ts`) at once.
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
  Candidate addresses and the candidate Favo de Mel phone stay in
  `research/venues.md`, not in operational fields on the page. Centro de
  Eventos' phone is published because its official UFG page supplies it.
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
  this gate is the `ride` flag, set only where the destination itself is
  confirmed: Golden Lis carries it; LAPIG, Centro de Eventos and Favo de Mel
  do not yet, and the panel says plainly why no ride is offered.
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
npm run dev     Local dev server on :3000
npm run build   Static export into out/
npm run lint    oxlint
```

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
- Confirmation of the Centro de Eventos details and the exact Favo de Mel unit
- Authorised photographs of the hotel, Centro de Eventos and Favo de Mel, with
  credit lines
- Confirm that participants arrange their own airport-to-hotel Uber/taxi
- Confirm the contracted shuttle's 08:00 Monday–Thursday departure, pickup
  points and returns; Friday leaves at 06:30
- Dietary requirements: how participants report them, and by when
- Day 5: the two grazing livestock farms are still "TBD"
- Workshop emergency contact and nearest hospital
- Accessibility arrangements and a contact route for support
- Final partner matrix beyond the publicly documented funder, project leads
  and workshop hosts already grouped on the home page
- Final approval of the agenda, required before `.ics` files are generated
- The 22 expected presentation/document files, the shared-folder route and the
  final programme PDF
- Field checklist, weather guidance and workshop-specific local contacts
- Written guidance on where in Goiânia participants can move around on
  their own. The self-guided Art Deco route was removed from the local
  guide on 3 September 2026 because the organiser judged the central
  district unsafe for visitors; nothing replaced it, so the site is now
  silent on the question rather than reassuring or warning

The hotel coverage confirmation remains urgent for participants booking
international flights.

## Known technical debt

- `components/ui/` contains 60 generated shadcn components that the site does
  not import, along with dependencies used only by that scaffold. Remove them
  as one mechanical cleanup commit, not mixed into feature or content work.
- Global `npm run lint` currently reports accessibility and compiler findings
  in those unused components and in `hooks/use-mobile.ts`, which only the
  scaffold uses. Nothing in `app/` or in the site's own components reports, and
  the repository returns to a clean global lint once the scaffold goes.

**The two raw `<img>` tags are gone.** Both the hero and the venue photographs
render through `next/image` under `images: { unoptimized: true }`, which is what
static export requires. Two attributes carry decisions and must not be dropped:
the hero is `loading="eager"` with `fetchPriority="high"` because it is the LCP
— `next/image` defaults to `loading="lazy"`, and `fetchPriority` alone does not
undo that — and the venue photograph uses `fill` with `sizes`, which works only
because `.venue-photo` is already `position: relative`. `withBasePath` still has
to prefix both sources: `next/image` does not apply `basePath` to a string
`src` when images are unoptimised.
