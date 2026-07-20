import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'displayUrl', standalone: true })
export class DisplayUrlPipe implements PipeTransform {
  transform(href: string): string {
    return href.startsWith('mailto:')
      ? href.slice(7)
      : href.replace(/^https?:\/\//, '').replace(/\/$/, '');
  }
}
