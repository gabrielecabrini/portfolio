import { computed, effect, inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { TranslateService, type InterpolationParameters } from '@ngx-translate/core';

const STORAGE_KEY = 'lang';
export const SUPPORTED_LANGS = ['it', 'en'] as const;
export type Lang = (typeof SUPPORTED_LANGS)[number];
export const FALLBACK_LANG: Lang = 'it';

/**
 * Narrows an untrusted value (localStorage, ngx-translate's nullable `currentLang`)
 * to a supported language, so nothing downstream has to cast.
 */
export function isLang(value: unknown): value is Lang {
  return typeof value === 'string' && (SUPPORTED_LANGS as readonly string[]).includes(value);
}

/**
 * `TranslateService.instant()` is typed as `any`, which silently switches off type
 * checking at every call site. Every key in this app resolves to a string, so the
 * narrowing happens once here; an unresolved key already falls back to the raw key.
 */
export function instantText(
  translate: TranslateService,
  key: string,
  params?: InterpolationParameters,
): string {
  const value: unknown = translate.instant(key, params);
  return typeof value === 'string' ? value : key;
}

// Owns the active language: picks it on startup, persists the user's choice, and
// keeps <html lang> in sync. Components read `lang()` to make themselves re-render
// on a switch — see page-seo.ts for why that read matters.
@Injectable({ providedIn: 'root' })
export class I18nService {
  private readonly translate = inject(TranslateService);
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  /** Active language, never null — falls back to 'it' before the first `use()`. */
  readonly lang = computed<Lang>(() => {
    const current = this.translate.currentLang();
    return isLang(current) ? current : FALLBACK_LANG;
  });

  constructor() {
    // Server/prerender always renders 'it' (localStorage doesn't exist there), matching
    // the static lang="it" already in index.html. The browser build then reads the saved
    // preference on top, so a returning EN visitor sees a brief IT flash before hydration
    // swaps it — this is the accepted tradeoff for keeping prerendered output deterministic.
    const saved = this.isBrowser ? localStorage.getItem(STORAGE_KEY) : null;
    this.translate.use(isLang(saved) ? saved : FALLBACK_LANG);

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
