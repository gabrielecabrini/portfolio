import { inject, Injectable, Signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

const STORAGE_KEY = 'lang';
const SUPPORTED = ['it', 'en'] as const;
type Lang = typeof SUPPORTED[number];

@Injectable({ providedIn: 'root' })
export class I18nService {
  private readonly translate = inject(TranslateService);
  readonly currentLang: Signal<string | null> = this.translate.currentLang;

  constructor() {
    const saved = localStorage.getItem(STORAGE_KEY) as Lang | null;
    const browser = (navigator.language || '').slice(0, 2) as Lang;
    const lang = saved ?? (SUPPORTED.includes(browser) ? browser : 'it');
    this.translate.use(lang);
  }

  toggle(): void {
    const next: Lang = (this.translate.currentLang() ?? 'it') === 'it' ? 'en' : 'it';
    this.translate.use(next);
    localStorage.setItem(STORAGE_KEY, next);
  }
}
