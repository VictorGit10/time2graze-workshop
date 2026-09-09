# Goiânia and Cidade de Goiás — sources

## Revision — 9 September 2026

The organiser replaced the illustrated-map section with brief city history
and a useful free-time guide for Goiânia. Cidade de Goiás carries richer
historical context and its existing licensed photograph, not a second leisure
guide. The earlier map research below is retained as provenance; it no longer
describes the rendered section. Participant copy now lives in
`data/city-guide.ts`; the source records in `data/geography.ts` are retained.

New copy was checked against these first-party sources:

- Goiânia City Hall, [História de Goiânia](https://www.goiania.go.gov.br/sobre-goiania/historia-de-goiania/):
  foundation on 24 October 1933, Attílio Corrêa Lima's plan, and construction
  near older Campinas. The municipal
  [historical account](https://www.goiania.go.gov.br/shtml/seplam/anuario2012/_html/historico.html)
  confirms the 1937 capital transfer.
- [Goiás Casa Civil](https://goias.gov.br/casacivil/goiania/) confirms the
  planned capital's Art Deco context and Attílio Corrêa Lima's commission.
- Cidade de Goiás City Hall, [A cidade](https://goias.go.gov.br/a-cidade):
  Sant’Anna in 1727, Vila Boa and the capital's transfer in 1937.
- [UNESCO](https://whc.unesco.org/en/list/993/): inscription in 2001, the
  Rio Vermelho, topography, local construction techniques and living cultural
  traditions. The page paraphrases these facts; it does not reproduce the
  UNESCO description.
- [Museu Casa de Cora Coralina](https://museucoracoralina.com.br/o-museu/)
  and [UFG](https://publica.ciar.ufg.br/ebooks/patrimonios-possiveis/10_cleomar_rocha.html):
  poet's dates, former home, museum and collection. Opening hours and entry
  prices are deliberately not copied.

The free-time places and pins are documented in `research/free-time.md`.

Compiled 8 September 2026 for the orientation section on `/practical/`
(`components/orientation.tsx`, `data/geography.ts`). Every figure rendered on
that section appears below with the source it came from. Nothing there is an
estimate, and nothing was carried over from a tourism site.

## What the section is, and is not

It answers *where am I* for participants arriving in central Brazil for the
first time: the planned city the workshop works in, and the colonial town it
spends Friday in.

The two are a pair on purpose. Goiânia was drawn on paper from 1933 to replace
the capital Cidade de Goiás had been since 1739, and the 1937 transfer appears
in both chronologies from its own side. That is why the second module is the
town and not the state: the state has no such relationship to the first module,
and two cities that displaced one another explain each other.

It is **not** a recommendation list, and it deliberately does not tell anyone
where to go on their own. The organiser judged the central district of Goiânia
unsafe for visiting participants on 3 September 2026 and the self-guided Art
Deco route was removed then — see `research/local-guide.md`. That decision
stands. Praça Cívica appears on the city map as the geometry of the 1933 plan
rather than as a destination, and the four markers in Cidade de Goiás describe
the town the workshop is taken to as a group on Friday. Written guidance on
independent movement is still owed by LAPIG and is tracked in
`research/pending-information.md`; the site remains silent on it.

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

| Year | Event | Source |
| --- | --- | --- |
| 1933 | Foundation stone laid 24 October under interventor Pedro Ludovico Teixeira | Goiás state government history; IPHAN |
| 1935 | Attílio Corrêa Lima's radial-concentric plan approved | Urban-history literature on the Corrêa Lima plan |
| 1937 | Seat of state government transferred from the town of Goiás | Decree of 1937 |
| 1942 | Formal inauguration, the *Batismo Cultural* | State and municipal records |
| 2003 | IPHAN lists the Art Deco ensemble, 22 buildings and monuments | IPHAN process 1500-T-2002, inscribed in three Livros do Tombo |

IPHAN: <https://www.gov.br/iphan/pt-br/assuntos/noticias/arquitetura-art-deco-de-goiania-completa-19-anos-de-tombamento-pelo-iphan>

### Cidade de Goiás

The municipality's IBGE code is **5208905**, and its IBGE name is simply
`Goiás` — the same string as the state, which is why the state's own code (52)
and the unrelated municipality 5209101 (Goiatuba) are both easy to reach for by
mistake. Check the returned `nome` on any new query.

| Figure | Value | Source |
| --- | --- | --- |
| Residents | 24,071 | IBGE 2022 Census, aggregate 4709, variable 93, locality N6 5208905 |
| Municipal area | 3,108.423 km² | IBGE, aggregate 4714, variable 6318, 2022 |
| Cattle | 335,983 head | IBGE Pesquisa da Pecuária Municipal 2023, aggregate 3939, variable 105, classification 79 category 2670 (Bovino) |
| World Heritage | Inscribed 2001, criteria (ii) and (iv) | UNESCO |
| State capital | 1739–1937 | As below |
| From Goiânia | 126 km | Haversine, this file's projection section |

"About 14 head per resident" is 335,983 ÷ 24,071 = 13.96. It is arithmetic on
the two rows above, not a separate claim; recompute it if either is updated.
The figure is worth carrying because the two Friday grazing-farm visits are in
this municipality — the farms themselves stay unnamed and pending.

| Year | Event | Source |
| --- | --- | --- |
| 1727 | Bartolomeu Bueno da Silva finds gold on the Rio Vermelho; the camp of Sant'Ana is founded | State and municipal histories |
| 1739 | The camp becomes Vila Boa de Goiás, seat of the captaincy | As above |
| 1889 | Ana Lins dos Guimarães Peixoto — Cora Coralina — born in the house by the bridge | Biographies; the museum's own account |
| 1937 | Government moves to Goiânia; the town keeps the name Goiás | Decree of 1937 |
| 2001 | UNESCO inscribes the historic centre | UNESCO |

UNESCO — Historic Centre of the Town of Goiás: <https://whc.unesco.org/en/list/993/>

The citation's own words are what the map is drawn to show: the centre "is
built between two series of hills, along a small river, the Rio Vermelho", the
right bank "tight up against the north-western hills" with "a popular
character, indicated by the church of Rosario, which was traditionally reserved
for slaves", and the left bank holding the representative buildings. Criterion
(ii) rests on "the urban plan adapted to the topography either side of the
river".

Two claims on the page are drawn straight from that text and no further: the
Rosário's right-bank position, and the reason it is named. **The Casa de Cora
Coralina's bank is deliberately not stated** — its own sources place it "beside
the bridge", which is what the page says; which bank that is was not
established, and left and right bank are defined looking downstream, so the
label cannot be guessed from the map.

## Coordinates plotted

Golden Lis, LAPIG and Cidade de Goiás are read from `data/venues.ts` and their
provenance is in `research/venues.md`. The rest:

| Place | Coordinate | Source |
| --- | --- | --- |
| Santa Genoveva Airport (GYN) | −16.6342407, −49.2155620 | OpenStreetMap, `aerodrome` node |
| Praça Cívica | −16.6810502, −49.2573368 | OpenStreetMap, the pedestrian way of Praça Dr. Pedro Ludovico Teixeira |
| Palácio Conde dos Arcos | −15.9344717, −50.1400060 | OpenStreetMap, `tourism=museum` |
| Museu das Bandeiras | −15.9378569, −50.1402539 | OpenStreetMap, `tourism=museum` |
| Casa de Cora Coralina | −15.9322562, −50.1401647 | OpenStreetMap, `tourism=museum` |
| Igreja do Rosário | −15.9312284, −50.1399828 | OpenStreetMap, `amenity=place_of_worship` |

These are **orientation pins, not operational ones**. None gets a ride link, an
address or a directions action; the registry rule in `data/venues.ts` — that a
pin a participant is sent to must be confirmed — is untouched, because nobody
is being sent to any of them by this section. A place a participant must
actually reach still belongs in `data/venues.ts` with its own confirmation.

## The maps

Each map is a **real basemap with an overlay drawn on it**. The first version
drew everything itself — a municipal boundary, a river and four pins — and the
organiser's verdict was the right one: an administrative outline with no city
inside it is a shape, not a map, and a visitor could not read anything off it.
The previous edition's site was cited as the counter-example; what it actually
used was an ordinary Google Maps embed, and what made it work was banal — it
was a real map, with street names on it.

`research/build-maps.py` writes the two images into `public/images/maps/` and
prints the blocks for `data/geography.ts`. Re-running it must reproduce them.

### The key

Basemap tiles come from **MapTiler**, style `basic-v2-light`, and the key lives
in the `MAPTILER_KEY` environment variable — used on the machine that
regenerates the images and nowhere else. **What ships is the rendered `.webp`;
the key must never enter a committed file.** The images are committed, so the
site builds and deploys with no key and no runtime call to anyone.

MapTiler was chosen over Google specifically for this: Google's Static Maps
terms forbid storing the rendered image beyond 30 days, and committing the file
is the whole approach. MapTiler's free tier does **not** include the rendered
(static) map API — a request to it answers `403 Access to rendered maps not
allowed` with an `X-MAPTILER-FREE: 1` header — but it does serve tiles, so the
frame is stitched here instead.

Attribution for both MapTiler and OpenStreetMap is required wherever a map is
shown, and both figure captions carry it.

### Two mistakes worth not repeating

**MapTiler serves 512px logical tiles, 1024px at `@2x`.** Assuming the usual
256 pasted every tile at half its width; the seams showed as a tonal
checkerboard with the labels sliced at every join.

**Pick the zoom for the width the map is *displayed* at, not the width it is
delivered at.** Tiles render their labels for the zoom's own pixel scale, so
choosing a zoom for the 2x pixel count renders every name for a map twice the
size it is shown at and the labels come out unreadable — which was the original
complaint. `pick_zoom` targets ~580 logical pixels, the plate's displayed
width, and `@2x` supplies the sharpness on top.

### Frames

Each frame is square in Mercator and chosen by what has to be inside it:

| Map | Frame | Across | Zoom |
| --- | --- | --- | --- |
| Goiânia | −49.2914, −16.6906 → −49.1891, −16.5926 | 10.9 km | 12 |
| Cidade de Goiás | −50.14893, −15.9426 → −50.13208, −15.9264 | 1.8 km | 15 |

Goiânia's frame holds the four places the workshop uses — airport, hotel,
LAPIG, Praça Cívica — and nothing decides it beyond that. The municipality is
729 km² and drew those four as one small cluster. Cidade de Goiás is framed on
the inscribed core, not the 3,108 km² municipality.

### The overlay

Drawn on top of each image, in **the image's own pixel space**, so a pin lands
on the street it was computed from. Change the projection on one side and not
the other and everything silently slides.

- **The river**, from OpenStreetMap. `basic-v2-light` does not draw watercourses
  at these zooms, and the river is the subject of both modules — Goiânia's only
  river, and the line UNESCO says the town's whole plan is adapted to.
- **The numbered pins**, from the coordinates in the table above.
- **Scale bar and compass**, on a translucent panel because the streets run
  under them. The bar is computed from `kmPerUnit`, which is the frame's real
  width in kilometres divided by the image width — a real scale, not an
  ornament.
- **The locator inset** on the town map only: the state of Goiás from IBGE's
  territorial mesh, with both towns on it. A 1.8 km street plan is unplaceable
  for a reader who has never been to Brazil. It is the one thing still drawn
  from vector data, it keeps its own equirectangular projection, and it shares
  no frame with the basemap under it.

Overpass queries, unchanged from the first version:

```
[out:json][timeout:180];
way["waterway"="river"]["name"~"Meia Ponte",i](-16.84,-49.46,-16.44,-49.07);
out geom;
```

```
[out:json][timeout:180];
way["waterway"="river"](-15.9480,-50.1560,-15.9250,-50.1310);
out geom;
```

**Overpass mirrors fail in a way that looks like success.** One answered HTTP
200 with `elements: []`, which the script cached and turned into a map with no
river on it. A blank layer is the one failure that looks finished, so
`overpass()` treats an empty result as a failed request, deletes the cache file
and moves to the next mirror.

### Distances

Great-circle, haversine, on R = 6371.0088 km (IUGG mean radius), and labelled
straight-line on the page because they are not road distances. Cidade de Goiás
measures 126 km straight-line; the road journey the Friday bus makes is the
~130 km cited elsewhere on the site, and the two are not in conflict.

Responses and tiles are cached in `research/.map-cache/` (git-ignored). Delete
it to refetch; regenerating the images needs the key, reading the committed
ones does not.
