/*!
 * nanocurrency-js: A toolkit for the Nano cryptocurrency.
 * Copyright (c) 2019 Marvin ROGER <dev at marvinroger dot fr>
 * Licensed under GPL-3.0 (https://git.io/vAZsK)
 */
import BigNumber from 'bignumber.js'
import { blake2bFinal, blake2bInit, blake2bUpdate } from 'blakejs'
import { checkHash, checkThreshold, checkWork } from './check'
import { byteArrayToHex, hexToByteArray } from './utils'

export const DEFAULT_WORK_THRESHOLD = 'ffffffc000000000'

/** Get work difficulty parameters. */
export interface GetWorkDifficultyParams {
  /** The block hash to check the work against */
  blockHash: string
  /** The work to check */
  work: string
}

/** @hidden */
export function getWorkDifficultyBigNumber(params: GetWorkDifficultyParams): BigNumber {
  if (!checkHash(params.blockHash)) throw new Error('Hash is not valid')
  if (!checkWork(params.work)) throw new Error('Work is not valid')

  const hashBytes = hexToByteArray(params.blockHash)
  const workBytes = hexToByteArray(params.work).reverse()

  const context = blake2bInit(8)
  blake2bUpdate(context, workBytes)
  blake2bUpdate(context, hashBytes)
  const output = blake2bFinal(context).reverse()
  const outputHex = byteArrayToHex(output)
  const outputBigNumber = new BigNumber(`0x${outputHex}`)

  return outputBigNumber
}

/**
 * Get the work difficulty for the given hash.
 *
 * @param params - Parameters
 * @returns Difficulty
 */
export function getWorkDifficulty(params: GetWorkDifficultyParams): string {
  const outputBigNumber = getWorkDifficultyBigNumber({ blockHash: params.blockHash, work: params.work })
  return outputBigNumber.toString(16);
}

/** Validate work parameters. */
export interface ValidateWorkParams {
  /** The block hash to validate the work against */
  blockHash: string
  /** The work to validate */
  work: string
  /** The threshold to validate against. Defaults to ffffffc000000000 */
  threshold?: string
}

/**
 * Validate whether or not the work value meets the difficulty for the given hash.
 *
 * @param params - Parameters
 * @returns Valid
 */
export function validateWork(params: ValidateWorkParams): boolean {
  const thresholdHex = params.threshold ?? DEFAULT_WORK_THRESHOLD

  if (!checkThreshold(thresholdHex)) throw new Error('Threshold is not valid')

  const outputBigNumber = getWorkDifficultyBigNumber({ blockHash: params.blockHash, work: params.work })
  const threshold = new BigNumber(`0x${thresholdHex}`)

  return outputBigNumber.isGreaterThanOrEqualTo(threshold)
}

/** Get work multiplier parameters. */
export interface GetDifficultyMultiplierParams {
  /** The block hash to check the work against */
  difficulty: string
  threshold?: string
}

/**
 * Get the difficulty multiplier of a work for the given hash.
 *
 * @param params - Parameters
 * @returns Multiplier
 */
export function getDifficultyMultiplier(params: GetDifficultyMultiplierParams): number {
  const thresholdHex = params.threshold ?? DEFAULT_WORK_THRESHOLD

  if (!checkThreshold(thresholdHex)) throw new Error('Threshold is not valid')

  const threshold = new BigNumber(`0x${thresholdHex}`)
  const difficulty = new BigNumber(`0x${params.difficulty}`)

  return threshold.dividedBy(difficulty).toNumber();
}
