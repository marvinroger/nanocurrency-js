/*!
 * nanocurrency-js: A toolkit for the Nano cryptocurrency.
 * Copyright (c) 2018 Marvin ROGER <dev at marvinroger dot fr>
 * Licensed under GPL-3.0 (https://git.io/vAZsK)
 */
import blake from 'blakejs'

let gf = function (init) {
  const r = new Float64Array(16)
  if (init) for (let i = 0; i < init.length; i++) r[i] = init[i]
  return r
}

let _9 = new Uint8Array(32)
_9[0] = 9

const gf0 = gf()
const gf1 = gf([1])
const D = gf([
  0x78a3,
  0x1359,
  0x4dca,
  0x75eb,
  0xd8ab,
  0x4141,
  0x0a4d,
  0x0070,
  0xe898,
  0x7779,
  0x4079,
  0x8cc7,
  0xfe73,
  0x2b6f,
  0x6cee,
  0x5203
])
const D2 = gf([
  0xf159,
  0x26b2,
  0x9b94,
  0xebd6,
  0xb156,
  0x8283,
  0x149a,
  0x00e0,
  0xd130,
  0xeef3,
  0x80f2,
  0x198e,
  0xfce7,
  0x56df,
  0xd9dc,
  0x2406
])
const X = gf([
  0xd51a,
  0x8f25,
  0x2d60,
  0xc956,
  0xa7b2,
  0x9525,
  0xc760,
  0x692c,
  0xdc5c,
  0xfdd6,
  0xe231,
  0xc0a4,
  0x53fe,
  0xcd6e,
  0x36d3,
  0x2169
])
const Y = gf([
  0x6658,
  0x6666,
  0x6666,
  0x6666,
  0x6666,
  0x6666,
  0x6666,
  0x6666,
  0x6666,
  0x6666,
  0x6666,
  0x6666,
  0x6666,
  0x6666,
  0x6666,
  0x6666
])
const I = gf([
  0xa0b0,
  0x4a0e,
  0x1b27,
  0xc4ee,
  0xe478,
  0xad2f,
  0x1806,
  0x2f43,
  0xd7a7,
  0x3dfb,
  0x0099,
  0x2b4d,
  0xdf0b,
  0x4fc1,
  0x2480,
  0x2b83
])

function vn (x, xi, y, yi, n) {
  let d = 0
  for (let i = 0; i < n; i++) d |= x[xi + i] ^ y[yi + i]
  return (1 & ((d - 1) >>> 8)) - 1
}

function cryptoVerify32 (x, xi, y, yi) {
  return vn(x, xi, y, yi, 32)
}
// "expand 32-byte k"

/*
* Port of Andrew Moon's Poly1305-donna-16. Public domain.
* https://github.com/floodyberry/poly1305-donna
*/

let Poly1305 = function (key) {
  this.buffer = new Uint8Array(16)
  this.r = new Uint16Array(10)
  this.h = new Uint16Array(10)
  this.pad = new Uint16Array(8)
  this.leftover = 0
  this.fin = 0

  let t0, t1, t2, t3, t4, t5, t6, t7

  t0 = (key[0] & 0xff) | ((key[1] & 0xff) << 8)
  this.r[0] = t0 & 0x1fff
  t1 = (key[2] & 0xff) | ((key[3] & 0xff) << 8)
  this.r[1] = ((t0 >>> 13) | (t1 << 3)) & 0x1fff
  t2 = (key[4] & 0xff) | ((key[5] & 0xff) << 8)
  this.r[2] = ((t1 >>> 10) | (t2 << 6)) & 0x1f03
  t3 = (key[6] & 0xff) | ((key[7] & 0xff) << 8)
  this.r[3] = ((t2 >>> 7) | (t3 << 9)) & 0x1fff
  t4 = (key[8] & 0xff) | ((key[9] & 0xff) << 8)
  this.r[4] = ((t3 >>> 4) | (t4 << 12)) & 0x00ff
  this.r[5] = (t4 >>> 1) & 0x1ffe
  t5 = (key[10] & 0xff) | ((key[11] & 0xff) << 8)
  this.r[6] = ((t4 >>> 14) | (t5 << 2)) & 0x1fff
  t6 = (key[12] & 0xff) | ((key[13] & 0xff) << 8)
  this.r[7] = ((t5 >>> 11) | (t6 << 5)) & 0x1f81
  t7 = (key[14] & 0xff) | ((key[15] & 0xff) << 8)
  this.r[8] = ((t6 >>> 8) | (t7 << 8)) & 0x1fff
  this.r[9] = (t7 >>> 5) & 0x007f

  this.pad[0] = (key[16] & 0xff) | ((key[17] & 0xff) << 8)
  this.pad[1] = (key[18] & 0xff) | ((key[19] & 0xff) << 8)
  this.pad[2] = (key[20] & 0xff) | ((key[21] & 0xff) << 8)
  this.pad[3] = (key[22] & 0xff) | ((key[23] & 0xff) << 8)
  this.pad[4] = (key[24] & 0xff) | ((key[25] & 0xff) << 8)
  this.pad[5] = (key[26] & 0xff) | ((key[27] & 0xff) << 8)
  this.pad[6] = (key[28] & 0xff) | ((key[29] & 0xff) << 8)
  this.pad[7] = (key[30] & 0xff) | ((key[31] & 0xff) << 8)
}

