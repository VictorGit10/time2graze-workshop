/**
 * Material for the devices that carry one subject each.
 *
 * Every entry here is a fact with a source, not a caption written to fill a
 * shape. A device with nothing true to draw is not built; see FUNAPE, whose
 * sequence is labelled as a general description rather than as this
 * workshop's arrangement, because that arrangement is not documented.
 */

/**
 * The five schools joined to create UFG on 14 December 1960.
 * Source: https://ufg.br/n/63408-historia (checked 9 September 2026).
 * The page also mentions a decree signed in December 1961; that sentence is
 * not reproduced, because it cannot be reconciled with the creation date on
 * the same page and the site does not publish a fact it cannot resolve.
 */
export const UFG_FOUNDERS = [
  { name: 'Faculdade de Direito', gloss: 'Law' },
  { name: 'Faculdade de Farmácia e Odontologia', gloss: 'Pharmacy & Dentistry' },
  { name: 'Escola de Engenharia', gloss: 'Engineering' },
  { name: 'Conservatório de Música', gloss: 'Music' },
  { name: 'Faculdade de Medicina', gloss: 'Medicine' },
] as const;

/**
 * The campuses UFG names on its own campus page.
 * Source: https://ufg.br/p/27153-campus (checked 9 September 2026).
 * The page also reports a presence in Caldas Novas and Firminópolis without
 * naming a campus there; those are left out rather than given one.
 *
 * `week` marks the two a participant meets: the workshop runs on Samambaia,
 * and Friday's destination town has a campus of the same university. Nothing
 * here says the group visits that campus, because the programme does not.
 */
export const UFG_CAMPUSES = [
  { name: 'Câmpus Samambaia', city: 'Goiânia', week: 'The workshop runs here' },
  { name: 'Câmpus Colemar Natal e Silva', city: 'Goiânia' },
  { name: 'Câmpus Aparecida de Goiânia', city: 'Aparecida de Goiânia' },
  { name: 'Câmpus Cidade de Goiás', city: 'Cidade de Goiás', week: 'Friday’s destination town', href: 'https://goias.ufg.br/' },
  { name: 'Câmpus Cidade Ocidental', city: 'Cidade Ocidental' },
] as const;

/**
 * Three instruments, not three views of one place — the distinction the
 * Cerrado story already makes in words, kept in the device. A slider or a
 * continuous zoom would claim a single location; a chosen rung does not.
 *
 * Only the Landsat resolution is a published figure. The other two rungs
 * describe the instrument, because no ground coverage is documented for them
 * and inventing one would put a fabricated number beside a real one.
 */
export const CERRADO_SCALES = [
  {
    id: 'ground', rung: 'From the ground', instrument: 'Photograph, on foot',
    resolution: 'What a person sees',
    note: 'Vegetation and terrain at Serra Dourada, in Goiás.',
    image: 'M07',
  },
  {
    id: 'air', rung: 'From the air', instrument: 'Aerial photograph',
    resolution: 'A single property',
    note: 'Grazing land seen from above, in LAPIG’s own aerial photography — the image this site opens with.',
    image: 'hero',
  },
  {
    id: 'orbit', rung: 'From orbit', instrument: 'Landsat 9',
    resolution: '30 m per pixel',
    note: 'Serra de Caldas and the landscape around it, 19 May 2025.',
    image: 'M08',
  },
] as const;

/**
 * A general description of what a research support foundation does, drawn
 * from FUNAPE's own account of its services. It is a description of the
 * institution, not of any arrangement for this workshop: that arrangement is
 * not documented in any source consulted.
 * Source: https://site.funape.org.br/perguntas_respostas.php (9 September 2026).
 */
export const FUNAPE_SEQUENCE = [
  { step: 'A project is approved', text: 'Research, teaching, outreach and innovation projects begin inside the university.' },
  { step: 'Resources are secured', text: 'The foundation supports obtaining the funding a project needs to run.' },
  { step: 'The work is administered', text: 'Contracts, purchasing and accounting are handled so the research team can do research.' },
  { step: 'The project reports', text: 'Governance and compliance requirements are met and published.' },
] as const;

/**
 * Goiânia's three dates, as steps rather than as a row of statistics. 1937 is
 * the hinge the two city stories share: the capital left Cidade de Goiás in
 * the same act that made Goiânia one, which is why each story links to the
 * other at that step rather than only at the foot of the panel.
 */
export const GOIANIA_STEPS = [
  { year: '1933', title: 'A capital is founded', text: 'Goiânia is founded, planned as the new capital of Goiás more than two centuries after the origins of Cidade de Goiás.' },
  { year: '1937', title: 'The government moves', text: 'The state government transfers from Cidade de Goiás to the new city.', hinge: { label: 'The town it left', href: '/practical/#about-cidade-de-goias' } },
  { year: '2003', title: 'The Art Deco ensemble is listed', text: 'IPHAN recognises the architectural and urban ensemble: 22 public buildings and monuments.' },
] as const;
