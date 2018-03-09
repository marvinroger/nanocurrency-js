/*!
 * nanocurrency-js: A toolkit for the Nano cryptocurrency.
 * Copyright (c) 2018 Marvin ROGER <dev at marvinroger dot fr>
 * Licensed under GPL-3.0 (https://git.io/vAZsK)
 */
import {
  C_BINDING,
  checkNotInitialized,
  checkHash,
  checkAddress,
  checkBalance
} from './common'

/**
 * Hash a receive block.
 * Requires initialization.
 *
 * @param {string} previous - The hash of the previous block on the account chain, in hexadecimal format
 * @param {string} source - The hash of the send block that is being received, in hexadecimal format
 * @return {string} Hash, in hexadecimal format
 */
export function hashReceiveBlock (previous, source) {
  checkNotInitialized()

  if (!checkHash(previous)) throw new Error('Previous is not valid')
  if (!checkHash(source)) throw new Error('Source is not valid')

  return C_BINDING.hashReceiveBlock(previous, source)
}

/**
 * Hash an open block.
 * Requires initialization.
 *
 * @param {string} source - The hash of the send block that is being received, in hexadecimal format
 * @param {string} representative - The representative address
 * @param {string} account - The account address
 * @return {string} Hash, in hexadecimal format
 */
export function hashOpenBlock (source, representative, account) {
  checkNotInitialized()

  if (!checkHash(source)) throw new Error('Source is not valid')
  if (!checkAddress(representative)) {
    throw new Error('Representative is not valid')
  }
  if (!checkAddress(account)) throw new Error('Account is not valid')

  return C_BINDING.hashOpenBlock(source, representative, account)
}

/**
 * Hash a change block.
 * Requires initialization.
 *
 * @param {string} previous - The hash of the previous block on the account chain, in hexadecimal format
 * @param {string} representative - The representative address
 * @return {string} Hash, in hexadecimal format
 */
export function hashChangeBlock (previous, representative) {
  checkNotInitialized()

  if (!checkHash(previous)) throw new Error('Previous is not valid')
  if (!checkAddress(representative)) {
    throw new Error('Representative is not valid')
  }

  return C_BINDING.hashChangeBlock(previous, representative)
}

/**
 * Hash a send block.
 * Requires initialization.
 *
 * @param {string} previous - The hash of the previous block on the account chain, in hexadecimal format
 * @param {string} destination - The destination address
 * @param {string} balance - The balance, in raw
 * @return {string} Hash, in hexadecimal format
 */
export function hashSendBlock (previous, destination, balance) {
  checkNotInitialized()

  if (!checkHash(previous)) throw new Error('Previous is not valid')
  if (!checkAddress(destination)) throw new Error('Destination is not valid')
  if (!checkBalance(balance)) throw new Error('Balance is not valid')

  return C_BINDING.hashSendBlock(previous, destination, balance)
}
