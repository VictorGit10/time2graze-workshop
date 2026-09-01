# Working on this site

Read this before changing anything.

## What this is

A single-page site for the **Time2Graze Brazil Workshop** — an internal technical
workshop of the Time2Graze project, held at LAPIG / Federal University of Goiás
in Goiânia, 14–18 September 2026.

The audience is roughly 20–30 researchers travelling from Uruguay, Argentina,
Colombia, Tanzania, Nigeria, Uganda, Zimbabwe and Brazil. Many of them will read
this page on a phone, on hotel wi-fi, deciding what time to be in a lobby.

That audience is the whole design brief. The site exists to answer four
questions: *what is this, when is my session, where do I sleep and eat, how do I
get there.* Anything that does not help answer one of those is not an
improvement.

## History — please read

In August 2026 an AI assistant rewrote this site into a six-page "map sheet"
system: a cartographic metaphor with sheet numbers, a graticule background on
every surface, a coordinate plot, a gazetteer, and pages of prose explaining the
site's own navigation. It was internally consistent and it was worse. It cost
1,555 lines of CSS, it made people translate "Sheet 05" into "hotel", and along
the way it dropped the presenter names out of the agenda.

That version was reverted on 1 September 2026. The current version is the one
that was there before, and it is deliberate — not a draft waiting to be
elaborated.

**The failure mode to avoid is applying craft where content is missing.** When
this site looks unfinished, it is almost always because a fact has not been
confirmed yet, not because a section needs a richer treatment.

## Rules

- **Keep it one page.** One URL, one Ctrl+F, one link to paste into a group
  chat. The content fits in a scroll; it does not need routing.
- **Plain words for section names.** "Programme", "Materials", "Stay & meals",
  "Maps". No metaphor, no house vocabulary a reader has to learn.
- **Never invent a fact.** Unconfirmed details render as "Pending confirmation",
  "To be published" or "TBD" — visibly. Someone will act on this while standing
  in an arrivals hall. A plausible guess is worse than a blank.
- **Keep the names.** Sessions carry their presenter and institution
  (`Priorities, Barriers, and Partner Needs (Lindsey/WRI)`). That is how a
  participant knows what is expected of them. Do not compress them away.
- **No new prose explaining the interface.** If a section needs a paragraph
  telling the reader how to use it, the section is wrong.
- **English only.** The working language of the workshop.

## Do not add

A CMS, a database, authentication, a countdown timer, dark mode, page
transitions, a PT/EN language switch, or a second page. These have all been
considered and rejected. If you believe one is now necessary, say so and wait
for an answer — do not build it.

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
- `resourceGroups` — the materials list, grouped by day
- `locations` — venues shown in the map panel

To change a session time or add a presenter, edit `agenda`. Nothing else needs
to move.

## Running and deploying

```
npm run dev     Local dev server on :3000
npm run build   Production build into dist/
npm run lint    oxlint
```

Pushing to `main` triggers `.github/workflows/deploy-pages.yml`, which builds
and publishes to https://victorgit10.github.io/time2graze-workshop/

`NEXT_PUBLIC_BASE_PATH` is set by that workflow from the repository name, so
every asset path in the code goes through it — see the hero `<img>` in
`page.tsx` and the favicon in `layout.tsx`. Do not hardcode a leading `/`.

## Open questions — content, not code

These are blank on the live site and are waiting on the LAPIG team. They cannot
be filled in by guessing, and they are the highest-value thing anyone can do for
this site right now:

- Hotel: name, address, what the rate covers, check-in and check-out
- Airport transfers: who arranges them, pickup times
- Daily transport between hotel and campus
- Dietary requirements: how participants report them, and by when
- Day 5: the two grazing livestock farms are still "TBD"
- Workshop emergency contact and nearest hospital
- `public/og.png` may still show the reverted design — verify before sharing
  the link widely, since it is the preview image in email and WhatsApp
