/*!
 * nanocurrency-js: A toolkit for the Nano cryptocurrency.
 * Copyright (c) 2018 Marvin ROGER <dev at marvinroger dot fr>
 * Licensed under GPL-3.0 (https://git.io/vAZsK)
 */
import { checkAddress, checkAmount, checkHash, checkKey } from './check'

import { deriveAddress, derivePublicKey } from './keys'

import { hashBlock } from './hash'

import { signBlock } from './signature'

/** State block data. */
export interface BlockData {
  /** The PoW. You can give it a `null` if you want to fill this field later */
  work: string | null
  /** The hash of the previous block on the account chain, in hexadecimal format */
  previous: string
  /** The representative address */
  representative: string
  /** The resulting balance */
  balance: string
  /** The link block hash or the link address, in hexadecimal or address format */
  link: string
}

/** State block representation. */
export interface BlockRepresentation {
  type: 'state'
  account: string
  previous: string
  representative: string
  balance: string
  link: string
  link_as_account: string
  work: string | null
  signature: string
}

/** State block. */
export interface Block {
  /** The block hash */
  hash: string
  /** The block representation */
  block: BlockRepresentation
}

/**
 * Create a state block.
 *
 * @param secretKey - The secret key to create the block from, in hexadecimal format
 * @param data - Block data
 * @returns Block
 */
export function createBlock(secretKey: string, data: BlockData): Block {
  if (!checkKey(secretKey)) throw new Error('Secret key is not valid')
  if (typeof data.work === 'undefined') throw new Error('Work is not set')
  if (!checkHash(data.previous)) throw new Error('Previous is not valid')
  if (!checkAddress(data.representative)) {
    throw new Error('Representative is not valid')
  }
  if (!checkAmount(data.balance)) throw new Error('Balance is not valid')
  let linkIsAddress = false
  if (checkAddress(data.link)) linkIsAddress = true
  else if (!checkHash(data.link)) throw new Error('Link is not valid')

  const publicKey = derivePublicKey(secretKey)
  const account = deriveAddress(publicKey)
  const hash = hashBlock({
    account,
    previous: data.previous,
    representative: data.representative,
    balance: data.balance,
    link: data.link,
  })
  const signature = signBlock({ hash, secretKey })

  let link
  let linkAsAddress
  if (linkIsAddress) {
    linkAsAddress = data.link
    link = derivePublicKey(linkAsAddress)
  } else {
    link = data.link
    linkAsAddress = deriveAddress(link)
  }

  const block: BlockRepresentation = {
    type: 'state',
    account,
    previous: data.previous,
    representative: data.representative,
    balance: data.balance,
    link,
    // eslint-disable-next-line @typescript-eslint/camelcase
    link_as_account: linkAsAddress,
    work: data.work,
    signature,
  }

  return {
    hash,
    block,
  }
}