Poly1305.prototype.blocks = function (m, mpos, bytes) {
  let hibit = this.fin ? 0 : 1 << 11
  let t0, t1, t2, t3, t4, t5, t6, t7, c
  let d0, d1, d2, d3, d4, d5, d6, d7, d8, d9

  let h0 = this.h[0]
  let h1 = this.h[1]
  let h2 = this.h[2]
  let h3 = this.h[3]
  let h4 = this.h[4]
  let h5 = this.h[5]
  let h6 = this.h[6]
  let h7 = this.h[7]
  let h8 = this.h[8]
  let h9 = this.h[9]

  const r0 = this.r[0]
  const r1 = this.r[1]
  const r2 = this.r[2]
  const r3 = this.r[3]
  const r4 = this.r[4]
  const r5 = this.r[5]
  const r6 = this.r[6]
  const r7 = this.r[7]
  const r8 = this.r[8]
  const r9 = this.r[9]

  while (bytes >= 16) {
    t0 = (m[mpos + 0] & 0xff) | ((m[mpos + 1] & 0xff) << 8)
    h0 += t0 & 0x1fff
    t1 = (m[mpos + 2] & 0xff) | ((m[mpos + 3] & 0xff) << 8)
    h1 += ((t0 >>> 13) | (t1 << 3)) & 0x1fff
    t2 = (m[mpos + 4] & 0xff) | ((m[mpos + 5] & 0xff) << 8)
    h2 += ((t1 >>> 10) | (t2 << 6)) & 0x1fff
    t3 = (m[mpos + 6] & 0xff) | ((m[mpos + 7] & 0xff) << 8)
    h3 += ((t2 >>> 7) | (t3 << 9)) & 0x1fff
    t4 = (m[mpos + 8] & 0xff) | ((m[mpos + 9] & 0xff) << 8)
    h4 += ((t3 >>> 4) | (t4 << 12)) & 0x1fff
    h5 += (t4 >>> 1) & 0x1fff
    t5 = (m[mpos + 10] & 0xff) | ((m[mpos + 11] & 0xff) << 8)
    h6 += ((t4 >>> 14) | (t5 << 2)) & 0x1fff
    t6 = (m[mpos + 12] & 0xff) | ((m[mpos + 13] & 0xff) << 8)
    h7 += ((t5 >>> 11) | (t6 << 5)) & 0x1fff
    t7 = (m[mpos + 14] & 0xff) | ((m[mpos + 15] & 0xff) << 8)
    h8 += ((t6 >>> 8) | (t7 << 8)) & 0x1fff
    h9 += (t7 >>> 5) | hibit

    c = 0

    d0 = c
    d0 += h0 * r0
    d0 += h1 * (5 * r9)
    d0 += h2 * (5 * r8)
    d0 += h3 * (5 * r7)
    d0 += h4 * (5 * r6)
    c = d0 >>> 13
    d0 &= 0x1fff
    d0 += h5 * (5 * r5)
    d0 += h6 * (5 * r4)
    d0 += h7 * (5 * r3)
    d0 += h8 * (5 * r2)
    d0 += h9 * (5 * r1)
    c += d0 >>> 13
    d0 &= 0x1fff

    d1 = c
    d1 += h0 * r1
    d1 += h1 * r0
    d1 += h2 * (5 * r9)
    d1 += h3 * (5 * r8)
    d1 += h4 * (5 * r7)
    c = d1 >>> 13
    d1 &= 0x1fff
    d1 += h5 * (5 * r6)
    d1 += h6 * (5 * r5)
    d1 += h7 * (5 * r4)
    d1 += h8 * (5 * r3)
    d1 += h9 * (5 * r2)
    c += d1 >>> 13
    d1 &= 0x1fff

    d2 = c
    d2 += h0 * r2
    d2 += h1 * r1
    d2 += h2 * r0
    d2 += h3 * (5 * r9)
    d2 += h4 * (5 * r8)
    c = d2 >>> 13
    d2 &= 0x1fff
    d2 += h5 * (5 * r7)
    d2 += h6 * (5 * r6)
    d2 += h7 * (5 * r5)
    d2 += h8 * (5 * r4)
    d2 += h9 * (5 * r3)
    c += d2 >>> 13
    d2 &= 0x1fff

    d3 = c
    d3 += h0 * r3
    d3 += h1 * r2
    d3 += h2 * r1
    d3 += h3 * r0
    d3 += h4 * (5 * r9)
    c = d3 >>> 13
    d3 &= 0x1fff
    d3 += h5 * (5 * r8)
    d3 += h6 * (5 * r7)
    d3 += h7 * (5 * r6)
    d3 += h8 * (5 * r5)
    d3 += h9 * (5 * r4)
    c += d3 >>> 13
    d3 &= 0x1fff

    d4 = c
    d4 += h0 * r4
    d4 += h1 * r3
    d4 += h2 * r2
    d4 += h3 * r1
    d4 += h4 * r0
    c = d4 >>> 13
    d4 &= 0x1fff
    d4 += h5 * (5 * r9)
    d4 += h6 * (5 * r8)
    d4 += h7 * (5 * r7)
    d4 += h8 * (5 * r6)
    d4 += h9 * (5 * r5)
    c += d4 >>> 13
    d4 &= 0x1fff

    d5 = c
    d5 += h0 * r5
    d5 += h1 * r4
    d5 += h2 * r3
    d5 += h3 * r2
    d5 += h4 * r1
    c = d5 >>> 13
    d5 &= 0x1fff
    d5 += h5 * r0
    d5 += h6 * (5 * r9)
    d5 += h7 * (5 * r8)
    d5 += h8 * (5 * r7)
    d5 += h9 * (5 * r6)
    c += d5 >>> 13
    d5 &= 0x1fff

    d6 = c
    d6 += h0 * r6
    d6 += h1 * r5
    d6 += h2 * r4
    d6 += h3 * r3
    d6 += h4 * r2
    c = d6 >>> 13
    d6 &= 0x1fff
    d6 += h5 * r1
    d6 += h6 * r0
    d6 += h7 * (5 * r9)
    d6 += h8 * (5 * r8)
    d6 += h9 * (5 * r7)
    c += d6 >>> 13
    d6 &= 0x1fff

    d7 = c
    d7 += h0 * r7
    d7 += h1 * r6
    d7 += h2 * r5
    d7 += h3 * r4
    d7 += h4 * r3
    c = d7 >>> 13
    d7 &= 0x1fff
    d7 += h5 * r2
    d7 += h6 * r1
    d7 += h7 * r0
    d7 += h8 * (5 * r9)
    d7 += h9 * (5 * r8)
    c += d7 >>> 13
    d7 &= 0x1fff

    d8 = c
    d8 += h0 * r8
    d8 += h1 * r7
    d8 += h2 * r6
    d8 += h3 * r5
    d8 += h4 * r4
    c = d8 >>> 13
    d8 &= 0x1fff
    d8 += h5 * r3
    d8 += h6 * r2
    d8 += h7 * r1
    d8 += h8 * r0
    d8 += h9 * (5 * r9)
    c += d8 >>> 13
    d8 &= 0x1fff

    d9 = c
    d9 += h0 * r9
    d9 += h1 * r8
    d9 += h2 * r7
    d9 += h3 * r6
    d9 += h4 * r5
    c = d9 >>> 13
    d9 &= 0x1fff
    d9 += h5 * r4
    d9 += h6 * r3
    d9 += h7 * r2
    d9 += h8 * r1
    d9 += h9 * r0
    c += d9 >>> 13
    d9 &= 0x1fff

    c = ((c << 2) + c) | 0
    c = (c + d0) | 0
    d0 = c & 0x1fff
    c = c >>> 13
    d1 += c

    h0 = d0
    h1 = d1
    h2 = d2
    h3 = d3
    h4 = d4
    h5 = d5
    h6 = d6
    h7 = d7
    h8 = d8
    h9 = d9

    mpos += 16
    bytes -= 16
  }
  this.h[0] = h0
  this.h[1] = h1
  this.h[2] = h2
  this.h[3] = h3
  this.h[4] = h4
  this.h[5] = h5
  this.h[6] = h6
  this.h[7] = h7
  this.h[8] = h8
  this.h[9] = h9
}

