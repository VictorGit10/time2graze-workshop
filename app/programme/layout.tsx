import type { Metadata } from 'next';

/** The page itself is a client component, so its metadata lives here. */
export const metadata: Metadata = {
  title: 'Programme · Time2Graze Brazil Workshop',
  description:
    'The five workshop days: sessions, presenters and requirements. 14–18 September 2026, Goiânia, Brazil.',
};

export default function ProgrammeLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
