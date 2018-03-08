/*!
 * nanocurrency-js: A toolkit for the Nano cryptocurrency.
 * Copyright (c) 2018 Marvin ROGER <dev at marvinroger dot fr>
 * Licensed under GPL-3.0 (https://git.io/vAZsK)
 */
const IS_NODE = Object.prototype.toString.call(typeof process !== 'undefined' ? process : 0) === '[object process]'

let fillRandom = null
if (!IS_NODE) {
  fillRandom = bytes => {
    return new Promise(resolve => {
      self.crypto.getRandomValues(bytes) // eslint-disable-line
      resolve()
    })
  }
} else {
  const {promisify} = require('util')
  fillRandom = promisify(require('crypto').randomFill)
}

export function getRandomBytes (count) {
  return new Promise((resolve, reject) => {
    const bytes = new Uint8Array(count)
    fillRandom(bytes)
      .then(() => {
        resolve(bytes)
      })
      .catch(reject)
  })
}
