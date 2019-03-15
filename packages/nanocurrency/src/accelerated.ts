/*!
 * nanocurrency-js: A toolkit for the Nano cryptocurrency.
 * Copyright (c) 2019 Marvin ROGER <dev at marvinroger dot fr>
 * Licensed under GPL-3.0 (https://git.io/vAZsK)
 */
import { checkHash } from './check'

import loadAssembly from '../assembly'

type WorkFunction = (
  blockHash: string,
  workerIndex: number,
  workerCount: number
) => string

interface AssemblyWhenNotLoaded {
  loaded: false
  work: null
}
interface AssemblyWhenLoaded {
  loaded: true
  work: WorkFunction
}

const ASSEMBLY: AssemblyWhenNotLoaded | AssemblyWhenLoaded = {
  loaded: false,
  work: null,
}

function loadWasm(): Promise<AssemblyWhenLoaded> {
  return new Promise((resolve, reject) => {
    if (ASSEMBLY.loaded) {
      return resolve(ASSEMBLY)
    }

    try {
      loadAssembly().then(assembly => {
        let loaded = Object.assign(ASSEMBLY, {
          loaded: true,
          work: assembly.cwrap('emscripten_work', 'string', [
            'string',
            'number',
            'number',
          ]),
        }) as AssemblyWhenLoaded

        resolve(loaded)
      })
    } catch (err) {
      reject(err)
    }
  })
}

/** Compute work parameters. */
export interface ComputeWorkParams {
  /** The current worker index, starting at 0 */
  workerIndex: number
  /** The count of worker */
  workerCount: number
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
): Promise<string | null> {
  const assembly = await loadWasm()

  if (!checkHash(blockHash)) throw new Error('Hash is not valid')
  if (
    !Number.isInteger(params.workerIndex) ||
    !Number.isInteger(params.workerCount) ||
    params.workerIndex < 0 ||
    params.workerCount < 1 ||
    params.workerIndex > params.workerCount - 1
  ) {
    throw new Error('Worker parameters are not valid')
  }

  const work = assembly.work(blockHash, params.workerIndex, params.workerCount)

  return work !== '0000000000000000' ? work : null
}
