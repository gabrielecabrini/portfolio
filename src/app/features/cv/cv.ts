import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { SeoService } from '../../core/services/seo.service';
import { I18nService } from '../../core/services/i18n.service';
import { PdfExportService } from '../../core/services/pdf-export.service';
import { WORK_EXPERIENCES, SKILLS, LANGUAGES, CERTIFICATIONS, EDUCATION } from '../../core/data/experience';
import { Education } from '../../core/models/education.model';
import { EMAIL, SOCIAL_LINKS } from '../../core/data/social-links';
import { SocialLink } from '../../core/models/social-link.model';
import { DateFormatPipe } from '../../core/pipes/date-format.pipe';
import { DateRangePipe } from '../../core/pipes/date-range.pipe';
import { DisplayUrlPipe } from '../../core/pipes/display-url.pipe';

@Component({
  selector: 'app-cv',
  imports: [TranslatePipe, DateFormatPipe, DateRangePipe, DisplayUrlPipe],
  templateUrl: './cv.html',
  styleUrl: './cv.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Cv {
  readonly i18n = inject(I18nService);
  private readonly pdfExport = inject(PdfExportService);
  readonly downloading = signal(false);

  // Most recent/current role first: missing endDate ("present") sorts as if it ended
  // in the far future, so ongoing jobs always lead; ties (e.g. two "present" roles,
  // not expected today but not prevented by the model) break by later start date.
  // /experience shows the same data unsorted (declaration order in core/data/experience.ts).
  readonly workExperiences = [...WORK_EXPERIENCES].sort((a, b) => {
    const aEnd = a.endDate ?? '9999-12';
    const bEnd = b.endDate ?? '9999-12';
    if (aEnd !== bEnd) return aEnd > bEnd ? -1 : 1;
    return a.startDate > b.startDate ? -1 : 1;
  });

  readonly education: Education[] = EDUCATION;
  readonly skills = SKILLS;
  readonly languages = LANGUAGES;
  readonly certifications = CERTIFICATIONS;

  readonly contactLinks: SocialLink[] = [
    EMAIL,
    ...SOCIAL_LINKS.filter(l => l.href.includes('linkedin.com')),
  ];

  constructor() {
    const seo = inject(SeoService);
    const translate = inject(TranslateService);

    effect(() => {
      this.i18n.lang();
      seo.setDescription(translate.instant('cv.seo.description'));
      seo.setSocialTitle(`CV — Gabriele Cabrini`);
      seo.setType('website');
    });
  }

  async downloadPdf(): Promise<void> {
    if (this.downloading()) return;
    this.downloading.set(true);
    try {
      const page = document.querySelector('.cv-page') as HTMLElement;
      await this.pdfExport.generate(page, this.i18n.lang());
    } finally {
      this.downloading.set(false);
    }
  }
}
