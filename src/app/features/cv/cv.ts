import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { I18nService } from '../../core/services/i18n.service';
import { applyPageSeo } from '../../core/services/page-seo';
import { PdfExportService } from '../../core/services/pdf-export.service';
import {
  WORK_EXPERIENCES,
  SKILLS,
  LANGUAGES,
  CERTIFICATIONS,
  EDUCATION,
} from '../../core/data/experience';
import { Education } from '../../core/models/education.model';
import { EMAIL, SOCIAL_LINKS } from '../../core/data/social-links';
import { SocialLink } from '../../core/models/social-link.model';
import { DateFormatPipe } from '../../core/pipes/date-format.pipe';
import { DateRangePipe } from '../../core/pipes/date-range.pipe';
import { DisplayUrlPipe } from '../../core/pipes/display-url.pipe';

// Renders the CV as an on-screen A4 "sheet" (.cv-page). The same DOM is what gets
// rasterised into the downloadable PDF, so the two can never drift apart —
// see PdfExportService.
@Component({
  selector: 'app-cv',
  imports: [TranslatePipe, DateFormatPipe, DateRangePipe, DisplayUrlPipe],
  templateUrl: './cv.html',
  styleUrl: './cv.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Cv {
  // Public because the template passes i18n.lang() to the date pipes and gates
  // the Italian-only GDPR clause on it.
  readonly i18n = inject(I18nService);

  private readonly pdfExport = inject(PdfExportService);
  private readonly cvPage = viewChild.required<ElementRef<HTMLElement>>('cvPage');

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
    ...SOCIAL_LINKS.filter((l) => l.href.includes('linkedin.com')),
  ];

  constructor() {
    applyPageSeo({
      descriptionKey: 'cv.seo.description',
      socialTitle: 'CV — Gabriele Cabrini',
    });
  }

  /**
   * Exports the rendered sheet as a PDF in the active language. Guarded by the
   * `downloading` signal because the capture takes a second or two and the button
   * stays clickable on slow devices.
   */
  async downloadPdf(): Promise<void> {
    if (this.downloading()) return;
    this.downloading.set(true);
    try {
      await this.pdfExport.generate(this.cvPage().nativeElement, this.i18n.lang());
    } finally {
      this.downloading.set(false);
    }
  }
}
