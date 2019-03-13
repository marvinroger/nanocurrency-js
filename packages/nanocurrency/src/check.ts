/*!
 * nanocurrency-js: A toolkit for the Nano cryptocurrency.
 * Copyright (c) 2018 Marvin ROGER <dev at marvinroger dot fr>
 * Licensed under GPL-3.0 (https://git.io/vAZsK)
 */
import BigNumber from 'bignumber.js';

import { parseAddress } from './parse';

const MAX_AMOUNT = new BigNumber('0xffffffffffffffffffffffffffffffff');

/** @hidden */
export function checkString(candidate: any) {
  return typeof candidate === 'string';
}

/** @hidden */
export function checkNumber(candidate: any) {
  if (!checkString(candidate)) return false;
  if (candidate.startsWith('.') || candidate.endsWith('.')) return false;

  const numberWithoutDot = candidate.replace('.', '');
  // more than one '.'
  if (candidate.length - numberWithoutDot.length > 1) return false;
  for (const char of numberWithoutDot) {
    if (char < '0' || char > '9') return false;
  }

  return true;
}

/**
 * Check if the given amount is valid.
 *
 * **Note:** a valid amount means that it can be embedded into a block `balance`.
 *
 * @param amount - The amount to check
 * @returns Valid
 */
export function checkAmount(amount: string) {
  if (amount === '0') return true;
  if (!checkString(amount) || !/^[1-9]{1}[0-9]{0,38}$/.test(amount)) return false;

  const candidate = new BigNumber(amount);

  return candidate.isLessThanOrEqualTo(MAX_AMOUNT);
}

/**
 * Check if the given seed is valid.
 *
 * **Note:** it only checks the format of the seed.
 *
 * @param seed - The seed to check
 * @returns Valid
 */
export function checkSeed(seed: string) {
  return checkString(seed) && /^[0-9a-fA-F]{64}$/.test(seed);
}

/**
 * Check if the given hash is valid.
 *
 * **Note:** it only checks the format of the hash.
 *
 * @param hash - The hash to check
 * @returns Valid
 */
export function checkHash(hash: string) {
  return checkSeed(hash);
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
export function checkKey(key: string) {
  return checkSeed(key);
}

/**
 * Check if the given address is valid.
 *
 * **Note:** it checks the format and the checksum of the address.
 * It does not check whether or not the address does exist on the network.
 *
 * @param address - The address to check
 * @returns Valid
 */
export function checkAddress(address: string) {
  const parseResult = parseAddress(address);

  return parseResult.valid;
}

/**
 * Check if the given work is valid.
 *
 * **Note:** it only checks the format of the work, not its difficulty.
 *
 * @param work - The work to check
 * @returns Valid
 */
export function checkWork(work: string) {
  return checkString(work) && /^[0-9a-fA-F]{16}$/.test(work);
}

/**
 * Check if the given signature is valid.
 *
 * **Note:** it only checks the format of the signature.
 *
 * @param signature - The signature to check
 * @returns Valid
 */
export function checkSignature(signature: string) {
  return checkString(signature) && /^[0-9a-fA-F]{128}$/.test(signature);
}
