import { effect, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { I18nService } from './i18n.service';
import { SeoService } from './seo.service';

export interface PageSeo {
  /** i18n key resolved to the page's meta/og/twitter description. */
  descriptionKey: string;
  /** Literal og:title / twitter:title text — proper nouns, not translated. */
  socialTitle: string;
  /**
   * Optional JSON-LD block. Receives the already-translated description so the
   * structured data and the meta description can't drift apart. Rebuilt on every
   * language switch, so `translate.instant(...)` is safe inside it.
   */
  jsonLd?: (description: string) => { id: string; data: unknown };
}

/**
 * Applies a feature page's SEO tags and re-applies them whenever the language
 * changes. Call it from an injection context (component constructor or field
 * initialiser); the effect is torn down with the component.
 */
export function applyPageSeo(page: PageSeo): void {
  const seo = inject(SeoService);
  const translate = inject(TranslateService);
  const i18n = inject(I18nService);

  effect(() => {
    // Must stay the first statement: `translate.instant()` reads a plain map and is
    // not reactive, so this signal read is the only thing that re-runs the effect
    // on a language switch. Drop it and shared links keep the old language's text.
    i18n.lang();

    const description = translate.instant(page.descriptionKey);
    seo.setDescription(description);
    seo.setSocialTitle(page.socialTitle);

    if (page.jsonLd) {
      const { id, data } = page.jsonLd(description);
      seo.setJsonLd(id, data);
    }
  });
}