Poly1305.prototype.finish = function (mac, macpos) {
  let g = new Uint16Array(10)
  let c, mask, f, i

  if (this.leftover) {
    i = this.leftover
    this.buffer[i++] = 1
    for (; i < 16; i++) this.buffer[i] = 0
    this.fin = 1
    this.blocks(this.buffer, 0, 16)
  }

  c = this.h[1] >>> 13
  this.h[1] &= 0x1fff
  for (i = 2; i < 10; i++) {
    this.h[i] += c
    c = this.h[i] >>> 13
    this.h[i] &= 0x1fff
  }
  this.h[0] += c * 5
  c = this.h[0] >>> 13
  this.h[0] &= 0x1fff
  this.h[1] += c
  c = this.h[1] >>> 13
  this.h[1] &= 0x1fff
  this.h[2] += c

  g[0] = this.h[0] + 5
  c = g[0] >>> 13
  g[0] &= 0x1fff
  for (i = 1; i < 10; i++) {
    g[i] = this.h[i] + c
    c = g[i] >>> 13
    g[i] &= 0x1fff
  }
  g[9] -= 1 << 13

  mask = (c ^ 1) - 1
  for (i = 0; i < 10; i++) g[i] &= mask
  mask = ~mask
  for (i = 0; i < 10; i++) this.h[i] = (this.h[i] & mask) | g[i]

  this.h[0] = (this.h[0] | (this.h[1] << 13)) & 0xffff
  this.h[1] = ((this.h[1] >>> 3) | (this.h[2] << 10)) & 0xffff
  this.h[2] = ((this.h[2] >>> 6) | (this.h[3] << 7)) & 0xffff
  this.h[3] = ((this.h[3] >>> 9) | (this.h[4] << 4)) & 0xffff
  this.h[4] =
    ((this.h[4] >>> 12) | (this.h[5] << 1) | (this.h[6] << 14)) & 0xffff
  this.h[5] = ((this.h[6] >>> 2) | (this.h[7] << 11)) & 0xffff
  this.h[6] = ((this.h[7] >>> 5) | (this.h[8] << 8)) & 0xffff
  this.h[7] = ((this.h[8] >>> 8) | (this.h[9] << 5)) & 0xffff

  f = this.h[0] + this.pad[0]
  this.h[0] = f & 0xffff
  for (i = 1; i < 8; i++) {
    f = (((this.h[i] + this.pad[i]) | 0) + (f >>> 16)) | 0
    this.h[i] = f & 0xffff
  }

  mac[macpos + 0] = (this.h[0] >>> 0) & 0xff
  mac[macpos + 1] = (this.h[0] >>> 8) & 0xff
  mac[macpos + 2] = (this.h[1] >>> 0) & 0xff
  mac[macpos + 3] = (this.h[1] >>> 8) & 0xff
  mac[macpos + 4] = (this.h[2] >>> 0) & 0xff
  mac[macpos + 5] = (this.h[2] >>> 8) & 0xff
  mac[macpos + 6] = (this.h[3] >>> 0) & 0xff
  mac[macpos + 7] = (this.h[3] >>> 8) & 0xff
  mac[macpos + 8] = (this.h[4] >>> 0) & 0xff
  mac[macpos + 9] = (this.h[4] >>> 8) & 0xff
  mac[macpos + 10] = (this.h[5] >>> 0) & 0xff
  mac[macpos + 11] = (this.h[5] >>> 8) & 0xff
  mac[macpos + 12] = (this.h[6] >>> 0) & 0xff
  mac[macpos + 13] = (this.h[6] >>> 8) & 0xff
  mac[macpos + 14] = (this.h[7] >>> 0) & 0xff
  mac[macpos + 15] = (this.h[7] >>> 8) & 0xff
}

