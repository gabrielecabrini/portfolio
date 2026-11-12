import { preview } from 'astro';
import { chromium, type Browser, type Page } from 'playwright';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';

// Drives the built site in Chromium, like scripts/cv-pdf.mjs: run `yarn build` first.
let server: Awaited<ReturnType<typeof preview>>;
let browser: Browser;
let page: Page;

beforeAll(async () => {
  server = await preview({ logLevel: 'warn' });
  browser = await chromium.launch();
});

afterAll(async () => {
  await browser?.close();
  await server?.stop();
});

beforeEach(async () => {
  // Fresh context per test: empty localStorage, OS theme pinned to light.
  page = await browser.newPage({
    colorScheme: 'light',
    baseURL: `http://localhost:${server.port}`,
  });
});

afterEach(() => page.close());

const theme = () => page.evaluate(() => document.documentElement.dataset['theme']);
const saved = () => page.evaluate(() => localStorage.getItem('theme'));

describe('theme toggle', () => {
  it('follows the OS until clicked, then remembers the choice across reloads', async () => {
    await page.goto('/');
    expect(await theme()).toBe('light');
    expect(await saved()).toBeNull();

    await page.click('.theme-toggle');
    expect(await theme()).toBe('dark');
    expect(await saved()).toBe('dark');

    await page.reload();
    expect(await theme()).toBe('dark');
  });

  it('drops the saved choice when switching back to the OS theme', async () => {
    await page.goto('/');
    await page.click('.theme-toggle');
    await page.click('.theme-toggle');
    expect(await theme()).toBe('light');
    expect(await saved()).toBeNull();
  });
});

describe('404 page', () => {
  it('echoes the path with one caret per character', async () => {
    const res = await page.goto('/nope-xyz');
    expect(res?.status()).toBe(404);
    expect(await page.textContent('#nf-path')).toBe('/nope-xyz');
    expect(await page.textContent('#nf-carets')).toBe('^'.repeat('/nope-xyz'.length));
  });

  it('cuts a long path to 32 characters', async () => {
    const path = `/${'a'.repeat(40)}`;
    await page.goto(path);
    expect(await page.textContent('#nf-path')).toBe(`${path.slice(0, 31)}…`);
    expect(await page.textContent('#nf-carets')).toBe('^'.repeat(32));
  });
});
