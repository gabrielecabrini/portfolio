import type { Lang } from '../i18n';

/**
 * "2025-06" → "giu 2025" / "Jun 2025". A bare "YYYY" really can arrive (education
 * dates), so the month defaults to January instead of producing an Invalid Date.
 */
export function formatMonthYear(date: string, lang: Lang): string {
  const [year = '', month = '1'] = date.split('-');
  return new Date(+year, +month - 1).toLocaleDateString(lang === 'it' ? 'it-IT' : 'en-US', {
    month: 'short',
    year: 'numeric',
  });
}

/** "2022-04" + "2023-03" → "apr 2022 — mar 2023"; no end date means an ongoing role. */
export function dateRange(start: string, end: string | undefined, lang: Lang): string {
  const to = end ? formatMonthYear(end, lang) : lang === 'it' ? 'Presente' : 'Present';
  return `${formatMonthYear(start, lang)} — ${to}`;
}

/** Link href → readable label: drops mailto:/http(s):// and a trailing slash. */
export function displayUrl(href: string): string {
  if (href.startsWith('mailto:')) return href.slice('mailto:'.length);
  return href.replace(/^https?:\/\//, '').replace(/\/$/, '');
}
