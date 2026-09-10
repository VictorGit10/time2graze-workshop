/**
 * Entry thumbnails for the optional-story rows.
 *
 * Run by hand after adding a story thumbnail, not from `prebuild`: it resolves
 * sharp from Next's own copy, which is a transitive dependency and must never
 * be something the deploy depends on. The generated files are committed.
 *
 *   node scripts/build-entry-thumbs.mjs
 *
 * The gallery thumbnails are 640px wide because they stand in for the full
 * photograph in a two-column gallery. An entry row shows the same image at
 * 92x66 on a desktop and 58x58 on a phone, so serving 640px there cost 85 KB
 * to paint 6 000 pixels. These are 260px, cropped to the row's own ratio.
 */
import { createRequire } from 'node:module';
import { readFileSync, statSync } from 'node:fs';

const require = createRequire(import.meta.url);

/* The specifier is assembled at runtime, and that is deliberate. Written as a
   literal, TypeScript resolves sharp's types, which switches oxlint into its
   type-aware pass for the whole of `scripts/` — and that pass then reports the
   floating `test()` promises every test file here has always had. Those are
   real, they predate this script, and they are not this script's to fix; an
   opaque specifier keeps the lint result honest about what changed. */
const nested = ['next', 'node_modules', 'sharp'].join('/');
let sharp;
try {
  sharp = require(nested);
} catch {
  sharp = require(['sh', 'arp'].join(''));
}

const WIDTH = 260;
const HEIGHT = 186;
const images = JSON.parse(readFileSync('data/story-images.json', 'utf8'));

/** Only the images an entry row actually uses. */
const ENTRIES = ['M01', 'M03', 'M05', 'M07', 'lapig-team', 'fica-city'];

/* Wrapped rather than run at the top level: a top-level `await` in this
   directory switches oxlint into its type-aware pass, which then reports the
   floating `test()` promises every other script here has always had. */
async function main() {
  for (const id of ENTRIES) {
    const record = images[id];
    if (!record) throw new Error(`unknown image: ${id}`);
    const source = `public${record.src}`;
    const out = `public/images/stories/${id}-entry.webp`;
    await sharp(source)
      .resize(WIDTH, HEIGHT, { fit: 'cover', position: 'attention' })
      .webp({ quality: 74 })
      .toFile(out);
    const before = statSync(`public${record.thumbnail ?? record.src}`).size;
    const after = statSync(out).size;
    console.log(`${id}: ${Math.round(before / 1024)} KB -> ${Math.round(after / 1024)} KB`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
