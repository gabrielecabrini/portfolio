import { inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';

const CAPTURE_SCALE = 2;
const BLOCK_SELECTORS = [
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

@Injectable({ providedIn: 'root' })
export class PdfExportService {
  private readonly document = inject(DOCUMENT);

  async generate(page: HTMLElement, lang: string): Promise<void> {
    const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
      import('html2canvas'),
      import('jspdf'),
    ]);

    const wasHidden = getComputedStyle(page).display === 'none';
    if (wasHidden) {
      page.style.cssText =
        'display:block;position:fixed;left:-9999px;top:0;width:820px;background:#fff;';
    }

    let canvas!: HTMLCanvasElement;
    let sortedBreaks!: number[];

    try {
      canvas = await html2canvas(page, {
        scale: CAPTURE_SCALE,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: 820,
      });

      const pageRect = page.getBoundingClientRect();
      const safeBreaks = new Set<number>([0, canvas.height]);
      page.querySelectorAll(BLOCK_SELECTORS).forEach(el => {
        const r = el.getBoundingClientRect();
        const top = Math.round((r.top - pageRect.top) * CAPTURE_SCALE);
        const bot = Math.round((r.bottom - pageRect.top) * CAPTURE_SCALE);
        if (top > 0) safeBreaks.add(top);
        if (bot < canvas.height) safeBreaks.add(bot);
      });
      sortedBreaks = [...safeBreaks].sort((a, b) => a - b);
    } finally {
      if (wasHidden) page.style.cssText = '';
    }

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();
    const pageHeightPx = Math.floor(pageH * canvas.width / pageW);

    const now = new Date();
    const dd = String(now.getDate()).padStart(2, '0');
    const MM = String(now.getMonth() + 1).padStart(2, '0');
    const yyyy = now.getFullYear();
    const generatedLabel =
      lang === 'it' ? `Generato il ${dd}/${MM}/${yyyy}` : `Generated on ${dd}/${MM}/${yyyy}`;

    const addPageFooter = (): void => {
      pdf.setFontSize(6.5);
      pdf.setTextColor(160, 160, 160);
      pdf.text(generatedLabel, pageW - 5, pageH - 4, { align: 'right' });
    };

    // ~10mm top padding added to continuation pages to avoid content flush against the edge
    const topPaddingPx = Math.round(10 * canvas.width / pageW);
    const offscreen = this.document.createElement('canvas');
    offscreen.width = canvas.width;
    const ctx = offscreen.getContext('2d')!;

    let sliceStart = 0;
    let pageIndex = 0;

    while (sliceStart < canvas.height) {
      const usableHeightPx = pageIndex === 0 ? pageHeightPx : pageHeightPx - topPaddingPx;
      const idealEnd = sliceStart + usableHeightPx;
      const cutPoint =
        idealEnd >= canvas.height
          ? canvas.height
          : (sortedBreaks.filter(b => b > sliceStart && b <= idealEnd).pop() ?? idealEnd);

      const sliceH = cutPoint - sliceStart;
      const topPad = pageIndex === 0 ? 0 : topPaddingPx;

      offscreen.height = sliceH + topPad;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, sliceH + topPad);
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
  }
}
