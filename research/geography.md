# Goiânia and Goiás — sources

Compiled 8 September 2026 for the orientation section on `/practical/`
(`components/orientation.tsx`, `data/geography.ts`). Every figure rendered on
the page appears below with the source it came from. Nothing on that section is
an estimate, and nothing was carried over from a tourism site.

## What the section is, and is not

It answers *where am I* for participants arriving in central Brazil for the
first time: the city's plan and dates, the state's scale and biome, and the
distances between the places the workshop actually uses.

It is **not** a recommendation list, and it deliberately does not tell anyone
where to go on their own. The organiser judged the central district unsafe for
visiting participants on 3 September 2026 and the self-guided Art Deco route
was removed then — see `research/local-guide.md`. That decision stands. Praça
Cívica appears on the city map as the geometric centre of the 1933 plan and as
a distance from the hotel, with no suggestion that a participant should walk
there. Written guidance on independent movement is still owed by LAPIG and is
tracked in `research/pending-information.md`; the site remains silent on it.

Chapada dos Veadeiros and Emas are on the state map because they are the two
UNESCO-inscribed Cerrado sites and the Cerrado is the workshop's subject. Their
distances — 366 km and 422 km — are printed precisely so that nobody reads them
as an afternoon out.

## Figures

### Goiânia

| Figure | Value | Source |
| --- | --- | --- |
| Residents | 1,437,366 | IBGE 2022 Census, aggregate 4709, variable 93, locality N6 5208707 |
| Municipal area | 729.296 km² | IBGE, aggregate 4714, variable 6318, 2022 |
| Elevation | 749 m | Widely published for the city centre; Central Plateau |
| River | Meia Ponte | The only river crossing the municipality |
| Local time | UTC−3 | `America/Sao_Paulo`; Brazil ended daylight saving in 2019 |
| Mid-September | End of the dry season | Aw climate; the wet season runs October–March |

Deliberately absent: temperature and humidity figures, and any advice on what
to wear. Aggregator weather sites were the only readily available source and
`AGENTS.md` reserves clothing and field guidance for LAPIG. The climate fact as
stated is a season, not a forecast.

### Chronology

| Year | Event | Source |
| --- | --- | --- |
| 1933 | Foundation stone laid 24 October under interventor Pedro Ludovico Teixeira | Goiás state government history; IPHAN |
| 1935 | Attílio Corrêa Lima's radial-concentric plan approved | Urban-history literature on the Corrêa Lima plan |
| 1937 | Seat of state government transferred from the town of Goiás | Decree of 1937 |
| 1942 | Formal inauguration, the *Batismo Cultural* | State and municipal records |
| 2003 | IPHAN lists the Art Deco ensemble, 22 buildings and monuments | IPHAN process 1500-T-2002, inscribed in three Livros do Tombo |

IPHAN: <https://www.gov.br/iphan/pt-br/assuntos/noticias/arquitetura-art-deco-de-goiania-completa-19-anos-de-tombamento-pelo-iphan>

### Goiás

| Figure | Value | Source |
| --- | --- | --- |
| Area | 340,242.859 km² | IBGE, aggregate 4714, variable 6318, 2022 |
| Residents | 7,056,495 | IBGE 2022 Census, aggregate 4709, variable 93, locality N3 52 |
| Cattle | 23,729,878 head | IBGE Pesquisa da Pecuária Municipal 2023, aggregate 3939, variable 105, classification 79 category 2670 (Bovino) |
| Cerrado | 97% of the state | IBGE biome map release |
| Density | 20.74 /km² | IBGE, aggregate 4714, variable 614, 2022 |
| Former capital | Cidade de Goiás, until 1937 | As above |

The lede's "more than three head for every resident" is 23,729,878 ÷ 7,056,495
= 3.36. It is arithmetic on the two rows above, not a separate claim; recompute
it if either figure is updated.

UNESCO — Historic Centre of the Town of Goiás, inscribed 2001:
<https://whc.unesco.org/en/list/993/>
UNESCO — Cerrado Protected Areas: Chapada dos Veadeiros and Emas National
Parks, inscribed 2001: <https://whc.unesco.org/en/list/1035>

## Coordinates plotted

Golden Lis, LAPIG and Cidade de Goiás are read from `data/venues.ts` and their
provenance is in `research/venues.md`. The four added here:

| Place | Coordinate | Source |
| --- | --- | --- |
| Santa Genoveva Airport (GYN) | −16.6342407, −49.2155620 | OpenStreetMap, `aerodrome` node |
| Praça Cívica | −16.6810502, −49.2573368 | OpenStreetMap, the pedestrian way of Praça Dr. Pedro Ludovico Teixeira |
| Brasília | −15.7934036, −47.8823172 | Federal District |
| Chapada dos Veadeiros NP | −13.9067840, −47.4161212 | OpenStreetMap |
| Emas NP | −18.1062755, −52.9410633 | OpenStreetMap, `protected_area` relation |

These are **orientation pins, not operational ones**. None of them gets a ride
link, an address or a directions action; the registry rule in `data/venues.ts`
— that a pin a participant is sent to must be confirmed — is untouched, because
nobody is being sent to any of them. A place a participant must actually reach
still belongs in `data/venues.ts` with its own confirmation.

## Drawn geometry

The two maps are generated, never traced. `research/build-maps.py` produces the
path strings at the foot of `data/geography.ts`; run it and re-splice if a
boundary is ever revised.

Boundaries, IBGE territorial mesh service (public, no key):

```
https://servicodados.ibge.gov.br/api/v3/malhas/estados/52?formato=application/vnd.geo+json&qualidade=intermediaria
https://servicodados.ibge.gov.br/api/v3/malhas/estados/53?formato=application/vnd.geo+json&qualidade=intermediaria
https://servicodados.ibge.gov.br/api/v3/malhas/municipios/5208707?formato=application/vnd.geo+json&qualidade=maxima
```

Rio Meia Ponte, OpenStreetMap via Overpass — **ODbL, so attribution is required
wherever the river is drawn**, and the figure caption carries it:

```
[out:json][timeout:180];
way["waterway"="river"]["name"~"Meia Ponte",i](-16.84,-49.46,-16.44,-49.07);
out geom;
```

The query takes a bounding box rather than the municipality, so the river
arrives longer than the city; the component clips it to the boundary path.

**Projection.** Equirectangular with the standard parallel at each map's own
centre latitude: `x = lon·cos(lat₀)`, `y = −lat`. Over one state the distortion
is small, and the projection is invertible, which is what lets `kmPerUnit` — and
therefore the scale bar — be exact along that parallel rather than decorative.

**Distances** are great-circle, computed with the haversine formula on
R = 6371.0088 km (IUGG mean radius), and are labelled straight-line on the page
because they are not road distances. Cidade de Goiás measures 126 km
straight-line; the road journey the Friday bus makes is the ~130 km already
cited elsewhere on the site, and the two are not in conflict.

Simplification is Ramer–Douglas–Peucker in projected space, then rounding to
integer SVG units — about 1.3 km per unit on the state map and 64 m on the
city map, both far below one rendered pixel at the sizes used.
