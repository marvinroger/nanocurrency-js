/*!
 * nanocurrency-js: A toolkit for the Nano cryptocurrency.
 * Copyright (c) 2018 Marvin ROGER <dev at marvinroger dot fr>
 * Licensed under GPL-3.0 (https://git.io/vAZsK)
 */
import { blake2b, blake2bInit, blake2bUpdate, blake2bFinal } from 'blakejs'

import { checkSeed, checkKey, checkAddress } from './check'
import { derivePublicFromSecret } from './nacl'
import {
  getRandomBytes,
  hexToByteArray,
  byteArrayToHex,
  byteArrayToBase32,
  base32ToByteArray
} from './utils'

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
 * Does not require initialization.
 *
 * @param {string} seed - The seed to generate the secret key from, in hexadecimal format
 * @param {number} index - The index to generate the secret key from
 * @return {string} Secret key, in hexadecimal format
 */
export function deriveSecretKey (seed, index) {
  if (!checkSeed(seed)) throw new Error('Seed is not valid')
  if (!Number.isInteger(index) || index < 0) {
    throw new Error('Index is not valid')
  }

  const seedBytes = hexToByteArray(seed)
  const indexBuffer = new ArrayBuffer(4)
  const indexView = new DataView(indexBuffer)
  indexView.setUint32(0, index)
  const indexBytes = new Uint8Array(indexBuffer)

  const context = blake2bInit(32)
  blake2bUpdate(context, seedBytes)
  blake2bUpdate(context, indexBytes)
  const secretKeyBytes = blake2bFinal(context)

  return byteArrayToHex(secretKeyBytes)
}

/**
 * Derive a public key from a secret key.
 * Does not require initialization.
 *
 * @param {string} secretKeyOrAddress - The secret key or address to generate the public key from, in hexadecimal or address format
 * @return {string} Public key, in hexadecimal format
 */
export function derivePublicKey (secretKeyOrAddress) {
  const isSecretKey = checkKey(secretKeyOrAddress)
  const isAddress = checkAddress(secretKeyOrAddress)
  if (!isSecretKey && !isAddress) {
    throw new Error('Secret key or address is not valid')
  }

  if (isSecretKey) {
    const secretKeyBytes = hexToByteArray(secretKeyOrAddress)
    const publicKeyBytes = derivePublicFromSecret(secretKeyBytes)

    return byteArrayToHex(publicKeyBytes)
  } else if (isAddress) {
    const publicKeyPart = secretKeyOrAddress.substr(4, 52) + '1'
    const paddedPublicKeyBytes = base32ToByteArray(publicKeyPart)
    const publicKeyHex = byteArrayToHex(paddedPublicKeyBytes).substr(1, 64)

    return publicKeyHex
  }
}

/**
 * Derive address from a public key.
 * Does not require initialization.
 *
 * @param {string} publicKey - The public key to generate the address from, in hexadecimal format
 * @return {string} Address
 */
export function deriveAddress (publicKey) {
  if (!checkKey(publicKey)) throw new Error('Public key is not valid')

  const publicKeyBytes = hexToByteArray(publicKey)
  const paddedPublicKeyBytes = hexToByteArray('0' + publicKey + '0')

  const encodedPublicKey = byteArrayToBase32(paddedPublicKeyBytes).slice(0, -1)

  const checksum = blake2b(publicKeyBytes, null, 5).reverse()

  const encodedChecksum = byteArrayToBase32(checksum)

  return 'xrb_' + encodedPublicKey + encodedChecksum
}
