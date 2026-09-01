import Link from 'next/link';

/**
 * Temporary. Proves that a second route reaches GitHub Pages under the
 * repository subpath, with its stylesheet, fonts and images intact.
 * Delete once the deploy is confirmed.
 *
 * Note the two different mechanisms: `next/link` picks up `basePath` on its
 * own, a plain `<img src>` does not and has to carry the prefix by hand.
 */
export default function Probe() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

  return (
    <main className="section-pad">
      <h1>Route probe</h1>
      <p>
        Styled text, a loaded image and a working link back mean routing,
        assets and fonts all resolve under the subpath.
      </p>
      <img src={`${basePath}/time2graze-hero.webp`} alt="" style={{ maxWidth: '320px' }} />
      <p><Link href="/">Back to the home page</Link></p>
    </main>
  );
}
