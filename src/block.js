/*!
 * nanocurrency-js: A toolkit for the Nano cryptocurrency.
 * Copyright (c) 2018 Marvin ROGER <dev at marvinroger dot fr>
 * Licensed under GPL-3.0 (https://git.io/vAZsK)
 */
import BigNumber from 'bignumber.js'

import {
  checkKey,
  checkHash,
  checkAddress,
  checkBalance
} from './common'

import { derivePublicKey, deriveAddress } from './keys'

import {
  hashOpenBlock,
  hashSendBlock,
  hashReceiveBlock,
  hashChangeBlock
} from './hash'

import { signBlock } from './signature'

/**
 * Create an open block.
 * Does not require initialization.
 *
 * @param {string} secretKey - The secret key to create the block from, in hexadecimal format
 * @param {Object} data - Block data
 * @param {string} data.work - The PoW
 * @param {string} data.source - The hash of the send block that is being received, in hexadecimal format
 * @param {string} data.representative - The representative address
 * @return {Object} Block
 */
export function createOpenBlock (secretKey, { work, source, representative }) {
  if (!checkKey(secretKey)) throw new Error('Secret key is not valid')
  if (typeof work === 'undefined') work = null // TODO(breaking): Ensure work is set
  if (!checkHash(source)) throw new Error('Source is not valid')
  if (!checkAddress(representative)) {
    throw new Error('Representative is not valid')
  }

  const previous = derivePublicKey(secretKey)
  const account = deriveAddress(previous)
  const hash = hashOpenBlock(source, representative, account)
  const signature = signBlock(hash, secretKey)

  return {
    hash,
    block: {
      type: 'open',
      source,
      representative,
      account,
      work,
      signature
    }
  }
}

/**
 * Create a receive block.
 * Does not require initialization.
 *
 * @param {string} secretKey - The secret key to create the block from, in hexadecimal format
 * @param {Object} data - Block data
 * @param {string} data.work - The PoW
 * @param {string} data.previous - The hash of the previous block on the account chain, in hexadecimal format
 * @param {string} data.source - The hash of the send block that is being received, in hexadecimal format
 * @return {Object} Block
 */
export function createReceiveBlock (secretKey, { work, previous, source }) {
  if (!checkKey(secretKey)) throw new Error('Secret key is not valid')
  if (typeof work === 'undefined') work = null // TODO(breaking): Ensure work is set
  if (!checkHash(previous)) throw new Error('Previous is not valid')
  if (!checkHash(source)) throw new Error('Source is not valid')

  const hash = hashReceiveBlock(previous, source)
  const signature = signBlock(hash, secretKey)

  return {
    hash,
    block: {
      type: 'receive',
      previous,
      source,
      work,
      signature
    }
  }
}

/**
 * Create a send block.
 * Does not require initialization.
 *
 * @param {string} secretKey - The secret key to create the block from, in hexadecimal format
 * @param {Object} data - Block data
 * @param {string} data.work - The PoW
 * @param {string} data.previous - The hash of the previous block on the account chain, in hexadecimal format
 * @param {string} data.destination - The destination address
 * @param {string} data.balance - The balance, in raw
 * @return {Object} Block
 */
export function createSendBlock (
  secretKey,
  { work, previous, destination, balance }
) {
  if (!checkKey(secretKey)) throw new Error('Secret key is not valid')
  if (typeof work === 'undefined') work = null // TODO(breaking): Ensure work is set
  if (!checkHash(previous)) throw new Error('Previous is not valid')
  if (!checkAddress(destination)) throw new Error('Destination is not valid')
  if (!checkBalance(balance)) throw new Error('Balance is not valid')

  const hash = hashSendBlock(previous, destination, balance)
  const signature = signBlock(hash, secretKey)
  const balanceHex = (new BigNumber(balance)).toString(16).padStart(32, '0')

  return {
    hash,
    block: {
      type: 'send',
      previous,
      destination,
      balance: balanceHex,
      work,
      signature
    }
  }
}

/**
 * Create a change block.
 * Does not require initialization.
 *
 * @param {string} secretKey - The secret key to create the block from, in hexadecimal format
 * @param {Object} data - Block data
 * @param {string} data.work - The PoW
 * @param {string} data.previous - The hash of the previous block on the account chain, in hexadecimal format
 * @param {string} data.representative - The representative address
 * @return {Object} Block
 */
export function createChangeBlock (
  secretKey,
  { work, previous, representative }
) {
  if (!checkKey(secretKey)) throw new Error('Secret key is not valid')
  if (typeof work === 'undefined') work = null // TODO(breaking): Ensure work is set
  if (!checkHash(previous)) throw new Error('Previous is not valid')
  if (!checkAddress(representative)) {
    throw new Error('Representative is not valid')
  }

  const hash = hashChangeBlock(previous, representative)
  const signature = signBlock(hash, secretKey)

  return {
    hash,
    block: {
      type: 'change',
      previous,
      representative,
      work,
      signature
    }
  }
}
