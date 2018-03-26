/*!
 * nanocurrency-js: A toolkit for the Nano cryptocurrency.
 * Copyright (c) 2018 Marvin ROGER <dev at marvinroger dot fr>
 * Licensed under GPL-3.0 (https://git.io/vAZsK)
 */
const IS_NODE =
  Object.prototype.toString.call(
    typeof process !== 'undefined' ? process : 0
  ) === '[object process]'

let fillRandom = null
if (!IS_NODE) {
  fillRandom = bytes => {
    return new Promise(resolve => {
      self.crypto.getRandomValues(bytes) // eslint-disable-line
      resolve()
    })
  }
} else {
  const { promisify } = require('util')
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

export function byteArrayToHex (byteArray) {
  if (!byteArray) {
    return ''
  }

  var hexStr = ''
  for (var i = 0; i < byteArray.length; i++) {
    var hex = (byteArray[i] & 0xff).toString(16)
    hex = hex.length === 1 ? '0' + hex : hex
    hexStr += hex
  }

  return hexStr.toUpperCase()
}

export function hexToByteArray (hex) {
  if (!hex) {
    return new Uint8Array()
  }

  var a = []
  for (var i = 0, len = hex.length; i < len; i += 2) {
    a.push(parseInt(hex.substr(i, 2), 16))
  }

  return new Uint8Array(a)
}

export function compareArrays (array1, array2) {
  for (let i = 0; i < array1.length; i++) {
    if (array1[i] !== array2[i]) return false
  }

  return true
}
