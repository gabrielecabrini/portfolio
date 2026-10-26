import { describe, expect, it } from 'vitest';
import { parseKey, wkdHash } from './pgp';

describe('parseKey', () => {
  it('reads fingerprint, uids and per-key usage and dates from --with-colons output', () => {
    const colons = [
      'pub:u:255:22:CFFA1EF2640C5BF3:1793044742:1856116742::u:::cESC:::::ed25519:::0:',
      'fpr:::::::::50761238F7719F61752B0410CFFA1EF2640C5BF3:',
      'uid:u::::1793044742::53EE::Jane Doe <jane@example.com>::::::::::0:',
      'sub:u:255:18:83A0D4A0A9364488:1793045388:1856117388:::::e:::::cv25519::',
      'fpr:::::::::786438C492ED53C705AD751183A0D4A0A9364488:',
    ].join('\n');
    expect(parseKey(colons)).toEqual({
      fingerprint: '50761238F7719F61752B0410CFFA1EF2640C5BF3',
      uids: ['Jane Doe <jane@example.com>'],
      keys: [
        {
          kind: 'pub',
          algorithm: 'ed25519',
          usage: 'C',
          created: '2026-10-26',
          expires: '2028-10-25',
        },
        {
          kind: 'sub',
          algorithm: 'cv25519',
          usage: 'E',
          created: '2026-10-26',
          expires: '2028-10-25',
        },
      ],
    });
  });
});

describe('wkdHash', () => {
  // Expected values from `gpg --with-wkd-hash`.
  it('matches gpg for the local part, case-insensitively', () => {
    expect(wkdHash('gabriele@gabrielecabrini.it')).toBe('u8w3knh56rybatrg53yuw5kjb7dwhjy8');
    expect(wkdHash('Gabriele@other.example')).toBe('u8w3knh56rybatrg53yuw5kjb7dwhjy8');
  });
});
