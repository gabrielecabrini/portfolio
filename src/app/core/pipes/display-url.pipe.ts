import { Pipe, PipeTransform } from '@angular/core';

/**
 * Turns a link href into readable label text by dropping the parts a reader
 * doesn't need: the mailto:/http(s):// scheme and any trailing slash.
 */
@Pipe({ name: 'displayUrl' })
export class DisplayUrlPipe implements PipeTransform {
  transform(href: string): string {
    if (href.startsWith('mailto:')) return href.slice('mailto:'.length);
    return href.replace(/^https?:\/\//, '').replace(/\/$/, '');
  }
}
