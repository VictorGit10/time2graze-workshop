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
  {
    name: 'Câmpus Samambaia', city: 'Goiânia',
    text: 'The large campus north-west of the centre, wooded enough that monkeys use the walkways. It holds LAPIG, the Parque Tecnológico Samambaia and an agrometeorological station that has been recording the climate of Goiânia since 1977.',
    week: 'The workshop runs here',
  },
  {
    name: 'Câmpus Colemar Natal e Silva', city: 'Setor Universitário, Goiânia',
    text: 'The campus inside the city, around Praça Universitária: the Faculty of Law — one of the five schools joined in 1960 — and the Hospital das Clínicas, among others. It carries the name of the man who ran the campaign for the university from that faculty and became its first rector.',
    note: 'A campus with no gate: it is a set of buildings in an ordinary Goiânia neighbourhood, four kilometres from Samambaia.',
  },
  { name: 'Câmpus Aparecida de Goiânia', city: 'Aparecida de Goiânia', text: 'Newer, in the neighbouring city; the Faculty of Science and Technology and its palaeontology collection are here.' },
  {
    name: 'Câmpus Cidade de Goiás', city: 'Cidade de Goiás',
    text: 'In the former capital, the UNESCO-listed town the programme visits on Friday. The group does not go to the campus — but the university is there.',
    week: 'Friday’s destination town', href: 'https://goias.ufg.br/',
  },
  { name: 'Câmpus Cidade Ocidental', city: 'Cidade Ocidental', text: 'On the far side of the state, near the border with the Federal District.' },
] as const;

/**
 * UFG's own figures, from https://ufg.br/p/27153-campus (10 September 2026):
 * "Com 114 cursos de graduação, cerca de 4 mil vagas disponíveis por ano na
 * graduação e mais de 22 mil alunos, a UFG está presente nas cidades de
 * Goiânia, Caldas Novas, Firminópolis, Aparecida de Goiânia, Cidade
 * Ocidental, Cidade de Goiás."
 *
 * The city count is six and the named campuses are five, because the page
 * reports a presence in Caldas Novas and Firminópolis without naming a campus
 * there. Both numbers are the page's; neither is reconciled into the other.
 */
export const UFG_FIGURES = [
  { value: '114', label: 'Undergraduate courses' },
  { value: '22,000+', label: 'Students' },
  { value: '6', label: 'Cities' },
] as const;

/**
 * The Parque Tecnológico Samambaia, on the campus where the workshop runs.
 * Source: https://parquesamambaia.ufg.br/p/sobre-pts (10 September 2026) —
 * "um complexo organizacional de caráter científico e tecnológico mantido
 * pela Universidade Federal de Goiás", useful area ~179,000 m², discussed
 * from 2004, feasibility approved 2005, implantation from 2011.
 *
 * The order is not alphabetical: FUNAPE first, because this list appears in
 * FUNAPE's own panel and the point is that the foundation is a building in a
 * place, next to the machines it helps pay for.
 */
