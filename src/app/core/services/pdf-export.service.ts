import { inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

const CAPTURE_SCALE = 2;
// Extra canvas-pixels added below each entry's bottom before registering it as a
// safe break. Prevents near-miss splits where an entry overflows the ideal page end
// by just a few pixels and gets cut instead of being pushed to the next page.
const ENTRY_BOTTOM_MARGIN = 10;

const SECTION_SELECTORS = '.cv-header, .cv-section, .cv-gdpr';
const ENTRY_SELECTORS = '.cv-entry, .cv-cert-entry';

@Injectable({ providedIn: 'root' })
export class PdfExportService {
  private readonly document = inject(DOCUMENT);
  private readonly translate = inject(TranslateService);

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
      page.querySelectorAll(`${SECTION_SELECTORS}, ${ENTRY_SELECTORS}`).forEach(el => {
        const r = el.getBoundingClientRect();
        const top = Math.round((r.top - pageRect.top) * CAPTURE_SCALE);
        const bot = Math.round((r.bottom - pageRect.top) * CAPTURE_SCALE);

        const isFirstEntry =
          el.matches(ENTRY_SELECTORS) &&
          !el.previousElementSibling?.matches(ENTRY_SELECTORS);

        // TOP is safe for sections and for non-first entries.
        // The first entry in a section is excluded: cutting before it would leave
        // the section's h2 title stranded alone at the bottom of the previous page.
        if (!isFirstEntry && top > 0) safeBreaks.add(top);

        // BOTTOM: entries use bot + ENTRY_BOTTOM_MARGIN so that a block whose true
        // bottom exceeds the ideal page end by a small amount is not picked as a
        // candidate — the algorithm falls back to an earlier break and pushes the
        // whole entry to the next page instead of shaving off its last few pixels.
        const safeBot = el.matches(ENTRY_SELECTORS)
          ? Math.min(bot + ENTRY_BOTTOM_MARGIN, canvas.height)
          : bot;
        if (safeBot < canvas.height) safeBreaks.add(safeBot);
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
    const generatedLabel = this.translate.instant('cv.footer.generated', {
      date: `${dd}/${MM}/${yyyy}`,
    });

    const addPageFooter = (): void => {
      pdf.setFontSize(6.5);
      pdf.setTextColor(160, 160, 160);
      pdf.text('gabrielecabrini.it/cv', 5, pageH - 4);
      pdf.text(generatedLabel, pageW - 5, pageH - 4, { align: 'right' });
    };

    // ~10mm top padding added to continuation pages to avoid content flush against the edge
    const topPaddingPx = Math.round(10 * canvas.width / pageW);
    const offscreen = this.document.createElement('canvas');
    offscreen.width = canvas.width;
    const ctx = offscreen.getContext('2d')!;

    // If the final page would hold less than this, backtrack to move more blocks there.
    const MIN_LAST_PAGE_PX = Math.round(pageHeightPx * 0.20);

    let sliceStart = 0;
    let pageIndex = 0;

    while (sliceStart < canvas.height) {
      const usableHeightPx = pageIndex === 0 ? pageHeightPx : pageHeightPx - topPaddingPx;
      const idealEnd = sliceStart + usableHeightPx;

      let cutPoint: number;
      if (idealEnd >= canvas.height) {
        cutPoint = canvas.height;
      } else {
        const candidates = sortedBreaks.filter(b => b > sliceStart && b <= idealEnd);
        cutPoint = candidates.at(-1) ?? idealEnd;

        // Look-ahead: if cutting here would leave the final page under-filled
        // (next iteration would be the last AND have too little content), retreat
        // to an earlier break so more blocks flow to the last page.
        const remaining = canvas.height - cutPoint;
        const nextCapacity = pageHeightPx - topPaddingPx;
        if (remaining > 0 && remaining <= nextCapacity && remaining < MIN_LAST_PAGE_PX) {
          for (let i = candidates.length - 2; i >= 0; i--) {
            if (canvas.height - candidates[i] >= MIN_LAST_PAGE_PX) {
              cutPoint = candidates[i];
              break;
            }
          }
        }
      }

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