Poly1305.prototype.update = function (m, mpos, bytes) {
  let i, want

  if (this.leftover) {
    want = 16 - this.leftover
    if (want > bytes) want = bytes
    for (i = 0; i < want; i++) this.buffer[this.leftover + i] = m[mpos + i]
    bytes -= want
    mpos += want
    this.leftover += want
    if (this.leftover < 16) return
    this.blocks(this.buffer, 0, 16)
    this.leftover = 0
  }

  if (bytes >= 16) {
    want = bytes - bytes % 16
    this.blocks(m, mpos, want)
    mpos += want
    bytes -= want
  }

  if (bytes) {
    for (i = 0; i < bytes; i++) this.buffer[this.leftover + i] = m[mpos + i]
    this.leftover += bytes
  }
}

function set25519 (r, a) {
  let i
  for (i = 0; i < 16; i++) r[i] = a[i] | 0
}

function car25519 (o) {
  let v
  let c = 1
  for (let i = 0; i < 16; i++) {
    v = o[i] + c + 65535
    c = Math.floor(v / 65536)
    o[i] = v - c * 65536
  }
  o[0] += c - 1 + 37 * (c - 1)
}

function sel25519 (p, q, b) {
  let t
  const c = ~(b - 1)
  for (let i = 0; i < 16; i++) {
    t = c & (p[i] ^ q[i])
    p[i] ^= t
    q[i] ^= t
  }
}

function pack25519 (o, n) {
  let b
  const m = gf()
  const t = gf()
  for (let i = 0; i < 16; i++) t[i] = n[i]
  car25519(t)
  car25519(t)
  car25519(t)
  for (let j = 0; j < 2; j++) {
    m[0] = t[0] - 0xffed
    for (let i = 1; i < 15; i++) {
      m[i] = t[i] - 0xffff - ((m[i - 1] >> 16) & 1)
      m[i - 1] &= 0xffff
    }
    m[15] = t[15] - 0x7fff - ((m[14] >> 16) & 1)
    b = (m[15] >> 16) & 1
    m[14] &= 0xffff
    sel25519(t, m, 1 - b)
  }
  for (let i = 0; i < 16; i++) {
    o[2 * i] = t[i] & 0xff
    o[2 * i + 1] = t[i] >> 8
  }
}

function neq25519 (a, b) {
  const c = new Uint8Array(32)
  const d = new Uint8Array(32)
  pack25519(c, a)
  pack25519(d, b)
  return cryptoVerify32(c, 0, d, 0)
}

function par25519 (a) {
  let d = new Uint8Array(32)
  pack25519(d, a)
  return d[0] & 1
}

function unpack25519 (o, n) {
  let i
  for (i = 0; i < 16; i++) o[i] = n[2 * i] + (n[2 * i + 1] << 8)
  o[15] &= 0x7fff
}

function A (o, a, b) {
  for (let i = 0; i < 16; i++) o[i] = a[i] + b[i]
}

function Z (o, a, b) {
  for (let i = 0; i < 16; i++) o[i] = a[i] - b[i]
}

