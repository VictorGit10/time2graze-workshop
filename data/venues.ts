/**
 * The single venue registry. The agenda and the location panel both read from
 * here, so a place is named — and pinned — in one file only.
 *
 * Every coordinate is sourced, and `research/venues.md` records where it came
 * from and what cross-checked it. A sourced pin is still not a confirmed one:
 * `address` stays absent until the venue or the host has confirmed it,
 * `photo` until an authorised photograph exists, and `pending` says on the
 * page what is still missing. A plausible address is worse than a blank one
 * for someone reading this in an arrivals hall.
 *
 * `short` is how a venue appears inside an agenda line;
 * `name` is its full form. `onMap` selects — and orders — the venues offered
 * in the location panel.
 */

/** WGS 84 decimal degrees, as both the map embed and the ride link expect. */
export type Coordinates = { lat: number; lon: number };

export type VenuePhoto = {
  /** Site-rooted path under `public/`. Prefixed with `withBasePath` in use. */
  src: string;
  alt: string;
  /** Author and licence. No photograph is published without one. */
  credit: string;
  creditHref?: string;
};

export type Venue = {
  /** Full form, used on the location panel. */
  name: string;
  /** Short form, as it appears inside an agenda line. */
  short: string;
  use: string;
  /** Where the place is, in words. Safe to print before the address is fixed. */
  locality?: string;
  /** Full postal address. Only once the venue or the host has confirmed it. */
  address?: string;
  /** The pin. Absent while no sourced coordinate exists. */
  coords?: Coordinates;
  /** Latitude span of the embedded map, in degrees. Wider for a whole town. */
  mapSpan?: number;
  /** What is still missing about this place. Rendered visibly. */
  pending?: string;
  /**
   * The workshop takes participants here; they do not make their own way.
   * Suppresses the ride link, which would otherwise offer a 130 km taxi to a
   * place the day-5 bus already covers.
   */
  organisedTransport?: boolean;
  /**
   * A ride link may be offered. Set only where the destination itself is
   * confirmed — both the pin and the address — because a ride link carries a
   * reader to a point rather than to a name they can re-read. Absent means no
   * ride link, however good the sourced pin looks.
   */
  ride?: boolean;
  /** Absent until an authorised photograph exists. */
  photo?: VenuePhoto;
  website?: string;
  phone?: string;
  onMap: boolean;
};

