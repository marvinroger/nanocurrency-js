/*!
 * nanocurrency-js: A toolkit for the Nano cryptocurrency.
 * Copyright (c) 2018 Marvin ROGER <dev at marvinroger dot fr>
 * Licensed under GPL-3.0 (https://git.io/vAZsK)
 */
import BigNumber from 'bignumber.js';
import { blake2bFinal, blake2bInit, blake2bUpdate } from 'blakejs';

import { checkHash, checkWork } from './check';

import { byteArrayToHex, hexToByteArray } from './utils';

const WORK_THRESHOLD = new BigNumber('0xffffffc000000000');

/**
 * Validate whether or not the work value meets the difficulty for the given hash.
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