function M (o, a, b) {
  let v
  let c
  let t0 = 0
  let t1 = 0
  let t2 = 0
  let t3 = 0
  let t4 = 0
  let t5 = 0
  let t6 = 0
  let t7 = 0
  let t8 = 0
  let t9 = 0
  let t10 = 0
  let t11 = 0
  let t12 = 0
  let t13 = 0
  let t14 = 0
  let t15 = 0
  let t16 = 0
  let t17 = 0
  let t18 = 0
  let t19 = 0
  let t20 = 0
  let t21 = 0
  let t22 = 0
  let t23 = 0
  let t24 = 0
  let t25 = 0
  let t26 = 0
  let t27 = 0
  let t28 = 0
  let t29 = 0
  let t30 = 0
  let b0 = b[0]
  let b1 = b[1]
  let b2 = b[2]
  let b3 = b[3]
  let b4 = b[4]
  let b5 = b[5]
  let b6 = b[6]
  let b7 = b[7]
  let b8 = b[8]
  let b9 = b[9]
  let b10 = b[10]
  let b11 = b[11]
  let b12 = b[12]
  let b13 = b[13]
  let b14 = b[14]
  let b15 = b[15]

  v = a[0]
  t0 += v * b0
  t1 += v * b1
  t2 += v * b2
  t3 += v * b3
  t4 += v * b4
  t5 += v * b5
  t6 += v * b6
  t7 += v * b7
  t8 += v * b8
  t9 += v * b9
  t10 += v * b10
  t11 += v * b11
  t12 += v * b12
  t13 += v * b13
  t14 += v * b14
  t15 += v * b15
  v = a[1]
  t1 += v * b0
  t2 += v * b1
  t3 += v * b2
  t4 += v * b3
  t5 += v * b4
  t6 += v * b5
  t7 += v * b6
  t8 += v * b7
  t9 += v * b8
  t10 += v * b9
  t11 += v * b10
  t12 += v * b11
  t13 += v * b12
  t14 += v * b13
  t15 += v * b14
  t16 += v * b15
  v = a[2]
  t2 += v * b0
  t3 += v * b1
  t4 += v * b2
  t5 += v * b3
  t6 += v * b4
  t7 += v * b5
  t8 += v * b6
  t9 += v * b7
  t10 += v * b8
  t11 += v * b9
  t12 += v * b10
  t13 += v * b11
  t14 += v * b12
  t15 += v * b13
  t16 += v * b14
  t17 += v * b15
  v = a[3]
  t3 += v * b0
  t4 += v * b1
  t5 += v * b2
  t6 += v * b3
  t7 += v * b4
  t8 += v * b5
  t9 += v * b6
  t10 += v * b7
  t11 += v * b8
  t12 += v * b9
  t13 += v * b10
  t14 += v * b11
  t15 += v * b12
  t16 += v * b13
  t17 += v * b14
  t18 += v * b15
  v = a[4]
  t4 += v * b0
  t5 += v * b1
  t6 += v * b2
  t7 += v * b3
  t8 += v * b4
  t9 += v * b5
  t10 += v * b6
  t11 += v * b7
  t12 += v * b8
  t13 += v * b9
  t14 += v * b10
  t15 += v * b11
  t16 += v * b12
  t17 += v * b13
  t18 += v * b14
  t19 += v * b15
  v = a[5]
  t5 += v * b0
  t6 += v * b1
  t7 += v * b2
  t8 += v * b3
  t9 += v * b4
  t10 += v * b5
  t11 += v * b6
  t12 += v * b7
  t13 += v * b8
  t14 += v * b9
  t15 += v * b10
  t16 += v * b11
  t17 += v * b12
  t18 += v * b13
  t19 += v * b14
  t20 += v * b15
  v = a[6]
  t6 += v * b0
  t7 += v * b1
  t8 += v * b2
  t9 += v * b3
  t10 += v * b4
  t11 += v * b5
  t12 += v * b6
  t13 += v * b7
  t14 += v * b8
  t15 += v * b9
  t16 += v * b10
  t17 += v * b11
  t18 += v * b12
  t19 += v * b13
  t20 += v * b14
  t21 += v * b15
  v = a[7]
  t7 += v * b0
  t8 += v * b1
  t9 += v * b2
  t10 += v * b3
  t11 += v * b4
  t12 += v * b5
  t13 += v * b6
  t14 += v * b7
  t15 += v * b8
  t16 += v * b9
  t17 += v * b10
  t18 += v * b11
  t19 += v * b12
  t20 += v * b13
  t21 += v * b14
  t22 += v * b15
  v = a[8]
  t8 += v * b0
  t9 += v * b1
  t10 += v * b2
  t11 += v * b3
  t12 += v * b4
  t13 += v * b5
  t14 += v * b6
  t15 += v * b7
  t16 += v * b8
  t17 += v * b9
  t18 += v * b10
  t19 += v * b11
  t20 += v * b12
  t21 += v * b13
  t22 += v * b14
  t23 += v * b15
  v = a[9]
  t9 += v * b0
  t10 += v * b1
  t11 += v * b2
  t12 += v * b3
  t13 += v * b4
  t14 += v * b5
  t15 += v * b6
  t16 += v * b7
  t17 += v * b8
  t18 += v * b9
  t19 += v * b10
  t20 += v * b11
  t21 += v * b12
  t22 += v * b13
  t23 += v * b14
  t24 += v * b15
  v = a[10]
  t10 += v * b0
  t11 += v * b1
  t12 += v * b2
  t13 += v * b3
  t14 += v * b4
  t15 += v * b5
  t16 += v * b6
  t17 += v * b7
  t18 += v * b8
  t19 += v * b9
  t20 += v * b10
  t21 += v * b11
  t22 += v * b12
  t23 += v * b13
  t24 += v * b14
  t25 += v * b15
  v = a[11]
  t11 += v * b0
  t12 += v * b1
  t13 += v * b2
  t14 += v * b3
  t15 += v * b4
  t16 += v * b5
  t17 += v * b6
  t18 += v * b7
  t19 += v * b8
  t20 += v * b9
  t21 += v * b10
  t22 += v * b11
  t23 += v * b12
  t24 += v * b13
  t25 += v * b14
  t26 += v * b15
  v = a[12]
  t12 += v * b0
  t13 += v * b1
  t14 += v * b2
  t15 += v * b3
  t16 += v * b4
  t17 += v * b5
  t18 += v * b6
  t19 += v * b7
  t20 += v * b8
  t21 += v * b9
  t22 += v * b10
  t23 += v * b11
  t24 += v * b12
  t25 += v * b13
  t26 += v * b14
  t27 += v * b15
  v = a[13]
  t13 += v * b0
  t14 += v * b1
  t15 += v * b2
  t16 += v * b3
  t17 += v * b4
  t18 += v * b5
  t19 += v * b6
  t20 += v * b7
  t21 += v * b8
  t22 += v * b9
  t23 += v * b10
  t24 += v * b11
  t25 += v * b12
  t26 += v * b13
  t27 += v * b14
  t28 += v * b15
  v = a[14]
  t14 += v * b0
  t15 += v * b1
  t16 += v * b2
  t17 += v * b3
  t18 += v * b4
  t19 += v * b5
  t20 += v * b6
  t21 += v * b7
  t22 += v * b8
  t23 += v * b9
  t24 += v * b10
  t25 += v * b11
  t26 += v * b12
  t27 += v * b13
  t28 += v * b14
  t29 += v * b15
  v = a[15]
  t15 += v * b0
  t16 += v * b1
  t17 += v * b2
  t18 += v * b3
  t19 += v * b4
  t20 += v * b5
  t21 += v * b6
  t22 += v * b7
  t23 += v * b8
  t24 += v * b9
  t25 += v * b10
  t26 += v * b11
  t27 += v * b12
  t28 += v * b13
  t29 += v * b14
  t30 += v * b15

  t0 += 38 * t16
  t1 += 38 * t17
  t2 += 38 * t18
  t3 += 38 * t19
  t4 += 38 * t20
  t5 += 38 * t21
  t6 += 38 * t22
  t7 += 38 * t23
  t8 += 38 * t24
  t9 += 38 * t25
  t10 += 38 * t26
  t11 += 38 * t27
  t12 += 38 * t28
  t13 += 38 * t29
  t14 += 38 * t30
  // t15 left as is

  // first car
  c = 1
  v = t0 + c + 65535
  c = Math.floor(v / 65536)
  t0 = v - c * 65536
  v = t1 + c + 65535
  c = Math.floor(v / 65536)
  t1 = v - c * 65536
  v = t2 + c + 65535
  c = Math.floor(v / 65536)
  t2 = v - c * 65536
  v = t3 + c + 65535
  c = Math.floor(v / 65536)
  t3 = v - c * 65536
  v = t4 + c + 65535
  c = Math.floor(v / 65536)
  t4 = v - c * 65536
  v = t5 + c + 65535
  c = Math.floor(v / 65536)
  t5 = v - c * 65536
  v = t6 + c + 65535
  c = Math.floor(v / 65536)
  t6 = v - c * 65536
  v = t7 + c + 65535
  c = Math.floor(v / 65536)
  t7 = v - c * 65536
  v = t8 + c + 65535
  c = Math.floor(v / 65536)
  t8 = v - c * 65536
  v = t9 + c + 65535
  c = Math.floor(v / 65536)
  t9 = v - c * 65536
  v = t10 + c + 65535
  c = Math.floor(v / 65536)
  t10 = v - c * 65536
  v = t11 + c + 65535
  c = Math.floor(v / 65536)
  t11 = v - c * 65536
  v = t12 + c + 65535
  c = Math.floor(v / 65536)
  t12 = v - c * 65536
  v = t13 + c + 65535
  c = Math.floor(v / 65536)
  t13 = v - c * 65536
  v = t14 + c + 65535
  c = Math.floor(v / 65536)
  t14 = v - c * 65536
  v = t15 + c + 65535
  c = Math.floor(v / 65536)
  t15 = v - c * 65536
  t0 += c - 1 + 37 * (c - 1)

  // second car
  c = 1
  v = t0 + c + 65535
  c = Math.floor(v / 65536)
  t0 = v - c * 65536
  v = t1 + c + 65535
  c = Math.floor(v / 65536)
  t1 = v - c * 65536
  v = t2 + c + 65535
  c = Math.floor(v / 65536)
  t2 = v - c * 65536
  v = t3 + c + 65535
  c = Math.floor(v / 65536)
  t3 = v - c * 65536
  v = t4 + c + 65535
  c = Math.floor(v / 65536)
  t4 = v - c * 65536
  v = t5 + c + 65535
  c = Math.floor(v / 65536)
  t5 = v - c * 65536
  v = t6 + c + 65535
  c = Math.floor(v / 65536)
  t6 = v - c * 65536
  v = t7 + c + 65535
  c = Math.floor(v / 65536)
  t7 = v - c * 65536
  v = t8 + c + 65535
  c = Math.floor(v / 65536)
  t8 = v - c * 65536
  v = t9 + c + 65535
  c = Math.floor(v / 65536)
  t9 = v - c * 65536
  v = t10 + c + 65535
  c = Math.floor(v / 65536)
  t10 = v - c * 65536
  v = t11 + c + 65535
  c = Math.floor(v / 65536)
  t11 = v - c * 65536
  v = t12 + c + 65535
  c = Math.floor(v / 65536)
  t12 = v - c * 65536
  v = t13 + c + 65535
  c = Math.floor(v / 65536)
  t13 = v - c * 65536
  v = t14 + c + 65535
  c = Math.floor(v / 65536)
  t14 = v - c * 65536
  v = t15 + c + 65535
  c = Math.floor(v / 65536)
  t15 = v - c * 65536
  t0 += c - 1 + 37 * (c - 1)

  o[0] = t0
  o[1] = t1
  o[2] = t2
  o[3] = t3
  o[4] = t4
  o[5] = t5
  o[6] = t6
  o[7] = t7
  o[8] = t8
  o[9] = t9
  o[10] = t10
  o[11] = t11
  o[12] = t12
  o[13] = t13
  o[14] = t14
  o[15] = t15
}

