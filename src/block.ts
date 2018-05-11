/*!
 * nanocurrency-js: A toolkit for the Nano cryptocurrency.
 * Copyright (c) 2018 Marvin ROGER <dev at marvinroger dot fr>
 * Licensed under GPL-3.0 (https://git.io/vAZsK)
 */
import { checkAddress, checkBalance, checkHash, checkKey } from './check'

import { convert, NanoUnit } from './conversion'

import { deriveAddress, derivePublicKey } from './keys'

import {
  hashChangeBlock,
  hashOpenBlock,
  hashReceiveBlock,
  hashSendBlock,
  hashStateBlock
} from './hash'

import { signBlock } from './signature'

/** Open block data. */
export interface OpenBlockData {
  /** The PoW */
  work?: string | null
  /** The hash of the send block that is being received, in hexadecimal format */
  source: string
  /** The representative address */
  representative: string
}

/**
 * Create an open block.
 * Does not require initialization.
 *
 * @param secretKey - The secret key to create the block from, in hexadecimal format
 * @param data - Block data
 * @returns Block
 */
export function createOpenBlock (secretKey: string, data: OpenBlockData) {
  if (!checkKey(secretKey)) throw new Error('Secret key is not valid')
  let work = data.work
  if (typeof work === 'undefined') work = null // TODO(breaking): Ensure work is set
  if (!checkHash(data.source)) throw new Error('Source is not valid')
  if (!checkAddress(data.representative)) {
    throw new Error('Representative is not valid')
  }

  const previous = derivePublicKey(secretKey)
  const account = deriveAddress(previous)
  const hash = hashOpenBlock(data.source, data.representative, account)
  const signature = signBlock(hash, secretKey)

  return {
    hash,
    block: {
      type: 'open',
      source: data.source,
      representative: data.representative,
      account,
      work,
      signature
    }
  }
}

/** Receive block data. */
export interface ReceiveBlockData {
  /** The PoW */
  work?: string | null
  /** The hash of the previous block on the account chain, in hexadecimal format */
  previous: string
  /** The hash of the send block that is being received, in hexadecimal format */
  source: string
}

/**
 * Create a receive block.
 * Does not require initialization.
 *
 * @param secretKey - The secret key to create the block from, in hexadecimal format
 * @param data - Block data
 * @returns Block
 */
export function createReceiveBlock (secretKey: string, data: ReceiveBlockData) {
  if (!checkKey(secretKey)) throw new Error('Secret key is not valid')
  let work = data.work
  if (typeof work === 'undefined') work = null // TODO(breaking): Ensure work is set
  if (!checkHash(data.previous)) throw new Error('Previous is not valid')
  if (!checkHash(data.source)) throw new Error('Source is not valid')

  const hash = hashReceiveBlock(data.previous, data.source)
  const signature = signBlock(hash, secretKey)

  return {
    hash,
    block: {
      type: 'receive',
      previous: data.previous,
      source: data.source,
      work,
      signature
    }
  }
}

/** Send block data. */
export interface SendBlockData {
  /** The PoW */
  work?: string | null
  /** The hash of the previous block on the account chain, in hexadecimal format */
  previous: string
  /** The destination address */
  destination: string
  /** The balance, in raw */
  balance: string
}

/**
 * Create a send block.
 * Does not require initialization.
 *
 * @param secretKey - The secret key to create the block from, in hexadecimal format
 * @param data - Block data
 * @returns Block
 */
export function createSendBlock (secretKey: string, data: SendBlockData) {
  if (!checkKey(secretKey)) throw new Error('Secret key is not valid')
  let work = data.work
  if (typeof work === 'undefined') work = null // TODO(breaking): Ensure work is set
  if (!checkHash(data.previous)) throw new Error('Previous is not valid')
  if (!checkAddress(data.destination)) {
    throw new Error('Destination is not valid')
  }
  if (!checkBalance(data.balance)) throw new Error('Balance is not valid')

  const hash = hashSendBlock(data.previous, data.destination, data.balance)
  const signature = signBlock(hash, secretKey)
  const balanceHex = convert(data.balance, {
    from: NanoUnit.raw,
    to: NanoUnit.hex
  })

  return {
    hash,
    block: {
      type: 'send',
      previous: data.previous,
      destination: data.destination,
      balance: balanceHex,
      work,
      signature
    }
  }
}

/** Change block data. */
export interface ChangeBlockData {
  /** The PoW */
  work?: string | null
  /** The hash of the previous block on the account chain, in hexadecimal format */
  previous: string
  /** The destination address */
  representative: string
}

/**
 * Create a change block.
 * Does not require initialization.
 *
 * @param secretKey - The secret key to create the block from, in hexadecimal format
 * @param data - Block data
 * @returns Block
 */
export function createChangeBlock (secretKey: string, data: ChangeBlockData) {
  if (!checkKey(secretKey)) throw new Error('Secret key is not valid')
  let work = data.work
  if (typeof work === 'undefined') work = null // TODO(breaking): Ensure work is set
  if (!checkHash(data.previous)) throw new Error('Previous is not valid')
  if (!checkAddress(data.representative)) {
    throw new Error('Representative is not valid')
  }

  const hash = hashChangeBlock(data.previous, data.representative)
  const signature = signBlock(hash, secretKey)

  return {
    hash,
    block: {
      type: 'change',
      previous: data.previous,
      representative: data.representative,
      work,
      signature
    }
  }
}

/** State block data. */
export interface StateBlockData {
  /** The PoW */
  work?: string | null
  /** The hash of the previous block on the account chain, in hexadecimal format */
  previous: string
  /** The destination address */
  representative: string
  /** The resulting balance */
  balance: string
  /** The link block hash or the link address, in hexadecimal or address format */
  link: string
}

/**
 * Create a state block.
 * Does not require initialization.
 *
 * @param secretKey - The secret key to create the block from, in hexadecimal format
 * @param data - Block data
 * @returns Block
 */
export function createStateBlock (secretKey: string, data: StateBlockData) {
  if (!checkKey(secretKey)) throw new Error('Secret key is not valid')
  let work = data.work
  if (typeof work === 'undefined') work = null // TODO(breaking): Ensure work is set
  if (!checkHash(data.previous)) throw new Error('Previous is not valid')
  if (!checkAddress(data.representative)) {
    throw new Error('Representative is not valid')
  }
  if (!checkBalance(data.balance)) throw new Error('Balance is not valid')
  let linkIsAddress = false
  if (checkAddress(data.link)) linkIsAddress = true
  else if (!checkHash(data.link)) throw new Error('Link is not valid')

  const publicKey = derivePublicKey(secretKey)
  const account = deriveAddress(publicKey)
  const hash = hashStateBlock(
    account,
    data.previous,
    data.representative,
    data.balance,
    data.link
  )
  const signature = signBlock(hash, secretKey)

  let link
  let linkAsAddress
  if (linkIsAddress) {
    linkAsAddress = data.link
    link = derivePublicKey(linkAsAddress)
  } else {
    link = data.link
    linkAsAddress = deriveAddress(link)
  }

  const block = {
    type: 'state',
    account,
    previous: data.previous,
    representative: data.representative,
    balance: data.balance,
    link,
    link_as_account: linkAsAddress,
    work,
    signature
  }

  return {
    hash,
    block
  }
}
