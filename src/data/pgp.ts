import { execFileSync } from 'node:child_process';
import { parseKey } from '../lib/pgp';
import type { PgpKey } from '../models/pgp-key.model';

// public/pgp.asc is the single source: /pgp is derived from it at
// build time, so renewing the key is just re-exporting it there. Parsed with the real
// gpg (no OpenPGP dependency); without gpg the build fails rather than ship no key.
const ASC = 'public/pgp.asc';

const gpg = (args: string[]) => execFileSync('gpg', args, { stdio: ['ignore', 'pipe', 'inherit'] });

export const PGP_KEY: PgpKey = parseKey(
  gpg(['--show-keys', '--with-colons', ASC]).toString('utf8'),
);
