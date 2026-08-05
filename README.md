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
```

Tests run in a real browser rather than a simulated DOM (`browsers: ["chromium"]`
on the `test` target). After a fresh `npm ci`, download the browser binary once
with `npx playwright install chromium`.

## Type checking

The build is configured to be as strict as the toolchain allows — `strictTemplates`
plus `strictStandalone` and `typeCheckHostBindings` on the Angular side,
`noUncheckedIndexedAccess` and `exactOptionalPropertyTypes` on the TypeScript side,
and every Angular extended diagnostic promoted to an error
(`extendedDiagnostics.defaultCategory`). `skipLibCheck` stays on deliberately: the
alternative is type-checking the `.d.ts` files of `jspdf`/`html2canvas`, whose
errors can't be fixed here.
