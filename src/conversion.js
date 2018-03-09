/*!
 * nanocurrency-js: A toolkit for the Nano cryptocurrency.
 * Copyright (c) 2018 Marvin ROGER <dev at marvinroger dot fr>
 * Licensed under GPL-3.0 (https://git.io/vAZsK)
 */
import { checkNumber } from './common'

const ZEROES = {
  raw: 0,
  nano: 24,
  knano: 27,
  Nano: 30,
  NANO: 30,
  KNano: 33,
  MNano: 36
}

function normalizeNumber (value) {
  let hasDecimals = value.includes('.')

  // strip first zeroes
  while (true) {
    let char = value[0]
    let followingChar = value[1]

    if (char === '0' && followingChar >= '0' && followingChar <= '9') {
      value = value.substring(1)
    } else {
      break
    }
  }

  // strip last zeroes
  if (hasDecimals) {
    while (true) {
      let char = value[value.length - 1]
      let previousChar = value[value.length - 2]

      if (char === '0' && previousChar >= '0' && previousChar <= '9') {
        value = value.slice(0, -1)
      } else {
        break
      }
    }
  }

  // remove decimal part if useless
  if (value.endsWith('.0')) {
    value = value.slice(0, -2)
    hasDecimals = false
  }

  // convert decimal to integer
  let shift = 0

  if (hasDecimals) {
    const splitted = value.split('.')
    const decimals = splitted[1]
    shift = decimals.length
    value = value.replace('.', '')
    value = normalizeNumber(value).value // might start with 0 after shift
  }

  return {
    value,
    shift
  }
}

/**
 * Convert a value from one Nano unit to another.
 * Does not require initialization.
 *
 * @param {string} value - The value to convert
 * @param {Object} units - Units
 * @param {string} units.from - The unit to convert the value from. One of 'raw', 'nano', 'knano', 'Nano', 'NANO', 'KNano', 'MNano'
 * @param {string} units.to - The unit to convert the value to. Same units as units.from
 * @return {string} Converted number
 */
export function convert (value, { from, to } = {}) {
  if (!checkNumber(value)) throw new Error('Value is not valid')

  const fromZeroes = ZEROES[from]
  const toZeroes = ZEROES[to]

  if (typeof fromZeroes === 'undefined' || typeof toZeroes === 'undefined') {
    throw new Exception('From or to is not valid')
  }

  let { value: normalizedValue, shift } = normalizeNumber(value)

  const decimalMultiplicator = 0

  const difference = fromZeroes - toZeroes - shift

  if (difference > 0) {
    normalizedValue += '0'.repeat(difference)
  } else if (difference < 0) {
    normalizedValue = '0.' + '0'.repeat(-difference - 1) + normalizedValue
  }

  return normalizedValue
}
