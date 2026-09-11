"""Regenerate the orientation maps for `/practical/`.

    set MAPTILER_KEY=...        (PowerShell: $env:MAPTILER_KEY = '...')
    python research/build-maps.py

Writes two basemap images into `public/images/maps/` and prints the `export
const` blocks for `data/geography.ts`. `research/geography.md` records the
sources, the licences and why the section exists.

**The key is used here and only here.** It fetches tiles on this machine; what
ships is the rendered `.webp`. Never write it into a committed file.

Three things are drawn, and they must share one projection or the pins will not
sit on the streets:

  - the basemap, MapTiler raster tiles stitched to an exact lon/lat frame;
  - the river, from OpenStreetMap, projected into that same frame — the light
    basemap does not render it, and it is the subject of both modules;
  - the pins, likewise.

Everything above is Web Mercator, because that is what the tiles are. The
locator inset is separate and stays equirectangular: it is its own little map,
drawn from IBGE boundaries, and shares no frame with the others.

Responses are cached in `research/.map-cache/` (git-ignored); delete it to
refetch. Re-running must reproduce the committed blocks exactly.
"""

import gzip
import io
import json
import math
import os
import urllib.parse
import urllib.request

from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
CACHE = os.path.join(HERE, ".map-cache")
OUT_DIR = os.path.join(ROOT, "public", "images", "maps")
R = 6371.0088  # km, IUGG mean radius
UA = "Time2GrazeWorkshopSite/1.0 (+https://lapig-ufg.github.io/time2graze-workshop/)"

# MapTiler serves 512px logical tiles, 1024px at @2x. Assuming the usual 256
# cost an afternoon: tiles were pasted at half their width and the seams showed
# as a tonal checkerboard with the labels sliced at every join.
TILE = 512
STYLE = "basic-v2-light"          # mixed-case labels, no commercial POIs
IMAGE_WIDTH = 1160                # delivered width; displayed at about half
WEBP_QUALITY = 80

MALHA = (
    "https://servicodados.ibge.gov.br/api/v3/malhas/estados/{code}"
    "?formato=application/vnd.geo+json&qualidade=intermediaria"
)
OVERPASS = (
    "https://overpass.kumi.systems/api/interpreter",
    "https://overpass-api.de/api/interpreter",
    "https://overpass.osm.ch/api/interpreter",
)

# The two frames. Each is square in Mercator and each is chosen by what has to
# be inside it, not by an administrative boundary: the municipality of Goiânia
# is 40 km across and drew the four places the workshop uses as one small
# cluster in an outline that told a visitor nothing.
GOIANIA_BOX = (-49.2914, -16.6906, -49.1891, -16.5926)   # 11 km, the four places
TOWN_BOX = (-50.14893, -15.9426, -50.13208, -15.9264)    # 1.8 km, the inscribed core

MEIA_PONTE = (
    '[out:json][timeout:180];\n'
    'way["waterway"="river"]["name"~"Meia Ponte",i]'
    "(-16.84,-49.46,-16.44,-49.07);\nout geom;"
)
RIO_VERMELHO = (
    '[out:json][timeout:180];\n'
    'way["waterway"="river"](-15.9480,-50.1560,-15.9250,-50.1310);\nout geom;'
)

GOIANIA_PINS = {
    "hotel": (-16.6412156, -49.2401076),     # data/venues.ts
    "lapig": (-16.6022387, -49.2649118),     # data/venues.ts
    "airport": (-16.6342407, -49.2155620),
    "civic": (-16.6810502, -49.2573368),
}
TOWN_PINS = {
    "rosario": (-15.9312284, -50.1399828),
    "cora": (-15.9322562, -50.1401647),
    "palacio": (-15.9344717, -50.1400060),
    "bandeiras": (-15.9378569, -50.1402539),
}
LOCATOR_PINS = {
    "goiania": (-16.6810502, -49.2573368),
    "cidade": (-15.9408902, -50.1465398),    # data/venues.ts
}


# ------------------------------------------------------------------ fetching

