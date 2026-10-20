// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.gabrielecabrini.it',
  // Attribute selectors, like Angular's emulated encapsulation the CSS was written
  // for: scoped rules keep the extra specificity over the global stylesheets.
  scopedStyleStrategy: 'attribute',
  integrations: [sitemap({ i18n: { defaultLocale: 'it', locales: { it: 'it', en: 'en' } } })],
});
