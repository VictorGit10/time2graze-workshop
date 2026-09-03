import {
  ClipboardTextIcon,
  FileTextIcon,
  FolderOpenIcon,
  InfoIcon,
  PresentationChartIcon,
} from '@phosphor-icons/react/ssr';
import type { Icon } from '@phosphor-icons/react';
import Link from 'next/link';
import type { Metadata } from 'next';
import type { MaterialKind } from '@/data/types';
import { materialDetail, materialsByDay } from '@/lib/materials';
import { withBasePath } from '@/lib/base-path';

/** The file's own icon, not one for everything: the model already knows the kind. */
const KIND_ICON: Record<MaterialKind, Icon> = {
  slides: PresentationChartIcon,
  document: FileTextIcon,
  protocol: ClipboardTextIcon,
};

export const metadata: Metadata = {
  title: 'Materials · Time2Graze Brazil Workshop',
  description: 'Presentations, documents and protocols for each day of the workshop.',
};

/** No state and no clock: this page is a read of the agenda, so it stays a
 *  server component and ships no JavaScript of its own. */
export default function MaterialsPage() {
  const groups = materialsByDay();
  const total = groups.reduce((count, group) => count + group.entries.length, 0);

  return (
    <section className="materials section-pad" id="materials">
      <div className="section-title split-title">
        <div><p>Workshop materials</p><h1>Presentations and documents</h1></div>
        <span>{total} expected files · linked to the sessions that produce them</span>
      </div>

      <output className="materials-notice">
        <InfoIcon aria-hidden="true" weight="bold" />
        <p><strong>Publication status</strong> Files will be added after approval. Some may be restricted to workshop participants.</p>
      </output>

      <div className="resource-groups">
        {groups.map(({ day, entries }) => (
          <section className="resource-group" key={day.date}>
            <header>
              <span>{String(day.index).padStart(2, '0')}</span>
              <div><p>Day {day.index}</p><h3>{day.label}</h3><small>{entries.length} {entries.length === 1 ? 'file' : 'files'} expected</small></div>
            </header>
            <div>
              {entries.map((entry, index) => {
                const KindIcon = KIND_ICON[entry.material.kind];
                /* Composed from what makes the entry distinct — day, session,
                   kind and position within the group — so two same-labelled
                   files on one session can never collide. */
                const key = `${day.date}-${entry.sessionId ?? 'day'}-${entry.material.kind}-${index}`;
                return (
                  <article className="resource-item" key={key} data-available={entry.material.href ? 'true' : undefined}>
                    <b className="resource-index">{String(index + 1).padStart(2, '0')}</b>
                    <KindIcon aria-hidden="true" weight="regular" />
                    <span>
                      {entry.sessionId
                        ? (
                          <Link className="resource-session" href={`/programme/#${entry.sessionId}`}>
                            {entry.context}
                          </Link>
                        )
                        : <strong>{entry.context}</strong>}
                      <small>{materialDetail(entry)}</small>
                    </span>
                  {entry.material.href
                    ? <a className="resource-file" href={withBasePath(entry.material.href)}>Download</a>
                    : <em>To be published</em>}
                  </article>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      <div className="document-placeholders">
        <article><span>PDF</span><FileTextIcon aria-hidden="true" weight="duotone" /><div><strong>Full programme</strong><small>Printable reference copy</small></div><em>Pending</em></article>
        <article><span>DIR</span><FolderOpenIcon aria-hidden="true" weight="duotone" /><div><strong>Shared workshop folder</strong><small>Participant access</small></div><em>Pending</em></article>
      </div>
    </section>
  );
}
