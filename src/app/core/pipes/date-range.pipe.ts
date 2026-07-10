import { Pipe, PipeTransform } from '@angular/core';
import { DateFormatPipe } from './date-format.pipe';

@Pipe({ name: 'dateRange' })
export class DateRangePipe implements PipeTransform {
  private readonly dateFormat = new DateFormatPipe();

  transform(start: string, end?: string, lang = 'it'): string {
    const present = lang === 'it' ? 'Presente' : 'Present';
    return `${this.dateFormat.transform(start, lang)} — ${end ? this.dateFormat.transform(end, lang) : present}`;
  }
}
