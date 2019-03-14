import { HEADER_SIZE } from 'internal/arraybuffer';

export class Context {
  b: Uint8Array;
  h: Uint64Array;
  t: Uint64Array;
  c: usize;
  outlen: usize;
}

const HASH_LENGTH: u32 = 8;

function B2B_GET64(arr: Uint8Array, i: u32): u64 {
  return load<u64>(changetype<usize>(arr.buffer) + arr.byteOffset + i, HEADER_SIZE);
}

function B2B_G(a: i32, b: i32, c: i32, d: i32, x: u64, y: u64): void {
  v[a] = unchecked(v[a]) + unchecked(v[b]) + x;
  v[d] = rotr<u64>(unchecked(v[d]) ^ unchecked(v[a]), 32);
  v[c] = unchecked(v[c]) + unchecked(v[d]);
  v[b] = rotr<u64>(unchecked(v[b]) ^ unchecked(v[c]), 24);
  v[a] = unchecked(v[a]) + unchecked(v[b]) + y;
  v[d] = rotr<u64>(unchecked(v[d]) ^ unchecked(v[a]), 16);
  v[c] = unchecked(v[c]) + unchecked(v[d]);
  v[b] = rotr<u64>(unchecked(v[b]) ^ unchecked(v[c]), 63);
}

const BLAKE2B_IV: u64[] = [
  0x6a09e667f3bcc908,
  0xbb67ae8584caa73b,
  0x3c6ef372fe94f82b,
  0xa54ff53a5f1d36f1,
  0x510e527fade682d1,
  0x9b05688c2b3e6c1f,
  0x1f83d9abfb41bd6b,
  0x5be0cd19137e2179,
];

const SIGMA: u8[][] = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
  [14, 10, 4, 8, 9, 15, 13, 6, 1, 12, 0, 2, 11, 7, 5, 3],
  [11, 8, 12, 0, 5, 2, 15, 13, 10, 14, 3, 6, 7, 1, 9, 4],
  [7, 9, 3, 1, 13, 12, 11, 14, 2, 6, 5, 10, 4, 0, 15, 8],
  [9, 0, 5, 7, 2, 4, 10, 15, 14, 1, 11, 12, 6, 8, 3, 13],
  [2, 12, 6, 10, 0, 11, 8, 3, 4, 13, 7, 5, 15, 14, 1, 9],
  [12, 5, 1, 15, 14, 13, 4, 10, 0, 7, 6, 3, 9, 2, 8, 11],
  [13, 11, 7, 14, 12, 1, 3, 9, 5, 0, 15, 4, 8, 6, 2, 10],
  [6, 15, 14, 9, 11, 3, 0, 8, 12, 2, 13, 7, 1, 4, 10, 5],
  [10, 2, 8, 4, 7, 6, 1, 5, 15, 11, 9, 14, 3, 12, 13, 0],
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
  [14, 10, 4, 8, 9, 15, 13, 6, 1, 12, 0, 2, 11, 7, 5, 3],
];

let ctx: Context = {
  b: new Uint8Array(128),
  h: new Uint64Array(8),
  t: new Uint64Array(2), // input count
  c: 0, // pointer within buffer
  outlen: HASH_LENGTH, // output length in bytes
};

