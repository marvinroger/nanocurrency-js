/*!
 * nanocurrency-js: A toolkit for the Nano cryptocurrency.
 * Copyright (c) 2018 Marvin ROGER <dev at marvinroger dot fr>
 * Licensed under GPL-3.0 (https://git.io/vAZsK)
 */
/** @module NanoCurrency */
import Native from '../native.tmp'

import {getRandomBytes} from './helpers'

let instance = null
let _work = null
let _validateWork = null
let _deriveSecretKey = null
let _derivePublicKey = null
let _deriveAddress = null
let _hashReceiveBlock = null
let _hashOpenBlock = null
let _hashChangeBlock = null
let _hashSendBlock = null
let _signBlock = null
let _verifyBlock = null
let _convertAmountDecimalIntegerToHex = null

/**
 * Initialize the library.
 *
 * @return {Promise<void>}
 */
export function init () {
  return new Promise((resolve, reject) => {
    try {
      Native().then(native => {
        instance = native
        _work = instance.cwrap('emscripten_work', 'string', ['string', 'number', 'number'])
        _validateWork = instance.cwrap('emscripten_validate_work', 'number', ['string', 'string'])
        _deriveSecretKey = instance.cwrap('emscripten_derive_secret_key', 'string', ['string', 'number'])
        _derivePublicKey = instance.cwrap('emscripten_derive_public_key', 'string', ['string'])
        _deriveAddress = instance.cwrap('emscripten_derive_address', 'string', ['string'])
        _hashReceiveBlock = instance.cwrap('emscripten_hash_receive_block', 'string', ['string', 'string'])
        _hashOpenBlock = instance.cwrap('emscripten_hash_open_block', 'string', ['string', 'string', 'string'])
        _hashChangeBlock = instance.cwrap('emscripten_hash_change_block', 'string', ['string', 'string'])
        _hashSendBlock = instance.cwrap('emscripten_hash_send_block', 'string', ['string', 'string', 'string'])
        _signBlock = instance.cwrap('emscripten_sign_block', 'string', ['string', 'string'])
        _verifyBlock = instance.cwrap('emscripten_verify_block', 'number', ['string', 'string', 'string'])
        _convertAmountDecimalIntegerToHex = instance.cwrap('emscripten_convert_amount_decimal_integer_to_hex', 'string', ['string'])

        resolve()
      })
    } catch (err) {
      reject(err)
    }
  })
}

/**
 * Get whether or not the library is ready to be used ({@link #module_NanoCurrency.init} has been called).
 *
 * @return {boolean}
 */
export function isReady () {
  return instance !== null
}

function checkNotInitialized () {
  if (!isReady()) throw new Error('NanoCurrency is not initialized')
}

function checkString (candidate) {
  return typeof candidate === 'string'
}

/**
 * Check if the given balance is valid.
 * Does not require initialization.
 *
 * @param {string} balance - The balance to check
 * @return {boolean} Valid
 */
export function checkBalance (balance) {
  // TODO(breaking): checkAmount instead
  if (!checkString(balance) || balance.length > 39) return false
  for (let char of balance) {
    if (char < '0' || char > '9') return false
  }

  return true
}

/**
 * Check if the given seed is valid.
 * Does not require initialization.
 *
 * @param {string} seed - The seed to check
 * @return {boolean} Valid
 */
export function checkSeed (seed) {
  return checkString(seed) && /[0-9a-fA-F]{64}/.test(seed)
}

/**
 * Check if the given hash is valid.
 * Does not require initialization.
 *
 * @param {string} hash - The hash to check
 * @return {boolean} Valid
 */
export function checkHash (hash) {
  return checkSeed(hash)
}

/**
 * Check if the given public or secret key is valid.
 * Does not require initialization.
 *
 * @param {string} key - The key to check
 * @return {boolean} Valid
 */
export function checkKey (key) {
  return checkSeed(key)
}

/**
 * Check if the given address is valid.
 * Does not require initialization.
 *
 * @param {string} address - The address to check
 * @return {boolean} Valid
 */
