import type { WorkExperience } from '../models/work-experience.model';

/**
 * Most recent/current role first: a missing endDate ("present") sorts as if it ended
 * in the far future; ties break by later start date. Returns a copy because
 * /experience renders the same array unsorted, in declaration order.
 */
export function sortForCv(jobs: readonly WorkExperience[]): WorkExperience[] {
  return [...jobs].sort((a, b) => {
    const aEnd = a.endDate ?? '9999-12';
    const bEnd = b.endDate ?? '9999-12';
    if (aEnd !== bEnd) return aEnd > bEnd ? -1 : 1;
    return a.startDate > b.startDate ? -1 : 1;
  });
}
