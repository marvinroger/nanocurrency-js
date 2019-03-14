/* eslint-env jest */
/* eslint-disable @typescript-eslint/no-var-requires */

const nano = require('../dist/nanocurrency.cjs')
const {
  INVALID_SEEDS,
  INVALID_INDEXES,
  INVALID_SECRET_KEYS,
  INVALID_ADDRESSES,
  INVALID_PUBLIC_KEYS,
} = require('./data/invalid')

const VALID_KEYS = require('./data/valid_keys')
const RANDOM_VALID_KEY = VALID_KEYS[0]

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
    expect.assertions(VALID_KEYS.length)
    for (let key of VALID_KEYS) {
      expect(nano.deriveSecretKey(key.seed, key.index)).toBe(key.secretKey)
    }
  })

  test('throws with invalid seeds', () => {
    expect.assertions(INVALID_SEEDS.length)
    for (let invalidSeed of INVALID_SEEDS) {
      expect(() => nano.deriveSecretKey(invalidSeed, 0)).toThrowError(
        'Seed is not valid'
      )
    }
  })

  test('throws with invalid indexes', () => {
    expect.assertions(INVALID_INDEXES.length)
    for (let invalidIndex of INVALID_INDEXES) {
      expect(() =>
        nano.deriveSecretKey(RANDOM_VALID_KEY.seed, invalidIndex)
      ).toThrowError('Index is not valid')
    }
  })
})

describe('public keys', () => {
  test('creates correct public keys from secret keys', () => {
    expect.assertions(VALID_KEYS.length)
    for (let key of VALID_KEYS) {
      expect(nano.derivePublicKey(key.secretKey)).toBe(key.publicKey)
    }
  })

  test('creates correct public keys from addresses', () => {
    expect.assertions(VALID_KEYS.length)
    for (let key of VALID_KEYS) {
      expect(nano.derivePublicKey(key.account)).toBe(key.publicKey)
    }
  })

  test('throws with invalid secret keys', () => {
    expect.assertions(INVALID_SECRET_KEYS.length)
    for (let invalidSecretKey of INVALID_SECRET_KEYS) {
      expect(() => nano.derivePublicKey(invalidSecretKey)).toThrowError(
        'Secret key or address is not valid'
      )
    }
  })

  test('throws with invalid addresses', () => {
    expect.assertions(INVALID_ADDRESSES.length)
    for (let invalidAddress of INVALID_ADDRESSES) {
      expect(() => nano.derivePublicKey(invalidAddress)).toThrowError(
        'Secret key or address is not valid'
      )
    }
  })
})

describe('addresses', () => {
  test('creates correct addresses', () => {
    expect.assertions(VALID_KEYS.length)
    for (let key of VALID_KEYS) {
      expect(nano.deriveAddress(key.publicKey)).toBe(key.account)
    }
  })

  test('creates correct addresses with nano prefix', () => {
    expect.assertions(VALID_KEYS.length)
    for (let key of VALID_KEYS) {
      expect(nano.deriveAddress(key.publicKey, { useNanoPrefix: true })).toBe(
        key.account.replace('xrb_', 'nano_')
      )
    }
  })

  test('throws with invalid public keys', () => {
    expect.assertions(INVALID_PUBLIC_KEYS.length)
    for (let invalidPublicKey of INVALID_PUBLIC_KEYS) {
      expect(() => nano.deriveAddress(invalidPublicKey)).toThrowError(
        'Public key is not valid'
      )
    }
  })
})
