/*!
 * nanocurrency-js: A toolkit for the Nano cryptocurrency.
 * Copyright (c) 2018 Marvin ROGER <dev at marvinroger dot fr>
 * Licensed under GPL-3.0 (https://git.io/vAZsK)
 */
import { C_BINDING, checkNotInitialized, checkSeed, checkKey } from './common'

import { getRandomBytes } from './helpers'

/**
 * Generate a cryptographically secure seed.
 * Does not require initialization.
 *
 * @return {Promise<string>} Seed, in hexadecimal format
 */
export function generateSeed () {
  return new Promise((resolve, reject) => {
    getRandomBytes(32)
      .then(seed => {
        const seedHex = seed.reduce(function (hex, i) {
          return hex + ('0' + i.toString(16)).slice(-2)
        }, '')

        resolve(seedHex)
      })
      .catch(reject)
  })
}

/**
 * Derive a secret key from a seed, given an index.
 * Requires initialization.
 *
 * @param {string} seed - The seed to generate the secret key from, in hexadecimal format
 * @param {number} index - The index to generate the secret key from
 * @return {string} Secret key, in hexadecimal format
 */
export function deriveSecretKey (seed, index) {
  checkNotInitialized()

  if (!checkSeed(seed)) throw new Error('Seed is not valid')
  if (!Number.isInteger(index) || index < 0) {
    throw new Error('Index is not valid')
  }

  return C_BINDING.deriveSecretKey(seed, index)
}

/**
 * Derive a public key from a secret key.
 * Requires initialization.
 *
 * @param {string} secretKey - The secret key to generate the secret key from, in hexadecimal format
 * @return {string} Public key, in hexadecimal format
 */
export function derivePublicKey (secretKey) {
  checkNotInitialized()

  if (!checkKey(secretKey)) throw new Error('Secret key is not valid')

  return C_BINDING.derivePublicKey(secretKey)
}

/**
 * Derive address from a public key.
 * Requires initialization.
 *
 * @param {string} publicKey - The public key to generate the address from, in hexadecimal format
 * @return {string} Address
 */
export function deriveAddress (publicKey) {
  checkNotInitialized()

  if (!checkKey(publicKey)) throw new Error('Public key is not valid')

  return C_BINDING.deriveAddress(publicKey)
}
