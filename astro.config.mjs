// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { readFile, rename, rmdir } from 'node:fs/promises';

// Pages whose <link rel="canonical"> points elsewhere (e.g. an untranslated blog post
// under the other language) stay out of the sitemap. Read from the built HTML, so
// Base.astro stays the only place that decides the canonical.
/** @type {Set<string>} */
const nonCanonical = new Set();
/** @type {import('astro').AstroIntegration} */
const skipNonCanonical = {
  name: 'skip-non-canonical',
  hooks: {
    'astro:build:done': async ({ dir, pages }) => {
      for (const { pathname } of pages) {
        const html = await readFile(new URL(`${pathname}index.html`, dir), 'utf8').catch(() => '');
        const href = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
        if (href && new URL(href).pathname !== `/${pathname}`) nonCanonical.add(`/${pathname}`);
      }
    },
  },
};

export default defineConfig({
  site: 'https://www.gabrielecabrini.it',
  // Attribute selectors, like Angular's emulated encapsulation the CSS was written
  // for: scoped rules keep the extra specificity over the global stylesheets.
  scopedStyleStrategy: 'attribute',
  // Pages are tiny static HTML: prefetch every internal link on hover.
  prefetch: { prefetchAll: true },
  // The CV pins Inter instead of system-ui, which Playwright's Chromium resolves to
  // whatever sans the build machine has. Inter is what GNOME's system-ui (Adwaita
  // Sans) is derived from, so the PDF matches the page as seen on the desktop.
  // Fontsource rather than Google: it serves static per-weight files, while
  // Chromium prints Google's variable font as Type 3 glyphs with broken spacing.
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: 'Inter',
      cssVariable: '--font-inter',
      weights: [400, 500, 600, 700],
    },
  ],
  integrations: [
    // Before sitemap: build:done hooks run in order, and sitemap reads the set in its own
    skipNonCanonical,
    sitemap({
      i18n: { defaultLocale: 'it', locales: { it: 'it', en: 'en' } },
      // donut is noindex
      filter: (page) => !page.endsWith('/donut/') && !nonCanonical.has(new URL(page).pathname),
    }),
    {
      // Cloudflare serves the nearest 404.html, but Astro only flattens the root /404:
      // en/404/index.html must become en/404.html for /en/… to get the English page.
      name: 'en-404',
      hooks: {
        'astro:build:done': async ({ dir }) => {
          await rename(new URL('en/404/index.html', dir), new URL('en/404.html', dir));
          await rmdir(new URL('en/404/', dir));
        },
      },
    },
  ],
});
