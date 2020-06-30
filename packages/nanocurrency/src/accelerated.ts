/*!
 * nanocurrency-js: A toolkit for the Nano cryptocurrency.
 * Copyright (c) 2019 Marvin ROGER <dev at marvinroger dot fr>
 * Licensed under GPL-3.0 (https://git.io/vAZsK)
 */
import loadAssembly from '../assembly'
import { checkHash, checkThreshold } from './check'
import { DEFAULT_WORK_THRESHOLD } from './work'

type WorkFunction = (
  blockHash: string,
  workThreshold: string,
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
      /* eslint-disable promise/catch-or-return, promise/always-return */
      loadAssembly().then(assembly => {
        const loaded = Object.assign(ASSEMBLY, {
          loaded: true,
          work: assembly.cwrap('emscripten_work', 'string', [
            'string',
            'string',
            'number',
            'number',
          ]),
        }) as AssemblyWhenLoaded

        resolve(loaded)
      })
      /* eslint-enable promise/catch-or-return, promise/always-return */
    } catch (err) {
      reject(err)
    }
  })
}

/** Compute work parameters. */
export interface ComputeWorkParams {
  /** The current worker index, starting at 0 */
  workerIndex?: number
  /** The count of worker */
  workerCount?: number
  /** The work threshold, in hex format. Defaults to `ffffffc000000000` */
  workThreshold?: string
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
  params: ComputeWorkParams = {}
): Promise<string | null> {
  const { workerIndex = 0, workerCount = 1, workThreshold = DEFAULT_WORK_THRESHOLD } = params

  const assembly = await loadWasm()

  if (!checkHash(blockHash)) throw new Error('Hash is not valid')
  if (!checkThreshold(workThreshold)) throw new Error('Threshold is not valid')
  if (
    !Number.isInteger(workerIndex) ||
    !Number.isInteger(workerCount) ||
    workerIndex < 0 ||
    workerCount < 1 ||
    workerIndex > workerCount - 1
  ) {
    throw new Error('Worker parameters are not valid')
  }

  const work = assembly.work(blockHash, workThreshold, workerIndex, workerCount)
  const success = work[1] === '1'

  if (!success) {
    return null
  }

  return work.substr(2)
}
