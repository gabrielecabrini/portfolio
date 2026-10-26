import type { PgpKey } from '../models/pgp-key.model';

// Mirrors public/pgp.asc, the file /pgp offers for download. After renewing or
// re-exporting the key, update this from `gpg --show-keys public/pgp.asc`;
// pgp.spec.ts fails `yarn test` (and so CI) if the two disagree.
export const PGP_KEY: PgpKey = {
  fingerprint: '50761238F7719F61752B0410CFFA1EF2640C5BF3',
  uids: ['Gabriele Cabrini <gabriele@gabrielecabrini.it>'],
  keys: [
    { kind: 'pub', algorithm: 'ed25519', usage: 'C', created: '2026-10-26', expires: '2028-10-25' },
    { kind: 'sub', algorithm: 'ed25519', usage: 'S', created: '2026-10-26', expires: '2028-10-25' },
    { kind: 'sub', algorithm: 'cv25519', usage: 'E', created: '2026-10-26', expires: '2028-10-25' },
  ],
};
