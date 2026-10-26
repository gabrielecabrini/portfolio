import { createHash } from 'node:crypto';
import type { PgpKey } from '../models/pgp-key.model';

const day = (epoch: string) => new Date(+epoch * 1000).toISOString().slice(0, 10);

/** Reads `gpg --show-keys --with-colons` output into the shape /pgp prints. */
export function parseKey(colons: string): PgpKey {
  const rows = colons.split('\n').map((line) => line.split(':'));
  return {
    fingerprint: rows.find((r) => r[0] === 'fpr')![9]!,
    uids: rows.filter((r) => r[0] === 'uid').map((r) => r[9]!),
    keys: rows
      .filter((r) => r[0] === 'pub' || r[0] === 'sub')
      .map((r) => ({
        kind: r[0] as 'pub' | 'sub',
        algorithm: r[16]!,
        // Uppercase letters are the whole key's capabilities, lowercase this key's.
        usage: r[11]!.replace(/[A-Z]/g, '').toUpperCase(),
        created: day(r[5]!),
        expires: day(r[6]!),
      })),
  };
}

/** WKD file name for an address: z-base-32 of the SHA-1 of its lowercased local part. */
export function wkdHash(email: string): string {
  const alphabet = 'ybndrfg8ejkmcpqxot1uwisza345h769';
  const local = email.slice(0, email.lastIndexOf('@')).toLowerCase();
  const bits = [...createHash('sha1').update(local).digest()]
    .map((b) => b.toString(2).padStart(8, '0'))
    .join('');
  return bits.replace(/.{5}/g, (chunk) => alphabet[parseInt(chunk, 2)]!);
}
