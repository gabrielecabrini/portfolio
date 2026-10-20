import { describe, expect, it } from 'vitest';
import { dateRange, displayUrl, formatMonthYear } from './format';

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

  it('renders a bare "YYYY" as January of that year rather than an invalid date', () => {
    expect(formatMonthYear('2019', 'en')).toBe('Jan 2019');
  });
});

describe('dateRange', () => {
  it('joins start and end with an em dash', () => {
    expect(dateRange('2022-04', '2023-03', 'en')).toBe('Apr 2022 — Mar 2023');
  });

  it('renders an ongoing role as "Present" in English', () => {
    expect(dateRange('2023-04', undefined, 'en')).toBe('Apr 2023 — Present');
  });

  it('renders an ongoing role as "Presente" in Italian', () => {
    expect(dateRange('2023-04', undefined, 'it')).toContain('Presente');
  });
});

describe('displayUrl', () => {
  it('strips mailto: prefix', () => {
    expect(displayUrl('mailto:gabriele@example.com')).toBe('gabriele@example.com');
  });

  it('strips http(s):// prefix', () => {
    expect(displayUrl('https://github.com/user')).toBe('github.com/user');
    expect(displayUrl('http://example.com')).toBe('example.com');
  });

  it('strips a trailing slash only', () => {
    expect(displayUrl('https://linkedin.com/in/user/')).toBe('linkedin.com/in/user');
    expect(displayUrl('https://github.com/user/repo')).toBe('github.com/user/repo');
  });
});
