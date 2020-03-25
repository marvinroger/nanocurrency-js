/*!
 * nanocurrency-js: A toolkit for the Nano cryptocurrency.
 * Copyright (c) 2019 Marvin ROGER <bonjour+code at marvinroger dot fr>
 * Licensed under GPL-3.0 (https://git.io/JvSg6)
 */
import wasm from '../wasm/bin/nanocurrency.wasm'
import { checkHash, checkThreshold } from './check'
import { DEFAULT_WORK_THRESHOLD } from './constants'
import { byteArrayToHex, hexToByteArray } from './utils'

interface Assembly {
  work: (
    hash: string,
    workerIndex: number,
    workerCount: number,
    threshold: string
  ) => null | string
}

let assembly: Assembly | undefined = undefined

async function loadWasm(): Promise<Assembly> {
  if (assembly) {
    return assembly
  }

  const { instance } = await wasm({})
  assembly = {
    work(hash, workerIndex, workerCount, threshold) {
      const hashBytes = hexToByteArray(hash)
      const thresholdBytes = hexToByteArray(threshold)

      const memory = instance.exports.memory
      const memoryPointer = instance.exports.get_work_memory_pointer()

      const sharedMemory = new Uint8Array(memory.buffer, memoryPointer, 57)

      const dataview = new DataView(
        sharedMemory.buffer,
        sharedMemory.byteOffset,
        sharedMemory.byteLength
      )

      sharedMemory.set(hashBytes, 0)
      dataview.setUint32(32, workerIndex, true)
      dataview.setUint32(36, workerCount, true)
      sharedMemory.set(thresholdBytes, 40)

      instance.exports.work()

      const found = sharedMemory[48] === 1
      const output = sharedMemory.slice(49, 57)

      if (!found) {
        return null
      }

      return byteArrayToHex(output)
    },
  }

  return assembly
}

/** Compute work parameters. */
export interface ComputeWorkParams {
  /** The current worker index, starting at 0 */
  workerIndex: number
  /** The count of worker */
  workerCount: number
  /** The work threshold, in 8 bytes hex format */
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
  params: ComputeWorkParams = { workerIndex: 0, workerCount: 1 }
): Promise<string | null> {
  const { workThreshold = DEFAULT_WORK_THRESHOLD } = params

  if (!checkHash(blockHash)) throw new Error('Hash is not valid')
  if (!checkThreshold(workThreshold))
    throw new Error('The work threshold is not valid')
  if (
    !Number.isInteger(params.workerIndex) ||
    !Number.isInteger(params.workerCount) ||
    params.workerIndex < 0 ||
    params.workerCount < 1 ||
    params.workerIndex > params.workerCount - 1
  ) {
    throw new Error('Worker parameters are not valid')
  }

  const assembly = await loadWasm()

  return assembly.work(
    blockHash,
    params.workerIndex,
    params.workerCount,
    workThreshold
  )
}
