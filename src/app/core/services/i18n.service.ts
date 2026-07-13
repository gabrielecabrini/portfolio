import { computed, effect, inject, Injectable, PLATFORM_ID, Signal } from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

const STORAGE_KEY = 'lang';
const SUPPORTED = ['it', 'en'] as const;
type Lang = typeof SUPPORTED[number];

@Injectable({ providedIn: 'root' })
export class I18nService {
  private readonly translate = inject(TranslateService);
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  readonly currentLang: Signal<string | null> = this.translate.currentLang;
  readonly lang = computed(() => this.currentLang() ?? 'it');

  constructor() {
    let lang: Lang = 'it';
    if (this.isBrowser) {
      const saved = localStorage.getItem(STORAGE_KEY) as Lang | null;
      const browser = (navigator.language || '').slice(0, 2) as Lang;
      lang = saved ?? (SUPPORTED.includes(browser) ? browser : 'it');
    }
    this.translate.use(lang);

    // Keep <html lang="..."> in sync with the active language
    effect(() => {
      const current = this.currentLang();
      if (current) this.document.documentElement.lang = current;
    });
  }

  toggle(): void {
    const next: Lang = (this.translate.currentLang() ?? 'it') === 'it' ? 'en' : 'it';
    this.translate.use(next);
    if (this.isBrowser) localStorage.setItem(STORAGE_KEY, next);
  }
}
