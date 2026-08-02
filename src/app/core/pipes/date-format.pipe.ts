import { Pipe, PipeTransform } from '@angular/core';

/**
 * Formats a "YYYY-MM" data string as a localised short month + year
 * ("2025-06" → "giu 2025" / "Jun 2025").
 *
 * Exported as a plain function so DateRangePipe can reuse it without
 * instantiating a pipe class.
 */
export function formatMonthYear(date: string, lang: string): string {
  const [year, month] = date.split('-');
  return new Date(+year, +month - 1).toLocaleDateString(lang === 'it' ? 'it-IT' : 'en-US', {
    month: 'short',
    year: 'numeric',
  });
}

@Pipe({ name: 'dateFormat' })
export class DateFormatPipe implements PipeTransform {
  transform(date: string, lang = 'it'): string {
    return formatMonthYear(date, lang);
  }
}
