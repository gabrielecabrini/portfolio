import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import en from '../i18n/en.json';
import itDict from '../i18n/it.json';
import { EDUCATION, LANGUAGES, SKILL_GROUPS, WORK_EXPERIENCES } from './experience';
import { PROJECTS } from './projects';

/**
 * src/data/README.md documents a rule that is otherwise enforced only by memory:
 * every `...Key` field must have a matching entry in BOTH translation files. A miss
 * doesn't crash — t() falls back to rendering the raw key — so it reaches
 * production looking like `experience.work.foo.role` on the page. These tests turn
 * that manual step into a mechanical one.
 */
function flattenKeys(value: unknown, prefix = ''): string[] {
  if (typeof value !== 'object' || value === null) return [prefix];
  return Object.entries(value).flatMap(([k, v]) => flattenKeys(v, prefix ? `${prefix}.${k}` : k));
}

const IT_KEYS = new Set(flattenKeys(itDict));
const EN_KEYS = new Set(flattenKeys(en));

// Every i18n key referenced from the typed content arrays under src/data/.
const CONTENT_KEYS: string[] = [
  ...WORK_EXPERIENCES.flatMap((w) => [w.roleKey, w.descriptionKey]),
  ...SKILL_GROUPS.flatMap((g) => [
    g.categoryKey,
    ...g.skills.map((s) => s.descriptionKey).filter((k) => k !== undefined),
  ]),
  ...LANGUAGES.map((l) => l.descriptionKey).filter((k) => k !== undefined),
  ...EDUCATION.map((e) => e.qualificationKey),
  ...PROJECTS.flatMap((p) => [p.titleKey, p.descriptionKey]),
];

// Every literal key passed to t(lang, '...') in the .astro templates.
const SRC = join(import.meta.dirname, '..');
const TEMPLATE_KEYS = readdirSync(SRC, { recursive: true, encoding: 'utf8' })
  .filter((file) => file.endsWith('.astro'))
  .flatMap((file) => [...readFileSync(join(SRC, file), 'utf8').matchAll(/\bt\(lang, '([^']+)'/g)])
  .map((match) => match[1] ?? '');

describe('translation files', () => {
  it('define the same set of keys in it and en', () => {
    expect([...IT_KEYS].filter((k) => !EN_KEYS.has(k))).toEqual([]);
    expect([...EN_KEYS].filter((k) => !IT_KEYS.has(k))).toEqual([]);
  });

  it('have no empty values', () => {
    const empty = Object.entries({ it: itDict, en })
      .flatMap(([lang, dict]) => flattenKeys(dict).map((k) => ({ lang, key: k, dict })))
      .filter(({ key, dict }) => {
        const value = key.split('.').reduce<unknown>((acc, part) => {
          return typeof acc === 'object' && acc !== null
            ? (acc as Record<string, unknown>)[part]
            : undefined;
        }, dict);
        return typeof value !== 'string' || value.trim() === '';
      })
      .map(({ lang, key }) => `${lang}:${key}`);
    expect(empty).toEqual([]);
  });
});

describe('content keys in src/data', () => {
  it('all resolve in both languages', () => {
    expect(CONTENT_KEYS.filter((k) => !IT_KEYS.has(k))).toEqual([]);
    expect(CONTENT_KEYS.filter((k) => !EN_KEYS.has(k))).toEqual([]);
  });

  it('covers a non-trivial number of keys (guards against the collector silently emptying)', () => {
    expect(CONTENT_KEYS.length).toBeGreaterThan(20);
  });
});

describe('template keys', () => {
  it('all resolve in both languages', () => {
    expect(TEMPLATE_KEYS.filter((k) => !IT_KEYS.has(k))).toEqual([]);
    expect(TEMPLATE_KEYS.filter((k) => !EN_KEYS.has(k))).toEqual([]);
  });

  it('covers a non-trivial number of keys (guards against the collector silently emptying)', () => {
    expect(TEMPLATE_KEYS.length).toBeGreaterThan(30);
  });
});