export function checkAddress (address) {
  return checkString(address) && /xrb_[13][0-9a-km-uw-z]{59}/.test(address)
}

/**
 * Check if the given work is valid.
 * Does not require initialization.
 *
 * @param {string} work - The work to check
 * @return {boolean} Valid
 */
export function checkWork (work) {
  return checkString(work) && /[0-9a-fA-F]{16}/.test(work)
}

/**
 * Check if the given signature is valid.
 * Does not require initialization.
 *
 * @param {string} signature - The signature to check
 * @return {boolean} Valid
 */
export function checkSignature (signature) {
  return checkString(signature) && /[0-9a-fA-F]{128}/.test(signature)
}

/**
 * Find a work value that meets the difficulty for the given hash.
 * Requires initialization.
 *
 * @param {string} blockHash - The hash to find a work for
 * @param {number} [workerIndex=0] - The current worker index, starting at 0
 * @param {number} [workerCount=1] - The count of worker
 * @return {string} Work, in hexadecimal format
 */
export function work (blockHash, workerIndex = 0, workerCount = 1) {
  checkNotInitialized()

  if (!checkHash(blockHash)) throw new Error('Hash is not valid')
  if (
    !Number.isInteger(workerIndex) ||
    !Number.isInteger(workerCount) ||
    workerIndex < 0 ||
    workerCount < 1 ||
    workerIndex > workerCount - 1
  ) throw new Error('Worker parameters are not valid')

  const work = _work(blockHash, workerIndex, workerCount)

  return work !== '0000000000000000' ? work : null
}

/**
 * Validate whether or not the work value meets the difficulty for the given hash.
 * Requires initialization.
 *
 * @param {string} blockHash - The hash to validate the work against
 * @param {string} work - The work to validate
 * @return {boolean} Valid
 */
export function validateWork (blockHash, work) {
  checkNotInitialized()

  if (!checkHash(blockHash)) throw new Error('Hash is not valid')
  if (!checkWork(work)) throw new Error('Work is not valid')

  const valid = _validateWork(blockHash, work) === 1

  return valid
}

/**
 * Generate a cryptographically secure seed.
 * Does not require initialization.
 *
 * @return {Promise<string>} Seed, in hexadecimal format
 */
export function generateSeed () {
  return new Promise((resolve, reject) => {
    getRandomBytes(32)
      .then(seed => {
        const seedHex = seed.reduce(function (hex, i) {
          return hex + ('0' + i.toString(16)).slice(-2)
        }, '')

        resolve(seedHex)
      })
      .catch(reject)
  })
}

/**
 * Derive a secret key from a seed, given an index.
 * Requires initialization.
 *
 * @param {string} seed - The seed to generate the secret key from, in hexadecimal format
 * @param {number} index - The index to generate the secret key from
 * @return {string} Secret key, in hexadecimal format
 */
export function deriveSecretKey (seed, index) {
  checkNotInitialized()

  if (!checkSeed(seed)) throw new Error('Seed is not valid')
  if (
    !Number.isInteger(index) ||
    index < 0
  ) throw new Error('Index is not valid')

  return _deriveSecretKey(seed, index)
}

/**
 * Derive a public key from a secret key.
 * Requires initialization.
 *
 * @param {string} secretKey - The secret key to generate the secret key from, in hexadecimal format
 * @return {string} Public key, in hexadecimal format
 */
export function derivePublicKey (secretKey) {
  checkNotInitialized()

  if (!checkKey(secretKey)) throw new Error('Secret key is not valid')

  return _derivePublicKey(secretKey)
}

/**
 * Derive address from a public key.
 * Requires initialization.
 *
 * @param {string} publicKey - The public key to generate the address from, in hexadecimal format
 * @return {string} Address
 */
export function deriveAddress (publicKey) {
  checkNotInitialized()

  if (!checkKey(publicKey)) throw new Error('Public key is not valid')

  return _deriveAddress(publicKey)
}

