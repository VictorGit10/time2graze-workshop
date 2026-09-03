import type { NextConfig } from 'next';

/**
 * GitHub Pages serves the site from a repository subpath, so every route and
 * asset has to carry it. `basePath` applies it to `next/link` and to the
 * `_next` bundle automatically; do not hand-write it into an href.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

const nextConfig: NextConfig = {
  // One HTML file per route, in `out/` — the whole reason for this toolchain.
  output: 'export',
  // `out/programme/index.html` rather than `out/programme.html`, which Pages
  // would not serve at `/programme/`.
  trailingSlash: true,
  basePath,
  // No image server exists on Pages.
  images: { unoptimized: true },
  // Phosphor exposes thousands of modules. Next rewrites named imports so the
  // development compiler only opens the small subset this interface uses.
  experimental: { optimizePackageImports: ['@phosphor-icons/react'] },
  // This variant lives inside the main project, so Turbopack must not adopt
  // the parent lockfile as its workspace root.
  turbopack: { root: process.cwd() },
  // `next dev` otherwise appends a block of its own to AGENTS.md, which is a
  // hand-written document and the primary brief for this project.
  agentRules: false,
};

export default nextConfig;