export const VENUES = {
  lapig: {
    name: 'LAPIG · UFG',
    short: 'LAPIG',
    use: 'Welcome, technical sessions and experimental area visit',
    locality: 'Campus Samambaia · Universidade Federal de Goiás, Goiânia',
    /**
     * The address LAPIG publishes carries a street name that looks like a
     * typo and a Caixa Postal CEP that does not resolve to the building, so
     * it is not printed until the team confirms it. The pin is cross-checked
     * against the IESA building in OpenStreetMap, 222 m away.
     */
    coords: { lat: -16.6022387, lon: -49.2649118 },
    pending: 'Postal address, building entrance and campus access to be confirmed by LAPIG.',
    photo: {
      src: '/images/venues/lapig.webp',
      alt: 'Entrance to the LAPIG building on the UFG Campus Samambaia',
      credit: 'Photo: LAPIG · Jornal UFG',
      creditHref: 'https://jornal.ufg.br/n/187113-nos-seus-30-anos-lapig-e-referencia-nacional-na-area-de-geotecnologias',
    },
    website: 'https://lapig.iesa.ufg.br/',
    phone: '+55 62 3521-1360',
    onMap: true,
  },
  hotel: {
    name: 'Golden Lis Hotel Boutique',
    short: 'Golden Lis',
    use: 'Accommodation and evening meals',
    locality: 'Setor Santa Genoveva, Goiânia',
    address: 'Av. das Indústrias, 75 — Setor Santa Genoveva, Goiânia — GO, 74670-600, Brazil',
    /** From the place record the hotel's own site links to. */
    coords: { lat: -16.6412156, lon: -49.2401076 },
    /** The only venue whose address, pin and phone the source itself confirms. */
    ride: true,
    photo: {
      src: '/images/venues/golden-lis.webp',
      alt: 'Front entrance of Golden Lis Hotel Boutique in Goiânia',
      credit: 'Photo supplied for this website',
    },
    pending: 'Confirm that workshop payment and accommodation cover 13–18 September; check-in and check-out times are still to be confirmed.',
    website: 'https://goldenlishoteis.com.br/',
    phone: '+55 62 3639-1003',
    onMap: true,
  },
  centroEventos: {
    name: 'Centro de Eventos · UFG',
    short: 'Centro de Eventos',
    use: 'Lunches during the retreat',
    locality: 'Campus Samambaia · Universidade Federal de Goiás, Goiânia',
    coords: { lat: -16.6040384, lon: -49.2589823 },
    photo: {
      src: '/images/venues/centro-de-eventos.webp',
      alt: 'Centro de Eventos da Universidade Federal de Goiás on Campus Samambaia',
      credit: 'Photo supplied for this website',
    },
    /** Candidate facts stay in research/venues.md, not in operational fields. */
    pending: 'The visitor address and map pin are awaiting confirmation from UFG. The pin is shown for reference only.',
    website: 'https://centrodeeventos.ufg.br/',
    phone: '+55 62 3521-1900',
    onMap: true,
  },
  favoDeMel: {
    name: 'Churrascaria Favo de Mel',
    short: 'Churrascaria Favo de Mel',
    use: 'Closing reception · 17 September',
    locality: 'Setor Sul, Goiânia',
    coords: { lat: -16.6904676, lon: -49.2552251 },
    /** Which house hosts the reception is an open question — no ride link. */
    pending: 'The restaurant unit, address and pin for the closing reception are awaiting confirmation. The map pin is shown for reference only.',
    photo: {
      src: '/images/venues/favo-de-mel.webp',
      alt: 'Entrance to Churrascaria Favo de Mel at night',
      credit: 'Photo supplied by the workshop organiser',
    },
    onMap: true,
  },
  cidadeDeGoias: {
    name: 'Cidade de Goiás',
    short: 'Cidade de Goiás',
    use: 'Field visits · 18 September',
    locality: 'Goiás state, north-west of Goiânia',
    /** A town, not a building: the pin is the municipality, drawn wider. */
    coords: { lat: -15.9408902, lon: -50.1465398 },
    mapSpan: 0.08,
    pending: 'The two grazing livestock farms visited on 18 September are still to be confirmed.',
    organisedTransport: true,
    photo: {
      src: '/images/venues/cidade-de-goias.webp',
      alt: 'Historic street and colonial buildings in Cidade de Goiás',
      credit: 'Historic centre · Adelano Lázaro · CC BY-SA 4.0',
      creditHref: 'https://commons.wikimedia.org/wiki/File:Rua_do_Conjunto_Arquitet%C3%B4nico_da_Cidade_de_Goi%C3%A1s,_Goi%C3%A1s,_Brasil.jpg',
    },
    onMap: true,
  },
  funape: {
    name: 'FUNAPE · UFG',
    short: 'FUNAPE',
    use: 'Coffee breaks during the retreat',
    locality: 'Campus Samambaia · Universidade Federal de Goiás, Goiânia',
    onMap: false,
  },
  t2gArea: {
    name: 'T2G Biomass Experimental Area',
    short: 'T2G Biomass Experimental Area',
    use: 'Field visit on day 1',
    pending: 'Location to be confirmed.',
    onMap: false,
  },
} satisfies Record<string, Venue>;

export type VenueId = keyof typeof VENUES;

/** A venue offered in the location panel: on the map, and with a pin to draw. */
export type MapVenue = Venue & { id: VenueId; coords: Coordinates };

export const MAP_VENUES: MapVenue[] = (Object.keys(VENUES) as VenueId[])
  .map((id): Venue & { id: VenueId } => ({ id, ...VENUES[id] }))
  .filter((v): v is MapVenue => v.onMap && v.coords !== undefined);
