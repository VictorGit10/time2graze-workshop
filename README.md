# Time2Graze Brazil Workshop

Institutional information hub for the internal Time2Graze technical workshop,
held in Goiânia, Brazil, from 14 to 18 September 2026.

Live site: https://victorgit10.github.io/time2graze-workshop/

The site is intentionally operational rather than promotional. It brings the
programme, presentation materials, venues, accommodation, meals, transport and
participant guidance together under four plainly named pages. Unknown
information remains visibly pending; it is never replaced by a plausible guess.

## Current state

Implemented:

- typed agenda, venue and material data;
- proportional programme on large screens and a chronological mobile view;
- explicit parallel tracks and point markers for activities without an end;
- deep links to each day and scheduled item;
- print layout containing all five days;
- `Today`, `Now` and `Next` states in `America/Sao_Paulo`;
- materials generated from the sessions and tracks that produce them;
- venue maps with candidate pins visibly marked and ride links restricted to
  confirmed destinations;
- official and reference institutional logo assets with provenance notes.

Waiting for confirmed information:

- `.ics` calendar files: blocked until times, venues and timezone are approved;
- hotel, booking, check-in and check-out details;
- confirmation of the LAPIG and Centro de Eventos pins and the exact Favo de
  Mel unit;
- airport transfers and daily transport;
- dietary-requirement instructions;
- the two Day 5 farm locations;
- accessibility arrangements, emergency contact and nearest hospital;
- the final partner matrix and logo hierarchy;
- the expected presentation files, shared folder and final programme PDF.

See [AGENTS.md](AGENTS.md) for the complete product, design and implementation
decisions. The complete operational checklist is in
[research/pending-information.md](research/pending-information.md).

## Content model

Content is kept out of the page markup:

- `data/agenda.ts` — days, sessions, tracks, speakers, requirements and
  expected materials;
- `data/venues.ts` — the single venue registry used by the programme and maps;
- `data/types.ts` — the content contracts;
- `lib/materials.ts` — derives the Materials section from the agenda;
- `lib/practical.ts` — derives the meals and transport lines on `/practical/`
  from the agenda;
- `components/programme.tsx` — proportional, chronological and print
  representations of the programme;
- `app/page.tsx` — home page composition. Day and map selection live in the
  programme and practical pages.

Material files belong to a day, session or parallel track. Leave `href` absent
until the file actually exists. The Materials section updates automatically;
there is no second list to maintain.

Stable session IDs are public anchors. Do not rename them after a link or
material has been published.

## Institutional assets

Candidate production marks are in `public/logos/institutions/`. Lower-quality
assets extracted from the previous Global Pasture Watch workshop are research
references only. Sources, restrictions and unresolved permissions are recorded
in [research/logos/README.md](research/logos/README.md).

Having a logo file does not confirm partner status. The final selection,
grouping and order require approval from the Time2Graze/LAPIG team.

## Development

Requirements:

- Node.js 22.13 or later;
- npm.

```bash
npm ci
npm run dev
```

Useful commands:

```bash
npm run build   # production build in out/
npm run lint    # oxlint
npm run format  # oxfmt
```

The generated scaffold still contains 60 unused shadcn components and several
unused dependencies. Global lint currently reports issues inside that unused
scaffold, plus the two intentional plain `<img>` elements used for the hero and
venue photographs. Removing the scaffold is a separate cleanup task and should
not be mixed with content changes.

## Deployment

Pushing `main` runs `.github/workflows/deploy-pages.yml`. The workflow builds
the static Next.js output with the repository base path and publishes it to
GitHub Pages.

Asset URLs must respect `NEXT_PUBLIC_BASE_PATH`; do not hardcode root-relative
paths. `NEXT_PUBLIC_SITE_URL` is supplied during deployment for absolute social
metadata and for the calendar subscription links, which Google and Apple fetch
from their own servers.

`npm run build` and `npm run dev` first run `scripts/build-calendar.mjs`, which
writes the programme's `.ics` files into `public/calendar/`. Those files are
generated, git-ignored, and produced only once `AGENDA_APPROVED` in
`data/agenda.ts` is true — until then the programme shows the calendar action
as pending rather than publishing provisional times.

GitHub Pages is the current delivery target, not a permanent hosting decision.

## Contribution rule

Keep content changes and structural changes in separate commits. Before adding
operational information, verify it with the LAPIG team. A missing fact is safer
than a confident but incorrect instruction to an international participant.
