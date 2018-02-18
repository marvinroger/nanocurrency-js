/* eslint-env jest */

const nano = require('../dist/nanocurrency.cjs')
const {
  INVALID_HASHES,
  INVALID_SECRET_KEYS,
  INVALID_PUBLIC_KEYS,
  INVALID_SIGNATURES
} = require('./common/data')

const SECRET_KEY = '0000000000000000000000000000000000000000000000000000000000000001'
const PUBLIC_KEY = 'c969ec348895a49e21824e10e6b829edea50ccc26a83ce8986a3b95d12576058'
const HASH = 'f47b23107e5f34b2ce06f562b5c435df72a533251cb414c51b2b62a8f63a00e4'
const SIGNATURE = '5974324f8cc42da56f62fc212a17886bdcb18de363d04da84eedc99cb4a33919d14a2cf9de9d534faa6d0b91d01f0622205d898293525e692586c84f2dcf9208'
const INVALID_SIGNATURE = '8029fcd2f48c685296e525392898d5022260f10d19b0d6aaf435d9ed9fc2a41d91933a4bc99cdee48ad40d363ed81bcdb68871a212cf26f65ad24cc8f4234795'

beforeAll(nano.init)

describe('sign', () => {
  test('signs correctly', () => {
    expect(
      nano.signBlock(
        HASH,
        SECRET_KEY
      )
    ).toBe(SIGNATURE)
  })

  test('throws with invalid hashes', () => {
    expect.assertions(INVALID_HASHES.length)
    for (let invalidHash of INVALID_HASHES) {
      expect(
        () => nano.signBlock(invalidHash, SECRET_KEY)
      ).toThrowError('Hash is not valid')
    }
  })

  test('throws with invalid secret keys', () => {
    expect.assertions(INVALID_SECRET_KEYS.length)
    for (let invalidSecretKey of INVALID_SECRET_KEYS) {
      expect(
        () => nano.signBlock(HASH, invalidSecretKey)
      ).toThrowError('Secret key is not valid')
    }
  })
})

describe('verify', () => {
  test('validates correct signature', () => {
    expect(
      nano.verifyBlock(
        HASH,
        SIGNATURE,
        PUBLIC_KEY
      )
    ).toBe(true)
  })

  test('does not validate incorrect signature', () => {
    expect(
      nano.verifyBlock(
        HASH,
        INVALID_SIGNATURE,
        PUBLIC_KEY
      )
    ).toBe(false)
  })

  test('throws with invalid hashes', () => {
    expect.assertions(INVALID_HASHES.length)
    for (let invalidHash of INVALID_HASHES) {
      expect(
        () => nano.verifyBlock(invalidHash, SIGNATURE, PUBLIC_KEY)
      ).toThrowError('Hash is not valid')
    }
  })

  test('throws with invalid signatures', () => {
    expect.assertions(INVALID_SIGNATURES.length)
    for (let invalidSignature of INVALID_SIGNATURES) {
      expect(
        () => nano.verifyBlock(HASH, invalidSignature, PUBLIC_KEY)
      ).toThrowError('Signature is not valid')
    }
  })

  test('throws with invalid public keys', () => {
    expect.assertions(INVALID_PUBLIC_KEYS.length)
    for (let invalidPublicKey of INVALID_PUBLIC_KEYS) {
      expect(
        () => nano.verifyBlock(HASH, SIGNATURE, invalidPublicKey)
      ).toThrowError('Public key is not valid')
    }
  })
})
