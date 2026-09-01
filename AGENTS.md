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

## Planned scope

The empty-looking sections are **deliberate stubs**, not clutter to remove.
The site is meant to grow into a full workshop hub and will receive:

- presentation files and supporting documents, per session
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
- `resourceGroups` — the materials list, grouped by day
- `locations` — venues shown in the map panel

To change a session time or add a presenter, edit `agenda`. Nothing else needs
to move.

## Images

`public/time2graze-hero.webp` and `public/og.png` were generated, not
photographed. Both are current and match the institutional design. The prompt
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
