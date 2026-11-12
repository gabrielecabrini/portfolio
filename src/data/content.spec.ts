import { describe, expect, it } from 'vitest';
import { EDUCATION, LANGUAGES, SKILL_GROUPS, SKILLS, WORK_EXPERIENCES } from './experience';
import { PROJECTS } from './projects';

/**
 * A typo in a date or a duplicated id doesn't break the build: it renders an Invalid
 * Date, a wrong duration or a clashing i18n key (keys are derived from `id`).
 */
const MONTH = /^\d{4}-(0[1-9]|1[0-2])$/;
const YEAR = /^\d{4}$/;

describe('work experience dates', () => {
  it.each(WORK_EXPERIENCES)('$id uses YYYY-MM and does not end before it starts', (job) => {
    expect(job.startDate).toMatch(MONTH);
    if (job.endDate !== undefined) {
      expect(job.endDate).toMatch(MONTH);
      expect(job.endDate >= job.startDate).toBe(true);
    }
  });
});

describe('education dates', () => {
  it.each(EDUCATION)('$id uses YYYY and does not end before it starts', (edu) => {
    expect(edu.startDate).toMatch(YEAR);
    expect(edu.endDate).toMatch(YEAR);
    expect(edu.endDate >= edu.startDate).toBe(true);
  });
});

describe('ids', () => {
  it.each(
    Object.entries({ WORK_EXPERIENCES, EDUCATION, PROJECTS, SKILL_GROUPS, SKILLS, LANGUAGES }),
  )('are unique in %s', (_, items) => {
    const ids = items.map((item) => item.id);
    expect(ids.filter((id, i) => ids.indexOf(id) !== i)).toEqual([]);
  });
});
