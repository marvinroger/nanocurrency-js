import * as nano from '../'

import {
  INVALID_HASHES,
  INVALID_SECRET_KEYS,
  INVALID_PUBLIC_KEYS,
  INVALID_SIGNATURES,
} from './test-data/invalid'

import VALID_BLOCKS from './test-data/valid_blocks.json'
const RANDOM_VALID_BLOCK = VALID_BLOCKS[0]

const INVALID_SIGNATURE =
  '8029FCD2F48C685296E525392898D5022260F10D19B0D6AAF435D9ED9FC2A41D91933A4BC99CDEE48AD40D363ED81BCDB68871A212CF26F65AD24CC8F4234795'

describe('sign', () => {
  test('signs correctly', () => {
    expect.assertions(VALID_BLOCKS.length)
    for (const block of VALID_BLOCKS) {
      expect(
        nano.signBlock({ hash: block.block.hash, secretKey: block.secretKey })
      ).toBe(block.block.data.signature)
    }
  })

  test('throws with invalid hashes', () => {
    expect.assertions(INVALID_HASHES.length)
    for (const invalidHash of INVALID_HASHES) {
      expect(() =>
        nano.signBlock({
          hash: invalidHash,
          secretKey: RANDOM_VALID_BLOCK.secretKey,
        })
      ).toThrowError('Hash is not valid')
    }
  })

  test('throws with invalid secret keys', () => {
    expect.assertions(INVALID_SECRET_KEYS.length)
    for (const invalidSecretKey of INVALID_SECRET_KEYS) {
      expect(() =>
        nano.signBlock({
          hash: RANDOM_VALID_BLOCK.block.hash,
          secretKey: invalidSecretKey,
        })
      ).toThrowError('Secret key is not valid')
    }
  })
})

describe('verify', () => {
  test('validates correct signature', () => {
    expect.assertions(VALID_BLOCKS.length)
    for (const block of VALID_BLOCKS) {
      expect(
        nano.verifyBlock({
          hash: block.block.hash,
          signature: block.block.data.signature,
          publicKey: block.publicKey,
        })
      ).toBe(true)
    }
  })

  test('does not validate incorrect signature', () => {
    expect(
      nano.verifyBlock({
        hash: RANDOM_VALID_BLOCK.block.hash,
        signature: INVALID_SIGNATURE,
        publicKey: RANDOM_VALID_BLOCK.publicKey,
      })
    ).toBe(false)
  })

  test('throws with invalid hashes', () => {
    expect.assertions(INVALID_HASHES.length)
    for (const invalidHash of INVALID_HASHES) {
      expect(() =>
        nano.verifyBlock({
          hash: invalidHash,
          signature: RANDOM_VALID_BLOCK.block.data.signature,
          publicKey: RANDOM_VALID_BLOCK.publicKey,
        })
      ).toThrowError('Hash is not valid')
    }
  })

  test('throws with invalid signatures', () => {
    expect.assertions(INVALID_SIGNATURES.length)
    for (const invalidSignature of INVALID_SIGNATURES) {
      expect(() =>
        nano.verifyBlock({
          hash: RANDOM_VALID_BLOCK.block.hash,
          signature: invalidSignature,
          publicKey: RANDOM_VALID_BLOCK.publicKey,
        })
      ).toThrowError('Signature is not valid')
    }
  })

  test('throws with invalid public keys', () => {
    expect.assertions(INVALID_PUBLIC_KEYS.length)
    for (const invalidPublicKey of INVALID_PUBLIC_KEYS) {
      expect(() =>
        nano.verifyBlock({
          hash: RANDOM_VALID_BLOCK.block.hash,
          signature: RANDOM_VALID_BLOCK.block.data.signature,
          publicKey: invalidPublicKey,
        })
      ).toThrowError('Public key is not valid')
    }
  })
})
