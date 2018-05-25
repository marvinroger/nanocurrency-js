/*!
 * nanocurrency-js: A toolkit for the Nano cryptocurrency.
 * Copyright (c) 2018 Marvin ROGER <dev at marvinroger dot fr>
 * Licensed under GPL-3.0 (https://git.io/vAZsK)
 */
import { checkHash } from './check';

import Native from '../native';

const C_BINDING: {
  instance_: any;
  work: null | ((blockHash: string, workerIndex: number, workerCount: number) => string);
} = {
  instance_: null,
  work: null,
};

function loadWasm(): Promise<void> {
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

async function loadWasmIfNotLoaded() {
  if (C_BINDING.instance_ !== null) return;

  await loadWasm();
}

/**
 * Find a work value that meets the difficulty for the given hash.
 * Require WebAssembly support.
 *
 * @param blockHash - The hash to find a work for
 * @param workerIndex - The current worker index, starting at 0
 * @param  workerCount - The count of worker
 * @returns Work, in hexadecimal format
 */
export async function computeWork(
  blockHash: string,
  workerIndex: number = 0,
  workerCount: number = 1
) {
  await loadWasmIfNotLoaded();

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
