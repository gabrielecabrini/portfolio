import { describe, expect, it } from 'vitest';
import { WORK_EXPERIENCES } from '../data/experience';
import { sortForCv } from './cv';

// Assertions are on the *properties* of the ordering rather than a hard-coded list
// of ids, so adding a job doesn't break the test.
describe('sortForCv', () => {
  const sorted = sortForCv(WORK_EXPERIENCES);

  it('keeps every entry', () => {
    expect(sorted.map((w) => w.id).sort()).toEqual(WORK_EXPERIENCES.map((w) => w.id).sort());
  });

  it('puts ongoing roles (no endDate) before every finished one', () => {
    const ongoing = sorted.map((w) => w.endDate === undefined);
    const lastOngoing = ongoing.lastIndexOf(true);
    const firstFinished = ongoing.indexOf(false);
    if (lastOngoing !== -1 && firstFinished !== -1) expect(lastOngoing).toBeLessThan(firstFinished);
  });

  it('orders finished roles by end date, most recent first', () => {
    const ends = sorted.map((w) => w.endDate).filter((e) => e !== undefined);
    expect(ends).toEqual([...ends].sort().reverse());
  });

  it('breaks ties on end date by the later start date', () => {
    for (let i = 1; i < sorted.length; i++) {
      const prev = sorted[i - 1];
      const curr = sorted[i];
      if (prev && curr && prev.endDate === curr.endDate) {
        expect(prev.startDate >= curr.startDate).toBe(true);
      }
    }
  });

  it('does not mutate WORK_EXPERIENCES, which /experience renders unsorted', () => {
    expect(WORK_EXPERIENCES.map((w) => w.id)).toEqual([
      'sandrini-metalli',
      'skyblockpuro',
      'r1se-gaming',
      'metamc-networks',
      'devroom',
    ]);
  });
});
