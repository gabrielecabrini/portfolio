# Portfolio

Personal portfolio developed with Angular 21, deployed at [www.gabrielecabrini.it](https://www.gabrielecabrini.it) via `ng deploy` (angular-cli-ghpages).

## Architecture

Fully static site: `outputMode: "static"` in `angular.json` prerenders every route at
build time (`src/app/app.routes.server.ts`), and there is no server running in
production — `ng deploy` just publishes the generated HTML/JS/CSS.

Everything is data-driven. Page content lives in typed arrays under
`src/app/core/data/`, shaped by the models in `src/app/core/models/`; components
mostly just bind that data to a template. To change what a page says, start in
`core/data/` — see **`src/app/core/data/README.md`** for the content model and the
`...Key` → i18n-JSON convention that most fields use.

The blog is the one exception with a secondary content source (Markdown files, not
just data arrays) — see **`src/app/features/blog/README.md`**.

Components are `standalone` + `OnPush` + signal-based throughout; state that needs to
survive SSR/hydration (language, theme) lives in root services under
`core/services/` and guards browser-only APIs with `isPlatformBrowser`.

## Stack

- Angular 21 (standalone components, signals, SSR + static prerendering)
- `@ngx-translate` for i18n (it/en), translations in `public/assets/i18n/`
- `marked` + `highlight.js` for blog Markdown rendering
- `html2canvas` + `jspdf` for the CV's client-side PDF export

## Development

```
npm start      # dev server
npm run build  # production build (prerendered)
npm test       # unit tests (vitest)
```
