/* eslint-env jest */

const nano = require('../dist/nanocurrency.cjs')
const {
  INVALID_SEEDS,
  INVALID_INDEXES,
  INVALID_SECRET_KEYS,
  INVALID_PUBLIC_KEYS
} = require('./common/data')

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

describe('seeds', () => {
  test('generates different seeds', () => {
    expect(nano.generateSeed()).not.toBe(nano.generateSeed())
  })
})

describe('secret keys', () => {
  test('creates correct secret keys', () => {
    for (let key of KEYS) {
      expect(nano.computeSecretKey(SEED, key.index)).toBe(key.secretKey)
    }
  })

  test('throws with invalid seeds', () => {
    for (let invalidSeed of INVALID_SEEDS) {
      expect(
        () => nano.computeSecretKey(invalidSeed, 0)
      ).toThrowError('Seed is not valid')
    }
  })

  test('throws with invalid indexes', () => {
    for (let invalidIndex of INVALID_INDEXES) {
      expect(
        () => nano.computeSecretKey(SEED, invalidIndex)
      ).toThrowError('Index is not valid')
    }
  })
})

describe('public keys', () => {
  test('creates correct public keys', () => {
    for (let key of KEYS) {
      expect(nano.computePublicKey(key.secretKey)).toBe(key.publicKey)
    }
  })

  test('throws with invalid secret keys', () => {
    for (let invalidSecretKey of INVALID_SECRET_KEYS) {
      expect(
        () => nano.computePublicKey(invalidSecretKey)
      ).toThrowError('Secret key is not valid')
    }
  })
})

describe('addresses', () => {
  test('creates correct addresses', () => {
    for (let key of KEYS) {
      expect(nano.computeAddress(key.publicKey)).toBe(key.address)
    }
  })

  test('throws with invalid public keys', () => {
    for (let invalidPublicKey of INVALID_PUBLIC_KEYS) {
      expect(
        () => nano.computeAddress(invalidPublicKey)
      ).toThrowError('Public key is not valid')
    }
  })
})
