/** Operational arrangements supplied by the workshop organiser on 3 September 2026. */
export const ACCOMMODATION_PLAN = {
  dates: '13–18 September 2026',
  payment: 'Covered and organised by the workshop',
  confirmation: 'Please confirm that payment and accommodation cover the full 13–18 September stay, and confirm check-in and check-out times.',
} as const;

export const SHUTTLE_PLAN = [
  {
    days: 'Mon–Thu',
    time: '08:00',
    detail: 'Departure from Golden Lis for the day’s workshop venue',
    provisional: true,
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
    label: 'Settle in',
    title: 'UFG guide for international students',
    description: 'An English-language reference to university services and practical information for international visitors.',
    href: 'https://sri.ufg.br/p/13919-guides-for-international-students',
    source: 'UFG International Relations · English guide',
  },
  {
    label: 'Friday visit',
    title: 'Historic Centre of the Town of Goiás',
    description: 'Official context for the World Heritage historic centre participants will visit on Friday.',
    href: 'https://whc.unesco.org/en/list/993/',
    source: 'UNESCO World Heritage Centre · English',
  },
] as const;
