import { effect, inject, Injectable, PLATFORM_ID, signal, WritableSignal } from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';

const THEME_KEY = 'theme';
type Theme = 'dark' | 'light';
const THEME_COLORS: Record<Theme, string> = { dark: '#0d0d0d', light: '#f8f8f8' };

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  readonly theme: WritableSignal<Theme>;

  constructor() {
    // This duplicates the inline <script> in index.html, which sets data-theme
    // synchronously before Angular loads (to avoid a flash of the wrong theme on
    // first paint). Both must be kept in sync manually — same THEME_KEY, same
    // saved-value-then-prefers-color-scheme fallback — if this logic changes.
    let initial: Theme = 'dark';
    if (this.isBrowser) {
      const saved = localStorage.getItem(THEME_KEY) as Theme | null;
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      initial = saved ?? (prefersDark ? 'dark' : 'light');
    }

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
    if (this.isBrowser) localStorage.setItem(THEME_KEY, next);
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
