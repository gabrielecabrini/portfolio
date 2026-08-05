import { describe, expect, it } from 'vitest';
import { DateFormatPipe, formatMonthYear } from './date-format.pipe';
import { DateRangePipe } from './date-range.pipe';

describe('formatMonthYear', () => {
  // The month part is 1-based in the data but 0-based in `new Date`, so the two
  // boundary months are what an off-by-one would break first.
  it('maps month 01 to January, not December of the previous year', () => {
    expect(formatMonthYear('2025-01', 'en')).toBe('Jan 2025');
  });

  it('maps month 12 to December of the same year', () => {
    expect(formatMonthYear('2025-12', 'en')).toBe('Dec 2025');
  });

  it('localises the month name', () => {
    const italian = formatMonthYear('2025-06', 'it');
    expect(italian).not.toBe(formatMonthYear('2025-06', 'en'));
    expect(italian).toContain('2025');
  });

  it('treats any language other than "it" as English', () => {
    expect(formatMonthYear('2025-06', 'de')).toBe(formatMonthYear('2025-06', 'en'));
  });

  it('renders a bare "YYYY" as January of that year rather than an invalid date', () => {
    expect(formatMonthYear('2019', 'en')).toBe('Jan 2019');
  });
});

describe('DateFormatPipe', () => {
  it('defaults to Italian when no language is passed', () => {
    expect(new DateFormatPipe().transform('2025-06')).toBe(formatMonthYear('2025-06', 'it'));
  });
});

describe('DateRangePipe', () => {
  const pipe = new DateRangePipe();

  it('joins start and end with an em dash', () => {
    expect(pipe.transform('2022-04', '2023-03', 'en')).toBe('Apr 2022 — Mar 2023');
  });

  it('renders an ongoing role as "Present" in English', () => {
    expect(pipe.transform('2023-04', undefined, 'en')).toBe('Apr 2023 — Present');
  });

  it('renders an ongoing role as "Presente" in Italian', () => {
    expect(pipe.transform('2023-04', undefined, 'it')).toContain('Presente');
  });

  it('defaults to Italian when no language is passed', () => {
    expect(pipe.transform('2023-04')).toContain('Presente');
  });
});
