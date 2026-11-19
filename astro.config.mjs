// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import { rename, rmdir } from 'node:fs/promises';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.gabrielecabrini.it',
  // Attribute selectors, like Angular's emulated encapsulation the CSS was written
  // for: scoped rules keep the extra specificity over the global stylesheets.
  scopedStyleStrategy: 'attribute',
  // Pages are tiny static HTML: prefetch every internal link on hover.
  prefetch: { prefetchAll: true },
  // Self-hosted at build time: no request to a font CDN, same faces on every OS.
  // Inter also pins the CV PDF, which would otherwise print in whatever sans the
  // build machine's Chromium resolves system-ui to.
  // Fontsource rather than Google: it serves static per-weight files, while
  // Chromium prints Google's variable font as Type 3 glyphs with broken spacing.
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: 'Inter',
      cssVariable: '--font-inter',
      weights: [400, 500, 600, 700],
    },
    {
      provider: fontProviders.fontsource(),
      name: 'JetBrains Mono',
      cssVariable: '--font-jetbrains-mono',
      weights: [400, 500, 600, 700],
      // Never set in italic: skip those files
      styles: ['normal'],
    },
  ],
  integrations: [
    sitemap({
      i18n: { defaultLocale: 'it', locales: { it: 'it', en: 'en' } },
      // donut is noindex
      filter: (page) => !page.endsWith('/donut/'),
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
