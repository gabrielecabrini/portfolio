import { execFileSync } from 'node:child_process';
import { parseKey } from '../lib/pgp';
import type { PgpKey } from '../models/pgp-key.model';

// public/gabrielecabrini.asc is the single source: /pgp is derived from it at
// build time, so renewing the key is just re-exporting it there. Parsed with the real
// gpg (no OpenPGP dependency); without gpg the build fails rather than ship no key.
const ASC = 'public/gabrielecabrini.asc';

export const PGP_KEY: PgpKey = parseKey(
  execFileSync('gpg', ['--show-keys', '--with-colons', ASC], {
    stdio: ['ignore', 'pipe', 'inherit'],
    encoding: 'utf8',
  }),
);