def fetch(url, name, data=None, binary=False):
    os.makedirs(CACHE, exist_ok=True)
    path = os.path.join(CACHE, name)
    if os.path.exists(path):
        return open(path, "rb").read() if binary else json.load(open(path, encoding="utf-8"))
    request = urllib.request.Request(
        url, data=data.encode() if data else None, headers={"User-Agent": UA}
    )
    with urllib.request.urlopen(request, timeout=180) as response:
        raw = response.read()
        # IBGE answers gzip whether or not it is asked to, and urllib — unlike
        # curl — hands the compressed bytes straight through.
        if response.headers.get("Content-Encoding") == "gzip" or raw[:2] == b"\x1f\x8b":
            raw = gzip.decompress(raw)
    if binary:
        open(path, "wb").write(raw)
        return raw
    body = json.loads(raw.decode("utf-8"))
    json.dump(body, open(path, "w", encoding="utf-8"))
    return body


def overpass(query, name):
    """Query Overpass, moving to the next mirror on failure *or* on silence.

    A loaded mirror can answer 200 with `elements: []`. Accepting that would
    cache the empty answer and draw a map with no river on it — a blank layer
    is the one failure that looks finished — so it counts as a failed request.
    """
    payload = urllib.parse.urlencode({"data": query})
    failures = []
    for host in OVERPASS:
        try:
            doc = fetch(host, name, data=payload)
            if doc.get("elements"):
                return doc
            failures.append(f"{host}: 200 but no elements")
            os.remove(os.path.join(CACHE, name))
        except Exception as error:  # noqa: BLE001 — the next mirror is the handler
            failures.append(f"{host}: {error}")
    raise SystemExit("Overpass returned nothing usable:\n  " + "\n  ".join(failures))


def waterway(query, name):
    return [
        [(p["lon"], p["lat"]) for p in way["geometry"]]
        for way in overpass(query, name)["elements"]
        if len(way.get("geometry", [])) > 1
    ]


def rings(geom):
    def walk(coords):
        if isinstance(coords[0][0], (int, float)):
            yield coords
        else:
            for part in coords:
                yield from walk(part)
    return list(walk(geom["coordinates"]))


def boundary(code):
    doc = fetch(MALHA.format(code=code), f"estados-{code}.geojson")
    return rings(doc["features"][0]["geometry"])


# ------------------------------------------------------------------ geometry

def haversine(a, b):
    (lat1, lon1), (lat2, lon2) = a, b
    p1, p2 = math.radians(lat1), math.radians(lat2)
    h = (
        math.sin((p2 - p1) / 2) ** 2
        + math.cos(p1) * math.cos(p2) * math.sin(math.radians(lon2 - lon1) / 2) ** 2
    )
    return 2 * R * math.asin(math.sqrt(h))


def merc(lon, lat, z):
    """Web Mercator pixel coordinates at zoom z, in TILE-sized tiles."""
    n = TILE * 2 ** z
    r = math.radians(lat)
    return (
        (lon + 180.0) / 360.0 * n,
        (1 - math.log(math.tan(r) + 1 / math.cos(r)) / math.pi) / 2 * n,
    )


def rdp(points, eps):
    """Ramer-Douglas-Peucker, run on already-projected points."""
    if len(points) < 3:
        return points
    (x1, y1), (x2, y2) = points[0], points[-1]
    dx, dy = x2 - x1, y2 - y1
    span = math.hypot(dx, dy)
    worst, index = -1.0, 0
    for i in range(1, len(points) - 1):
        px, py = points[i]
        d = (
            abs(dy * px - dx * py + x2 * y1 - y2 * x1) / span
            if span else math.hypot(px - x1, py - y1)
        )
        if d > worst:
            worst, index = d, i
    if worst <= eps:
        return [points[0], points[-1]]
    return rdp(points[: index + 1], eps)[:-1] + rdp(points[index:], eps)


def dedup(points):
    out = [points[0]]
    for point in points[1:]:
        if point != out[-1]:
            out.append(point)
    return out


def clip(line, box):
    """Runs of `line` inside `box`, one point of slack either side."""
    lon0, lat0, lon1, lat1 = box
    inside = [lon0 <= lon <= lon1 and lat0 <= lat <= lat1 for lon, lat in line]
    runs, current = [], []
    for i, point in enumerate(line):
        near = inside[i] or (i and inside[i - 1]) or (i + 1 < len(line) and inside[i + 1])
        if near:
            current.append(point)
        elif current:
            runs.append(current)
            current = []
    if current:
        runs.append(current)
    return [r for r in runs if len(r) > 1]


