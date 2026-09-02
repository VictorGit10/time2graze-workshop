import type { Metadata } from 'next';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { Cormorant_Garamond, Manrope } from 'next/font/google';
import { withBasePath } from '@/lib/base-path';
import './globals.css';

const sans = Manrope({ variable: '--font-sans', subsets: ['latin'] });
const serif = Cormorant_Garamond({
  variable: '--font-serif', subsets: ['latin'], weight: ['500', '600'], style: ['normal', 'italic'],
});

export const metadata: Metadata = {
  title: 'Time2Graze Brazil Workshop · 14–18 September 2026',
  description: 'Internal Time2Graze technical workshop in Goiânia, Brazil, focused on data development, decision support and grazing management.',
  icons: { icon: withBasePath('/favicon.svg') },
  openGraph: {
    title: 'Time2Graze Brazil Workshop',
    description: 'Internal technical workshop · 14–18 September 2026 · Goiânia, Brazil.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Time2Graze Brazil Workshop',
    images: process.env.NEXT_PUBLIC_SITE_URL ? [`${process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '')}/og.png`] : [],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Time2Graze Brazil Workshop',
    description: '14–18 September 2026 · Goiânia, Brazil',
    images: process.env.NEXT_PUBLIC_SITE_URL ? [`${process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '')}/og.png`] : [],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${sans.variable} ${serif.variable}`}>
        {/* Ahead of the header, so the first tab stop on every page skips the
            navigation rather than walking through it. */}
        <a className="skip-link" href="#content">Skip to the content</a>
        <SiteHeader />
        <main id="content">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