export const PARQUE_TECNOLOGICO = [
  { name: 'FUNAPE', text: 'Its own building since December 2020: 1,772 m² over two floors, a roof garden, water recycling, and a training room for 97 people.' },
  { name: 'LaMCAD', text: 'The multi-user high-performance computing laboratory, opened in 2020. CEMPA-Cerrado — which forecasts the weather of the Cerrado — is its largest client.' },
  { name: 'CRTI', text: 'The Regional Centre for Technological Development and Innovation, next door to FUNAPE.' },
  { name: 'Agência UFG de Inovação', text: 'The university’s innovation agency.' },
  { name: 'CEMEP', text: 'The Centre of Excellence in Molecular Studies, Energy and Petroleum.' },
  { name: 'IPElab', text: 'An open prototyping laboratory.' },
  { name: 'CEI', text: 'The Entrepreneurship and Incubation Centre, with coworking space, startups and spin-offs.' },
  { name: 'Edifício LIFE', text: 'One of the park’s laboratory buildings.' },
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

/**
 * What UFG watches, and the one entry that builds instead.
 *
 * A university describes itself in student counts and campus photographs, and
 * both are forgettable. This one keeps observatories: it watches the land, it
 * watches the sky, and — since LAPIG built the third — it watches itself. That
 * is a specific and checkable thing to say, and it is the same idea the
 * workshop is about, which is why the panel is built on it.
 *
 * CEIA is marked as building rather than watching, because it is: forcing a
 * fourth "watches" onto it to make the row symmetrical would have been the
 * device inventing a fact for the sake of its own shape.
 *
 * Sources, all checked 10 September 2026:
 *  - CEMPA-Cerrado name and mission: https://cempa.ufg.br/p/39752-apresentacao
 *  - Observatório UFG-IA, and UFG's 2019 AI degree:
 *    https://lapig.iesa.ufg.br/n/203133-lapig-lanca-observatorio-ufg-ia-para-debater-e-mapear-uso-de-inteligencia-artificial
 *  - CEIA's founding, FAPEG policy and triple-helix model:
 *    https://ceia.ufg.br/sobre-nos/
 */
export const UFG_OBSERVATORIES = [
  {
    id: 'lapig', role: 'Watches the land', figure: '1994',
    name: 'LAPIG',
    full: 'Laboratório de Sensoriamento Remoto e Geoprocessamento',
    text: 'Remote sensing and geoprocessing for environmental and territorial monitoring — including the pastures this workshop is about. It is the laboratory you are sitting in.',
    href: '/#about-lapig', internal: true,
  },
  {
    id: 'cempa', role: 'Watches the sky', figure: '2 km',
    name: 'CEMPA-Cerrado',
    full: 'Centro de Excelência em Estudos, Monitoramento e Previsões Ambientais do Cerrado',
    text: 'Numerical weather prediction for Goiás and the Centre-West, down to a two-kilometre grid over the Goiânia region, with climate bulletins, air-quality forecasts and active-fire monitoring.',
    href: 'https://cempa.ufg.br/',
  },
  {
    id: 'observatorio', role: 'Watches the university', figure: 'Daily',
    name: 'Observatório UFG-IA',
    full: 'A platform to monitor, collect data on and study artificial intelligence',
    text: 'A public collection of articles, papers, news and video on artificial intelligence, updated daily, alongside a survey of how the university itself uses the technology. Launched by LAPIG.',
    href: 'https://lapig-ufg.github.io/observatorio-ia/',
  },
  {
    id: 'ceia', role: 'Builds the instruments', figure: '2019',
    name: 'CEIA',
    full: 'Centro de Excelência em Inteligência Artificial',
    text: 'Created under a public policy of FAPEG, the state research foundation, on a triple-helix model of university, government and companies. UFG opened Brazil’s first undergraduate degree in AI the same year.',
    href: 'https://ceia.ufg.br/',
  },
] as const;

/**
 * FICA as an institution, not as one edition.
 *
 * The panel was rebuilt around the 2026 edition on 10 September 2026 and read,
 * correctly, as a page about the 27th FICA rather than about FICA. These three
 * figures are the festival's own and none of them belongs to a single year.
 *
 * Sources, checked 10 September 2026:
 *  - Annual in Cidade de Goiás since 1999, and the international competition
 *    named after Washington Novaes:
 *    https://www.goiania.go.leg.br/sala-de-imprensa/noticias/sessao-solene-nesta-terca-feira-25-celebrara-25-anos-do-festival-internacional-de-cinema-e-video-ambiental-o-fica
 *  - Edition count through 2026:
 *    https://fica.go.gov.br/n/201264-fica-2026-reune-38-filmes-de-sete-paises-em-mostras-competitivas
 */
export const FICA_FIGURES = [
  { value: '1999', label: 'First edition' },
  { value: '27', label: 'Editions through 2026' },
  { value: '4', label: 'Competitive showcases' },
] as const;

/**
 * The four competitive showcases: the festival's standing shape, not the 2026
 * selection.
 *
 * Each entry says what the showcase is *for*. It said what the showcase held in
 * June 2026 — six features from four countries, eight shorts from six others —
 * and that is an edition's fact wearing a festival's clothes. Prize values were
 * removed on the client's instruction of 10 September 2026; the Cora Coralina
 * prize keeps its name in the chapters, because a name is not a number.
 *
 * The order runs from the widest reach to the streets of the host town. The
 * Indigenous and traditional peoples' showcase sits second because it is not a
 * geographic category at all, and forcing it onto that axis to keep the shape
 * tidy would be the order inventing a claim.
 *
 * Names and Washington Novaes's role, checked 10 September 2026:
 *  - https://fica.go.gov.br/n/201264-fica-2026-reune-38-filmes-de-sete-paises-em-mostras-competitivas
 *  - https://goias.gov.br/cultura/homenageado-do-fica-2020-washington-novaes-fez-parte-da-historia-e-consolidacao-do-festival/
 */
export const FICA_SHOWCASES = [
  {
    name: 'Mostra Internacional Washington Novaes',
    gloss: 'International competition',
    text: 'The main competition, open to environmental film from any country. It carries the name of the journalist who set the festival’s approach to environmental questions across its first ten editions.',
  },
  {
    name: 'Mostra Cinema Indígena e Povos Tradicionais',
    gloss: 'Indigenous cinema and traditional peoples',
    text: 'A competition of its own, rather than a category inside another one, for Indigenous cinema and the cinema of traditional peoples.',
  },
  {
    name: 'Mostra Cinema Goiano',
    gloss: 'Cinema from the state of Goiás',
    text: 'Film made in Goiás — the state the workshop meets in, and the one whose landscapes this week is about.',
  },
  {
    name: 'Mostra Becos da Minha Terra',
    gloss: 'The alleys of my land',
    text: 'Film made in Cidade de Goiás and the territory around it: the town that hosts the festival, and the town Friday goes to.',
  },
] as const;

/**
 * The most recent edition, kept to one labelled block near the foot of the
 * panel. It is a fact about FICA, not the subject of the page — which is the
 * whole reason it no longer opens it.
 *
 * The theme stays in Portuguese with a translation beside it, the way the
 * festival’s own title does. The tense is past: this edition happened in June
 * and the workshop is in September, and nothing here may read as an invitation.
 *
 * Source, checked 10 September 2026:
 * https://fica.go.gov.br/n/201969-fica-2026-inicia-sua-maior-edicao-com-homenagem-a-dalton-paula-e-estreia-nacional-de-a-curva-do-rio
 */
export const FICA_EDITION = {
  ordinal: '27th edition',
  dates: '16–21 June 2026',
  venue: 'Cine Teatro São Joaquim',
  theme: 'Água e Clima no Brasil das Nascentes',
  themeGloss: 'Water and climate in Brazil’s headwaters',
  honour: 'The edition honoured the visual artist Dalton Paula, and opened with the national premiere of “A Curva do Rio”.',
} as const;
