import type { APIRoute, GetStaticPaths } from 'astro';
import { wkdHash } from '../../../../lib/pgp';
import { PGP_BINARY, PGP_KEY } from '../../../../data/pgp';

// Web Key Directory (direct method): mail clients fetch the key for an address here.
export const getStaticPaths = (() =>
  PGP_KEY.uids.map((uid) => ({
    params: { hash: wkdHash(uid.match(/<(.+)>/)![1]!) },
  }))) satisfies GetStaticPaths;

// Copied into a plain Uint8Array: BodyInit rejects Buffer<ArrayBufferLike> under strict types.
export const GET: APIRoute = () => new Response(new Uint8Array(PGP_BINARY));