// Compression function. 'last' flag indicates last block.
let v = new Uint64Array(16);
let m = new Uint64Array(16);
function blake2bCompress(last: boolean): void {
  let i = 0;

  v[0] = unchecked(ctx.h[0]);
  v[8] = unchecked(BLAKE2B_IV[0]);
  v[1] = unchecked(ctx.h[1]);
  v[9] = unchecked(BLAKE2B_IV[1]);
  v[2] = unchecked(ctx.h[2]);
  v[10] = unchecked(BLAKE2B_IV[2]);
  v[3] = unchecked(ctx.h[3]);
  v[11] = unchecked(BLAKE2B_IV[3]);
  v[4] = unchecked(ctx.h[4]);
  v[12] = unchecked(BLAKE2B_IV[4]);
  v[5] = unchecked(ctx.h[5]);
  v[13] = unchecked(BLAKE2B_IV[5]);
  v[6] = unchecked(ctx.h[6]);
  v[14] = unchecked(BLAKE2B_IV[6]);
  v[7] = unchecked(ctx.h[7]);
  v[15] = unchecked(BLAKE2B_IV[7]);

  v[12] = unchecked(v[12]) ^ unchecked(ctx.t[0]); // low 64 bits of offset
  v[13] = unchecked(v[13]) ^ unchecked(ctx.t[1]); // high 64 bits

  // last block flag set ?
  if (last) {
    v[14] = unchecked(~v[14]);
  }

  // get little-endian words
  for (i = 0; i < 16; i++) {
    m[i] = B2B_GET64(ctx.b, 8 * i);
  }

  // twelve rounds of mixing
  for (i = 0; i < 12; i++) {
    B2B_G(0, 4, 8, 12, unchecked(m[SIGMA[i][0]]), unchecked(m[SIGMA[i][1]]));
    B2B_G(1, 5, 9, 13, unchecked(m[SIGMA[i][2]]), unchecked(m[SIGMA[i][3]]));
    B2B_G(2, 6, 10, 14, unchecked(m[SIGMA[i][4]]), unchecked(m[SIGMA[i][5]]));
    B2B_G(3, 7, 11, 15, unchecked(m[SIGMA[i][6]]), unchecked(m[SIGMA[i][7]]));
    B2B_G(0, 5, 10, 15, unchecked(m[SIGMA[i][8]]), unchecked(m[SIGMA[i][9]]));
    B2B_G(1, 6, 11, 12, unchecked(m[SIGMA[i][10]]), unchecked(m[SIGMA[i][11]]));
    B2B_G(2, 7, 8, 13, unchecked(m[SIGMA[i][12]]), unchecked(m[SIGMA[i][13]]));
    B2B_G(3, 4, 9, 14, unchecked(m[SIGMA[i][14]]), unchecked(m[SIGMA[i][15]]));
  }

  ctx.h[0] = unchecked(ctx.h[0]) ^ unchecked(v[0]) ^ unchecked(v[8]);
  ctx.h[1] = unchecked(ctx.h[1]) ^ unchecked(v[1]) ^ unchecked(v[9]);
  ctx.h[2] = unchecked(ctx.h[2]) ^ unchecked(v[2]) ^ unchecked(v[10]);
  ctx.h[3] = unchecked(ctx.h[3]) ^ unchecked(v[3]) ^ unchecked(v[11]);
  ctx.h[4] = unchecked(ctx.h[4]) ^ unchecked(v[4]) ^ unchecked(v[12]);
  ctx.h[5] = unchecked(ctx.h[5]) ^ unchecked(v[5]) ^ unchecked(v[13]);
  ctx.h[6] = unchecked(ctx.h[6]) ^ unchecked(v[6]) ^ unchecked(v[14]);
  ctx.h[7] = unchecked(ctx.h[7]) ^ unchecked(v[7]) ^ unchecked(v[15]);
}

export function blake2bInit(): void {
  // initialize hash state
  ctx.h[0] = unchecked(BLAKE2B_IV[0]);
  ctx.h[1] = unchecked(BLAKE2B_IV[1]);
  ctx.h[2] = unchecked(BLAKE2B_IV[2]);
  ctx.h[3] = unchecked(BLAKE2B_IV[3]);
  ctx.h[4] = unchecked(BLAKE2B_IV[4]);
  ctx.h[5] = unchecked(BLAKE2B_IV[5]);
  ctx.h[6] = unchecked(BLAKE2B_IV[6]);
  ctx.h[7] = unchecked(BLAKE2B_IV[7]);

  ctx.h[0] ^= 0x01010000 ^ (0 << 8) ^ ctx.outlen;

  ctx.t[0] = 0;
  ctx.t[1] = 0;
  ctx.c = 0;

  ctx.b.fill(0);
}

export function blake2bUpdate(input: Uint8Array): void {
  for (let i = 0, len = input.length; i < len; i++) {
    if (ctx.c === 128) {
      // buffer full ?
      ctx.t[0] += ctx.c; // add counters
      if (ctx.t[0] < ctx.c) {
        // carry overflow ?
        ctx.t[1]++; // high word
      }
      blake2bCompress(false); // compress (not last)
      ctx.c = 0; // counter to zero
    }
    ctx.b[ctx.c++] = unchecked(input[i]);
  }
}

let output = new Uint8Array(HASH_LENGTH);
export function blake2bFinal(): Uint8Array {
  ctx.t[0] += ctx.c; // mark last block offset
  if (ctx.t[0] < ctx.c) {
    // carry overflow
    ctx.t[1]++; // high word
  }

  while (ctx.c < 128) {
    // fill up with zeros
    ctx.b[ctx.c++] = 0;
  }
  blake2bCompress(true); // final block flag = 1

  // little endian convert and store
  for (let i: u64 = 0, len = ctx.outlen; i < len; i++) {
    output[<i32>i] = (<u32>(unchecked(ctx.h[(<i32>i) >> 3]) >> (8 * (i & 7)))) & 0xff;
  }
  return output;
}

export function blake2b(data: Uint8Array): Uint8Array {
  blake2bInit();
  blake2bUpdate(data);
  return blake2bFinal();
}
