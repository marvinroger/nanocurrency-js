/*!
 * nanocurrency-js: A toolkit for the Nano cryptocurrency.
 * Copyright (c) 2021 Marvin ROGER <bonjour+code at marvinroger dot fr>
 * Licensed under GPL-3.0 (https://git.io/vAZsK)
 */
import { blake2bFinal, blake2bInit, blake2bUpdate } from 'blakejs'

import { checkAmount, checkHash } from './check'

import { convert, Unit } from './conversion'

import { byteArrayToHex, hexToByteArray } from './utils'

import { derivePublicKey } from './keys'
import { checkAddress } from './address'

const STATE_BLOCK_PREAMBLE_BYTES = new Uint8Array(32)
STATE_BLOCK_PREAMBLE_BYTES[31] = 6

/** Hash block parameters. */
export interface HashBlockParams {
  /** The account address */
  account: string
  /**
   * The hash of the previous block on the account chain, in hexadecimal format
   *
   * `0000000000000000000000000000000000000000000000000000000000000000` if `open` block.
   */
  previous: string
  /** The representative address */
  representative: string
  /** The resulting balance, in raw */
  balance: string
  /**
   * The account or block hash meant as a link, in address or hexadecimal format
   *
   * Read more on the [Official Nano Wiki](https://github.com/nanocurrency/raiblocks/wiki/Universal-Blocks-Specification)
   */
  link: string
}

/** @hidden */
export function unsafeHashBlock(params: HashBlockParams): string {
  const accountBytes = hexToByteArray(derivePublicKey(params.account))
  const previousBytes = hexToByteArray(params.previous)
  const representativeBytes = hexToByteArray(
    derivePublicKey(params.representative)
  )
  const balanceHex = convert(params.balance, { from: Unit.raw, to: Unit.hex })
  const balanceBytes = hexToByteArray(balanceHex)
  let linkBytes: Uint8Array
  if (checkAddress(params.link)) {
    linkBytes = hexToByteArray(derivePublicKey(params.link))
  } else {
    linkBytes = hexToByteArray(params.link)
  }

  const context = blake2bInit(32)
  blake2bUpdate(context, STATE_BLOCK_PREAMBLE_BYTES)
  blake2bUpdate(context, accountBytes)
  blake2bUpdate(context, previousBytes)
  blake2bUpdate(context, representativeBytes)
  blake2bUpdate(context, balanceBytes)
  blake2bUpdate(context, linkBytes)
  const hashBytes = blake2bFinal(context)

  return byteArrayToHex(hashBytes)
}

/**
 * Hash a state block.
 *
 * @param params - Parameters
 * @returns Hash, in hexadecimal format
 */
export function hashBlock(params: HashBlockParams): string {
  if (!checkAddress(params.account)) throw new Error('Account is not valid')
  if (!checkHash(params.previous)) throw new Error('Previous is not valid')
  if (!checkAddress(params.representative)) {
    throw new Error('Representative is not valid')
  }
  if (!checkAmount(params.balance)) throw new Error('Balance is not valid')
  if (!checkAddress(params.link) && !checkHash(params.link)) {
    throw new Error('Link is not valid')
  }

  return unsafeHashBlock(params)
}
