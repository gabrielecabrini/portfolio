# Portfolio

My personal site, built with [Astro](https://astro.build) and live at
[www.gabrielecabrini.it](https://www.gabrielecabrini.it).

Content lives in `src/data/` (see [`src/data/README.md`](src/data/README.md)),
translations in `src/i18n/`.

## Development

```
npm ci
npx playwright install chromium   # once, for the CV PDFs
npm run dev
```

Before pushing: `npm run lint`, `npm test`, `npm run pretty`.

## Release

Bump `version` in `package.json` and push to `master`: CI deploys GitHub Pages,
publishes the Docker image and tags `vX.Y.Z`. Pushes without a bump only run the checks.

```
docker run --rm -p 8080:80 ghcr.io/gabrielecabrini/portfolio:latest
```
