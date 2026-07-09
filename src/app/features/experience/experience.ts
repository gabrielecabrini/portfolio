import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { I18nService } from '../../core/services/i18n.service';
import { WORK_EXPERIENCES, SKILLS, CERTIFICATIONS, LANGUAGES } from '../../../assets/data/experience';
import { WorkExperience } from '../../core/models/work-experience.model';
import { Skill } from '../../core/models/skill.model';
import { Certification } from '../../core/models/certification.model';

@Component({
  selector: 'app-experience',
  imports: [TranslatePipe, RouterLink],
  templateUrl: './experience.html',
  styleUrl: './experience.css',
})
export class Experience {
  readonly workExperiences: WorkExperience[] = WORK_EXPERIENCES;
  readonly skills: Skill[] = SKILLS;
  readonly languages: Skill[] = LANGUAGES;
  readonly certifications: Certification[] = CERTIFICATIONS;

  constructor(private i18n: I18nService) {}

  formatDate(date: string): string {
    const [year, month] = date.split('-');
    const d = new Date(+year, +month - 1);
    const lang = this.i18n.currentLang() ?? 'it';
    return d.toLocaleDateString(lang === 'it' ? 'it-IT' : 'en-US', {
      month: 'short',
      year: 'numeric',
    });
  }

  formatRange(start: string, end?: string): string {
    const lang = this.i18n.currentLang() ?? 'it';
    const present = lang === 'it' ? 'Presente' : 'Present';
    return `${this.formatDate(start)} — ${end ? this.formatDate(end) : present}`;
  }
}
