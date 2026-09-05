import type { Metadata } from 'next';

/** Keep metadata next to the stable /practical/ route. */
export const metadata: Metadata = {
  title: 'Travel & stay · Time2Graze Brazil Workshop',
  description:
    'Accommodation, transport, workshop locations and maps for participants of the Time2Graze Brazil Workshop.',
};

export default function PracticalLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
