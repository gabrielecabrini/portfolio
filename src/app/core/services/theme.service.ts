import { effect, inject, Injectable, signal, WritableSignal } from '@angular/core';
import { DOCUMENT } from '@angular/common';

const THEME_KEY = 'theme';
type Theme = 'dark' | 'light';

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
      this.document.documentElement.setAttribute('data-theme', this.theme());
    });
  }

  toggle(): void {
    const next: Theme = this.theme() === 'dark' ? 'light' : 'dark';
    this.theme.set(next);
    localStorage.setItem(THEME_KEY, next);
  }
}
