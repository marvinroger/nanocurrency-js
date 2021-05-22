/*!
 * nanocurrency-js: A toolkit for the Nano cryptocurrency.
 * Copyright (c) 2019 Marvin ROGER <dev at marvinroger dot fr>
 * Licensed under GPL-3.0 (https://git.io/vAZsK)
 */
import { blake2b } from 'blakejs'

import { compareArrays } from './utils'
import { checkString } from './check'
import { decodeNanoBase32 } from './nano-base32'

/** @hidden */
export interface ParseAddressResult {
  valid: boolean
  publicKeyBytes: Uint8Array | null
}

/** @hidden */
export function parseAddress(address: {}): ParseAddressResult {
  const invalid = { valid: false, publicKeyBytes: null }
  if (
    !checkString(address) ||
    !/^(xrb_|nano_)[13][13-9a-km-uw-z]{59}$/.test(address as string)
  ) {
    return invalid
  }

  let prefixLength
  if ((address as string).startsWith('xrb_')) {
    prefixLength = 4
  } else {
    // nano_
    prefixLength = 5
  }

  const publicKeyBytes = decodeNanoBase32(
    (address as string).substr(prefixLength, 52)
  )
  const checksumBytes = decodeNanoBase32(
    (address as string).substr(prefixLength + 52)
  )

  const computedChecksumBytes = blake2b(publicKeyBytes, null, 5).reverse()

  const valid = compareArrays(checksumBytes, computedChecksumBytes)

  if (!valid) return invalid

  return {
    publicKeyBytes,
    valid: true,
  }
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
export function checkAddress(address: string): boolean {
  const parseResult = parseAddress(address)

  return parseResult.valid
}
