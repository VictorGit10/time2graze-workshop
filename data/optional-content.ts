import { CITY_STORIES } from '@/data/city-guide';

export type StoryId = 'ufg' | 'lapig' | 'funape' | 'goiania' | 'cidade-de-goias' | 'fica' | 'cerrado';
type Source = { label: string; href: string };
export type Story = {
  id: StoryId;
  label: string;
  category: string;
  title: string;
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
    title: 'Federal University of Goiás',
    lead: 'A university in Goiás, connecting education, research and cultural life.',
    chapters: [
      { title: 'A university takes shape', text: 'The Federal University of Goiás — Universidade Federal de Goiás, or UFG — was established in 1960 through the union of five existing colleges. Today its activities include undergraduate and postgraduate education.' },
      { title: 'The workshop’s host university', text: 'LAPIG is part of UFG’s Institute of Socio-Environmental Studies, known as IESA. The workshop takes place at the laboratory on Campus Samambaia in Goiânia.' },
      { title: 'Beyond the laboratory', text: 'UFG also co-organises FICA, the environmental film festival in Cidade de Goiás. The festival brings the university into conversations about cinema, science and the environment.' },
    ],
    images: ['M01', 'M02'], facts: [{ value: '1960', label: 'University established' }, { value: 'Samambaia', label: 'The workshop’s campus' }],
    sources: [{ label: 'UFG website', href: 'https://ufg.br/' }, { label: 'UFG and FICA', href: 'https://fica.go.gov.br/n/201969-fica-2026-inicia-sua-maior-edicao-com-homenagem-a-dalton-paula-e-estreia-nacional-de-a-curva-do-rio' }],
    related: [{ label: 'About LAPIG', href: '/#about-lapig' }, { label: 'FICA: cinema and the environment', href: '/practical/#about-fica' }],
  },
  lapig: {
    id: 'lapig', label: 'About LAPIG', category: 'Laboratory',
    title: 'Observing landscapes',
    lead: 'At LAPIG, satellite observations and geographic information support the study of changing landscapes.',
    chapters: [
      { title: 'Research at UFG', text: 'Established in 1994 and linked to IESA, LAPIG works with remote sensing and geoprocessing. It produces and organises geographic information for environmental and territorial monitoring.' },
      { title: 'Pastures as a research focus', text: 'The laboratory studies pasture condition and productivity through mapping and monitoring. Its Pasture Research Programme provides the Atlas of Pastures and contributes to pasture mapping within MapBiomas.' },
      { title: 'From research to accessible data', text: 'The Atlas of Pastures makes geospatial information about Brazilian pastures available online. The laboratory’s research pages introduce its projects and the data products they produce.' },
    ],
    images: ['lapig-building'], facts: [{ value: '1994', label: 'Laboratory established' }, { value: 'Pastures', label: 'Mapping and monitoring' }],
    sources: [{ label: 'LAPIG website', href: 'https://lapig.iesa.ufg.br/' }, { label: 'Pasture Research Programme', href: 'https://lapig.iesa.ufg.br/p/38950-programa-de-pesquisa-em-pastagens-ppp?atr=pt-BR&locale=pt-BR' }, { label: 'Thirty years of LAPIG · UFG', href: 'https://ufg.br/n/186501-lapig-ufg-realiza-solenidade-para-celebrar-30-anos-de-historia' }],
    related: [{ label: 'About UFG', href: '/#about-ufg' }, { label: 'The Cerrado landscape', href: '/practical/#about-cerrado' }],
  },
  funape: {
    id: 'funape', label: 'About FUNAPE', category: 'Research support',
    title: 'Supporting research projects',
    lead: 'FUNAPE provides the administrative support that helps research and education projects take place.',
    chapters: [
      { title: 'Created by researchers', text: 'FUNAPE — Fundação de Apoio à Pesquisa — is a private, nonprofit foundation created in 1981 by researchers at UFG.' },
      { title: 'The work behind a project', text: 'The foundation supports the securing and management of resources for education, research, university outreach, innovation and institutional development. Its institutional website describes its services and governance.' },
    ],
    images: [], facts: [{ value: '1981', label: 'Foundation established' }, { value: 'Nonprofit', label: 'Research support foundation' }],
    sources: [{ label: 'About FUNAPE', href: 'https://site.funape.org.br/perguntas_respostas.php' }, { label: 'Institutional governance', href: 'https://site.funape.org.br/compliance.php' }],
  },
  goiania: {
    id: 'goiania', label: 'History and photos of Goiânia', category: 'City history',
    title: 'Goiânia, a planned capital',
    lead: 'A new capital, drawn in the twentieth century, grew beside the older settlement of Campinas.',
    chapters: [
      { title: 'A new beginning', text: CITY_STORIES.goiania.paragraphs[0] },
      { title: 'The shape of the city', text: CITY_STORIES.goiania.paragraphs[1] },
      { title: 'Art Deco heritage', text: 'In 2003, IPHAN recognised Goiânia’s architectural and urban ensemble. The listed group includes 22 public buildings and monuments, preserving part of the city’s early identity.' },
    ],
    images: ['M03', 'M04'], facts: [{ value: '1933', label: 'Goiânia founded' }, { value: '1937', label: 'State capital transferred' }, { value: '2003', label: 'Art Deco ensemble listed' }],
    sources: [CITY_STORIES.goiania.source, { label: 'Art Deco heritage · IPHAN', href: 'https://www.gov.br/iphan/pt-br/assuntos/noticias/iphan-lanca-norma-de-preservacao-do-acervo-arquitetonico-e-urbanistico-art-deco-de-goiania-go' }],
    related: [{ label: 'History of Cidade de Goiás', href: '/practical/#about-cidade-de-goias' }],
  },
  'cidade-de-goias': {
    id: 'cidade-de-goias', label: 'History and photos of Cidade de Goiás', category: 'History & culture',
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
    title: 'Environmental questions, on screen',
    lead: 'Since 1999, Cidade de Goiás has hosted the Festival Internacional de Cinema e Vídeo Ambiental — FICA.',
    chapters: [
      { title: 'Cinema in Cidade de Goiás', text: 'Film screenings, discussions and cultural activities bring environmental questions into the city’s cultural life. The 2026 opening took place at Cine Teatro São Joaquim.' },
      { title: 'Water and climate', text: 'The 27th edition ran from 16 to 21 June 2026 under the theme “Água e Clima no Brasil das Nascentes”, focusing on water, climate and Brazil’s headwaters.' },
      { title: 'A university connection', text: 'UFG co-organised the festival with the Goiás State Secretariat of Culture, through Fundação RTVE. The June festival is separate from the September workshop.' },
    ],
    images: [], facts: [{ value: '1999', label: 'First edition' }, { value: '16–21 June', label: '2026 festival dates' }, { value: '27', label: 'Editions through 2026' }],
    sources: [{ label: 'FICA 2026 · official festival report', href: 'https://fica.go.gov.br/n/201969-fica-2026-inicia-sua-maior-edicao-com-homenagem-a-dalton-paula-e-estreia-nacional-de-a-curva-do-rio' }, { label: 'Festival dates · UFG', href: 'https://goias.ufg.br/n/200984-ufg-campus-goias-abre-selecao-de-monitores-para-o-fica-2026?atr=en&locale=en' }],
    related: [{ label: 'About UFG', href: '/#about-ufg' }],
  },
  cerrado: {
    id: 'cerrado', label: 'The Cerrado landscape', category: 'Landscape',
    title: 'The Cerrado, at two scales',
    lead: 'Savanna and grassland landscapes in central Brazil support a rich variety of plant and animal life.',
    chapters: [
      { title: 'Seen from the ground', text: 'The vegetation and terrain of Serra Dourada offer one view of the Cerrado in Goiás. This regional landscape provides context for the workshop’s interest in land and grazing systems.' },
      { title: 'Seen from space', text: 'On 19 May 2025, Landsat 9 captured Serra de Caldas and its surrounding landscape. The image reveals another scale of observation, connecting this regional view with the work of remote sensing.' },
      { title: 'Two places in Goiás', text: 'Serra Dourada and Serra de Caldas are different locations. These images show regional landscapes, rather than the farm visited during the workshop.' },
    ],
    images: ['M07', 'M08'],
    sources: [{ label: 'Cerrado · ICMBio', href: 'https://www.gov.br/icmbio/pt-br/assuntos/biodiversidade/unidade-de-conservacao/unidades-de-biomas/cerrado/cerrado' }, { label: 'Serra de Caldas · NASA', href: 'https://www.nasa.gov/image-article/central-brazil-cerrado/' }],
    related: [{ label: 'About LAPIG', href: '/#about-lapig' }],
  },
};
