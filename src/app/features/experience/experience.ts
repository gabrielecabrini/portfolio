import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { I18nService } from '../../core/services/i18n.service';
import { WORK_EXPERIENCES, SKILL_GROUPS, CERTIFICATIONS, LANGUAGES } from '../../core/data/experience';
import { WorkExperience } from '../../core/models/work-experience.model';
import { Skill, SkillGroup } from '../../core/models/skill.model';
import { Certification } from '../../core/models/certification.model';
import { DateFormatPipe } from '../../core/pipes/date-format.pipe';
import { DateRangePipe } from '../../core/pipes/date-range.pipe';
import { SeoService } from '../../core/services/seo.service';
import { RevealDirective } from '../../shared/directives/reveal.directive';

@Component({
  selector: 'app-experience',
  imports: [TranslatePipe, RouterLink, DateFormatPipe, DateRangePipe, RevealDirective],
  templateUrl: './experience.html',
  styleUrl: './experience.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Experience {
  readonly i18n = inject(I18nService);
  readonly workExperiences: WorkExperience[] = WORK_EXPERIENCES;
  readonly skillGroups: SkillGroup[] = SKILL_GROUPS;
  readonly languages: Skill[] = LANGUAGES;
  readonly certifications: Certification[] = CERTIFICATIONS;

  constructor() {
    const seo = inject(SeoService);
    const translate = inject(TranslateService);

    effect(() => {
      this.i18n.lang();
      seo.setDescription(translate.instant('experience.seo.description'));
      seo.setSocialTitle(`Experience — Gabriele Cabrini`);
      seo.setType('website');
    });
  }
}
