# Portfolio

Personal portfolio developed with Angular 22, deployed at [www.gabrielecabrini.it](https://www.gabrielecabrini.it) via `ng deploy` (angular-cli-ghpages).

## Architecture

Fully static site: `outputMode: "static"` in `angular.json` prerenders every route at
build time (`src/app/app.routes.server.ts`), and there is no server running in
production — `ng deploy` just publishes the generated HTML/JS/CSS.

Everything is data-driven. Page content lives in typed arrays under
`src/app/core/data/`, shaped by the models in `src/app/core/models/`; components
mostly just bind that data to a template. To change what a page says, start in
`core/data/` — see **`src/app/core/data/README.md`** for the content model and the
`...Key` → i18n-JSON convention that most fields use.

Components are standalone + `OnPush` + signal-based throughout. State that must
survive SSR/hydration (language, theme) lives in root services under
`core/services/`. Browser-only work runs inside `afterNextRender`, which never
executes during prerendering; `isPlatformBrowser` is only used where a value is
needed synchronously during construction.

Per-page `<head>` tags go through `core/services/page-seo.ts`, which re-applies
them on every language switch. Tags that don't vary per route (`og:type`,
`og:image`, `twitter:card`) are static in `src/index.html`.

## Stack

- Angular 22 (standalone components, signals, zoneless, SSR + static prerendering)
- `@ngx-translate` for i18n (it/en), translations bundled from `public/assets/i18n/`
- `html2canvas` + `jspdf` for the CV's client-side PDF export

## Development

```
npm start      # dev server
npm run build  # production build (prerendered)
npm test       # unit tests (vitest, real Chromium)
npm run lint   # eslint + angular-eslint (TS and templates)
npm run pretty # format everything in place (run before committing)
```

`npm run pretty:check` is the read-only variant. Both skip whatever `.gitignore`
lists, which Prettier reads by default.

Tests run in a real browser rather than a simulated DOM (`browsers: ["chromium"]`
on the `test` target). After a fresh `npm ci`, download the browser binary once
with `npx playwright install chromium`.

`.github/workflows/deploy.yml` runs lint, tests and a build on every push and pull
request; the Pages deploy and the image push only run outside pull requests, and
only if that passes.

## Docker

The prerendered site is also published as a container image, at
[ghcr.io/gabrielecabrini/portfolio](https://github.com/gabrielecabrini/portfolio/pkgs/container/portfolio):

```
docker run --rm -p 8080:80 ghcr.io/gabrielecabrini/portfolio:latest
```

Since the image serves exactly what GitHub Pages serves, it exists for
self-hosting, not because production depends on it.

## Three checks, three jobs

They don't overlap, which is why all three are worth running:

- **Prettier** owns formatting, and nothing else.
- **The TypeScript/Angular compiler** owns types. It's configured as strictly as the
  toolchain allows: `strictTemplates` plus `strictStandalone` and
  `typeCheckHostBindings` on the Angular side, `noUncheckedIndexedAccess` and
  `exactOptionalPropertyTypes` on the TypeScript side, and every Angular extended
  diagnostic promoted to an error (`extendedDiagnostics.defaultCategory`).
  `skipLibCheck` stays on deliberately: the alternative is type-checking the `.d.ts`
  files of `jspdf`/`html2canvas`, whose errors can't be fixed here.
- **ESLint** owns what neither of the above can see: type-aware rules such as
  `no-floating-promises`, and linting of Angular templates (accessibility and
  best practice). It enables no formatting rules, so it never fights Prettier.

## Tests

The suite is deliberately small and targets rules that are otherwise enforced only
by remembering them:

- `core/data/content-i18n.spec.ts` — every `...Key` in `core/data/` and every route
  title resolves in **both** translation files, and the two files declare the same
  keys. A missing translation doesn't crash; it renders the raw key on the page.
- `core/pipes/date-format.pipe.spec.ts` — month is 1-based in the data and 0-based
  in `Date`, so the January/December boundaries are covered, along with the
  "Presente"/"Present" fallback for an ongoing role.
- `features/cv/cv.spec.ts` — /cv sorts work entries while /experience shows them in
  declaration order. Asserts the ordering rule and that the source array is not
  sorted in place.
