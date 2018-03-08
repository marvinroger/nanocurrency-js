/*!
 * nanocurrency-js: A toolkit for the Nano cryptocurrency.
 * Copyright (c) 2018 Marvin ROGER <dev at marvinroger dot fr>
 * Licensed under GPL-3.0 (https://git.io/vAZsK)
 */
import {
  C_BINDING,
  checkNotInitialized,
  checkKey,
  checkHash,
  checkSignature
} from './common'

/**
 * Sign a block.
 * Requires initialization.
 *
 * @param {string} blockHash - The hash of the block to sign
 * @param {string} secretKey - The secret key to sign the block with, in hexadecimal format
 * @return {string} Signature, in hexadecimal format
 */
export function signBlock (blockHash, secretKey) {
  checkNotInitialized()

  if (!checkHash(blockHash)) throw new Error('Hash is not valid')
  if (!checkKey(secretKey)) throw new Error('Secret key is not valid')

  return C_BINDING.signBlock(blockHash, secretKey)
}

/**
 * Verify a block against a public key.
 * Requires initialization.
 *
 * @param {string} blockHash - The hash of the block to verify
 * @param {string} signature - The signature of the block to verify, in hexadecimal format
 * @param {string} publicKey - The public key to verify the block against, in hexadecimal format
 * @return {boolean} Valid
 */
export function verifyBlock (blockHash, signature, publicKey) {
  checkNotInitialized()

  if (!checkHash(blockHash)) throw new Error('Hash is not valid')
  if (!checkSignature(signature)) throw new Error('Signature is not valid')
  if (!checkKey(publicKey)) throw new Error('Public key is not valid')

  const valid = C_BINDING.verifyBlock(blockHash, signature, publicKey) === 1

  return valid
}
