/*!
 * nanocurrency-js: A toolkit for the Nano cryptocurrency.
 * Copyright (c) 2019 Marvin ROGER <bonjour+code at marvinroger dot fr>
 * Licensed under GPL-3.0 (https://git.io/JvSg6)
 */
import wasm from '../wasm/bin/nanocurrency.wasm'
import { checkHash, checkKey, checkSeed, checkThreshold } from './check'
import { DEFAULT_WORK_THRESHOLD } from './constants'
import { byteArrayToHex, hexToByteArray } from './utils'

interface Assembly {
  work: (
    hash: string,
    workerIndex: number,
    workerCount: number,
    threshold: string
  ) => null | string
  derivePublic: (secretKey: string) => string
  deriveSecret: (seed: string, index: number) => string
  encodeAddress: (publicKey: string) => string
  testSeedMatchesAddressPattern: (
    seed: Uint8Array,
    addressPattern: Uint8Array
  ) => boolean
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
      const memoryPointer = instance.exports.io_ptr_work()

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
    derivePublic(secretKey) {
      const secretKeyBytes = hexToByteArray(secretKey)

      const memory = instance.exports.memory
      const memoryPointer = instance.exports.io_ptr_derive_public()

      const sharedMemory = new Uint8Array(memory.buffer, memoryPointer, 64)

      sharedMemory.set(secretKeyBytes, 0)

      instance.exports.derive_public()

      const output = sharedMemory.slice(33)

      return byteArrayToHex(output)
    },
    deriveSecret(seed, index) {
      const seedBytes = hexToByteArray(seed)

      const memory = instance.exports.memory
      const memoryPointer = instance.exports.io_ptr_derive_secret()

      const sharedMemory = new Uint8Array(memory.buffer, memoryPointer, 68)
      const dataview = new DataView(
        sharedMemory.buffer,
        sharedMemory.byteOffset,
        sharedMemory.byteLength
      )

      sharedMemory.set(seedBytes, 0)
      dataview.setUint32(32, index, true)

      instance.exports.derive_secret()

      const output = sharedMemory.slice(36)

      return byteArrayToHex(output)
    },
    encodeAddress(publicKey) {
      const publicKeyBytes = hexToByteArray(publicKey)

      const memory = instance.exports.memory
      const memoryPointer = instance.exports.io_ptr_encode_address()

      const sharedMemory = new Uint8Array(memory.buffer, memoryPointer, 92)
      sharedMemory.set(publicKeyBytes, 0)

      instance.exports.encode_address()

      const output = sharedMemory.slice(32)

      return String.fromCharCode.apply(null, Array.from(output))
    },
    testSeedMatchesAddressPattern(seed, addressPattern) {
      const memory = instance.exports.memory
      const memoryPointer = instance.exports.io_ptr_test_seed_matches_address_pattern()

      const sharedMemory = new Uint8Array(memory.buffer, memoryPointer, 93)
      sharedMemory.set(seed, 0)
      sharedMemory.set(addressPattern, 32)

      instance.exports.test_seed_matches_address_pattern()

      return sharedMemory[92] === 1
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

/**
 * Find a work value that meets the difficulty for the given hash.
 * Require WebAssembly support.
 *
 * @param secretKey - The secret key to derive the public key from
 * @returns The public key
 */
export async function derivePublic(secretKey: string): Promise<string> {
  if (!checkKey(secretKey)) throw new Error('Secret key is not valid')

  const assembly = await loadWasm()

  return assembly.derivePublic(secretKey)
}

/**
 * Find a work value that meets the difficulty for the given hash.
 * Require WebAssembly support.
 *
 * @param secretKey - The secret key to derive the public key from
 * @returns The public key
 */
export async function derivePrivate(
  seed: string,
  index: number
): Promise<string> {
  if (!checkSeed(seed)) throw new Error('Seed is not valid')

  const assembly = await loadWasm()

  return assembly.deriveSecret(seed, index)
}

/**
 * Find a work value that meets the difficulty for the given hash.
 * Require WebAssembly support.
 *
 * @param secretKey - The secret key to derive the public key from
 * @returns The public key
 */
export async function encodeAddress(publicKey: string): Promise<string> {
  if (!checkKey(publicKey)) throw new Error('Public key is not valid')

  const assembly = await loadWasm()

  return assembly.encodeAddress(publicKey)
}

/**
 * Find a work value that meets the difficulty for the given hash.
 * Require WebAssembly support.
 *
 * @param secretKey - The secret key to derive the public key from
 * @returns The public key
 */
export async function testSeedMatchesAddressPattern(
  seed: Uint8Array,
  addressPattern: Uint8Array
): Promise<boolean> {
  const assembly = await loadWasm()

  if (seed.length !== 32) {
    throw new Error('The seed is invalid')
  }

  if (addressPattern.length !== 60) {
    throw new Error('The address pattern is invalid')
  }

  return assembly.testSeedMatchesAddressPattern(seed, addressPattern)
}
