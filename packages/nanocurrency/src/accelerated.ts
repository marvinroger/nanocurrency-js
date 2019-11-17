/*!
 * nanocurrency-js: A toolkit for the Nano cryptocurrency.
 * Copyright (c) 2019 Marvin ROGER <dev at marvinroger dot fr>
 * Licensed under GPL-3.0 (https://git.io/vAZsK)
 */
import initWasm, * as wasmExports from 'nanocurrency-wasm'
import wasmAsDataUrl from '../wasm/pkg/nanocurrency.wasm'
import { checkHash, checkWorkThreshold } from './check'
import { byteArrayToHex, hexToByteArray } from './utils'

let ASSEMBLY_LOADED = false
let IS_NODE = false
try {
  IS_NODE =
    Object.prototype.toString.call(global.process) === '[object process]'
} catch (_e) {}

async function loadWasm(): Promise<void> {
  if (ASSEMBLY_LOADED) {
    return
  }

  let wasmBinary!: ArrayBuffer

  if (IS_NODE) {
    const base64 = wasmAsDataUrl.replace('data:application/wasm;base64,', '')
    wasmBinary = Buffer.from(base64, 'base64')
  } else {
    const wasmRes = await self.fetch(wasmAsDataUrl)
    wasmBinary = await wasmRes.arrayBuffer()
  }

  await initWasm(wasmBinary)
  ASSEMBLY_LOADED = true
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
  const { workThreshold = 'ffffffc000000000' } = params

  if (!checkHash(blockHash)) throw new Error('Hash is not valid')
  if (!checkWorkThreshold(workThreshold))
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

  await loadWasm()

  const blockHashBytes = hexToByteArray(blockHash)
  const workThresholdSerialized = hexToByteArray(workThreshold)

  const work = wasmExports.work(
    blockHashBytes,
    params.workerIndex,
    params.workerCount,
    workThresholdSerialized
  )

  if (!work) {
    return null
  }

  return byteArrayToHex(work)
}
