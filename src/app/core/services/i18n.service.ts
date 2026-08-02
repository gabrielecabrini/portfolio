import { computed, effect, inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

const STORAGE_KEY = 'lang';
export const SUPPORTED_LANGS = ['it', 'en'] as const;
export type Lang = (typeof SUPPORTED_LANGS)[number];

// Owns the active language: picks it on startup, persists the user's choice, and
// keeps <html lang> in sync. Components read `lang()` to make themselves re-render
// on a switch — see page-seo.ts for why that read matters.
@Injectable({ providedIn: 'root' })
export class I18nService {
  private readonly translate = inject(TranslateService);
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  /** Active language, never null — falls back to 'it' before the first `use()`. */
  readonly lang = computed<Lang>(() => (this.translate.currentLang() ?? 'it') as Lang);

  constructor() {
    // Server/prerender always renders 'it' (localStorage doesn't exist there), matching
    // the static lang="it" already in index.html. The browser build then reads the saved
    // preference on top, so a returning EN visitor sees a brief IT flash before hydration
    // swaps it — this is the accepted tradeoff for keeping prerendered output deterministic.
    const saved = this.isBrowser ? (localStorage.getItem(STORAGE_KEY) as Lang | null) : null;
    this.translate.use(saved ?? 'it');

    effect(() => {
      this.document.documentElement.lang = this.lang();
    });
  }

  toggle(): void {
    const next: Lang = this.lang() === 'it' ? 'en' : 'it';
    this.translate.use(next);
    if (this.isBrowser) localStorage.setItem(STORAGE_KEY, next);
  }
}
