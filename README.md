# Portfolio

Personal portfolio built with [Astro](https://astro.build), deployed at
[www.gabrielecabrini.it](https://www.gabrielecabrini.it) on GitHub Pages.

## Architecture

Fully static site: `astro build` renders every page to plain HTML, and there is no
server running in production. The only client-side JavaScript is the dark/light
theme toggle.

Everything is data-driven. Page content lives in typed arrays under `src/data/`,
shaped by the models in `src/models/`; pages mostly just render that data. To change
what a page says, start in `src/data/` — see **`src/data/README.md`** for the content
model and the `...Key` → i18n-JSON convention that most fields use.

- **Languages**: Italian at the root (`/about/`), English under `/en/` (`/en/about/`).
  Each page in `src/pages/[...lang]/` is built once per language; `t(lang, key)` in
  `src/i18n/` resolves text from `it.json` / `en.json` at build time.
- **`<head>`**: title, description, canonical and hreflang come from the props of
  `src/layouts/Base.astro`; `@astrojs/sitemap` writes `sitemap-index.xml`.
- **CV PDF**: after `astro build`, `scripts/cv-pdf.mjs` prints `/cv` and `/en/cv` with
  Playwright's Chromium (using the page's `@media print` styles) to
  `dist/CV-GabrieleCabrini-{IT,EN}.pdf`, which the CV page links to.

## Development

```
npm run dev     # dev server
npm run build   # type check + static build + CV PDFs
npm test        # unit tests (vitest)
npm run lint    # eslint (TS and .astro)
npm run pretty  # format everything in place (run before committing)
```

`npm run pretty:check` is the read-only variant. After a fresh `npm ci`, download
the browser the build uses once with `npx playwright install chromium`.

`.github/workflows/deploy.yml` runs lint, tests and a build on every push and pull
request; the Pages deploy (`gh-pages` → `gh-pages` branch) and the image push only
run outside pull requests, and only if that passes.

## Docker

The built site is also published as a container image, at
[ghcr.io/gabrielecabrini/portfolio](https://github.com/gabrielecabrini/portfolio/pkgs/container/portfolio):

```
docker run --rm -p 8080:80 ghcr.io/gabrielecabrini/portfolio:latest
```

Since the image serves exactly what GitHub Pages serves, it exists for
self-hosting, not because production depends on it.

## Three checks, three jobs

They don't overlap, which is why all three are worth running:

- **Prettier** owns formatting, and nothing else.
- **`astro check`** owns types, for `.ts` and `.astro` files alike, with Astro's
  `strictest` tsconfig preset.
- **ESLint** owns what neither of the above can see: type-aware rules such as
  `no-floating-promises`, and Astro template rules. It enables no formatting rules,
  so it never fights Prettier.

## Tests

The suite is deliberately small and targets rules that are otherwise enforced only
by remembering them:

- `src/data/content-i18n.spec.ts` — every `...Key` in `src/data/` and every literal
  key passed to `t(lang, '…')` in the `.astro` templates resolves in **both**
  translation files, and the two files declare the same keys. A missing translation
  doesn't fail the build; it renders the raw key on the page.
- `src/lib/format.spec.ts` — month is 1-based in the data and 0-based in `Date`, so
  the January/December boundaries are covered, along with "Presente"/"Present".
- `src/lib/cv.spec.ts` — /cv sorts work entries while /experience shows them in
  declaration order. Asserts the ordering rule and that the source array is not
  sorted in place.
- `src/i18n/index.spec.ts` — key lookup, `{{param}}` interpolation, and the
  `/en` path mapping used by links, canonical and hreflang.
