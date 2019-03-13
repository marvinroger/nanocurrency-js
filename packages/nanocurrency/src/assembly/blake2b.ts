import { HEADER_SIZE } from 'internal/arraybuffer'

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
  v[a] = v[a] + v[b] + x;
  v[d] = rotr<u64>(v[d] ^ v[a], 32);
  v[c] = v[c] + v[d];
  v[b] = rotr<u64>(v[b] ^ v[c], 24);
  v[a] = v[a] + v[b] + y;
  v[d] = rotr<u64>(v[d] ^ v[a], 16);
  v[c] = v[c] + v[d];
  v[b] = rotr<u64>(v[b] ^ v[c], 63);
}

let BLAKE2B_IV_DATA: u64[] = [
  0x6a09e667f3bcc908,
  0xbb67ae8584caa73b,
  0x3c6ef372fe94f82b,
  0xa54ff53a5f1d36f1,
  0x510e527fade682d1,
  0x9b05688c2b3e6c1f,
  0x1f83d9abfb41bd6b,
  0x5be0cd19137e2179,
];

let BLAKE2B_IV = new Uint64Array(BLAKE2B_IV_DATA.length);
for (let i = 0; i < BLAKE2B_IV.length; i++) {
  BLAKE2B_IV[i] = BLAKE2B_IV_DATA[i];
}

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

  // init work variables
  for (i = 0; i < 8; i++) {
    v[i] = ctx.h[i];
    v[i + 8] = BLAKE2B_IV[i];
  }

  v[12] = v[12] ^ ctx.t[0]; // low 64 bits of offset
  v[13] = v[13] ^ ctx.t[1]; // high 64 bits

  // last block flag set ?
  if (last) {
    v[14] = ~v[14];
  }

  // get little-endian words
  for (i = 0; i < 16; i++) {
    m[i] = B2B_GET64(ctx.b, 8 * i);
  }

  // twelve rounds of mixing
  for (i = 0; i < 12; i++) {
    B2B_G(0, 4, 8, 12, m[SIGMA[i][0]], m[SIGMA[i][1]]);
    B2B_G(1, 5, 9, 13, m[SIGMA[i][2]], m[SIGMA[i][3]]);
    B2B_G(2, 6, 10, 14, m[SIGMA[i][4]], m[SIGMA[i][5]]);
    B2B_G(3, 7, 11, 15, m[SIGMA[i][6]], m[SIGMA[i][7]]);
    B2B_G(0, 5, 10, 15, m[SIGMA[i][8]], m[SIGMA[i][9]]);
    B2B_G(1, 6, 11, 12, m[SIGMA[i][10]], m[SIGMA[i][11]]);
    B2B_G(2, 7, 8, 13, m[SIGMA[i][12]], m[SIGMA[i][13]]);
    B2B_G(3, 4, 9, 14, m[SIGMA[i][14]], m[SIGMA[i][15]]);
  }

  for (i = 0; i < 8; ++i) {
    ctx.h[i] = ctx.h[i] ^ v[i] ^ v[i + 8];
  }
}

export function blake2bInit(): void {
  // initialize hash state
  for (let i = 0; i < 8; i++) {
    ctx.h[i] = BLAKE2B_IV[i];
  }

  ctx.h[0] ^= 0x01010000 ^ (0 << 8) ^ ctx.outlen;

  ctx.t[0] = 0;
  ctx.t[1] = 0;
  ctx.c = 0;

  for (let i = 0; i < 128; i++) {
    ctx.b[i] = 0;
  }
}

export function blake2bUpdate(input: Uint8Array): void {
  for (let i = 0; i < input.length; i++) {
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
    ctx.b[ctx.c++] = input[i];
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
  for (let i: u64 = 0; i < ctx.outlen; i++) {
    output[<i32>i] = (<u32>(ctx.h[(<i32>i) >> 3] >> (8 * (i & 7)))) & 0xff;
  }
  return output;
}

export function blake2b(data: Uint8Array): Uint8Array {
  blake2bInit();
  blake2bUpdate(data);
  return blake2bFinal();
}