function S (o, a) {
  M(o, a, a)
}

function inv25519 (o, i) {
  let c = gf()
  let a
  for (a = 0; a < 16; a++) c[a] = i[a]
  for (a = 253; a >= 0; a--) {
    S(c, c)
    if (a !== 2 && a !== 4) M(c, c, i)
  }
  for (a = 0; a < 16; a++) o[a] = c[a]
}

function pow2523 (o, i) {
  let c = gf()
  let a
  for (a = 0; a < 16; a++) c[a] = i[a]
  for (a = 250; a >= 0; a--) {
    S(c, c)
    if (a !== 1) M(c, c, i)
  }
  for (a = 0; a < 16; a++) o[a] = c[a]
}

function cryptoHash (out, m, n) {
  const input = new Uint8Array(n)
  for (let i = 0; i < n; ++i) {
    input[i] = m[i]
  }
  let hash = blake.blake2b(input)
  for (let i = 0; i < CRYPTO_HASH_BYTES; ++i) {
    out[i] = hash[i]
  }
  return 0
}

function add (p, q) {
  const a = gf()
  const b = gf()
  const c = gf()
  const d = gf()
  const e = gf()
  const f = gf()
  const g = gf()
  const h = gf()
  const t = gf()

  Z(a, p[1], p[0])
  Z(t, q[1], q[0])
  M(a, a, t)
  A(b, p[0], p[1])
  A(t, q[0], q[1])
  M(b, b, t)
  M(c, p[3], q[3])
  M(c, c, D2)
  M(d, p[2], q[2])
  A(d, d, d)
  Z(e, b, a)
  Z(f, d, c)
  A(g, d, c)
  A(h, b, a)

  M(p[0], e, f)
  M(p[1], h, g)
  M(p[2], g, f)
  M(p[3], e, h)
}

