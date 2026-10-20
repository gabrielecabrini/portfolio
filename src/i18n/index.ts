import it from './it.json';
import en from './en.json';

export const LANGS = ['it', 'en'] as const;
export type Lang = (typeof LANGS)[number];

const DICTS: Record<Lang, unknown> = { it, en };

/**
 * Looks up a dotted key ("nav.home") and fills `{{name}}` placeholders. A missing key
 * renders as the key itself rather than crashing the build; data/content-i18n.spec.ts
 * is what catches it.
 */
export function t(lang: Lang, key: string, params: Record<string, string> = {}): string {
  const value = key
    .split('.')
    .reduce<unknown>(
      (node, part) =>
        typeof node === 'object' && node !== null
          ? (node as Record<string, unknown>)[part]
          : undefined,
      DICTS[lang],
    );
  if (typeof value !== 'string') return key;
  return value.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, name: string) => params[name] ?? match);
}

/**
 * "/about" → "/about/" (it) or "/en/about/" (en). Trailing slash because that's the
 * URL static hosting serves directory pages at; without it every click is a redirect.
 */
export function localePath(lang: Lang, path: string): string {
  const prefix = lang === 'it' ? '' : '/en';
  return path === '/' ? `${prefix}/` : `${prefix}${path}/`;
}

/** Strips the "/en" prefix and any trailing slash: "/en/about/" → "/about". */
export function basePath(pathname: string): string {
  const path = pathname.replace(/^\/en(?=\/|$)/, '').replace(/\/+$/, '');
  return path || '/';
}

/** getStaticPaths for pages/[...lang]/: each page is built at the root (it) and under /en. */
export const langPaths = () => [{ params: { lang: undefined } }, { params: { lang: 'en' } }];

export function pageLang(param: string | undefined): Lang {
  return param === 'en' ? 'en' : 'it';
}
