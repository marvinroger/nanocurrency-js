/*!
 * nanocurrency-js: A toolkit for the Nano cryptocurrency.
 * Copyright (c) 2018 Marvin ROGER <dev at marvinroger dot fr>
 * Licensed under GPL-3.0 (https://git.io/vAZsK)
 */
import { blake2b, blake2bFinal, blake2bInit, blake2bUpdate } from 'blakejs'
import nanoBase32 from 'nano-base32'

import { checkAddress, checkKey, checkSeed } from './check'
import { derivePublicFromSecret } from './nacl'
import { byteArrayToHex, getRandomBytes, hexToByteArray } from './utils'

/**
 * Generate a cryptographically secure seed.
 * Does not require initialization.
 *
 * @returns Promise fulfilled with seed, in hexadecimal format
 */
export function generateSeed (): Promise<string> {
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
 * @param seed - The seed to generate the secret key from, in hexadecimal format
 * @param index - The index to generate the secret key from
 * @returns Secret key, in hexadecimal format
 */
export function deriveSecretKey (seed: string, index: number) {
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
 * @param secretKeyOrAddress - The secret key or address to generate the public key from, in hexadecimal or address format
 * @returns Public key, in hexadecimal format
 */
export function derivePublicKey (secretKeyOrAddress: string) {
  const isSecretKey = checkKey(secretKeyOrAddress)
  const isAddress = checkAddress(secretKeyOrAddress)
  if (!isSecretKey && !isAddress) {
    throw new Error('Secret key or address is not valid')
  }

  let publicKeyBytes: Uint8Array
  if (isSecretKey) {
    const secretKeyBytes = hexToByteArray(secretKeyOrAddress)
    publicKeyBytes = derivePublicFromSecret(secretKeyBytes)
  } else if (isAddress) {
    publicKeyBytes = nanoBase32.decode(secretKeyOrAddress.substr(4, 52))
  }

  return byteArrayToHex(publicKeyBytes)
}

/**
 * Derive address from a public key.
 * Does not require initialization.
 *
 * @param publicKey - The public key to generate the address from, in hexadecimal format
 * @returns Address
 */
export function deriveAddress (publicKey: string) {
  if (!checkKey(publicKey)) throw new Error('Public key is not valid')

  const publicKeyBytes = hexToByteArray(publicKey)
  const paddedPublicKeyBytes = hexToByteArray(publicKey)

  const encodedPublicKey = nanoBase32.encode(paddedPublicKeyBytes)

  const checksum = blake2b(publicKeyBytes, null, 5).reverse()

  const encodedChecksum = nanoBase32.encode(checksum)

  return 'xrb_' + encodedPublicKey + encodedChecksum
}
