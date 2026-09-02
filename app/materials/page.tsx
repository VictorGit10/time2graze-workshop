import { FileText, FolderOpen, Info, Presentation } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { materialDetail, materialsByDay } from '@/lib/materials';

export const metadata: Metadata = {
  title: 'Materials · Time2Graze Brazil Workshop',
  description: 'Presentations, documents and protocols for each day of the workshop.',
};

/** `basePath` reaches a `next/link` href on its own, but not a plain
 *  `<a href>`. A material served from `public/` therefore has to be prefixed
 *  here; an external URL is left alone. */
function fileHref(href: string) {
  return href.startsWith('/') ? `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}${href}` : href;
}

/** No state and no clock: this page is a read of the agenda, so it stays a
 *  server component and ships no JavaScript of its own. */
export default function MaterialsPage() {
  return (
    <section className="materials section-pad" id="materials">
      <div className="section-title split-title">
        <div><p>Workshop materials</p><h2>Presentations and documents</h2></div>
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
              {entries.map((entry) => (
                <article className="resource-item" key={`${entry.sessionId ?? 'day'}-${entry.context}`}>
                  <Presentation aria-hidden="true" />
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
                    ? <a className="resource-file" href={fileHref(entry.material.href)}>Download</a>
                    : <em>To be published</em>}
                </article>
              ))}
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
