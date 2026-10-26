import { execFileSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';
import { PGP_KEY } from './pgp';

/**
 * /pgp prints PGP_KEY but serves public/pgp.asc: a fingerprint mistyped in the data,
 * or a key re-exported without updating it, would publish a fingerprint that doesn't
 * match the downloadable key. Parsed with the real gpg, so no OpenPGP dependency.
 */
function showKeys(): string | null {
  try {
    const args = ['--show-keys', '--with-colons', 'public/pgp.asc'];
    return execFileSync('gpg', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
  } catch {
    return null;
  }
}

const output = showKeys();
const day = (epoch: string) => new Date(+epoch * 1000).toISOString().slice(0, 10);

describe.skipIf(output === null)('PGP_KEY matches public/pgp.asc', () => {
  const rows = output!.split('\n').map((line) => line.split(':'));

  it('has the same primary fingerprint', () => {
    expect(rows.find((r) => r[0] === 'fpr')?.[9]).toBe(PGP_KEY.fingerprint);
  });

  it('has the same user IDs', () => {
    expect(rows.filter((r) => r[0] === 'uid').map((r) => r[9])).toEqual(PGP_KEY.uids);
  });

  it('has the same keys, algorithms, usages and dates', () => {
    const keys = rows
      .filter((r) => r[0] === 'pub' || r[0] === 'sub')
      .map((r) => ({
        kind: r[0],
        algorithm: r[16],
        usage: r[11]!.replace(/[A-Z]/g, '').toUpperCase(),
        created: day(r[5]!),
        expires: day(r[6]!),
      }));
    expect(keys).toEqual(PGP_KEY.keys);
  });
});
