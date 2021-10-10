/*!
 * nanocurrency-js: A toolkit for the Nano cryptocurrency.
 * Copyright (c) 2021 Marvin ROGER <bonjour+code at marvinroger dot fr>
 * Licensed under GPL-3.0 (https://git.io/vAZsK)
 */
import wasm from './wasm/lib/nanocurrency.wasm'
import { checkHash, checkThreshold } from './check'
import { DEFAULT_WORK_THRESHOLD } from './work'
import { byteArrayToHex, hexToByteArray } from './utils'

interface Assembly {
  work: (
    hash: string,
    threshold: bigint,
    workerIndex: number,
    workerCount: number
  ) => null | string
  derivePublicFromSecret: (secretKey: string) => string
}

let assembly: Assembly | undefined = undefined

async function loadWasm(): Promise<Assembly> {
  if (assembly) {
    return assembly
  }

  const { instance } = await wasm({})
  assembly = {
    work(hash, threshold, workerIndex, workerCount) {
      const hashBytes = hexToByteArray(hash)
      const thresholdBytes = hexToByteArray(
        threshold.toString(16).padStart(8, '0')
      )

      const memory = instance.exports.memory
      const memoryPointer = instance.exports.wasm_get_io_buffer()

      const sharedMemory = new Uint8Array(memory.buffer, memoryPointer, 1024)

      const dataview = new DataView(
        sharedMemory.buffer,
        sharedMemory.byteOffset,
        sharedMemory.byteLength
      )

      sharedMemory.set(hashBytes, 0)
      sharedMemory.set(thresholdBytes, 32)
      dataview.setUint8(40, workerIndex)
      dataview.setUint8(41, workerCount)

      instance.exports.wasm_work()

      const found = sharedMemory[42] === 1
      const output = sharedMemory.slice(43, 51)

      if (!found) {
        return null
      }

      return byteArrayToHex(output)
    },
    derivePublicFromSecret(secretKey) {
      const secretKeyBytes = hexToByteArray(secretKey)

      const memory = instance.exports.memory
      const memoryPointer = instance.exports.wasm_get_io_buffer()

      const sharedMemory = new Uint8Array(memory.buffer, memoryPointer, 1024)

      sharedMemory.set(secretKeyBytes, 0)

      instance.exports.wasm_derive_public_key_from_secret_key()

      const publicKeyBytes = sharedMemory.slice(32, 64)

      return byteArrayToHex(publicKeyBytes)
    },
  }

  return assembly
}

/** Compute work parameters. */
export interface ComputeWorkParams {
  /** The current worker index, starting at 0 */
  workerIndex?: number
  /** The count of worker */
  workerCount?: number
  /** The work threshold, in hex format. Defaults to `0xffffffc000000000n` */
  workThreshold?: bigint
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
  const {
    workerIndex = 0,
    workerCount = 1,
    workThreshold = DEFAULT_WORK_THRESHOLD,
  } = params

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

  return assembly.work(blockHash, workThreshold, workerIndex, workerCount)
}

export async function derivePublicFromSecret(
  secretKey: string
): Promise<string> {
  const assembly = await loadWasm()

  return assembly.derivePublicFromSecret(secretKey)
}
