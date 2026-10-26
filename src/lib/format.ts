import type { Lang } from '../i18n';
import type { WorkExperience } from '../models/work-experience.model';

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

/** "Dubai" + remote → "Dubai · Remote"; empty string when the job has neither. */
export function workPlace(job: Pick<WorkExperience, 'location' | 'remote'>, lang: Lang): string {
  const remote = job.remote ? (lang === 'it' ? 'Da remoto' : 'Remote') : undefined;
  return [job.location, remote].filter(Boolean).join(' · ');
}

/** Link href → readable label: drops mailto:/http(s)://, a leading www. and a trailing slash. */
export function displayUrl(href: string): string {
  if (href.startsWith('mailto:')) return href.slice('mailto:'.length);
  return href.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
}

/**
 * "2022-04" → "2023-03" = "1 anno" / "1 yr": both end months count, like LinkedIn.
 * An ongoing role runs up to `now`, so callers re-run it in the browser at page load.
 */
export function duration(
  start: string,
  end: string | undefined,
  lang: Lang,
  now: Date = new Date(),
): string {
  const [sy = 0, sm = 1] = start.split('-').map(Number);
  const [ey = 0, em = 1] = end
    ? end.split('-').map(Number)
    : [now.getFullYear(), now.getMonth() + 1];
  const total = Math.max(1, (ey - sy) * 12 + em - sm + 1);
  const years = Math.floor(total / 12);
  const months = total % 12;
  const [yr, yrs, mo, mos] =
    lang === 'it' ? ['anno', 'anni', 'mese', 'mesi'] : ['yr', 'yrs', 'mo', 'mos'];
  return [
    years && `${years} ${years === 1 ? yr : yrs}`,
    months && `${months} ${months === 1 ? mo : mos}`,
  ]
    .filter(Boolean)
    .join(' ');
}

/** 40 hex chars → ["5076 1238 F771 9F61 752B", "0410 … 5BF3"]: gpg's groups of 4, in two halves. */
export function formatFingerprint(fingerprint: string): [string, string] {
  const groups = fingerprint.match(/.{1,4}/g) ?? [];
  return [groups.slice(0, 5).join(' '), groups.slice(5).join(' ')];
}
