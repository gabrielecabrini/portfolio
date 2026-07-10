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

      const CAPTURE_SCALE = 2;

      const canvas = await html2canvas(page, {
        scale: CAPTURE_SCALE,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: 820,
      });

      // Collect safe break points (element boundaries) while the element is still rendered
      const pageRect = page.getBoundingClientRect();
      const blockSelectors = [
        '.cv-header',
        '.cv-rule',
        '.cv-section-title',
        '.cv-bio',
        '.cv-entry',
        '.cv-cert-entry',
        '.cv-proj-entry',
        '.cv-lang-entry',
        '.cv-skills-list',
        '.cv-gdpr',
      ].join(', ');

      const safeBreaks = new Set<number>([0, canvas.height]);
      page.querySelectorAll(blockSelectors).forEach(el => {
        const r = el.getBoundingClientRect();
        const top = Math.round((r.top - pageRect.top) * CAPTURE_SCALE);
        const bot = Math.round((r.bottom - pageRect.top) * CAPTURE_SCALE);
        if (top > 0) safeBreaks.add(top);
        if (bot < canvas.height) safeBreaks.add(bot);
      });

      if (hidden) {
        page.style.cssText = '';
      }

      const sortedBreaks = [...safeBreaks].sort((a, b) => a - b);

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      // How many canvas pixels fit in one A4 page height
      const pageHeightPx = Math.floor(pageH * canvas.width / pageW);

      const now = new Date();
      const dd = String(now.getDate()).padStart(2, '0');
      const MM = String(now.getMonth() + 1).padStart(2, '0');
      const yyyy = now.getFullYear();
      const lang = this.i18n.currentLang() ?? 'it';
      const generatedLabel = lang === 'it'
        ? `Generato il ${dd}/${MM}/${yyyy}`
        : `Generated on ${dd}/${MM}/${yyyy}`;

      const addPageFooter = () => {
        pdf.setFontSize(6.5);
        pdf.setTextColor(160, 160, 160);
        pdf.text(generatedLabel, pageW - 5, pageH - 4, { align: 'right' });
      };

      // Top padding added at the start of every non-first page (in canvas pixels)
      const topPaddingPx = Math.round(10 * canvas.width / pageW); // ~10mm

      // Offscreen canvas for slicing
      const offscreen = document.createElement('canvas');
      offscreen.width = canvas.width;
      const ctx = offscreen.getContext('2d')!;

      let sliceStart = 0;
      let pageIndex = 0;

      while (sliceStart < canvas.height) {
        // Pages after the first have less usable height because of the top padding
        const usableHeightPx = pageIndex === 0 ? pageHeightPx : pageHeightPx - topPaddingPx;
        const idealEnd = sliceStart + usableHeightPx;

        // Pick the largest safe break point that fits within this page
        const cutPoint = idealEnd >= canvas.height
          ? canvas.height
          : (sortedBreaks.filter(b => b > sliceStart && b <= idealEnd).pop() ?? idealEnd);

        const sliceH = cutPoint - sliceStart;
        const topPad = pageIndex === 0 ? 0 : topPaddingPx;

        offscreen.height = sliceH + topPad;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, sliceH + topPad);
        // Draw content below the top padding
        ctx.drawImage(canvas, 0, sliceStart, canvas.width, sliceH, 0, topPad, canvas.width, sliceH);

        if (pageIndex > 0) pdf.addPage();
        const sliceHmm = (sliceH + topPad) * pageW / canvas.width;
        pdf.addImage(offscreen.toDataURL('image/jpeg', 0.92), 'JPEG', 0, 0, pageW, sliceHmm);
        addPageFooter();

        sliceStart = cutPoint;
        pageIndex++;
      }

      const fileDate = `${yyyy}${MM}${dd}`;
      pdf.save(`CV-GabrieleCabrini-${fileDate}-${lang.toUpperCase()}.pdf`);
    } finally {
      this.downloading.set(false);
    }
  }
}
