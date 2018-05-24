/*!
 * nanocurrency-js: A toolkit for the Nano cryptocurrency.
 * Copyright (c) 2018 Marvin ROGER <dev at marvinroger dot fr>
 * Licensed under GPL-3.0 (https://git.io/vAZsK)
 */
import BigNumber from 'bignumber.js';
import { blake2bFinal, blake2bInit, blake2bUpdate } from 'blakejs';

import { checkHash, checkWork } from './check';

import { byteArrayToHex, hexToByteArray } from './utils';

import Native from '../native';

const WORK_THRESHOLD = new BigNumber('0xffffffc000000000');

const C_BINDING: {
  instance_: any;
  work: null | ((blockHash: string, workerIndex: number, workerCount: number) => string);
} = {
  instance_: null,
  work: null,
};

/**
 * Initialize the library. This basically loads the WebAssembly used by `work`.
 *
 * @returns Promise
 */
export function init(): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      Native().then((native: any) => {
        C_BINDING.instance_ = native;
        C_BINDING.work = native.cwrap('emscripten_work', 'string', ['string', 'number', 'number']);

        resolve();
      });
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Get whether or not `work` is ready to be used (`init` has been called).
 *
 * @returns Ready
 */
export function isReady() {
  return C_BINDING.instance_ !== null;
}

/**
 * Find a work value that meets the difficulty for the given hash.
 * Requires initialization.
 *
 * @param blockHash - The hash to find a work for
 * @param workerIndex - The current worker index, starting at 0
 * @param  workerCount - The count of worker
 * @returns Work, in hexadecimal format
 */
export function work(blockHash: string, workerIndex: number = 0, workerCount: number = 1) {
  if (!isReady()) throw new Error('NanoCurrency is not initialized');
  if (!checkHash(blockHash)) throw new Error('Hash is not valid');
  if (
    !Number.isInteger(workerIndex) ||
    !Number.isInteger(workerCount) ||
    workerIndex < 0 ||
    workerCount < 1 ||
    workerIndex > workerCount - 1
  ) {
    throw new Error('Worker parameters are not valid');
  }

  const work = C_BINDING.work!(blockHash, workerIndex, workerCount);

  return work !== '0000000000000000' ? work : null;
}

/**
 * Validate whether or not the work value meets the difficulty for the given hash.
 * Does not require initialization.
 *
 * @param blockHash - The hash to validate the work against
 * @param work - The work to validate
 * @returns Valid
 */
export function validateWork(blockHash: string, work: string) {
  if (!checkHash(blockHash)) throw new Error('Hash is not valid');
  if (!checkWork(work)) throw new Error('Work is not valid');

  const hashBytes = hexToByteArray(blockHash);
  const workBytes = hexToByteArray(work).reverse();

  const context = blake2bInit(8);
  blake2bUpdate(context, workBytes);
  blake2bUpdate(context, hashBytes);
  const output = blake2bFinal(context).reverse();
  const outputHex = byteArrayToHex(output);
  const outputBigNumber = new BigNumber('0x' + outputHex);

  return outputBigNumber.isGreaterThanOrEqualTo(WORK_THRESHOLD);
}
