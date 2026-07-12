import { effect, inject, Injectable, signal, WritableSignal } from '@angular/core';
import { DOCUMENT } from '@angular/common';

const THEME_KEY = 'theme';
type Theme = 'dark' | 'light';
const THEME_COLORS: Record<Theme, string> = { dark: '#0d0d0d', light: '#f8f8f8' };

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  readonly theme: WritableSignal<Theme>;

  constructor() {
    const saved = localStorage.getItem(THEME_KEY) as Theme | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initial: Theme = saved ?? (prefersDark ? 'dark' : 'light');

    this.theme = signal<Theme>(initial);

    effect(() => {
      const t = this.theme();
      this.document.documentElement.setAttribute('data-theme', t);
      this.syncThemeColor(t);
    });
  }

  toggle(): void {
    const next: Theme = this.theme() === 'dark' ? 'light' : 'dark';
    this.theme.set(next);
    localStorage.setItem(THEME_KEY, next);
  }

  // Keeps the theme-color meta in sync with the active theme after user toggles.
  // The static media-query meta tags in index.html handle pre-JS load; this one
  // (without a media attribute) takes precedence once JS runs.
  private syncThemeColor(theme: Theme): void {
    let tag = this.document.querySelector<HTMLMetaElement>('meta[name="theme-color"]:not([media])');
    if (!tag) {
      tag = this.document.createElement('meta');
      tag.name = 'theme-color';
      this.document.head.appendChild(tag);
    }
    tag.content = THEME_COLORS[theme];
  }
}
