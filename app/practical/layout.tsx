import type { Metadata } from 'next';

/** The page itself is a client component, so its metadata lives here. */
export const metadata: Metadata = {
  title: 'Practical information · Time2Graze Brazil Workshop',
  description:
    'Accommodation, transport, workshop locations and maps for participants of the Time2Graze Brazil Workshop.',
};

export default function PracticalLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
