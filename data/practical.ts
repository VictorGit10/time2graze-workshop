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
    time: '06:00',
    detail: 'Departure from Golden Lis for Cidade de Goiás',
    provisional: false,
  },
] as const;
