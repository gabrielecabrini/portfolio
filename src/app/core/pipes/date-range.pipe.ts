import { Pipe, PipeTransform } from '@angular/core';
import { formatMonthYear } from './date-format.pipe';

// Literal rather than an i18n key: keeping it here means the pipe stays pure and
// synchronous instead of having to inject TranslateService.
const PRESENT = { it: 'Presente', en: 'Present' };

/**
 * Renders a work/education period ("2022-04" + "2023-03" → "apr 2022 — mar 2023").
 * An absent end date means the role is ongoing and renders as "Presente"/"Present".
 */
@Pipe({ name: 'dateRange' })
export class DateRangePipe implements PipeTransform {
  transform(start: string, end?: string, lang = 'it'): string {
    const present = lang === 'it' ? PRESENT.it : PRESENT.en;
    const from = formatMonthYear(start, lang);
    const to = end ? formatMonthYear(end, lang) : present;
    return `${from} — ${to}`;
  }
}