function cswap (p, q, b) {
  let i
  for (i = 0; i < 4; i++) {
    sel25519(p[i], q[i], b)
  }
}

function pack (r, p) {
  const tx = gf()
  const ty = gf()
  const zi = gf()
  inv25519(zi, p[2])
  M(tx, p[0], zi)
  M(ty, p[1], zi)
  pack25519(r, ty)
  r[31] ^= par25519(tx) << 7
}

function scalarmult (p, q, s) {
  let b, i
  set25519(p[0], gf0)
  set25519(p[1], gf1)
  set25519(p[2], gf1)
  set25519(p[3], gf0)
  for (i = 255; i >= 0; --i) {
    b = (s[(i / 8) | 0] >> (i & 7)) & 1
    cswap(p, q, b)
    add(q, p)
    add(p, p)
    cswap(p, q, b)
  }
}

function scalarbase (p, s) {
  let q = [gf(), gf(), gf(), gf()]
  set25519(q[0], X)
  set25519(q[1], Y)
  set25519(q[2], gf1)
  M(q[3], X, Y)
  scalarmult(p, q, s)
}

let L = new Float64Array([
  0xed,
  0xd3,
  0xf5,
  0x5c,
  0x1a,
  0x63,
  0x12,
  0x58,
  0xd6,
  0x9c,
  0xf7,
  0xa2,
  0xde,
  0xf9,
  0xde,
  0x14,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0x10
])

function modL (r, x) {
  let carry, i, j, k
  for (i = 63; i >= 32; --i) {
    carry = 0
    for (j = i - 32, k = i - 12; j < k; ++j) {
      x[j] += carry - 16 * x[i] * L[j - (i - 32)]
      carry = (x[j] + 128) >> 8
      x[j] -= carry * 256
    }
    x[j] += carry
    x[i] = 0
  }
  carry = 0
  for (j = 0; j < 32; j++) {
    x[j] += carry - (x[31] >> 4) * L[j]
    carry = x[j] >> 8
    x[j] &= 255
  }
  for (j = 0; j < 32; j++) x[j] -= carry * L[j]
  for (i = 0; i < 32; i++) {
    x[i + 1] += x[i] >> 8
    r[i] = x[i] & 255
  }
}

function reduce (r) {
  const x = new Float64Array(64)
  for (let i = 0; i < 64; i++) x[i] = r[i]
  for (let i = 0; i < 64; i++) r[i] = 0
  modL(r, x)
}

