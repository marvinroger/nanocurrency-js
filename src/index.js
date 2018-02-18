/*!
 * nanocurrency-js: A toolkit for the Nano cryptocurrency.
 * Copyright (c) 2018 Marvin ROGER <dev at marvinroger dot fr>
 * Licensed under GPL-3.0 (https://git.io/vAZsK)
 */
import Native from '../native'

const IS_NODE = typeof exports === 'object' && '' + exports === '[object Object]'
let fillRandom = null

let instance = null
let _generateWork = null
let _validateWork = null
let _computeSecretKey = null
let _computePublicKey = null
let _computeAddress = null
let _computeSignature = null
let _computeReceiveBlockHash = null
let _computeOpenBlockHash = null
let _computeChangeBlockHash = null
let _computeSendBlockHash = null
export function init () {
  return new Promise((resolve, reject) => {
    try {
      if (!IS_NODE) {
        fillRandom = window.crypto.getRandomValues
      } else {
        fillRandom = require('crypto').randomFillSync
      }

      Native().then(native => {
        instance = native
        _generateWork = instance.cwrap('emscripten_generate_work', 'string', ['string', 'number', 'number'])
        _validateWork = instance.cwrap('emscripten_validate_work', 'number', ['string', 'string'])
        _computeSecretKey = instance.cwrap('emscripten_compute_secret_key', 'string', ['string', 'number'])
        _computePublicKey = instance.cwrap('emscripten_compute_public_key', 'string', ['string'])
        _computeAddress = instance.cwrap('emscripten_compute_address', 'string', ['string'])
        _computeSignature = instance.cwrap('emscripten_compute_signature', 'string', ['string', 'string', 'string'])
        _computeReceiveBlockHash = instance.cwrap('emscripten_compute_receive_block_hash', 'string', ['string', 'string'])
        _computeOpenBlockHash = instance.cwrap('emscripten_compute_open_block_hash', 'string', ['string', 'string', 'string'])
        _computeChangeBlockHash = instance.cwrap('emscripten_compute_change_block_hash', 'string', ['string', 'string'])
        _computeSendBlockHash = instance.cwrap('emscripten_compute_send_block_hash', 'string', ['string', 'string', 'string'])

        resolve()
      })
    } catch (err) {
      reject(err)
    }
  })
}

const checkNotInitialized = () => {
  if (instance === null) throw new Error('NanoCurrency is not initialized')
}
const checkString = candidate => typeof candidate === 'string'
export const checkSeed = hash => checkString(hash) && hash.match(/[0-9a-fA-F]{64}/)
export const checkHash = checkSeed
export const checkKey = checkSeed
export const checkAddress = address => checkString(address) && address.match(/xrb_[13][0-9a-km-uw-z]/)
export const checkWork = work => checkString(work) && work.match(/[0-9a-fA-F]{16}/)
export const checkSignature = signature => checkString(signature) && signature.match(/[0-9a-fA-F]{128}/)

export function generateWork (blockHash, workerNumber = 0, workerCount = 1) {
  checkNotInitialized()

  if (!checkHash(blockHash)) throw new Error('Hash is not valid')
  if (
    !Number.isInteger(workerNumber) ||
    !Number.isInteger(workerCount) ||
    workerNumber < 0 ||
    workerCount < 1 ||
    workerNumber > workerCount - 1
  ) throw new Error('Worker parameters are not valid')

  const work = _generateWork(blockHash, workerNumber, workerCount)

  return work !== '0000000000000000' ? work : null
}

export function validateWork (blockHash, work) {
  checkNotInitialized()

  if (!checkHash(blockHash)) throw new Error('Hash is not valid')
  if (!checkWork(work)) throw new Error('Work is not valid')

  const valid = _validateWork(blockHash, work) === 1

  return valid
}

export function generateSeed () {
  checkNotInitialized()

  const seed = new Uint8Array(32)
  fillRandom(seed)

  return seed.reduce(function (hex, i) {
    return hex + ('0' + i.toString(16)).slice(-2)
  }, '')
}

export function computeSecretKey (seed, index) {
  checkNotInitialized()

  if (!checkSeed(seed)) throw new Error('Seed is not valid')
  if (
    !Number.isInteger(index) ||
    index < 0
  ) throw new Error('Index is not valid')

  return _computeSecretKey(seed, index)
}

export function computePublicKey (secretKey) {
  checkNotInitialized()

  if (!checkKey(secretKey)) throw new Error('Secret key is not valid')

  return _computePublicKey(secretKey)
}

export function computeAddress (publicKey) {
  checkNotInitialized()

  if (!checkKey(publicKey)) throw new Error('Public key is not valid')

  return _computeAddress(publicKey)
}

export function computeSignature (blockHash, secretKey, publicKey) {
  checkNotInitialized()

  if (!checkHash(blockHash)) throw new Error('Hash is not valid')
  if (!checkKey(secretKey)) throw new Error('Secret key is not valid')
  if (!checkKey(publicKey)) throw new Error('Public key is not valid')

  return _computeSignature(blockHash, secretKey, publicKey)
}

export function computeReceiveBlockHash (previous, source) {
  checkNotInitialized()

  if (!checkHash(previous)) throw new Error('Previous is not valid')
  if (!checkHash(source)) throw new Error('Source is not valid')

  return _computeReceiveBlockHash(previous, source)
}

export function computeOpenBlockHash (source, representative, account) {
  checkNotInitialized()

  if (!checkHash(source)) throw new Error('Source is not valid')
  if (!checkAddress(representative)) throw new Error('Representative is not valid')
  if (!checkAddress(account)) throw new Error('Account is not valid')

  return _computeOpenBlockHash(source, representative, account)
}

export function computeChangeBlockHash (previous, representative) {
  checkNotInitialized()

  if (!checkHash(previous)) throw new Error('Previous is not valid')
  if (!checkAddress(representative)) throw new Error('Representative is not valid')

  return _computeChangeBlockHash(previous, representative)
}

export function computeSendBlockHash (previous, destination, amount) {
  checkNotInitialized()

  if (!checkHash(previous)) throw new Error('Previous is not valid')
  if (!checkAddress(destination)) throw new Error('Destination is not valid')
  const amountError = new Error('Amount is not valid')
  if (amount.length > 39) throw amountError
  for (let char of amount) {
    if (char < '0' || char > '9') throw amountError
  }

  return _computeSendBlockHash(previous, destination, amount)
}
