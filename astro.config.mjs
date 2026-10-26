// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';

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
  integrations: [sitemap({ i18n: { defaultLocale: 'it', locales: { it: 'it', en: 'en' } } })],
  vite: {
    build: {
      // three.js (~740 kB, ~185 kB gzipped) barely tree-shakes and is already split out:
      // HeroScene imports it dynamically, on idle and on desktop only.
      chunkSizeWarningLimit: 800,
    },
  },
});
