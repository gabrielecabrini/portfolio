import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { I18nService } from '../../core/services/i18n.service';
import { WORK_EXPERIENCES, SKILLS, CERTIFICATIONS, LANGUAGES, EDUCATION } from '../../core/data/experience';
import { WorkExperience } from '../../core/models/work-experience.model';
import { Skill } from '../../core/models/skill.model';
import { Certification } from '../../core/models/certification.model';
import { Education } from '../../core/models/education.model';
import { DateFormatPipe } from '../../core/pipes/date-format.pipe';
import { DateRangePipe } from '../../core/pipes/date-range.pipe';

@Component({
  selector: 'app-experience',
  imports: [TranslatePipe, RouterLink, DateFormatPipe, DateRangePipe],
  templateUrl: './experience.html',
  styleUrl: './experience.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Experience {
  readonly i18n = inject(I18nService);
  readonly workExperiences: WorkExperience[] = WORK_EXPERIENCES;
  readonly education: Education[] = EDUCATION;
  readonly skills: Skill[] = SKILLS;
  readonly languages: Skill[] = LANGUAGES;
  readonly certifications: Certification[] = CERTIFICATIONS;
}
