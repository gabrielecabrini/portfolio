import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'dateFormat' })
export class DateFormatPipe implements PipeTransform {
  transform(date: string, lang = 'it'): string {
    const [year, month] = date.split('-');
    const d = new Date(+year, +month - 1);
    return d.toLocaleDateString(lang === 'it' ? 'it-IT' : 'en-US', {
      month: 'short',
      year: 'numeric',
    });
  }
}
