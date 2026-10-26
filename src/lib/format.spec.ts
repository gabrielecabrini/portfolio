import { describe, expect, it } from 'vitest';
import {
  dateRange,
  displayUrl,
  duration,
  formatFingerprint,
  formatMonthYear,
  workPlace,
} from './format';

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

  it('strips a leading www.', () => {
    expect(displayUrl('https://www.linkedin.com/in/user/')).toBe('linkedin.com/in/user');
  });

  it('strips a trailing slash only', () => {
    expect(displayUrl('https://linkedin.com/in/user/')).toBe('linkedin.com/in/user');
    expect(displayUrl('https://github.com/user/repo')).toBe('github.com/user/repo');
  });
});

describe('workPlace', () => {
  it('joins location and remote, localised', () => {
    expect(workPlace({ location: 'Dubai', remote: true }, 'en')).toBe('Dubai · Remote');
    expect(workPlace({ location: 'Dubai', remote: true }, 'it')).toBe('Dubai · Da remoto');
  });

  it('renders whichever part is present, or nothing', () => {
    expect(workPlace({ location: 'Costa Volpino (BG)' }, 'en')).toBe('Costa Volpino (BG)');
    expect(workPlace({ remote: true }, 'en')).toBe('Remote');
    expect(workPlace({}, 'en')).toBe('');
  });
});

describe('duration', () => {
  it('counts both end months, so Apr 2022 — Mar 2023 is exactly one year', () => {
    expect(duration('2022-04', '2023-03', 'en')).toBe('1 yr');
    expect(duration('2022-04', '2023-03', 'it')).toBe('1 anno');
  });

  it('combines years and months with plurals', () => {
    expect(duration('2024-01', '2025-09', 'en')).toBe('1 yr 9 mos');
    expect(duration('2022-08', '2024-02', 'it')).toBe('1 anno 7 mesi');
    expect(duration('2020-01', '2022-01', 'it')).toBe('2 anni 1 mese');
  });

  it('never renders an empty string for a role starting and ending in the same month', () => {
    expect(duration('2024-05', '2024-05', 'en')).toBe('1 mo');
  });

  it('measures an ongoing role up to now', () => {
    expect(duration('2023-04', undefined, 'it', new Date(2026, 9, 26))).toBe('3 anni 7 mesi');
  });
});

describe('formatFingerprint', () => {
  it('groups by 4 into the two halves gpg prints', () => {
    expect(formatFingerprint('50761238F7719F61752B0410CFFA1EF2640C5BF3')).toEqual([
      '5076 1238 F771 9F61 752B',
      '0410 CFFA 1EF2 640C 5BF3',
    ]);
  });
});
