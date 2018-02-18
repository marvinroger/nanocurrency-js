/* eslint-env jest */

const nano = require('../dist/nanocurrency.cjs')

const SEED = 'b947ee0115014a4d49a804e7fc7248e31690b80033ce7a6e3a07bdf93b2584ff'
const KEYS = [
  {
    index: 0,
    secretKey: '23b5e95b4c4325ed5af109bfe4acde782dbab0163591d9052963723ae8e72a09',
    publicKey: '4d312f604f638adf19afac6308ecbbc5881e1b6cd6f53d382775c686bca7535b',
    address: 'xrb_1mbj7xi6yrwcuwetzd5535pdqjea5rfpsoqo9nw4gxg8itycgntucp49i1nz'
  },
  {
    index: 1,
    secretKey: 'feb6959738d43f9b0e6cdcc778bcd2f3384e6f1255510db6f48e2b99ba059f0f',
    publicKey: 'fffadbb9e15d553101e1db0c67f20f6984836dc1bb513ff1d0e4a0af89ce5291',
    address: 'xrb_3zztugwy4qco861y5preezs1yte6ifpw5gtj9zrx3s71oy6wwnnj5en5oo5a'
  }
]

beforeAll(nano.init)

test('generates different seeds', () => {
  expect(nano.generateSeed()).not.toBe(nano.generateSeed())
})

test('creates correct secret keys', () => {
  for (let key of KEYS) {
    expect(nano.computeSecretKey(SEED, key.index)).toBe(key.secretKey)
  }
})

test('creates correct public keys', () => {
  for (let key of KEYS) {
    expect(nano.computePublicKey(key.secretKey)).toBe(key.publicKey)
  }
})

test('creates correct addresses', () => {
  for (let key of KEYS) {
    expect(nano.computeAddress(key.publicKey)).toBe(key.address)
  }
})
