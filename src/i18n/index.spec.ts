import { describe, expect, it } from 'vitest';
import { basePath, localePath, t } from '.';

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
