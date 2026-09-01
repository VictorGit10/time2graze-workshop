/**
 * The single venue registry. The agenda and the map panel both read from here,
 * so a place is named in one file only.
 *
 * `short` is how a venue appears inside an agenda line ("Lunch @ Samauma");
 * `name` is its full form, used on the map. `onMap` selects — and orders — the
 * venues offered in the map panel.
 */
export type Venue = {
  /** Full form, used on the map. */
  name: string;
  /** Short form, as it appears inside an agenda line ("Lunch @ Samauma"). */
  short: string;
  use: string;
  /** Null while the place has no confirmed address to search for. */
  mapQuery: string | null;
  onMap: boolean;
};

export const VENUES = {
  lapig: {
    name: 'LAPIG · UFG',
    short: 'LAPIG',
    use: 'Welcome, technical sessions and experimental area visit',
    mapQuery: 'LAPIG UFG Goiânia',
    onMap: true,
  },
  centroEventos: {
    name: 'Centro de Eventos · UFG',
    short: 'Centro de Eventos',
    use: 'Lunches during the retreat',
    mapQuery: 'Centro de Eventos UFG Goiânia',
    onMap: true,
  },
  favoDeMel: {
    name: 'Churrascaria Favo de Mel',
    short: 'Churrascaria Favo de Mel',
    use: 'Closing reception · 17 September',
    mapQuery: 'Churrascaria Favo de Mel Goiânia',
    onMap: true,
  },
  cidadeDeGoias: {
    name: 'Cidade de Goiás',
    short: 'Cidade de Goiás',
    use: 'Field visits · 18 September',
    mapQuery: 'Cidade de Goiás Goiás',
    onMap: true,
  },
  funape: {
    name: 'FUNAPE · UFG',
    short: 'FUNAPE',
    use: 'Coffee breaks during the retreat',
    mapQuery: 'FUNAPE UFG Goiânia',
    onMap: false,
  },
  samauma: {
    name: 'Samauma',
    short: 'Samauma',
    use: 'Lunch on day 1',
    mapQuery: 'Samauma Goiânia',
    onMap: false,
  },
  /** Not yet chosen — see the open questions in AGENTS.md. */
  hotel: {
    name: 'Hotel',
    short: 'Hotel',
    use: 'Accommodation and evening meals',
    mapQuery: null,
    onMap: false,
  },
  t2gArea: {
    name: 'T2G Biomass Experimental Area',
    short: 'T2G Biomass Experimental Area',
    use: 'Field visit on day 1',
    mapQuery: null,
    onMap: false,
  },
} satisfies Record<string, Venue>;

export type VenueId = keyof typeof VENUES;

/** A venue offered in the map panel: on the map, and with something to search. */
export type MapVenue = Venue & { id: VenueId; mapQuery: string };

export const MAP_VENUES: MapVenue[] = (Object.keys(VENUES) as VenueId[])
  .map((id) => ({ id, ...VENUES[id] }))
  .filter((v): v is MapVenue => v.onMap && v.mapQuery !== null);
