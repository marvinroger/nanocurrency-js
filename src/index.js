/*!
 * nanocurrency-js: A toolkit for the Nano cryptocurrency.
 * Copyright (c) 2018 Marvin ROGER <dev at marvinroger dot fr>
 * Licensed under GPL-3.0 (https://git.io/vAZsK)
 */
import Native from '../native.tmp'

const IS_NODE = Object.prototype.toString.call(typeof process !== 'undefined' ? process : 0) === '[object process]'
let fillRandom = null

let instance = null
let _work = null
let _validateWork = null
let _computeSecretKey = null
let _computePublicKey = null
let _computeAddress = null
let _hashReceiveBlock = null
let _hashOpenBlock = null
let _hashChangeBlock = null
let _hashSendBlock = null
let _signBlock = null
let _verifyBlock = null
export function init () {
  return new Promise((resolve, reject) => {
    try {
      if (!IS_NODE) {
        fillRandom = self.crypto.getRandomValues // eslint-disable-line
      } else {
        const {promisify} = require('util')
        fillRandom = promisify(require('crypto').randomFill)
      }

      Native().then(native => {
        instance = native
        _work = instance.cwrap('emscripten_work', 'string', ['string', 'number', 'number'])
        _validateWork = instance.cwrap('emscripten_validate_work', 'number', ['string', 'string'])
        _computeSecretKey = instance.cwrap('emscripten_compute_secret_key', 'string', ['string', 'number'])
        _computePublicKey = instance.cwrap('emscripten_compute_public_key', 'string', ['string'])
        _computeAddress = instance.cwrap('emscripten_compute_address', 'string', ['string'])
        _hashReceiveBlock = instance.cwrap('emscripten_hash_receive_block', 'string', ['string', 'string'])
        _hashOpenBlock = instance.cwrap('emscripten_hash_open_block', 'string', ['string', 'string', 'string'])
        _hashChangeBlock = instance.cwrap('emscripten_hash_change_block', 'string', ['string', 'string'])
        _hashSendBlock = instance.cwrap('emscripten_hash_send_block', 'string', ['string', 'string', 'string'])
        _signBlock = instance.cwrap('emscripten_sign_block', 'string', ['string', 'string'])
        _verifyBlock = instance.cwrap('emscripten_verify_block', 'number', ['string', 'string', 'string'])

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
export const checkAddress = address => checkString(address) && address.match(/xrb_[13][0-9a-km-uw-z]{59}/)
export const checkWork = work => checkString(work) && work.match(/[0-9a-fA-F]{16}/)
export const checkSignature = signature => checkString(signature) && signature.match(/[0-9a-fA-F]{128}/)

export function work (blockHash, workerNumber = 0, workerCount = 1) {
  checkNotInitialized()

  if (!checkHash(blockHash)) throw new Error('Hash is not valid')
  if (
    !Number.isInteger(workerNumber) ||
    !Number.isInteger(workerCount) ||
    workerNumber < 0 ||
    workerCount < 1 ||
    workerNumber > workerCount - 1
  ) throw new Error('Worker parameters are not valid')

  const work = _work(blockHash, workerNumber, workerCount)

  return work !== '0000000000000000' ? work : null
}

export function validateWork (blockHash, work) {
  checkNotInitialized()

  if (!checkHash(blockHash)) throw new Error('Hash is not valid')
  if (!checkWork(work)) throw new Error('Work is not valid')

  const valid = _validateWork(blockHash, work) === 1

  return valid
}

export async function generateSeed () {
  checkNotInitialized()

  const seed = new Uint8Array(32)
  await fillRandom(seed)

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

export function hashReceiveBlock (previous, source) {
  checkNotInitialized()

  if (!checkHash(previous)) throw new Error('Previous is not valid')
  if (!checkHash(source)) throw new Error('Source is not valid')

  return _hashReceiveBlock(previous, source)
}

export function hashOpenBlock (source, representative, account) {
  checkNotInitialized()

  if (!checkHash(source)) throw new Error('Source is not valid')
  if (!checkAddress(representative)) throw new Error('Representative is not valid')
  if (!checkAddress(account)) throw new Error('Account is not valid')

  return _hashOpenBlock(source, representative, account)
}

export function hashChangeBlock (previous, representative) {
  checkNotInitialized()

  if (!checkHash(previous)) throw new Error('Previous is not valid')
  if (!checkAddress(representative)) throw new Error('Representative is not valid')

  return _hashChangeBlock(previous, representative)
}

export function hashSendBlock (previous, destination, balance) {
  checkNotInitialized()

  if (!checkHash(previous)) throw new Error('Previous is not valid')
  if (!checkAddress(destination)) throw new Error('Destination is not valid')
  const balanceError = new Error('Balance is not valid')
  if (!checkString(balance) || balance.length > 39) throw balanceError
  for (let char of balance) {
    if (char < '0' || char > '9') throw balanceError
  }

  return _hashSendBlock(previous, destination, balance)
}

export function signBlock (blockHash, secretKey) {
  checkNotInitialized()

  if (!checkHash(blockHash)) throw new Error('Hash is not valid')
  if (!checkKey(secretKey)) throw new Error('Secret key is not valid')

  return _signBlock(blockHash, secretKey)
}

export function verifyBlock (blockHash, signature, publicKey) {
  checkNotInitialized()

  if (!checkHash(blockHash)) throw new Error('Hash is not valid')
  if (!checkSignature(signature)) throw new Error('Signature is not valid')
  if (!checkKey(publicKey)) throw new Error('Public key is not valid')

  const valid = _verifyBlock(blockHash, signature, publicKey) === 1

  return valid
}

export function createOpenBlock (secretKey, { source, representative, account }) {
  const hash = hashOpenBlock(source, representative, account)
  const signature = signBlock(hash, secretKey)

  return {
    hash,
    block: {
      type: 'open',
      source,
      representative,
      account,
      work: 'TODO',
      signature
    }
  }
}

export function createReceiveBlock (secretKey, { previous, source }) {
  const hash = hashReceiveBlock(previous, source)
  const signature = signBlock(hash, secretKey)

  return {
    hash,
    block: {
      type: 'receive',
      previous,
      source,
      work: 'TODO',
      signature
    }
  }
}

export function createSendBlock (secretKey, { previous, destination, balance }) {
  const hash = hashSendBlock(previous, destination, balance)
  const signature = signBlock(hash, secretKey)

  return {
    hash,
    block: {
      type: 'send',
      previous,
      destination,
      balance,
      work: 'TODO',
      signature
    }
  }
}

export function createChangeBlock (secretKey, { previous, representative }) {
  const hash = hashChangeBlock(previous, representative)
  const signature = signBlock(hash, secretKey)

  return {
    hash,
    block: {
      type: 'change',
      previous,
      representative,
      work: 'TODO',
      signature
    }
  }
}
