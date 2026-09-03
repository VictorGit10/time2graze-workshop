import { AGENDA } from '@/data/agenda';
import type { Day, Material, MaterialKind } from '@/data/types';

const KIND_LABEL: Record<MaterialKind, string> = {
  slides: 'Slides',
  document: 'Document',
  protocol: 'Protocol',
};

export function materialLabel(material: Material) {
  return material.title ?? KIND_LABEL[material.kind];
}

/** A file, and the thing it belongs to. */
export type MaterialEntry = {
  material: Material;
  /** The session or track title, or the file's own name for day-level files. */
  context: string;
  /** Anchor of the session to link back to. Absent for day-level files. */
  sessionId?: string;
};

export type DayMaterials = { day: Day; entries: MaterialEntry[] };

/**
 * The materials section, read out of the agenda.
 *
 * There is no second list to keep in step: a file is declared on the session
 * that produces it, and appears here because of that. A track carries its own
 * files but links back to the session that holds it, since that is what the
 * programme anchors.
 */
export function materialsByDay(): DayMaterials[] {
  return AGENDA.map((day) => {
    const entries: MaterialEntry[] = [];

    for (const material of day.materials ?? []) {
      entries.push({ material, context: materialLabel(material) });
    }

    for (const session of day.sessions) {
      for (const material of session.materials ?? []) {
        entries.push({ material, context: session.title, sessionId: session.id });
      }
      for (const track of session.tracks ?? []) {
        for (const material of track.materials ?? []) {
          entries.push({ material, context: track.title, sessionId: session.id });
        }
      }
    }

    return { day, entries };
  }).filter((group) => group.entries.length > 0);
}

/** The line under the title: what the file is, and how it is reached. */
export function materialDetail(entry: MaterialEntry) {
  const parts = [entry.sessionId ? materialLabel(entry.material) : KIND_LABEL[entry.material.kind]];
  if (entry.material.format) parts.push(entry.material.format);
  if (entry.material.restricted) parts.push('Participants only');
  return parts.join(' · ');
}
