/*!
 * nanocurrency-js: A toolkit for the Nano cryptocurrency.
 * Copyright (c) 2018 Marvin ROGER <dev at marvinroger dot fr>
 * Licensed under GPL-3.0 (https://git.io/vAZsK)
 */
import BigNumber from 'bignumber.js'
import { blake2bInit, blake2bUpdate, blake2bFinal } from 'blakejs'

import { checkWork, checkHash } from './check'

import { hexToByteArray, byteArrayToHex } from './utils'

import Native from '../native.tmp'

const WORK_THRESHOLD = new BigNumber('0xffffffc000000000')

export const C_BINDING = {
  instance_: null,
  work: null
}

/**
 * Initialize the library. This basically loads the WebAssembly used by `work`.
 *
 * @return {Promise<void>} Promise
 */
export function init () {
  return new Promise((resolve, reject) => {
    try {
      Native().then(native => {
        C_BINDING.instance_ = native
        C_BINDING.work = native.cwrap('emscripten_work', 'string', [
          'string',
          'number',
          'number'
        ])

        resolve()
      })
    } catch (err) {
      reject(err)
    }
  })
}

/**
 * Get whether or not `work` is ready to be used ({@link #init} has been called).
 *
 * @return {boolean} Ready
 */
export function isReady () {
  return C_BINDING.instance_ !== null
}

/**
 * Find a work value that meets the difficulty for the given hash.
 * Requires initialization.
 *
 * @param {string} blockHash - The hash to find a work for
 * @param {number} [workerIndex=0] - The current worker index, starting at 0
 * @param {number} [workerCount=1] - The count of worker
 * @return {string} Work, in hexadecimal format
 */
export function work (blockHash, workerIndex = 0, workerCount = 1) {
  if (!isReady()) throw new Error('NanoCurrency is not initialized')
  if (!checkHash(blockHash)) throw new Error('Hash is not valid')
  if (
    !Number.isInteger(workerIndex) ||
    !Number.isInteger(workerCount) ||
    workerIndex < 0 ||
    workerCount < 1 ||
    workerIndex > workerCount - 1
  ) {
    throw new Error('Worker parameters are not valid')
  }

  const work = C_BINDING.work(blockHash, workerIndex, workerCount)

  return work !== '0000000000000000' ? work : null
}

/**
 * Validate whether or not the work value meets the difficulty for the given hash.
 * Does not require initialization.
 *
 * @param {string} blockHash - The hash to validate the work against
 * @param {string} work - The work to validate
 * @return {boolean} Valid
 */
export function validateWork (blockHash, work) {
  if (!checkHash(blockHash)) throw new Error('Hash is not valid')
  if (!checkWork(work)) throw new Error('Work is not valid')

  const hashBytes = hexToByteArray(blockHash)
  const workBytes = hexToByteArray(work).reverse()

  const context = blake2bInit(8)
  blake2bUpdate(context, workBytes)
  blake2bUpdate(context, hashBytes)
  const output = blake2bFinal(context).reverse()
  const outputHex = byteArrayToHex(output)
  const outputBigNumber = new BigNumber('0x' + outputHex)

  return outputBigNumber.isGreaterThanOrEqualTo(WORK_THRESHOLD)
}
