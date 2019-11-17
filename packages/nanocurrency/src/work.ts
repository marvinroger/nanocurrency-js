/*!
 * nanocurrency-js: A toolkit for the Nano cryptocurrency.
 * Copyright (c) 2019 Marvin ROGER <dev at marvinroger dot fr>
 * Licensed under GPL-3.0 (https://git.io/vAZsK)
 */
import BigNumber from 'bignumber.js'
import { blake2bFinal, blake2bInit, blake2bUpdate } from 'blakejs'
import { checkHash, checkWork, checkWorkThreshold } from './check'
import { DEFAULT_WORK_THRESHOLD } from './constants'
import { byteArrayToHex, hexToByteArray } from './utils'

/** Validate work parameters. */
export interface ValidateWorkParams {
  /** The block hash to validate the work against */
  blockHash: string
  /** The work to validate */
  work: string
  /** The threshold to validate against, in 8 bytes hex format */
  threshold?: string
}

/**
 * Validate whether or not the work value meets the difficulty for the given hash.
 *
 * @param params - Parameters
 * @returns Valid
 */
export function validateWork(params: ValidateWorkParams): boolean {
  const { threshold = DEFAULT_WORK_THRESHOLD } = params
  if (!checkHash(params.blockHash)) throw new Error('Hash is not valid')
  if (!checkHash(params.blockHash)) throw new Error('Hash is not valid')
  if (!checkWork(params.work)) throw new Error('Work is not valid')
  if (!checkWorkThreshold(threshold)) throw new Error('Threshold is not valid')

  const hashBytes = hexToByteArray(params.blockHash)
  const workBytes = hexToByteArray(params.work).reverse()

  const context = blake2bInit(8)
  blake2bUpdate(context, workBytes)
  blake2bUpdate(context, hashBytes)
  const output = blake2bFinal(context).reverse()
  const outputHex = byteArrayToHex(output)
  const outputBigNumber = new BigNumber(`0x${outputHex}`)

  return outputBigNumber.isGreaterThanOrEqualTo(new BigNumber(`0x${threshold}`))
}
