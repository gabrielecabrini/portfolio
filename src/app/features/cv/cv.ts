import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { I18nService } from '../../core/services/i18n.service';
import { WORK_EXPERIENCES, SKILLS, LANGUAGES, CERTIFICATIONS, EDUCATION } from '../../core/data/experience';
import { Education } from '../../core/models/education.model';
import { PROJECTS } from '../../core/data/projects';
import { SOCIAL_LINKS } from '../../core/data/social-links';
import { SocialLink } from '../../core/models/social-link.model';
import { DateFormatPipe } from '../../core/pipes/date-format.pipe';
import { DateRangePipe } from '../../core/pipes/date-range.pipe';

@Component({
  selector: 'app-cv',
  imports: [TranslatePipe, DateFormatPipe, DateRangePipe],
  templateUrl: './cv.html',
  styleUrl: './cv.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Cv {
  readonly i18n = inject(I18nService);
  readonly downloading = signal(false);

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
  readonly projects = PROJECTS;

  readonly contactLinks: SocialLink[] = SOCIAL_LINKS.filter(l =>
    l.href.startsWith('mailto:') ||
    l.href.includes('linkedin.com')
  );

  displayUrl(href: string): string {
    return href.startsWith('mailto:')
      ? href.slice(7)
      : href.replace(/^https?:\/\//, '').replace(/\/$/, '');
  }

  async downloadPdf(): Promise<void> {
    if (this.downloading()) return;
    this.downloading.set(true);

    try {
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import('html2canvas'),
        import('jspdf'),
      ]);

      const page = document.querySelector('.cv-page') as HTMLElement;
      const hidden = getComputedStyle(page).display === 'none';

      if (hidden) {
        page.style.cssText =
          'display:block;position:fixed;left:-9999px;top:0;width:820px;background:#fff;';
      }

      const canvas = await html2canvas(page, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: 820,
      });

      if (hidden) {
        page.style.cssText = '';
      }

      const imgData = canvas.toDataURL('image/jpeg', 0.92);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const imgW = canvas.width / 2;
      const imgH = canvas.height / 2;
      const ratio = pageW / imgW;
      const scaledH = imgH * ratio;

      const now = new Date();
      const dd = String(now.getDate()).padStart(2, '0');
      const MM = String(now.getMonth() + 1).padStart(2, '0');
      const yyyy = now.getFullYear();
      const lang = this.i18n.currentLang() ?? 'it';
      const generatedLabel = lang === 'it' ? `Generato il ${dd}/${MM}/${yyyy}` : `Generated on ${dd}/${MM}/${yyyy}`;

      const addPageFooter = () => {
        pdf.setFontSize(6.5);
        pdf.setTextColor(160, 160, 160);
        pdf.text(generatedLabel, pageW - 5, pageH - 4, { align: 'right' });
      };

      const totalPages = Math.max(1, Math.ceil(scaledH / pageH));
      for (let i = 0; i < totalPages; i++) {
        if (i > 0) pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, -(i * pageH), pageW, scaledH);
        addPageFooter();
      }

      const fileDate = `${yyyy}${MM}${dd}`;
      pdf.save(`CV-GabrieleCabrini-${fileDate}-${lang.toUpperCase()}.pdf`);
    } finally {
      this.downloading.set(false);
    }
  }
}