/**
 * Hash a receive block.
 * Requires initialization.
 *
 * @param {string} previous - The hash of the previous block on the account chain, in hexadecimal format
 * @param {string} source - The hash of the send block that is being received, in hexadecimal format
 * @return {string} Hash, in hexadecimal format
 */
export function hashReceiveBlock (previous, source) {
  checkNotInitialized()

  if (!checkHash(previous)) throw new Error('Previous is not valid')
  if (!checkHash(source)) throw new Error('Source is not valid')

  return _hashReceiveBlock(previous, source)
}

/**
 * Hash an open block.
 * Requires initialization.
 *
 * @param {string} source - The hash of the send block that is being received, in hexadecimal format
 * @param {string} representative - The representative address
 * @param {string} account - The account address
 * @return {string} Hash, in hexadecimal format
 */
export function hashOpenBlock (source, representative, account) {
  checkNotInitialized()

  if (!checkHash(source)) throw new Error('Source is not valid')
  if (!checkAddress(representative)) throw new Error('Representative is not valid')
  if (!checkAddress(account)) throw new Error('Account is not valid')

  return _hashOpenBlock(source, representative, account)
}

/**
 * Hash a change block.
 * Requires initialization.
 *
 * @param {string} previous - The hash of the previous block on the account chain, in hexadecimal format
 * @param {string} representative - The representative address
 * @return {string} Hash, in hexadecimal format
 */
export function hashChangeBlock (previous, representative) {
  checkNotInitialized()

  if (!checkHash(previous)) throw new Error('Previous is not valid')
  if (!checkAddress(representative)) throw new Error('Representative is not valid')

  return _hashChangeBlock(previous, representative)
}

/**
 * Hash a send block.
 * Requires initialization.
 *
 * @param {string} previous - The hash of the previous block on the account chain, in hexadecimal format
 * @param {string} destination - The destination address
 * @param {string} balance - The balance, in raw
 * @return {string} Hash, in hexadecimal format
 */
export function hashSendBlock (previous, destination, balance) {
  checkNotInitialized()

  if (!checkHash(previous)) throw new Error('Previous is not valid')
  if (!checkAddress(destination)) throw new Error('Destination is not valid')
  if (!checkBalance(balance)) throw new Error('Balance is not valid')

  return _hashSendBlock(previous, destination, balance)
}

/**
 * Sign a block.
 * Requires initialization.
 *
 * @param {string} blockHash - The hash of the block to sign
 * @param {string} secretKey - The secret key to sign the block with, in hexadecimal format
 * @return {string} Signature, in hexadecimal format
 */
export function signBlock (blockHash, secretKey) {
  checkNotInitialized()

  if (!checkHash(blockHash)) throw new Error('Hash is not valid')
  if (!checkKey(secretKey)) throw new Error('Secret key is not valid')

  return _signBlock(blockHash, secretKey)
}

/**
 * Verify a block against a public key.
 * Requires initialization.
 *
 * @param {string} blockHash - The hash of the block to verify
 * @param {string} signature - The signature of the block to verify, in hexadecimal format
 * @param {string} publicKey - The public key to verify the block against, in hexadecimal format
 * @return {boolean} Valid
 */
export function verifyBlock (blockHash, signature, publicKey) {
  checkNotInitialized()

  if (!checkHash(blockHash)) throw new Error('Hash is not valid')
  if (!checkSignature(signature)) throw new Error('Signature is not valid')
  if (!checkKey(publicKey)) throw new Error('Public key is not valid')

  const valid = _verifyBlock(blockHash, signature, publicKey) === 1

  return valid
}

/**
 * Create an open block.
 * Requires initialization.
 *
 * @param {string} secretKey - The secret key to create the block from, in hexadecimal format
 * @param {Object} data - Block data
 * @param {string} data.work - The PoW
 * @param {string} data.source - The hash of the send block that is being received, in hexadecimal format
 * @param {string} data.representative - The representative address
 * @return {Object} Block
 */
