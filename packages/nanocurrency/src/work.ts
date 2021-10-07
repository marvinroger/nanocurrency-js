/*!
 * nanocurrency-js: A toolkit for the Nano cryptocurrency.
 * Copyright (c) 2021 Marvin ROGER <bonjour+code at marvinroger dot fr>
 * Licensed under GPL-3.0 (https://git.io/vAZsK)
 */
import { blake2bFinal, blake2bInit, blake2bUpdate } from 'blakejs'
import { checkHash, checkThreshold, checkWork } from './check'
import { byteArrayToHex, hexToByteArray } from './utils'

export const DEFAULT_WORK_THRESHOLD = 0xffffffc000000000n

/** Validate work parameters. */
export interface ValidateWorkParams {
  /** The block hash to validate the work against */
  blockHash: string
  /** The work to validate */
  work: string
  /** The threshold to validate against. Defaults to 0xffffffc000000000 */
  threshold?: bigint
}

/**
 * Validate whether or not the work value meets the difficulty for the given hash.
 *
 * @param params - Parameters
 * @returns Valid
 */
export function validateWork(params: ValidateWorkParams): boolean {
  const threshold = params.threshold ?? DEFAULT_WORK_THRESHOLD

  if (!checkHash(params.blockHash)) throw new Error('Hash is not valid')
  if (!checkWork(params.work)) throw new Error('Work is not valid')
  if (!checkThreshold(threshold)) throw new Error('Threshold is not valid')

  const hashBytes = hexToByteArray(params.blockHash)
  const workBytes = hexToByteArray(params.work).reverse()

  const context = blake2bInit(8)
  blake2bUpdate(context, workBytes)
  blake2bUpdate(context, hashBytes)
  const output = blake2bFinal(context).reverse()
  const outputHex = byteArrayToHex(output)
  const outputBigNumber = BigInt(`0x${outputHex}`)

  return outputBigNumber >= threshold
}
