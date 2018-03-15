/* eslint-env jest */

const nano = require('../dist/nanocurrency.cjs')
const {
  INVALID_HASHES,
  INVALID_SECRET_KEYS,
  INVALID_PUBLIC_KEYS,
  INVALID_SIGNATURES
} = require('./common/data')

const SECRET_KEY = '0000000000000000000000000000000000000000000000000000000000000001'
const PUBLIC_KEY = 'C969EC348895A49E21824E10E6B829EDEA50CCC26A83CE8986A3B95D12576058'
const HASH = 'F47B23107E5F34B2CE06F562B5C435DF72A533251CB414C51B2B62A8F63A00E4'
const SIGNATURE = '5974324F8CC42DA56F62FC212A17886BDCB18DE363D04DA84EEDC99CB4A33919D14A2CF9DE9D534FAA6D0B91D01F0622205D898293525E692586C84F2DCF9208'
const INVALID_SIGNATURE = '8029FCD2F48C685296E525392898D5022260F10D19B0D6AAF435D9ED9FC2A41D91933A4BC99CDEE48AD40D363ED81BCDB68871A212CF26F65AD24CC8F4234795'

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
