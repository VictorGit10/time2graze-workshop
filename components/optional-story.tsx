import { StoryLink } from '@/components/story-link';
import Image from 'next/image';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import { STORIES, type StoryId } from '@/data/optional-content';
import { STORY_IMAGES } from '@/data/optional-media';
import { StoryDisclosure } from '@/components/story-disclosure';
import { StoryGallery } from '@/components/story-gallery';
import { StoryCinema } from '@/components/story-cinema';
import { STORY_FILMS } from '@/data/story-films';
import { withBasePath } from '@/lib/base-path';
import { StoryExplorer } from '@/components/story-explorer';

const EXPLORER_VIEWS = {
  ufg: [{ label: 'On campus', place: 'Alameda Palmeiras', image: 'M01' }, { label: 'Study & research', place: 'Central Library', image: 'M02' }],
  goiania: [{ label: 'Parque Flamboyant', place: 'Parks and the city skyline', image: 'M03' }, { label: 'Parque Vaca Brava', place: 'Water and urban green space', image: 'M04' }],
  'cidade-de-goias': [{ label: 'Historic centre', place: 'The streets of Goiás', image: 'M05' }, { label: 'Cora Coralina', place: 'The house across the river', image: 'M06' }],
  cerrado: [{ label: 'From the ground', place: 'Serra Dourada', image: 'M07' }, { label: 'From space', place: 'Serra de Caldas · Landsat 9', image: 'M08' }],
};

/** Text is server-rendered; disclosure and gallery are small client boundaries. */
export function OptionalStory({ id, headingLevel = 3 }: { id: StoryId; headingLevel?: 3 | 4 }) {
  const story = STORIES[id];
  const Heading = headingLevel === 3 ? 'h3' : 'h4';
  const ChapterHeading = headingLevel === 3 ? 'h4' : 'h5';
  const cinematic = id === 'fica' || id === 'lapig';
  const views = id in EXPLORER_VIEWS ? EXPLORER_VIEWS[id as keyof typeof EXPLORER_VIEWS] : null;
  return <StoryDisclosure id={`about-${id}`} label={story.label} category={story.category} printAlways={id === 'cidade-de-goias'}>
    <div className="story-opening">
      <p className="story-eyebrow">{story.category}</p>
      <Heading className="story-title">{id === 'fica' ? <><span className="story-festival-name">FICA</span><span className="story-festival-subtitle">Cinema, culture &amp; environment</span></> : story.title}</Heading>
      <p className="story-lead">{story.lead}</p>
    </div>
    {cinematic && <StoryCinema films={STORY_FILMS[id]} poster={STORY_IMAGES[id === 'fica' ? 'fica-city' : 'lapig-team']} />}
    {id === 'funape' && <div className="story-foundation-mark"><Image src={withBasePath('/logos/institutions/funape.png')} alt="FUNAPE — Fundação de Apoio à Pesquisa" width={256} height={71} loading="lazy" /></div>}
    {views ? <StoryExplorer views={views.map(view => ({ label: view.label, place: view.place, photo: STORY_IMAGES[view.image] }))} /> : !cinematic && <StoryGallery photos={story.images.flatMap(key => STORY_IMAGES[key] ? [STORY_IMAGES[key]] : [])} />}
    {story.facts && <dl className="story-facts">{story.facts.map(fact => <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}</dl>}
    {cinematic && <section className="story-photo-essay">
      <div className="story-essay-heading"><p className="story-eyebrow">{id === 'fica' ? 'The festival in photographs' : 'People & practice'}</p>
        <ChapterHeading>{id === 'fica' ? 'From the screen to the city' : 'Inside the laboratory'}</ChapterHeading>
        <p>{id === 'fica' ? 'Speakers, audiences and filmmakers share the festival. These archive photographs show earlier editions; the films above cover 2026.' : 'Research takes place around a table, in shared workspaces and through collaboration. Photographs from LAPIG’s 2024 anniversary retrospective.'}</p>
      </div>
      <StoryGallery photos={story.images.flatMap(key => STORY_IMAGES[key] ? [STORY_IMAGES[key]] : [])} />
    </section>}
    <div className="story-chapters">{story.chapters.map(chapter => <section key={chapter.title}>
      <ChapterHeading>{chapter.title}</ChapterHeading><p>{chapter.text}</p>
    </section>)}</div>
    {id === 'lapig' && <section className="story-research-paths">
      <p className="story-eyebrow">Explore the work</p>
      <ChapterHeading>From observation to shared knowledge</ChapterHeading>
      <div>
        <a href="https://lapig.iesa.ufg.br/p/38950-programa-de-pesquisa-em-pastagens-ppp?atr=pt-BR&locale=pt-BR" target="_blank" rel="noreferrer"><span>01 / Pastures</span><strong>Mapping &amp; monitoring</strong><p>Research on pasture condition and productivity, and the Atlas of Pastures.</p><ArrowUpRight aria-hidden="true" /></a>
        <a href="https://www.youtube.com/watch?v=ejSyEkKsdyU" target="_blank" rel="noreferrer"><span>02 / Native vegetation</span><strong>Landscapes of Goiás</strong><p>A field perspective from the laboratory’s vegetation atlas film series.</p><ArrowUpRight aria-hidden="true" /></a>
        <a href="https://www.youtube.com/watch?v=nihnic0in_o" target="_blank" rel="noreferrer"><span>03 / Education</span><strong>Learning geotechnologies</strong><p>Meet Geocursos through TV UFG’s report on the training programme.</p><ArrowUpRight aria-hidden="true" /></a>
      </div>
    </section>}
    {id === 'fica' && <section className="story-festival-programme">
      <p className="story-eyebrow">Different places. Different perspectives.</p>
      <ChapterHeading>Four windows on environmental cinema</ChapterHeading>
      <ol><li><span>01</span><strong>International films</strong><p>The Washington Novaes competition brings environmental filmmaking from different countries.</p></li><li><span>02</span><strong>Cinema from Goiás</strong><p>A dedicated competition for filmmaking from the state.</p></li><li><span>03</span><strong>Becos da Minha Terra</strong><p>Stories made in Cidade de Goiás, the festival’s home.</p></li><li><span>04</span><strong>Indigenous &amp; traditional peoples</strong><p>A competition dedicated to Indigenous cinema and traditional peoples.</p></li></ol>
      <a href="https://filmfreeway.com/FICA-Brazil" target="_blank" rel="noreferrer">Explore the festival’s film sections <ArrowUpRight aria-hidden="true" /></a>
    </section>}
    <div className="story-references">
      <div><p className="story-eyebrow">Further reading</p><ul>{story.sources.map(source => <li key={source.href}><a href={source.href} target="_blank" rel="noreferrer">{source.label}<ArrowUpRight aria-hidden="true" /></a></li>)}</ul></div>
      {story.related && <div><p className="story-eyebrow">Related</p><ul>{story.related.map(link => <li key={link.href}><StoryLink href={link.href}>{link.label}<ArrowRight aria-hidden="true" /></StoryLink></li>)}</ul></div>}
    </div>
  </StoryDisclosure>;
}
