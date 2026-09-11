import { CITY_STORIES } from '@/data/city-guide';

export type StoryId = 'ufg' | 'lapig' | 'funape' | 'goiania' | 'cidade-de-goias' | 'fica' | 'cerrado';
type Source = { label: string; href: string };
export type Story = {
  id: StoryId;
  label: string;
  category: string;
  title: string;
  /** An acronym the subject is known by, when the title is what it stands for. */
  mark?: string;
  /** A misreading the subject invites, corrected in the opening. FICA alone. */
  note?: string;
  /** One line on the closed entry. Seven identical rows are not a menu. */
  teaser: string;
  /** STORY_IMAGES key for the entry's thumbnail; FUNAPE has none and shows its mark. */
  thumbnail?: string;
  /** The AGENDA session this subject is in the reader's week, if it is one. */
  weekSessionId?: string;
  /** Why that session and this subject are the same thing. */
  weekNote?: string;
  lead: string;
  chapters: { title: string; text: string }[];
  images: string[];
  facts?: { value: string; label: string }[];
  sources: Source[];
  related?: { label: string; href: string }[];
};

/** Original English copy; evidence and media rights are recorded in research/optional-content-*.md. */
export const STORIES: Record<StoryId, Story> = {
  ufg: {
    id: 'ufg', label: 'About UFG', category: 'University',
    teaser: 'Five schools became one university. It now keeps observatories — including one pointed at itself.',
    thumbnail: 'U01', weekSessionId: 'd1-ufg-tour',
    title: 'Federal University of Goiás',
    lead: 'A university in Goiás that measures things: pasture from orbit, weather over the Cerrado, and its own use of artificial intelligence.',
    chapters: [
      { title: 'A university takes shape', text: 'The Federal University of Goiás — Universidade Federal de Goiás, or UFG — was created on 14 December 1960, joining five higher-education schools that already existed in Goiânia. Today its activities include undergraduate and postgraduate education, across campuses in several cities of the state.' },
      { title: 'The workshop’s host university', text: 'LAPIG is part of UFG’s Institute of Socio-Environmental Studies, known as IESA. The workshop takes place at the laboratory on Campus Samambaia in Goiânia.' },
      { title: 'A university of instruments', text: 'The same campus carries a centre forecasting the weather of the Cerrado, a laboratory mapping its pastures, an agrometeorological station recording the climate of Goiânia since 1977, and the first undergraduate degree in artificial intelligence opened in Brazil.' },
      { title: 'A campus with no gate', text: 'Not all of it is on one site. Câmpus Colemar Natal e Silva is spread through Goiânia’s Setor Universitário, around Praça Universitária, four kilometres from where the workshop meets: the Faculty of Law, the Hospital das Clínicas and their neighbours stand among ordinary streets. It is named after the man who directed that faculty, organised the assemblies and marches that argued for a federal university in Goiás, and became UFG’s first rector in 1961.' },
      { title: 'Beyond the laboratory', text: 'UFG also co-organises FICA, the environmental film festival in Cidade de Goiás. The festival brings the university into conversations about cinema, science and the environment.' },
    ],
    /* Not a campus tour: the range of one university. See components/stories/ufg.tsx. */
    images: ['U01', 'U06', 'U02', 'U03', 'U04'],
    sources: [{ label: 'UFG website', href: 'https://ufg.br/' }, { label: 'UFG history · 1960', href: 'https://ufg.br/n/63408-historia' }, { label: 'UFG campuses', href: 'https://ufg.br/p/27153-campus' }, { label: 'The creation of UFG · Jornal UFG', href: 'https://jornal.ufg.br/n/135985-a-criacao-da-ufg-uma-ousadia-historica' }, { label: 'CEMPA-Cerrado', href: 'https://cempa.ufg.br/p/39752-apresentacao' }, { label: 'Observatório UFG-IA', href: 'https://lapig-ufg.github.io/observatorio-ia/' }, { label: 'CEIA · Centre of Excellence in AI', href: 'https://ceia.ufg.br/sobre-nos/' }, { label: 'UFG and FICA', href: 'https://fica.go.gov.br/n/201969-fica-2026-inicia-sua-maior-edicao-com-homenagem-a-dalton-paula-e-estreia-nacional-de-a-curva-do-rio' }],
    related: [{ label: 'About LAPIG', href: '/#about-lapig' }, { label: 'FICA: cinema and the environment', href: '/practical/#about-fica' }],
  },
  lapig: {
    id: 'lapig', label: 'About LAPIG', category: 'Laboratory',
    teaser: 'The laboratory hosting the workshop, in its own films and photographs.',
    thumbnail: 'lapig-team', weekSessionId: 'd1-ufg-tour',
    title: 'Thirty years of research',
    lead: 'At LAPIG, satellite observations and geographic information support the study of changing landscapes.',
    chapters: [
      { title: 'Research at UFG', text: 'Established in 1994 and linked to IESA, LAPIG works with remote sensing and geoprocessing. It produces and organises geographic information for environmental and territorial monitoring.' },
      { title: 'Pastures as a research focus', text: 'The laboratory studies pasture condition and productivity through mapping and monitoring. Its Pasture Research Programme provides the Atlas of Pastures and contributes to pasture mapping within MapBiomas.' },
      { title: 'From research to accessible data', text: 'The Atlas of Pastures makes geospatial information about Brazilian pastures available online. The laboratory’s research pages introduce its projects and the data products they produce.' },
    ],
    images: ['lapig-team', 'lapig-research'], facts: [{ value: '1994', label: 'Laboratory established' }, { value: '2024', label: 'Thirty-year anniversary' }, { value: 'UFG', label: 'Research, education and outreach' }],
    sources: [{ label: 'LAPIG website', href: 'https://lapig.iesa.ufg.br/' }, { label: 'Pasture Research Programme', href: 'https://lapig.iesa.ufg.br/p/38950-programa-de-pesquisa-em-pastagens-ppp?atr=pt-BR&locale=pt-BR' }, { label: 'Thirty years of LAPIG · UFG', href: 'https://ufg.br/n/186501-lapig-ufg-realiza-solenidade-para-celebrar-30-anos-de-historia' }],
    related: [{ label: 'About UFG', href: '/#about-ufg' }, { label: 'The Cerrado landscape', href: '/practical/#about-cerrado' }],
  },
  funape: {
    id: 'funape', label: 'About FUNAPE', category: 'Research support',
    teaser: 'The work behind a research project — and the building it is done in, on this campus.',
    thumbnail: 'U05',
    title: 'Supporting research projects',
    lead: 'A grant is not a laboratory. Somebody has to contract, purchase, account for and report it — and at UFG that somebody has a building in the science park.',
    chapters: [
      { title: 'Created by researchers', text: 'FUNAPE — Fundação de Apoio à Pesquisa — is a private, nonprofit foundation created in 1981 by a group of researchers at UFG. It is accredited by the ministries of education and of science and technology, its projects are approved by a deliberative council, and its accounts are open to the federal audit bodies of every institution it serves.' },
      { title: 'The work behind a project', text: 'The foundation supports the securing and management of resources for teaching, research, university outreach, innovation and institutional development: the contracting, purchasing and accounting that a research team would otherwise be doing instead of research.' },
      { title: 'Beyond this university', text: 'FUNAPE administers projects for around nine universities and federal institutes. Alongside UFG, its own account names the federal institutes of Goiás and Goiano, the University of Brasília, the State University of Goiás and EMBRAPA.' },
      { title: 'A building of its own', text: 'Its headquarters opened in December 2020 inside the Parque Tecnológico Samambaia, next to the regional centre for technological development: 1,772 m² over two floors, with a training and events room for 97 people, a roof garden, a system that recycles water for cleaning and irrigation, and the wiring already in place for solar panels.' },
    ],
    images: ['U05'], facts: [{ value: '1981', label: 'Foundation established' }, { value: '1,772 m²', label: 'Its building, from 2020' }, { value: '9', label: 'Institutions supported' }],
    sources: [{ label: 'About FUNAPE', href: 'https://site.funape.org.br/perguntas_respostas.php' }, { label: 'Institutional governance', href: 'https://site.funape.org.br/compliance.php' }, { label: 'The new building · UFG', href: 'https://ufg.br/n/136743-novo-predio-da-fundacao-de-apoio-a-pesquisa-e-inaugurado' }, { label: 'Parque Tecnológico Samambaia', href: 'https://parquesamambaia.ufg.br/p/sobre-pts' }],
    related: [{ label: 'About UFG', href: '/#about-ufg' }, { label: 'About LAPIG', href: '/#about-lapig' }],
  },
  goiania: {
    id: 'goiania', label: 'History and photos of Goiânia', category: 'City history',
    teaser: 'A capital drawn on paper in 1933, and what was listed in 2003.',
    thumbnail: 'M03',
    title: 'Goiânia, a planned capital',
    lead: 'A new capital, drawn in the twentieth century, grew beside the older settlement of Campinas.',
    chapters: [
      { title: 'The shape of the city', text: CITY_STORIES.goiania.paragraphs[1] },
    ],
    images: ['M03', 'M04'],
    sources: [CITY_STORIES.goiania.source, { label: 'Art Deco heritage · IPHAN', href: 'https://www.gov.br/iphan/pt-br/assuntos/noticias/iphan-lanca-norma-de-preservacao-do-acervo-arquitetonico-e-urbanistico-art-deco-de-goiania-go' }],
    related: [{ label: 'History of Cidade de Goiás', href: '/practical/#about-cidade-de-goias' }],
  },
  'cidade-de-goias': {
    id: 'cidade-de-goias', label: 'History and photos of Cidade de Goiás', category: 'History & culture',
    teaser: 'The former capital, its river, and the poet who wrote from its bank.',
    thumbnail: 'M05', weekSessionId: 'd5-city-tour',
    title: 'Streets, landscape and literature',
    lead: 'The former capital of Goiás carries its history in the relationship between the town, the river and the hills.',
    chapters: [
      { title: 'A town shaped by its setting', text: CITY_STORIES.goias.paragraphs[1] },
      ...CITY_STORIES.goias.details,
      { title: 'Inside the poet’s world', text: 'The Museu Casa de Cora Coralina opened in 1989, on the centenary of the poet’s birth. Its collection includes manuscripts, photographs, correspondence, household objects and furniture.' },
    ],
    images: ['M05', 'M06'], facts: [{ value: '1727', label: 'Settlement of Sant’Anna' }, { value: '1937', label: 'Capital moves to Goiânia' }, { value: '2001', label: 'World Heritage inscription' }],
    sources: [...CITY_STORIES.goias.sources, { label: 'Watch the UNESCO/NHK film', href: 'https://whc.unesco.org/en/list/993/video' }],
    related: [{ label: 'FICA: cinema and the environment', href: '/practical/#about-fica' }],
  },
  fica: {
    id: 'fica', label: 'FICA: cinema and the environment', category: 'Film & environment',
    teaser: 'An environmental film festival the same town has hosted since 1999.',
    thumbnail: 'fica-city',
    /* The acronym is the identity, and the panel's opening spells it out of the
       name it stands for. `title` is therefore the name itself, in Portuguese:
       the festival's own, not a translation of it. */
    mark: 'FICA',
    title: 'Festival Internacional de Cinema e Vídeo Ambiental',
    lead: 'An environmental film festival, held in Cidade de Goiás since 1999. Twenty-seven editions have now taken place in the same World Heritage town — the town this workshop visits on Friday.',
    /* The one thing a reader on a workshop site could get wrong. It is stated
       once, in the opening, rather than defended by tense alone. */
    note: 'The most recent edition ran in June 2026. The festival is not part of the workshop programme.',
    chapters: [
      { title: 'A festival with a subject', text: 'FICA is not a general film festival with an environmental strand — the environment is its whole subject, and it is in the festival’s name. It has been held in Cidade de Goiás since 1999, which makes it two years older than the town’s own World Heritage inscription. Recent editions have run in June.' },
      { title: 'The journalist who set its line', text: 'Washington Novaes (1934–2020) was an environmental journalist and filmmaker. He was FICA’s environmental consultant from the first edition in 1999 until 2008, and the state’s own account credits him with establishing how the festival approaches environmental questions — its themes, its guests and its debates. The main competition carries his name.' },
      { title: 'More than a screening programme', text: 'Around the competition the festival runs debates, roundtables and lectures, and filmmaking workshops in local schools. One of its screenings is powered by the audience: at BikeCine the projection runs on bicycles the public pedals. The three films above are television reports on exactly that — the festival as it works in the town, rather than as a list of titles.' },
      { title: 'Who runs it', text: 'The festival is organised by the Government of Goiás through its State Secretariat of Culture, with the Federal University of Goiás — the workshop’s host university — through Fundação RTVE. UFG has a campus in the town, and runs a student monitor programme for each edition.' },
      { title: 'A prize with an address', text: 'The best feature in the main competition receives the Prêmio Cora Coralina, named after the poet who lived and wrote in this town. Her house is now a museum, a few streets from the cinema where the prize is given.' },
    ],
    images: ['fica-cinema', 'fica-awards', 'fica-city'],
    sources: [
      { label: 'The festival, and its twenty-five years', href: 'https://www.goiania.go.leg.br/sala-de-imprensa/noticias/sessao-solene-nesta-terca-feira-25-celebrara-25-anos-do-festival-internacional-de-cinema-e-video-ambiental-o-fica' },
      { label: 'Washington Novaes and the festival’s line', href: 'https://goias.gov.br/cultura/homenageado-do-fica-2020-washington-novaes-fez-parte-da-historia-e-consolidacao-do-festival/' },
      { label: 'The competitive showcases', href: 'https://fica.go.gov.br/n/201264-fica-2026-reune-38-filmes-de-sete-paises-em-mostras-competitivas' },
      { label: 'The most recent edition', href: 'https://fica.go.gov.br/n/201969-fica-2026-inicia-sua-maior-edicao-com-homenagem-a-dalton-paula-e-estreia-nacional-de-a-curva-do-rio' },
      { label: 'UFG at the festival', href: 'https://goias.ufg.br/n/200984-ufg-campus-goias-abre-selecao-de-monitores-para-o-fica-2026?atr=en&locale=en' },
    ],
    related: [
      { label: 'History and photos of Cidade de Goiás', href: '/practical/#about-cidade-de-goias' },
      { label: 'About UFG', href: '/#about-ufg' },
    ],
  },
  cerrado: {
    id: 'cerrado', label: 'The Cerrado landscape', category: 'Landscape',
    teaser: 'One landscape, seen on foot, from the air and from orbit.',
    thumbnail: 'M07', weekSessionId: 'd5-serra-dourada',
    weekNote: 'Serra Dourada is the landscape on the first rung above; the programme stops at its lookout on the way back.',
    title: 'The Cerrado, at three scales',
    lead: 'Savanna and grassland landscapes in central Brazil support a rich variety of plant and animal life.',
    chapters: [
      { title: 'Seen from the ground', text: 'The vegetation and terrain of Serra Dourada offer one view of the Cerrado in Goiás. This regional landscape provides context for the workshop’s interest in land and grazing systems.' },
      { title: 'Seen from space', text: 'On 19 May 2025, Landsat 9 captured Serra de Caldas and its surrounding landscape. The image reveals another scale of observation, connecting this regional view with the work of remote sensing.' },
      { title: 'Three places, not one', text: 'Serra Dourada, the aerial photograph and Serra de Caldas are different locations. The rungs above change the instrument, not the place, and none of them shows the farm visited during the workshop.' },
    ],
    images: ['M07', 'M08'],
    sources: [{ label: 'Cerrado · ICMBio', href: 'https://www.gov.br/icmbio/pt-br/assuntos/biodiversidade/unidade-de-conservacao/unidades-de-biomas/cerrado/cerrado' }, { label: 'Serra de Caldas · NASA', href: 'https://www.nasa.gov/image-article/central-brazil-cerrado/' }],
    related: [{ label: 'About LAPIG', href: '/#about-lapig' }],
  },
};