# ------------------------------------------------------------------ basemap

def pick_zoom(box, target_px):
    """Smallest zoom whose frame is at least `target_px` logical pixels wide.

    Target the *displayed* width, not the delivered one. Choosing a zoom for
    the 2x pixel count renders every label for a map twice the size it is shown
    at, and the names come out too small to read — which was the whole
    complaint about the drawn maps this replaced.
    """
    for z in range(1, 20):
        if merc(box[2], box[3], z)[0] - merc(box[0], box[1], z)[0] >= target_px:
            return z
    return 19


def basemap(box, name, target_px=580):
    """Stitch tiles to `box` exactly. Returns the frame's projection details."""
    key = os.environ.get("MAPTILER_KEY")
    z = pick_zoom(box, target_px)
    x0, y1 = merc(box[0], box[1], z)     # south edge -> larger y
    x1, y0 = merc(box[2], box[3], z)
    tx0, tx1 = int(x0 // TILE), int(x1 // TILE)
    ty0, ty1 = int(y0 // TILE), int(y1 // TILE)

    canvas = Image.new("RGB", ((tx1 - tx0 + 1) * TILE * 2, (ty1 - ty0 + 1) * TILE * 2))
    for tx in range(tx0, tx1 + 1):
        for ty in range(ty0, ty1 + 1):
            cached = os.path.join(CACHE, f"{STYLE}-{z}-{tx}-{ty}@2x.png")
            if os.path.exists(cached):
                data = open(cached, "rb").read()
            else:
                if not key:
                    raise SystemExit(
                        "MAPTILER_KEY is not set and the tiles are not cached.\n"
                        "The rendered .webp files in public/images/maps/ are "
                        "committed, so this is only needed to regenerate them."
                    )
                url = (f"https://api.maptiler.com/maps/{STYLE}/{z}/{tx}/{ty}@2x.png"
                       f"?key={key}")
                data = fetch(url, f"{STYLE}-{z}-{tx}-{ty}@2x.png", binary=True)
            canvas.paste(
                Image.open(io.BytesIO(data)).convert("RGB"),
                ((tx - tx0) * TILE * 2, (ty - ty0) * TILE * 2),
            )

    crop = canvas.crop((
        round((x0 - tx0 * TILE) * 2), round((y0 - ty0 * TILE) * 2),
        round((x1 - tx0 * TILE) * 2), round((y1 - ty0 * TILE) * 2),
    ))
    height = round(IMAGE_WIDTH * crop.height / crop.width)
    image = crop.resize((IMAGE_WIDTH, height), Image.LANCZOS)
    os.makedirs(OUT_DIR, exist_ok=True)
    path = os.path.join(OUT_DIR, f"{name}.webp")
    image.save(path, "WEBP", quality=WEBP_QUALITY, method=6)

    # Delivered pixels per Mercator pixel, so everything else lands on the map.
    factor = IMAGE_WIDTH / (x1 - x0)
    lat_c = (box[1] + box[3]) / 2
    km = haversine((lat_c, box[0]), (lat_c, box[2]))
    frame = {
        "z": z, "x0": x0, "y0": y0, "factor": factor,
        "width": IMAGE_WIDTH, "height": height,
        "kmPerUnit": km / IMAGE_WIDTH, "box": box,
    }
    print(f"\n### {name}  z={z}  {IMAGE_WIDTH}x{height}  "
          f"{km:.2f} km across  {os.path.getsize(path)//1024} KB")
    return frame


def place(frame, lat, lon):
    x, y = merc(lon, lat, frame["z"])
    return (round((x - frame["x0"]) * frame["factor"]),
            round((y - frame["y0"]) * frame["factor"]))


def trace(frame, lines, eps=0.6):
    """An OSM way list as one SVG path in the basemap's pixel space."""
    out = []
    for line in lines:
        for run in clip(line, frame["box"]):
            pts = dedup([place(frame, lat, lon) for lon, lat in run])
            pts = dedup(rdp(pts, eps))
            if len(pts) > 1:
                out.append("M" + "L".join(f"{x} {y}" for x, y in pts))
    return "".join(out)


# ------------------------------------------------------- the locator, drawn

def locator(layers, places, width=640, pad=12, eps=0.5):
    """The state outline, equirectangular. Its own map, its own projection."""
    frame = [p for lines in layers.values() for line in lines for p in line]
    lat0 = math.radians((min(p[1] for p in frame) + max(p[1] for p in frame)) / 2)
    k = math.cos(lat0)
    xs = [p[0] * k for p in frame]
    ys = [-p[1] for p in frame]
    x0, x1, y0, y1 = min(xs), max(xs), min(ys), max(ys)
    scale = (width - 2 * pad) / (x1 - x0)
    height = (y1 - y0) * scale + 2 * pad

    def to_svg(lon, lat):
        return ((lon * k - x0) * scale + pad, (-lat - y0) * scale + pad)

    paths = {}
    for key, lines in layers.items():
        drawn = []
        for line in lines:
            pts = dedup([(round(a), round(b)) for a, b in
                         rdp(dedup([to_svg(*p) for p in line]), eps)])
            if len(pts) > 1:
                drawn.append("M" + "L".join(f"{a} {b}" for a, b in pts) + "Z")
        paths[key] = "".join(drawn)
    points = {k: tuple(round(v) for v in to_svg(lon, lat))
              for k, (lat, lon) in places.items()}
    print(f"\n### locator  {width}x{round(height)}")
    return {"width": width, "height": round(height), "paths": paths, "points": points}


# --------------------------------------------------------------------- run

city = basemap(GOIANIA_BOX, "goiania")
town = basemap(TOWN_BOX, "cidade-de-goias")
loc = locator({"state": boundary(52), "df": boundary(53)}, LOCATOR_PINS)

city_river = trace(city, waterway(MEIA_PONTE, "meia-ponte.json"))
town_river = trace(town, waterway(RIO_VERMELHO, "rio-vermelho.json"))
print(f"\n### river overlays  goiania {len(city_river)} chars, "
      f"cidade-de-goias {len(town_river)} chars")

print("\n### pin positions, in each image's own pixels")
for label, frame, pins in (("GOIANIA_PLACES", city, GOIANIA_PINS),
                           ("TOWN_PLACES", town, TOWN_PINS)):
    print(f"  {label}")
    for name, (lat, lon) in pins.items():
        x, y = place(frame, lat, lon)
        print(f"    {name:10s} x: {x}, y: {y}")
print("  LOCATOR_PLACES")
for name, (x, y) in loc["points"].items():
    print(f"    {name:10s} x: {x}, y: {y}")

print("\n### straight-line distances (km)")
for label, a, b in (
    ("hotel -> LAPIG", GOIANIA_PINS["hotel"], GOIANIA_PINS["lapig"]),
    ("hotel -> airport", GOIANIA_PINS["hotel"], GOIANIA_PINS["airport"]),
    ("hotel -> Praca Civica", GOIANIA_PINS["hotel"], GOIANIA_PINS["civic"]),
    ("Goiania -> Cidade de Goias", LOCATOR_PINS["goiania"], LOCATOR_PINS["cidade"]),
    ("Rosario -> Museu das Bandeiras", TOWN_PINS["rosario"], TOWN_PINS["bandeiras"]),
):
    print(f"    {label:32s} {haversine(a, b):7.2f}")

print("\n/* paste over the generated blocks in data/geography.ts */\n")
for name, frame, river, layer in (
    ("GOIANIA_MAP", city, city_river, "river"),
    ("TOWN_MAP", town, town_river, "water"),
):
    src = "goiania" if name == "GOIANIA_MAP" else "cidade-de-goias"
    print(f"export const {name} = {{")
    print(f"  src: '/images/maps/{src}.webp',")
    print(f"  width: {frame['width']},")
    print(f"  height: {frame['height']},")
    print("  /** Kilometres per image pixel, across the frame's centre latitude. */")
    print(f"  kmPerUnit: {frame['kmPerUnit']:.6f},")
    print(f"  {layer}: '{river}',")
    print("} as const;\n")

print("export const LOCATOR_MAP = {")
print(f"  width: {loc['width']},")
print(f"  height: {loc['height']},")
for key in ("state", "df"):
    print(f"  {key}: '{loc['paths'][key]}',")
print("} as const;")
