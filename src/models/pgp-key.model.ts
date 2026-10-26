export interface PgpKey {
  fingerprint: string; // primary key, 40 hex chars, no spaces
  uids: string[]; // "Name <email>", as gpg prints them
  // One entry per line of `gpg --show-keys`: the primary key, then its subkeys.
  keys: {
    kind: 'pub' | 'sub';
    algorithm: string; // "ed25519", "cv25519"
    usage: string; // gpg capability letters: C certify, S sign, E encrypt
    created: string; // "YYYY-MM-DD"
    expires: string; // "YYYY-MM-DD"
  }[];
}
