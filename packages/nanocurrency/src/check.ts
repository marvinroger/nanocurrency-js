/*!
 * nanocurrency-js: A toolkit for the Nano cryptocurrency.
 * Copyright (c) 2021 Marvin ROGER <bonjour+code at marvinroger dot fr>
 * Licensed under GPL-3.0 (https://git.io/vAZsK)
 */
const MIN_INDEX = 0
const MAX_INDEX = Math.pow(2, 32) - 1
const MAX_AMOUNT = 0xffffffffffffffffffffffffffffffffn
const MIN_THRESHOLD = 0n
const MAX_THRESHOLD = 0xffffffffffffffffn

/** @hidden */
export function checkString(candidate: {}): boolean {
  return typeof candidate === 'string'
}

/** @hidden */
export function checkNumber(candidate: string): boolean {
  if (candidate.startsWith('.') || candidate.endsWith('.')) return false

  const numberWithoutDot = candidate.replace(/\./g, '')
  const moreThanOneDot = candidate.length - numberWithoutDot.length > 1
  if (moreThanOneDot) return false

  return numberWithoutDot.split('').every(char => char >= '0' && char <= '9')
}

/**
 * Check if the given amount is valid.
 *
 * **Note:** a valid amount means that it can be embedded into a block `balance`.
 *
 * @param amount - The amount to check
 * @returns Valid
 */
export function checkAmount(amount: string): boolean {
  if (amount === '0') return true
  if (!checkString(amount) || !/^[1-9]{1}[0-9]{0,38}$/.test(amount))
    return false

  const candidate = BigInt(amount)

  return candidate <= MAX_AMOUNT
}

/**
 * Check if the given seed is valid.
 *
 * **Note:** it only checks the format of the seed.
 *
 * @param seed - The seed to check
 * @returns Valid
 */
export function checkSeed(seed: string): boolean {
  return checkString(seed) && /^[0-9a-fA-F]{64}$/.test(seed)
}

/**
 * Check if the given threshold is valid.
 *
 * **Note:** it only checks the format of the threshold.
 *
 * @param threshold - The threshold to check
 * @returns Valid
 */
export function checkThreshold(threshold: bigint): boolean {
  return threshold >= MIN_THRESHOLD && threshold <= MAX_THRESHOLD
}

/**
 * Check if the given index is valid.
 *
 * **Note:** it only checks the format of the index.
 *
 * @param index- The index to check
 * @returns Valid
 */
export function checkIndex(index: number): boolean {
  return Number.isInteger(index) && index >= MIN_INDEX && index <= MAX_INDEX
}

/**
 * Check if the given hash is valid.
 *
 * **Note:** it only checks the format of the hash.
 *
 * @param hash - The hash to check
 * @returns Valid
 */
export function checkHash(hash: string): boolean {
  return checkSeed(hash)
}

/**
 * Check if the given public or secret key is valid.
 *
 * **Note:** it only checks the format of the key.
 * It does not check whether or not the key does exist on the network.
 *
 * @param key - The key to check
 * @returns Valid
 */
export function checkKey(key: string): boolean {
  return checkSeed(key)
}

/**
 * Check if the given work is valid.
 *
 * **Note:** it only checks the format of the work, not its difficulty.
 *
 * @param work - The work to check
 * @returns Valid
 */
export function checkWork(work: string): boolean {
  return checkString(work) && /^[0-9a-fA-F]{16}$/.test(work)
}

/**
 * Check if the given signature is valid.
 *
 * **Note:** it only checks the format of the signature.
 *
 * @param signature - The signature to check
 * @returns Valid
 */
export function checkSignature(signature: string): boolean {
  return checkString(signature) && /^[0-9a-fA-F]{128}$/.test(signature)
}
