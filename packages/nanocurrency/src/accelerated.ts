/*!
 * nanocurrency-js: A toolkit for the Nano cryptocurrency.
 * Copyright (c) 2018 Marvin ROGER <dev at marvinroger dot fr>
 * Licensed under GPL-3.0 (https://git.io/vAZsK)
 */
import * as loader from 'assemblyscript/lib/loader';

import { checkHash } from './check';
import { base64ToByteArray, hexToByteArray, byteArrayToHex } from './utils';

let ASSEMBLY: any = null;

async function loadWasm(): Promise<void> {
  ASSEMBLY = loader.instantiateBuffer(base64ToByteArray('%%%WASM_BASE64%%%'), {
    external: {
      logs(value: number) {
        console.log(ASSEMBLY.getString(value));
      },
    },
  } as any);
}

async function loadWasmIfNotLoaded() {
  if (ASSEMBLY !== null) return;

  await loadWasm();
}

/** Compute work parameters. */
export interface ComputeWorkParams {
  /** The current worker index, starting at 0 */
  workerIndex: number;
  /** The count of worker */
  workerCount: number;
}

/**
 * Find a work value that meets the difficulty for the given hash.
 * Require WebAssembly support.
 *
 * @param blockHash - The block hash to find a work for
 * @param params - Parameters
 * @returns Work, in hexadecimal format, or null if no work has been found (very unlikely)
 */
export async function computeWork(
  blockHash: string,
  params: ComputeWorkParams = { workerIndex: 0, workerCount: 1 }
) {
  await loadWasmIfNotLoaded();

  if (!checkHash(blockHash)) throw new Error('Hash is not valid');
  if (
    !Number.isInteger(params.workerIndex) ||
    !Number.isInteger(params.workerCount) ||
    params.workerIndex < 0 ||
    params.workerCount < 1 ||
    params.workerIndex > params.workerCount - 1
  ) {
    throw new Error('Worker parameters are not valid');
  }

  const blockHashBytes = hexToByteArray(blockHash);
  const blockHashPtr = ASSEMBLY.newArray(blockHashBytes);

  const outputPtr = ASSEMBLY.findWork(blockHashPtr, params.workerIndex, params.workerCount);
  const output = ASSEMBLY.getArray(Uint8Array, outputPtr);
  ASSEMBLY.freeArray(blockHashPtr);

  if (output.length === 0) {
    return null;
  }

  return byteArrayToHex(output);
}
