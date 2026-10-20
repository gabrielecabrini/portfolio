// Prints /cv and /en/cv to static PDFs after `astro build`, using the page's own
// @media print styles, so the download always matches what the page shows.
import { preview } from 'astro';
import { chromium } from 'playwright';

const server = await preview({ logLevel: 'warn' });
const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  for (const [path, lang] of [
    ['/cv', 'IT'],
    ['/en/cv', 'EN'],
  ]) {
    await page.goto(`http://localhost:${server.port}${path}`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    const generated = await page.locator('.cv-page').getAttribute('data-pdf-footer');
    await page.pdf({
      path: `dist/CV-GabrieleCabrini-${lang}.pdf`,
      preferCSSPageSize: true,
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: '<span></span>',
      footerTemplate: `<div style="width: 100%; padding: 0 5mm; display: flex; justify-content: space-between; font-size: 6.5pt; color: #a0a0a0"><span>gabrielecabrini.it/cv</span><span>${generated}</span></div>`,
    });
    console.log(`dist/CV-GabrieleCabrini-${lang}.pdf`);
  }
} finally {
  await browser.close();
  await server.stop();
}
