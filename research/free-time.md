# Free time in Goiânia

9 September 2026. The organiser asked for a personalised version of the
[GMH Workshop – Brazil 2026 map](https://www.google.com/maps/d/viewer?mid=1wDascwQKCzMgoPfq7yvsy1KGaMoXnUc),
created by Nathália Monteiro Teles.

The public KML export is retained in `reference-free-time.kml`. Seven
coordinates are copied exactly to `data/city-guide.ts`; Golden Lis comes
from the existing venue registry. The original external map was not edited.
The site displays the selected points on an independent Leaflet map with
OpenStreetMap tiles and visible OSM attribution. The original map author is
credited under it. The old centre-walking-route exclusion still applies.

Descriptions were checked against:

| Place | Source |
| --- | --- |
| Luiz Café Concept | https://luizcafe.com.br/ |
| La Farine Marista | https://linktr.ee/lafarine.go |
| Parque Flamboyant; Parque Vaca Brava | https://www.goiania.go.gov.br/goianiatur/turismo/roteiros-turisticos/ |
| Centro Cultural Oscar Niemeyer | https://goias.gov.br/turismo/sobre-o-centro-cultural-oscar-niemeyer/ and https://goias.gov.br/cultura/museu-de-ar/ |
| Flamboyant Shopping | https://flamboyant.com.br/gastronomia/ |
| Goiânia Shopping | https://goianiashop.com.br/sobre-o-shopping/ |

Do not infer opening hours, availability, prices, walking times, entrance
coordinates, transport arrangements or safety assessments from these pins.
The links identify places; they do not offer a workshop ride or an itinerary.
The page tells readers to check hours with each place.

The browser loads the map only when the section enters the viewport or the
reader activates it. No tile prefetching or offline download is implemented.
https://operations.osmfoundation.org/policies/tiles/

## Marker correction — 9 September 2026

Browser inspection found Leaflet's later-loaded `display: block` overriding
the marker's grid centring. Marker styles now include the map container in
their selector, so their layout does not depend on stylesheet load order.
Nearby leisure pins use Leaflet.markercluster with a distinct “N places”
label; single numbered pins still correspond to the list. Golden Lis remains
an independent hotel marker. Filtering rebuilds the cluster's layers, and
“Show on map” reveals a clustered marker before opening its popup.

Verified in the browser at 375px and 1440px: centred labels, no overlapping
overview markers at 375px, cluster opening, category filtering and selection
of a previously clustered place from the list.
