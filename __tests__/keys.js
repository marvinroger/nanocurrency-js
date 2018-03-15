/* eslint-env jest */

const nano = require('../dist/nanocurrency.cjs')
const {
  INVALID_SEEDS,
  INVALID_INDEXES,
  INVALID_SECRET_KEYS,
  INVALID_ADDRESSES,
  INVALID_PUBLIC_KEYS
} = require('./common/data')

const SEED = 'b947ee0115014a4d49a804e7fc7248e31690b80033ce7a6e3a07bdf93b2584ff'
const KEYS = [
  {
    index: 0,
    secretKey: '23B5E95B4C4325ED5AF109BFE4ACDE782DBAB0163591D9052963723AE8E72A09',
    publicKey: '4D312F604F638ADF19AFAC6308ECBBC5881E1B6CD6F53D382775C686BCA7535B',
    address: 'xrb_1mbj7xi6yrwcuwetzd5535pdqjea5rfpsoqo9nw4gxg8itycgntucp49i1nz'
  },
  {
    index: 1,
    secretKey: 'FEB6959738D43F9B0E6CDCC778BCD2F3384E6F1255510DB6F48E2B99BA059F0F',
    publicKey: 'FFFADBB9E15D553101E1DB0C67F20F6984836DC1BB513FF1D0E4A0AF89CE5291',
    address: 'xrb_3zztugwy4qco861y5preezs1yte6ifpw5gtj9zrx3s71oy6wwnnj5en5oo5a'
  }
]

describe('seeds', () => {
  test('generates different seeds', async () => {
    expect.assertions(3)
    const seed1 = await nano.generateSeed()
    const seed2 = await nano.generateSeed()

    expect(nano.checkSeed(seed1)).toBe(true)
    expect(nano.checkSeed(seed2)).toBe(true)
    expect(seed1).not.toBe(seed2)
  })
})

describe('secret keys', () => {
  test('creates correct secret keys', () => {
    expect.assertions(KEYS.length)
    for (let key of KEYS) {
      expect(nano.deriveSecretKey(SEED, key.index)).toBe(key.secretKey)
    }
  })

  test('throws with invalid seeds', () => {
    expect.assertions(INVALID_SEEDS.length)
    for (let invalidSeed of INVALID_SEEDS) {
      expect(
        () => nano.deriveSecretKey(invalidSeed, 0)
      ).toThrowError('Seed is not valid')
    }
  })

  test('throws with invalid indexes', () => {
    expect.assertions(INVALID_INDEXES.length)
    for (let invalidIndex of INVALID_INDEXES) {
      expect(
        () => nano.deriveSecretKey(SEED, invalidIndex)
      ).toThrowError('Index is not valid')
    }
  })
})

describe('public keys', () => {
  test('creates correct public keys from secret keys', () => {
    expect.assertions(KEYS.length)
    for (let key of KEYS) {
      expect(nano.derivePublicKey(key.secretKey)).toBe(key.publicKey)
    }
  })

  test('creates correct public keys from addresses', () => {
    expect.assertions(KEYS.length)
    for (let key of KEYS) {
      expect(nano.derivePublicKey(key.address)).toBe(key.publicKey)
    }
  })

  test('throws with invalid secret keys', () => {
    expect.assertions(INVALID_SECRET_KEYS.length)
    for (let invalidSecretKey of INVALID_SECRET_KEYS) {
      expect(
        () => nano.derivePublicKey(invalidSecretKey)
      ).toThrowError('Secret key or address is not valid')
    }
  })

  test('throws with invalid addresses', () => {
    expect.assertions(INVALID_ADDRESSES.length)
    for (let invalidAddress of INVALID_ADDRESSES) {
      expect(
        () => nano.derivePublicKey(invalidAddress)
      ).toThrowError('Secret key or address is not valid')
    }
  })
})

describe('addresses', () => {
  test('creates correct addresses', () => {
    expect.assertions(KEYS.length)
    for (let key of KEYS) {
      expect(nano.deriveAddress(key.publicKey)).toBe(key.address)
    }
  })

  test('throws with invalid public keys', () => {
    expect.assertions(INVALID_PUBLIC_KEYS.length)
    for (let invalidPublicKey of INVALID_PUBLIC_KEYS) {
      expect(
        () => nano.deriveAddress(invalidPublicKey)
      ).toThrowError('Public key is not valid')
    }
  })
})
