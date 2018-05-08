/*!
 * nanocurrency-js: A toolkit for the Nano cryptocurrency.
 * Copyright (c) 2018 Marvin ROGER <dev at marvinroger dot fr>
 * Licensed under GPL-3.0 (https://git.io/vAZsK)
 */
import { blake2bInit, blake2bUpdate, blake2bFinal } from 'blakejs'

import { checkHash, checkAddress, checkBalance } from './check'

import { convert, NanoUnit } from './conversion'

import { hexToByteArray, byteArrayToHex } from './utils'

import { derivePublicKey } from './keys'

const STATE_BLOCK_PREAMBLE_BYTES = new Uint8Array(32)
STATE_BLOCK_PREAMBLE_BYTES[31] = 6

/**
 * Hash a receive block.
 * Does not require initialization.
 *
 * @param previous - The hash of the previous block on the account chain, in hexadecimal format
 * @param source - The hash of the send block that is being received, in hexadecimal format
 * @returns Hash, in hexadecimal format
 */
export function hashReceiveBlock (previous: string, source: string) {
  if (!checkHash(previous)) throw new Error('Previous is not valid')
  if (!checkHash(source)) throw new Error('Source is not valid')

  const previousBytes = hexToByteArray(previous)
  const sourceBytes = hexToByteArray(source)

  const context = blake2bInit(32)
  blake2bUpdate(context, previousBytes)
  blake2bUpdate(context, sourceBytes)
  const hashBytes = blake2bFinal(context)

  return byteArrayToHex(hashBytes)
}

/**
 * Hash an open block.
 * Does not require initialization.
 *
 * @param source - The hash of the send block that is being received, in hexadecimal format
 * @param representative - The representative address
 * @param account - The account address
 * @returns Hash, in hexadecimal format
 */
export function hashOpenBlock (
  source: string,
  representative: string,
  account: string
) {
  if (!checkHash(source)) throw new Error('Source is not valid')
  if (!checkAddress(representative)) {
    throw new Error('Representative is not valid')
  }
  if (!checkAddress(account)) throw new Error('Account is not valid')

  const sourceBytes = hexToByteArray(source)
  const representativeBytes = hexToByteArray(derivePublicKey(representative))
  const accountBytes = hexToByteArray(derivePublicKey(account))

  const context = blake2bInit(32)
  blake2bUpdate(context, sourceBytes)
  blake2bUpdate(context, representativeBytes)
  blake2bUpdate(context, accountBytes)
  const hashBytes = blake2bFinal(context)

  return byteArrayToHex(hashBytes)
}

/**
 * Hash a change block.
 * Does not require initialization.
 *
 * @param previous - The hash of the previous block on the account chain, in hexadecimal format
 * @param representative - The representative address
 * @returns Hash, in hexadecimal format
 */
export function hashChangeBlock (previous: string, representative: string) {
  if (!checkHash(previous)) throw new Error('Previous is not valid')
  if (!checkAddress(representative)) {
    throw new Error('Representative is not valid')
  }

  const previousBytes = hexToByteArray(previous)
  const representativeBytes = hexToByteArray(derivePublicKey(representative))

  const context = blake2bInit(32)
  blake2bUpdate(context, previousBytes)
  blake2bUpdate(context, representativeBytes)
  const hashBytes = blake2bFinal(context)

  return byteArrayToHex(hashBytes)
}

/**
 * Hash a send block.
 * Does not require initialization.
 *
 * @param previous - The hash of the previous block on the account chain, in hexadecimal format
 * @param destination - The destination address
 * @param balance - The balance, in raw
 * @returns Hash, in hexadecimal format
 */
export function hashSendBlock (
  previous: string,
  destination: string,
  balance: string
) {
  if (!checkHash(previous)) throw new Error('Previous is not valid')
  if (!checkAddress(destination)) throw new Error('Destination is not valid')
  if (!checkBalance(balance)) throw new Error('Balance is not valid')

  const previousBytes = hexToByteArray(previous)
  const destinationBytes = hexToByteArray(derivePublicKey(destination))
  const balanceHex = convert(balance, { from: NanoUnit.raw, to: NanoUnit.hex })
  const balanceBytes = hexToByteArray(balanceHex)

  const context = blake2bInit(32)
  blake2bUpdate(context, previousBytes)
  blake2bUpdate(context, destinationBytes)
  blake2bUpdate(context, balanceBytes)
  const hashBytes = blake2bFinal(context)

  return byteArrayToHex(hashBytes)
}

/**
 * Hash a state block.
 * Does not require initialization.
 *
 * @param account - The account address
 * @param previous - The hash of the previous block on the account chain, in hexadecimal format
 * @param representative - The representative address
 * @param balance - The balance, in raw
 * @param link - The account or block hash meant as a link, in address or hexadecimal format
 * @returns Hash, in hexadecimal format
 */
export function hashStateBlock (
  account: string,
  previous: string,
  representative: string,
  balance: string,
  link: string
) {
  if (!checkAddress(account)) throw new Error('Account is not valid')
  if (!checkHash(previous)) throw new Error('Previous is not valid')
  if (!checkAddress(representative)) {
    throw new Error('Representative is not valid')
  }
  if (!checkBalance(balance)) throw new Error('Balance is not valid')
  let linkIsAddress = false
  let linkIsBlockHash = false
  if (checkAddress(link)) linkIsAddress = true
  else if (checkHash(link)) linkIsBlockHash = true
  else throw new Error('Link is not valid')

  const accountBytes = hexToByteArray(derivePublicKey(account))
  const previousBytes = hexToByteArray(previous)
  const representativeBytes = hexToByteArray(derivePublicKey(representative))
  const balanceHex = convert(balance, { from: NanoUnit.raw, to: NanoUnit.hex })
  const balanceBytes = hexToByteArray(balanceHex)
  let linkBytes
  if (linkIsAddress) {
    linkBytes = hexToByteArray(derivePublicKey(link))
  } else if (linkIsBlockHash) {
    linkBytes = hexToByteArray(link)
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