export function createOpenBlock (secretKey, { work, source, representative }) {
  checkNotInitialized()

  if (!checkKey(secretKey)) throw new Error('Secret key is not valid')
  if (typeof work === 'undefined') work = null // TODO(breaking): Ensure work is set
  if (!checkHash(source)) throw new Error('Source is not valid')
  if (!checkAddress(representative)) throw new Error('Representative is not valid')

  const previous = derivePublicKey(secretKey)
  const account = deriveAddress(previous)
  const hash = hashOpenBlock(source, representative, account)
  const signature = signBlock(hash, secretKey)

  return {
    hash,
    block: {
      type: 'open',
      source,
      representative,
      account,
      work,
      signature
    }
  }
}

/**
 * Create a receive block.
 * Requires initialization.
 *
 * @param {string} secretKey - The secret key to create the block from, in hexadecimal format
 * @param {Object} data - Block data
 * @param {string} data.work - The PoW
 * @param {string} data.previous - The hash of the previous block on the account chain, in hexadecimal format
 * @param {string} data.source - The hash of the send block that is being received, in hexadecimal format
 * @return {Object} Block
 */
export function createReceiveBlock (secretKey, { work, previous, source }) {
  checkNotInitialized()

  if (!checkKey(secretKey)) throw new Error('Secret key is not valid')
  if (typeof work === 'undefined') work = null // TODO(breaking): Ensure work is set
  if (!checkHash(previous)) throw new Error('Previous is not valid')
  if (!checkHash(source)) throw new Error('Source is not valid')

  const hash = hashReceiveBlock(previous, source)
  const signature = signBlock(hash, secretKey)

  return {
    hash,
    block: {
      type: 'receive',
      previous,
      source,
      work,
      signature
    }
  }
}

/**
 * Create a send block.
 * Requires initialization.
 *
 * @param {string} secretKey - The secret key to create the block from, in hexadecimal format
 * @param {Object} data - Block data
 * @param {string} data.work - The PoW
 * @param {string} data.previous - The hash of the previous block on the account chain, in hexadecimal format
 * @param {string} data.destination - The destination address
 * @param {string} data.balance - The balance, in raw
 * @return {Object} Block
 */
export function createSendBlock (secretKey, { work, previous, destination, balance }) {
  checkNotInitialized()

  if (!checkKey(secretKey)) throw new Error('Secret key is not valid')
  if (typeof work === 'undefined') work = null // TODO(breaking): Ensure work is set
  if (!checkHash(previous)) throw new Error('Previous is not valid')
  if (!checkAddress(destination)) throw new Error('Destination is not valid')
  if (!checkBalance(balance)) throw new Error('Balance is not valid')

  const hash = hashSendBlock(previous, destination, balance)
  const signature = signBlock(hash, secretKey)
  const balanceHex = _convertAmountDecimalIntegerToHex(balance)

  return {
    hash,
    block: {
      type: 'send',
      previous,
      destination,
      balance: balanceHex,
      work,
      signature
    }
  }
}

/**
 * Create a change block.
 * Requires initialization.
 *
 * @param {string} secretKey - The secret key to create the block from, in hexadecimal format
 * @param {Object} data - Block data
 * @param {string} data.work - The PoW
 * @param {string} data.previous - The hash of the previous block on the account chain, in hexadecimal format
 * @param {string} data.representative - The representative address
 * @return {Object} Block
 */
export function createChangeBlock (secretKey, { work, previous, representative }) {
  checkNotInitialized()

  if (!checkKey(secretKey)) throw new Error('Secret key is not valid')
  if (typeof work === 'undefined') work = null // TODO(breaking): Ensure work is set
  if (!checkHash(previous)) throw new Error('Previous is not valid')
  if (!checkAddress(representative)) throw new Error('Representative is not valid')

  const hash = hashChangeBlock(previous, representative)
  const signature = signBlock(hash, secretKey)

  return {
    hash,
    block: {
      type: 'change',
      previous,
      representative,
      work,
      signature
    }
  }
}
