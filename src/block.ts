/*!
 * nanocurrency-js: A toolkit for the Nano cryptocurrency.
 * Copyright (c) 2018 Marvin ROGER <dev at marvinroger dot fr>
 * Licensed under GPL-3.0 (https://git.io/vAZsK)
 */
import { checkKey, checkHash, checkAddress, checkBalance } from './check'

import { convert } from './conversion'

import { derivePublicKey, deriveAddress } from './keys'

import {
  hashOpenBlock,
  hashSendBlock,
  hashReceiveBlock,
  hashChangeBlock,
  hashStateBlock
} from './hash'

import { signBlock } from './signature'

/**
 * Create an open block.
 * Does not require initialization.
 *
 * @param secretKey - The secret key to create the block from, in hexadecimal format
 * @param data - Block data
 * @param data.work - The PoW
 * @param data.source - The hash of the send block that is being received, in hexadecimal format
 * @param data.representative - The representative address
 * @returns Block
 */
export function createOpenBlock (
  secretKey: string,
  {
    work,
    source,
    representative
  }: { work?: string | null; source: string; representative: string }
) {
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
 * @param secretKey - The secret key to create the block from, in hexadecimal format
 * @param data - Block data
 * @param data.work - The PoW
 * @param data.previous - The hash of the previous block on the account chain, in hexadecimal format
 * @param data.source - The hash of the send block that is being received, in hexadecimal format
 * @returns Block
 */
export function createReceiveBlock (
  secretKey: string,
  {
    work,
    previous,
    source
  }: { work?: string | null; previous: string; source: string }
) {
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
 * @param secretKey - The secret key to create the block from, in hexadecimal format
 * @param data - Block data
 * @param data.work - The PoW
 * @param data.previous - The hash of the previous block on the account chain, in hexadecimal format
 * @param data.destination - The destination address
 * @param data.balance - The balance, in raw
 * @returns Block
 */
export function createSendBlock (
  secretKey: string,
  {
    work,
    previous,
    destination,
    balance
  }: {
  work?: string | null
  previous: string
  destination: string
  balance: string
  }
) {
  if (!checkKey(secretKey)) throw new Error('Secret key is not valid')
  if (typeof work === 'undefined') work = null // TODO(breaking): Ensure work is set
  if (!checkHash(previous)) throw new Error('Previous is not valid')
  if (!checkAddress(destination)) throw new Error('Destination is not valid')
  if (!checkBalance(balance)) throw new Error('Balance is not valid')

  const hash = hashSendBlock(previous, destination, balance)
  const signature = signBlock(hash, secretKey)
  const balanceHex = convert(balance, { from: 'raw', to: 'hex' })

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
 * @param secretKey - The secret key to create the block from, in hexadecimal format
 * @param data - Block data
 * @param data.work - The PoW
 * @param data.previous - The hash of the previous block on the account chain, in hexadecimal format
 * @param data.representative - The representative address
 * @returns Block
 */
export function createChangeBlock (
  secretKey: string,
  {
    work,
    previous,
    representative
  }: { work?: string | null; previous: string; representative: string }
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

/**
 * Create a state block.
 * Does not require initialization.
 *
 * @param secretKey - The secret key to create the block from, in hexadecimal format
 * @param data - Block data
 * @param data.work - The PoW
 * @param data.previous - The hash of the previous block on the account chain, in hexadecimal format
 * @param data.representative - The representative address
 * @param data.balance - The resulting balance
 * @param data.link - The link block hash or the link address, in hexadecimal or address format
 * @returns Block
 */
export function createStateBlock (
  secretKey: string,
  {
    work,
    previous,
    representative,
    balance,
    link
  }: {
  work?: string | null
  previous: string
  representative: string
  balance: string
  link: string
  }
) {
  if (!checkKey(secretKey)) throw new Error('Secret key is not valid')
  if (typeof work === 'undefined') work = null // TODO(breaking): Ensure work is set
  if (!checkHash(previous)) throw new Error('Previous is not valid')
  if (!checkAddress(representative)) {
    throw new Error('Representative is not valid')
  }
  if (!checkBalance(balance)) throw new Error('Balance is not valid')
  let linkIsAddress = false
  if (checkAddress(link)) linkIsAddress = true
  else if (!checkHash(link)) throw new Error('Link is not valid')

  const publicKey = derivePublicKey(secretKey)
  const account = deriveAddress(publicKey)
  const hash = hashStateBlock(account, previous, representative, balance, link)
  const signature = signBlock(hash, secretKey)

  let linkAsAddress
  if (linkIsAddress) {
    linkAsAddress = link
    link = derivePublicKey(linkAsAddress)
  } else {
    linkAsAddress = deriveAddress(link)
  }

  const block = {
    type: 'state',
    account,
    previous,
    representative,
    balance,
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
