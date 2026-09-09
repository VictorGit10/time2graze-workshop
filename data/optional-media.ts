import imageRecords from '@/data/story-images.json';

export type StoryImage = {
  id: string;
  src: string;
  thumbnail?: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
  credit: string;
  sourcePage: string;
  license?: string;
  licenseUrl?: string;
};

/** Only locally available, documented images enter this registry. */
export const STORY_IMAGES: Record<string, StoryImage> = {
  ...imageRecords,
  'lapig-building': {
    id: 'lapig-building', src: '/images/venues/lapig.webp', width: 720, height: 420,
    alt: 'Entrance to the LAPIG building on UFG’s Campus Samambaia',
    caption: 'LAPIG, Campus Samambaia · Goiânia', credit: 'LAPIG · Jornal UFG',
    sourcePage: 'https://jornal.ufg.br/n/187113-nos-seus-30-anos-lapig-e-referencia-nacional-na-area-de-geotecnologias',
  },
};