// Note: difference from C - smlen returned, not passed as argument.
function cryptoSign (sm, m, n, sk) {
  const d = new Uint8Array(64)
  const h = new Uint8Array(64)
  const r = new Uint8Array(64)
  let i
  let j
  let x = new Float64Array(64)
  let p = [gf(), gf(), gf(), gf()]

  let pk = derivePublicFromSecret(sk)

  cryptoHash(d, sk, 32)
  d[0] &= 248
  d[31] &= 127
  d[31] |= 64

  let smlen = n + 64
  for (i = 0; i < n; i++) sm[64 + i] = m[i]
  for (i = 0; i < 32; i++) sm[32 + i] = d[32 + i]

  cryptoHash(r, sm.subarray(32), n + 32)
  reduce(r)
  scalarbase(p, r)
  pack(sm, p)

  for (i = 32; i < 64; i++) sm[i] = pk[i - 32]
  cryptoHash(h, sm, n + 64)
  reduce(h)

  for (i = 0; i < 64; i++) x[i] = 0
  for (i = 0; i < 32; i++) x[i] = r[i]
  for (i = 0; i < 32; i++) {
    for (j = 0; j < 32; j++) {
      x[i + j] += h[i] * d[j]
    }
  }

  modL(sm.subarray(32), x)
  return smlen
}

function unpackneg (r, p) {
  const t = gf()
  const chk = gf()
  const num = gf()
  const den = gf()
  const den2 = gf()
  const den4 = gf()
  const den6 = gf()

  set25519(r[2], gf1)
  unpack25519(r[1], p)
  S(num, r[1])
  M(den, num, D)
  Z(num, num, r[2])
  A(den, r[2], den)

  S(den2, den)
  S(den4, den2)
  M(den6, den4, den2)
  M(t, den6, num)
  M(t, t, den)

  pow2523(t, t)
  M(t, t, num)
  M(t, t, den)
  M(t, t, den)
  M(r[0], t, den)

  S(chk, r[0])
  M(chk, chk, den)
  if (neq25519(chk, num)) M(r[0], r[0], I)

  S(chk, r[0])
  M(chk, chk, den)
  if (neq25519(chk, num)) return -1

  if (par25519(r[0]) === p[31] >> 7) Z(r[0], gf0, r[0])

  M(r[3], r[0], r[1])
  return 0
}

function cryptoSignOpen (m, sm, n, pk) {
  let i, mlen
  const t = new Uint8Array(32)
  const h = new Uint8Array(64)
  const p = [gf(), gf(), gf(), gf()]
  const q = [gf(), gf(), gf(), gf()]

  mlen = -1
  if (n < 64) return -1

  if (unpackneg(q, pk)) return -1

  for (i = 0; i < n; i++) m[i] = sm[i]
  for (i = 0; i < 32; i++) m[i + 32] = pk[i]
  cryptoHash(h, m, n)
  reduce(h)
  scalarmult(p, q, h)

  scalarbase(q, sm.subarray(32))
  add(p, q)
  pack(t, p)

  n -= 64
  if (cryptoVerify32(sm, 0, t, 0)) {
    for (i = 0; i < n; i++) m[i] = 0
    return -1
  }

  for (i = 0; i < n; i++) m[i] = sm[i + 64]
  mlen = n
  return mlen
}

const CRYPTO_SIGN_BYTES = 64
const CRYPTO_SIGN_PUBLICKEYBYTES = 32
const CRYPTO_SIGN_SECRETKEYBYTES = 32
const CRYPTO_HASH_BYTES = 64

/* High-level API */

function checkArrayTypes () {
  for (let i = 0; i < arguments.length; i++) {
    if (!(arguments[i] instanceof Uint8Array)) {
      throw new TypeError('unexpected type, use Uint8Array')
    }
  }
}

function naclSign (msg, secretKey) {
  checkArrayTypes(msg, secretKey)
  if (secretKey.length !== CRYPTO_SIGN_SECRETKEYBYTES) {
    throw new Error('bad secret key size')
  }
  let signedMsg = new Uint8Array(CRYPTO_SIGN_BYTES + msg.length)
  cryptoSign(signedMsg, msg, msg.length, secretKey)
  return signedMsg
}

export function derivePublicFromSecret (sk) {
  let d = new Uint8Array(64)
  let p = [gf(), gf(), gf(), gf()]
  let pk = new Uint8Array(32)
  let context = blake.blake2bInit(64)
  blake.blake2bUpdate(context, sk)
  d = blake.blake2bFinal(context)

  d[0] &= 248
  d[31] &= 127
  d[31] |= 64

  scalarbase(p, d)
  pack(pk, p)
  return pk
}

export function signDetached (msg, secretKey) {
  let signedMsg = naclSign(msg, secretKey)
  let sig = new Uint8Array(CRYPTO_SIGN_BYTES)
  for (let i = 0; i < sig.length; i++) sig[i] = signedMsg[i]
  return sig
}

export function verifyDetached (msg, sig, publicKey) {
  checkArrayTypes(msg, sig, publicKey)
  if (sig.length !== CRYPTO_SIGN_BYTES) throw new Error('bad signature size')
  if (publicKey.length !== CRYPTO_SIGN_PUBLICKEYBYTES) {
    throw new Error('bad public key size')
  }
  let sm = new Uint8Array(CRYPTO_SIGN_BYTES + msg.length)
  let m = new Uint8Array(CRYPTO_SIGN_BYTES + msg.length)
  let i
  for (i = 0; i < CRYPTO_SIGN_BYTES; i++) sm[i] = sig[i]
  for (i = 0; i < msg.length; i++) sm[i + CRYPTO_SIGN_BYTES] = msg[i]
  return cryptoSignOpen(m, sm, sm.length, publicKey) >= 0
}
