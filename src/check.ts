/*!
 * nanocurrency-js: A toolkit for the Nano cryptocurrency.
 * Copyright (c) 2018 Marvin ROGER <dev at marvinroger dot fr>
 * Licensed under GPL-3.0 (https://git.io/vAZsK)
 */
import { blake2b } from 'blakejs'
import nanoBase32 from 'nano-base32'

import { compareArrays } from './utils'

/** @hidden */
export function checkString (candidate: any) {
  return typeof candidate === 'string'
}

/** @hidden */
export function checkNumber (candidate: any) {
  if (!checkString(candidate)) return false
  if (candidate.startsWith('.') || candidate.endsWith('.')) return false

  const numberWithoutDot = candidate.replace('.', '')
  // more than one '.'
  if (candidate.length - numberWithoutDot.length > 1) return false
  for (const char of numberWithoutDot) {
    if (char < '0' || char > '9') return false
  }

  return true
}

/**
 * Check if the given balance is valid.
 * Does not require initialization.
 *
 * @param balance - The balance to check
 * @returns Valid
 */
export function checkBalance (balance: any) {
  // TODO(breaking): checkAmount instead
  if (!checkString(balance) || balance.length > 39) return false
  for (const char of balance) {
    if (char < '0' || char > '9') return false
  }

  return true
}

/**
 * Check if the given seed is valid.
 * Does not require initialization.
 *
 * @param seed - The seed to check
 * @returns Valid
 */
export function checkSeed (seed: any) {
  return checkString(seed) && /[0-9a-fA-F]{64}/.test(seed)
}

/**
 * Check if the given hash is valid.
 * Does not require initialization.
 *
 * @param hash - The hash to check
 * @returns Valid
 */
export function checkHash (hash: any) {
  return checkSeed(hash)
}

/**
 * Check if the given public or secret key is valid.
 * Does not require initialization.
 *
 * @param key - The key to check
 * @returns Valid
 */
export function checkKey (key: any) {
  return checkSeed(key)
}

/**
 * Check if the given address is valid.
 * Does not require initialization.
 *
 * @param address - The address to check
 * @returns Valid
 */
export function checkAddress (address: any) {
  if (!checkString(address) || !/xrb_[13][0-9a-km-uw-z]{59}/.test(address)) {
    return false
  }

  const publicKeyBytes = nanoBase32.decode(address.substr(4, 52))
  const checksumBytes = nanoBase32.decode(address.substr(56, 8))

  const computedChecksumBytes = blake2b(publicKeyBytes, null, 5).reverse()

  return compareArrays(checksumBytes, computedChecksumBytes)
}

/**
 * Check if the given work is valid.
 * Does not require initialization.
 *
 * @param work - The work to check
 * @returns Valid
 */
export function checkWork (work: any) {
  return checkString(work) && /[0-9a-fA-F]{16}/.test(work)
}

/**
 * Check if the given signature is valid.
 * Does not require initialization.
 *
 * @param signature - The signature to check
 * @returns Valid
 */
export function checkSignature (signature: any) {
  return checkString(signature) && /[0-9a-fA-F]{128}/.test(signature)
}
