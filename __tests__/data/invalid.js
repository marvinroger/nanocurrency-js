const INVALID_SEEDS = [
  '',
  12,
  '947ee0115014a4d49a804e7fc7248e31690b80033ce7a6e3a07bdf93b2584ff',
  'z947ee0115014a4d49a804e7fc7248e31690b80033ce7a6e3a07bdf93b2584ff',
];

const INVALID_INDEXES = ['', '0', -1, 1.1];

const INVALID_SECRET_KEYS = [
  '',
  12,
  '3b5e95b4c4325ed5af109bfe4acde782dbab0163591d9052963723ae8e72a09',
  'z3b5e95b4c4325ed5af109bfe4acde782dbab0163591d9052963723ae8e72a09',
];

const INVALID_PUBLIC_KEYS = [
  '',
  12,
  'd312f604f638adf19afac6308ecbbc5881e1b6cd6f53d382775c686bca7535b',
  'zd312f604f638adf19afac6308ecbbc5881e1b6cd6f53d382775c686bca7535b',
];

const INVALID_HASHES = [
  '',
  12,
  'f7122e843b27524f4f1d6bd14aefd1c8f01d36ae8653d37417533c0d4bc2be6',
  'zf7122e843b27524f4f1d6bd14aefd1c8f01d36ae8653d37417533c0d4bc2be6',
];

const INVALID_WORKS = ['', 12, '000000000995bc3', 'z000000000995bc3'];

const INVALID_ADDRESSES = [
  '',
  12,
  'xrb_1mbj7xi6yrwcuwetzd5535pdqjea5rfpsoqo9nw4gxg8itycgntucp49i1n4', // bad checksum
  'zrb_1mbj7xi6yrwcuwetzd5535pdqjea5rfpsoqo9nw4gxg8itycgntucp49i1nz',
  'xrb_2mbj7xi6yrwcuwetzd5535pdqjea5rfpsoqo9nw4gxg8itycgntucp49i1nz',
  'xrb_1mbj7xi6yrwcuwetzd5535pdqjea5rfpsoqo9nw4gxg8itycgntucp49i1n',
  'xrb_1mbj7xi6yrwcuwetzd5535pdqjea5rfpsoqo9nw4gxg8itycgntucp49i1nv',
];

const INVALID_AMOUNTS = [
  '',
  12,
  'bla',
  '1000000000000000000000000000000000000000',
  '-1',
  // a bit more than 2^128
  '350000000000000000000000000000000000000',
];

const INVALID_SIGNATURES = [
  '',
  12,
  '974324f8cc42da56f62fc212a17886bdcb18de363d04da84eedc99cb4a33919d14a2cf9de9d534faa6d0b91d01f0622205d898293525e692586c84f2dcf9208',
  'z974324f8cc42da56f62fc212a17886bdcb18de363d04da84eedc99cb4a33919d14a2cf9de9d534faa6d0b91d01f0622205d898293525e692586c84f2dcf9208',
];

module.exports = {
  INVALID_SEEDS,
  INVALID_INDEXES,
  INVALID_SECRET_KEYS,
  INVALID_PUBLIC_KEYS,
  INVALID_HASHES,
  INVALID_WORKS,
  INVALID_ADDRESSES,
  INVALID_AMOUNTS,
  INVALID_SIGNATURES,
  INVALID_HASHES_AND_ADDRESSES: INVALID_HASHES.concat(INVALID_ADDRESSES),
};
