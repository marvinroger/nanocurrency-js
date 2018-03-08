/*!
 * nanocurrency-js: A toolkit for the Nano cryptocurrency.
 * Copyright (c) 2018 Marvin ROGER <dev at marvinroger dot fr>
 * Licensed under GPL-3.0 (https://git.io/vAZsK)
 */
import Native from '../native.tmp'

export const C_BINDING = {
  instance_: null,
  work: null,
  validateWork: null,
  deriveSecretKey: null,
  derivePublicKey: null,
  deriveAddress: null,
  hashReceiveBlock: null,
  hashOpenBlock: null,
  hashChangeBlock: null,
  hashSendBlock: null,
  signBlock: null,
  verifyBlock: null,
  convertAmountDecimalIntegerToHex: null
}

/**
 * Initialize the library.
 *
 * @return {Promise<void>}
 */
export function init () {
  return new Promise((resolve, reject) => {
    try {
      Native().then(native => {
        C_BINDING.instance_ = native
        C_BINDING.work = native.cwrap('emscripten_work', 'string', ['string', 'number', 'number'])
        C_BINDING.validateWork = native.cwrap('emscripten_validate_work', 'number', ['string', 'string'])
        C_BINDING.deriveSecretKey = native.cwrap('emscripten_derive_secret_key', 'string', ['string', 'number'])
        C_BINDING.derivePublicKey = native.cwrap('emscripten_derive_public_key', 'string', ['string'])
        C_BINDING.deriveAddress = native.cwrap('emscripten_derive_address', 'string', ['string'])
        C_BINDING.hashReceiveBlock = native.cwrap('emscripten_hash_receive_block', 'string', ['string', 'string'])
        C_BINDING.hashOpenBlock = native.cwrap('emscripten_hash_open_block', 'string', ['string', 'string', 'string'])
        C_BINDING.hashChangeBlock = native.cwrap('emscripten_hash_change_block', 'string', ['string', 'string'])
        C_BINDING.hashSendBlock = native.cwrap('emscripten_hash_send_block', 'string', ['string', 'string', 'string'])
        C_BINDING.signBlock = native.cwrap('emscripten_sign_block', 'string', ['string', 'string'])
        C_BINDING.verifyBlock = native.cwrap('emscripten_verify_block', 'number', ['string', 'string', 'string'])
        C_BINDING.convertAmountDecimalIntegerToHex = native.cwrap('emscripten_convert_amount_decimal_integer_to_hex', 'string', ['string'])

        resolve()
      })
    } catch (err) {
      reject(err)
    }
  })
}

/**
 * Get whether or not the library is ready to be used ({@link #init} has been called).
 *
 * @return {boolean}
 */
export function isReady () {
  return C_BINDING.instance_ !== null
}

export function checkNotInitialized () {
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
