import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideTranslateService, TranslateLoader } from '@ngx-translate/core';
import { of } from 'rxjs';
import { App } from './app';

// Empty dictionary: these are structural assertions, so the shell only needs the
// translate pipe to resolve — the text it produces is irrelevant here.
const noopLoader: TranslateLoader = { getTranslation: () => of({}) };

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([]),
        provideTranslateService({
          fallbackLang: 'it',
          loader: { provide: TranslateLoader, useValue: noopLoader },
        }),
      ],
    }).compileComponents();
  });

  it('creates the app', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders the shell: skip link, header, routed outlet, footer', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const shell = fixture.nativeElement as HTMLElement;

    expect(shell.querySelector('a.skip-link')?.getAttribute('href')).toBe('#main-content');
    expect(shell.querySelector('app-header')).toBeTruthy();
    expect(shell.querySelector('main#main-content')).toBeTruthy();
    expect(shell.querySelector('app-footer')).toBeTruthy();
  });
});
