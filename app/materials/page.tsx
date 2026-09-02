import { ClipboardList, FileText, FolderOpen, Info, Presentation, type LucideIcon } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';
import type { MaterialKind } from '@/data/types';
import { materialDetail, materialsByDay } from '@/lib/materials';
import { withBasePath } from '@/lib/base-path';

/** The file's own icon, not one for everything: the model already knows the kind. */
const KIND_ICON: Record<MaterialKind, LucideIcon> = {
  slides: Presentation,
  document: FileText,
  protocol: ClipboardList,
};

export const metadata: Metadata = {
  title: 'Materials · Time2Graze Brazil Workshop',
  description: 'Presentations, documents and protocols for each day of the workshop.',
};

/** No state and no clock: this page is a read of the agenda, so it stays a
 *  server component and ships no JavaScript of its own. */
export default function MaterialsPage() {
  return (
    <section className="materials section-pad" id="materials">
      <div className="section-title split-title">
        <div><p>Workshop materials</p><h1>Presentations and documents</h1></div>
        <span>Materials will be added as they are approved</span>
      </div>

      <div className="materials-notice">
        <Info aria-hidden="true" />
        <p>This area is prepared to receive presentations, reading materials, protocols and supporting documents. Some files may be restricted to workshop participants.</p>
      </div>

      <div className="resource-groups">
        {materialsByDay().map(({ day, entries }) => (
          <section className="resource-group" key={day.date}>
            <h3>Day {day.index} · {day.label}</h3>
            <div>
              {entries.map((entry, index) => {
                const KindIcon = KIND_ICON[entry.material.kind];
                /* Composed from what makes the entry distinct — day, session,
                   kind and position within the group — so two same-labelled
                   files on one session can never collide. */
                const key = `${day.date}-${entry.sessionId ?? 'day'}-${entry.material.kind}-${index}`;
                return (
                  <article className="resource-item" key={key}>
                    <KindIcon aria-hidden="true" />
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
        <article><FileText aria-hidden="true" /><div><strong>Full programme</strong><span>PDF version</span></div><small>Pending</small></article>
        <article><FolderOpen aria-hidden="true" /><div><strong>Shared workshop folder</strong><span>Participant access</span></div><small>Pending</small></article>
      </div>
    </section>
  );
}
