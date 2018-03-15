/*!
 * nanocurrency-js: A toolkit for the Nano cryptocurrency.
 * Copyright (c) 2018 Marvin ROGER <dev at marvinroger dot fr>
 * Licensed under GPL-3.0 (https://git.io/vAZsK)
 */
import base32Encode from 'base32-encode'
import base32Decode from 'base32-decode'

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

const BASE32_MAPPING = {
  A: '1',
  B: '3',
  C: '4',
  D: '5',
  E: '6',
  F: '7',
  G: '8',
  H: '9',
  I: 'a',
  J: 'b',
  K: 'c',
  L: 'd',
  M: 'e',
  N: 'f',
  O: 'g',
  P: 'h',
  Q: 'i',
  R: 'j',
  S: 'k',
  T: 'm',
  U: 'n',
  V: 'o',
  W: 'p',
  X: 'q',
  Y: 'r',
  Z: 's',
  2: 't',
  3: 'u',
  4: 'w',
  5: 'x',
  6: 'y',
  7: 'z'
}

export function byteArrayToBase32 (byteArray) {
  return base32Encode(byteArray, 'RFC4648')
    .split('')
    .map(c => BASE32_MAPPING[c])
    .join('')
}

export function base32ToByteArray (base32) {
  const mapped = base32
    .split('')
    .map(c =>
      Object.keys(BASE32_MAPPING).find(key => BASE32_MAPPING[key] === c)
    )
    .join('')

  const decoded = base32Decode(mapped, 'RFC4648')

  return new Uint8Array(decoded)
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
