import { describe, expect, it, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideTranslateService, TranslateLoader } from '@ngx-translate/core';
import { of } from 'rxjs';
import { WORK_EXPERIENCES } from '../../core/data/experience';
import { Cv } from './cv';

const noopLoader: TranslateLoader = { getTranslation: () => of({}) };

/**
 * /cv re-sorts work entries (most recent first) while /experience shows them in
 * declaration order. The ordering rule and that split are documented in cv.ts but
 * were not enforced anywhere. Assertions are on the *properties* of the ordering
 * rather than a hard-coded list of ids, so adding a job doesn't break the test.
 */
describe('Cv work experience ordering', () => {
  let workExperiences: Cv['workExperiences'];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideTranslateService({
          fallbackLang: 'it',
          loader: { provide: TranslateLoader, useValue: noopLoader },
        }),
      ],
    });
    workExperiences = TestBed.runInInjectionContext(() => new Cv()).workExperiences;
  });

  it('keeps every entry', () => {
    expect(workExperiences.map((w) => w.id).sort()).toEqual(
      WORK_EXPERIENCES.map((w) => w.id).sort(),
    );
  });

  it('puts ongoing roles (no endDate) before every finished one', () => {
    const ongoing = workExperiences.map((w) => w.endDate === undefined);
    const lastOngoing = ongoing.lastIndexOf(true);
    const firstFinished = ongoing.indexOf(false);
    if (lastOngoing !== -1 && firstFinished !== -1) expect(lastOngoing).toBeLessThan(firstFinished);
  });

  it('orders finished roles by end date, most recent first', () => {
    const ends = workExperiences.map((w) => w.endDate).filter((e) => e !== undefined);
    expect(ends).toEqual([...ends].sort().reverse());
  });

  it('breaks ties on end date by the later start date', () => {
    for (let i = 1; i < workExperiences.length; i++) {
      const prev = workExperiences[i - 1];
      const curr = workExperiences[i];
      if (prev && curr && prev.endDate === curr.endDate) {
        expect(prev.startDate >= curr.startDate).toBe(true);
      }
    }
  });

  it('does not mutate WORK_EXPERIENCES, which /experience renders unsorted', () => {
    // cv.ts copies with [...WORK_EXPERIENCES] before sorting. Dropping that spread
    // would silently reorder the /experience page too, since Array#sort is in-place.
    expect(WORK_EXPERIENCES.map((w) => w.id)).toEqual([
      'sandrini-metalli',
      'skyblockpuro',
      'r1se-gaming',
      'metamc-networks',
      'devroom',
      'songoda',
      'techscode',
    ]);
  });
});
