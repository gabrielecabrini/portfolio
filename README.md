# Portfolio

My personal site, built with [Astro](https://astro.build) and live at
[www.gabrielecabrini.it](https://www.gabrielecabrini.it).

Content lives in `src/data/` (see [`src/data/README.md`](src/data/README.md)),
translations in `src/i18n/`.

## Development

```
yarn install
yarn playwright install chromium  # once, for the CV PDFs
yarn dev
```

Before pushing: `yarn lint`, `yarn test`, `yarn pretty`.

## PGP key

`public/pgp.asc` is the only source: the build reads it with `gpg` (so `gpg` must be
installed) to render `/pgp`.
[Web Key Directory](https://wiki.gnupg.org/WKD) lookup (`gpg --locate-keys`) uses the
advanced method, served from `openpgpkey.gabrielecabrini.it`, not by this site.
To renew or replace the key, re-export it and release:

```
gpg --armor --export-options export-minimal --export <fingerprint> > public/pgp.asc
```

## Release

Every push to `master` is built by CI and deployed to Cloudflare with `wrangler deploy` (`wrangler.jsonc`).

```
docker build -t portfolio . && docker run --rm -p 8080:80 portfolio
```
