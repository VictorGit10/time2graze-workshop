/** Operational arrangements confirmed by the organiser on 8 September 2026. */
export const ACCOMMODATION_PLAN = {
  dates: '13–18 September 2026',
  payment: 'Organised by the workshop',
} as const;

export const SHUTTLE_PLAN = [
  {
    days: 'Mon–Thu',
    time: '08:00',
    detail: 'Departure from Golden Lis for the day’s workshop venue',
    provisional: false,
  },
  {
    days: 'Friday',
    time: '06:30',
    detail: 'Departure from Golden Lis for Cidade de Goiás',
    provisional: false,
  },
] as const;

export const LOCAL_GUIDES = [
  {
    title: 'UFG guide for international students',
    description: 'An English-language reference to university services and practical information for international visitors.',
    href: 'https://sri.ufg.br/p/13919-guides-for-international-students',
    source: 'UFG International Relations · English guide',
  },
  {
    title: 'Historic Centre of the Town of Goiás',
    description: 'Official context for the World Heritage historic centre participants will visit on Friday.',
    href: 'https://whc.unesco.org/en/list/993/',
    source: 'UNESCO World Heritage Centre · English',
  },
] as const;
