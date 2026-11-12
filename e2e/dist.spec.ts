import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import config from '../astro.config.mjs';
import { LANGS } from '../src/i18n';

// Checks on the built site: run `yarn build` first.
const DIST = join(import.meta.dirname, '..', 'dist');

const HTML = new Map(
  readdirSync(DIST, { recursive: true, encoding: 'utf8' })
    .filter((file) => file.endsWith('.html'))
    .map((file) => [file, readFileSync(join(DIST, file), 'utf8')]),
);

// /about/ → about/index.html, /CV-…pdf → the file itself, as static hosting resolves them.
const resolves = (path: string) => {
  const file = join(DIST, decodeURIComponent(path));
  return existsSync(path.endsWith('/') ? join(file, 'index.html') : file);
};

const isNoindex = (html: string) => html.includes('<meta name="robots" content="noindex');

describe('dist', () => {
  it('has no internal link or asset pointing to a missing file', () => {
    const broken = [...HTML].flatMap(([file, html]) =>
      [...html.matchAll(/\b(?:href|src)="(\/(?!\/)[^"#?]*)/g)]
        .map((m) => m[1]!)
        .filter((path) => !resolves(path))
        .map((path) => `${file}: ${path}`),
    );
    expect(broken).toEqual([]);
  });

  it('gives every indexable page a canonical and an alternate per language plus x-default', () => {
    const indexable = [...HTML].filter(([, html]) => !isNoindex(html));
    // Also guards against the collector silently emptying.
    expect(indexable.length).toBeGreaterThan(10);
    for (const [file, html] of indexable) {
      expect(html.match(/<link rel="canonical"[^>]*>/g), file).toHaveLength(1);
      for (const lang of [...LANGS, 'x-default']) {
        expect(html, `${file} hreflang=${lang}`).toContain(
          `hreflang="${lang}" href="${config.site}/`,
        );
      }
    }
  });

  it('keeps donut and the 404s out of search engines and the sitemap', () => {
    for (const file of ['donut/index.html', '404.html', 'en/404.html']) {
      expect(isNoindex(HTML.get(file) ?? ''), file).toBe(true);
    }
    const sitemap = readFileSync(join(DIST, 'sitemap-0.xml'), 'utf8');
    expect(sitemap).not.toContain('/donut/');
    expect(sitemap).not.toContain('404');
  });

  it('flattens the English 404 so Cloudflare serves it under /en/ (en-404 hook)', () => {
    expect(HTML.has('en/404.html')).toBe(true);
    expect(existsSync(join(DIST, 'en/404'))).toBe(false);
  });
});
