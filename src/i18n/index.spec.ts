import { describe, expect, it } from 'vitest';
import { basePath, localePath, pageLang, t } from '.';

describe('t', () => {
  it('resolves nested keys per language', () => {
    expect(t('it', 'nav.about')).toBe('Chi sono');
    expect(t('en', 'nav.about')).toBe('About');
  });

  it('falls back to the key when missing', () => {
    expect(t('it', 'nope.missing')).toBe('nope.missing');
  });

  it('fills {{params}}', () => {
    expect(t('it', 'cv.footer.generated', { date: '01/02/2026' })).toBe('Generato il 01/02/2026');
  });

  it('leaves a placeholder without a param as written', () => {
    expect(t('it', 'cv.footer.generated')).toBe('Generato il {{date}}');
  });

  it('falls back to the key when it points to a group, not a string', () => {
    expect(t('it', 'nav')).toBe('nav');
  });
});

describe('localePath / basePath', () => {
  it('round-trips every page between the two languages', () => {
    for (const path of ['/', '/about', '/cv']) {
      for (const lang of ['it', 'en'] as const) {
        expect(basePath(localePath(lang, path))).toBe(path);
      }
    }
  });

  it('prefixes English only', () => {
    expect(localePath('it', '/about')).toBe('/about/');
    expect(localePath('en', '/about')).toBe('/en/about/');
    expect(localePath('en', '/')).toBe('/en/');
  });

  it('does not treat "/english" as the /en prefix', () => {
    expect(basePath('/english')).toBe('/english');
  });
});

describe('pageLang', () => {
  it('maps only "en" to English, anything else to Italian', () => {
    expect(pageLang('en')).toBe('en');
    expect(pageLang(undefined)).toBe('it');
    expect(pageLang('xx')).toBe('it');
  });
});
