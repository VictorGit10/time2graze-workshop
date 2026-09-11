import imageRecords from '@/data/story-images.json';

export type StoryImage = {
  id: string;
  src: string;
  /** 640px, the gallery's stand-in for the full photograph. */
  thumbnail?: string;
  /** 260px, cropped for the entry row. Built by `scripts/build-entry-thumbs.mjs`. */
  entry?: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
  credit: string;
  sourcePage: string;
  license?: string;
  licenseUrl?: string;
  edits?: string;
};

/** Only locally available, documented images enter this registry. */
export const STORY_IMAGES: Record<string, StoryImage> = {
  ...imageRecords,
  /* LAPIG's own aerial survey photograph, already cleared for this site as the
     home hero (research/venues.md). No visible attribution is required; the
     credit is carried anyway, because the scale ladder is about who observes. */
  hero: {
    id: 'hero', src: '/time2graze-hero.webp', width: 1440, height: 1080,
    alt: 'Aerial view of green pastureland, photographed from above',
    caption: 'Grazing land from the air, in LAPIG’s aerial survey photography.',
    credit: 'LAPIG', sourcePage: 'https://lapig.iesa.ufg.br/',
    edits: 'Cropped, converted to WebP',
  },
  'lapig-building': {
    id: 'lapig-building', src: '/images/venues/lapig.webp', width: 720, height: 420,
    alt: 'Entrance to the LAPIG building on UFG’s Campus Samambaia',
    caption: 'LAPIG, Campus Samambaia · Goiânia', credit: 'LAPIG · Jornal UFG',
    sourcePage: 'https://jornal.ufg.br/n/187113-nos-seus-30-anos-lapig-e-referencia-nacional-na-area-de-geotecnologias',
  },
};
