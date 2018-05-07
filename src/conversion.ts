/*!
 * nanocurrency-js: A toolkit for the Nano cryptocurrency.
 * Copyright (c) 2018 Marvin ROGER <dev at marvinroger dot fr>
 * Licensed under GPL-3.0 (https://git.io/vAZsK)
 */
import BigNumber from 'bignumber.js'

import { checkNumber, checkBalance } from './check'

const TunedBigNumber = BigNumber.clone({ EXPONENTIAL_AT: 1e9 })

const ZEROES: { [index: string]: number } = {
  hex: 0,
  raw: 0,
  nano: 24,
  knano: 27,
  Nano: 30,
  NANO: 30,
  KNano: 33,
  MNano: 36
}

/**
 * Convert a value from one Nano unit to another.
 * Does not require initialization.
 *
 * @param value - The value to convert
 * @param units - Units
 * @param units.from - The unit to convert the value from. One of 'hex', 'raw', 'nano', 'knano', 'Nano', 'NANO', 'KNano', 'MNano'
 * @param units.to - The unit to convert the value to. Same units as units.from
 * @returns Converted number
 */
export function convert (value: string, { from = 'Nano', to = 'raw' } = {}) {
  if ((from === 'hex' && !checkBalance(value)) || !checkNumber(value)) {
    throw new Error('Value is not valid')
  }

  const fromZeroes: number | undefined = ZEROES[from]
  const toZeroes: number | undefined = ZEROES[to]

  if (typeof fromZeroes === 'undefined' || typeof toZeroes === 'undefined') {
    throw new Error('From or to is not valid')
  }

  const difference = fromZeroes - toZeroes

  let bigNumber
  if (from === 'hex') {
    bigNumber = new TunedBigNumber('0x' + value)
  } else {
    bigNumber = new TunedBigNumber(value)
  }

  if (difference < 0) {
    for (let i = 0; i < -difference; i++) {
      bigNumber = bigNumber.dividedBy(10)
    }
  } else if (difference > 0) {
    for (let i = 0; i < difference; i++) {
      bigNumber = bigNumber.multipliedBy(10)
    }
  }

  if (to === 'hex') {
    return bigNumber.toString(16).padStart(32, '0')
  } else {
    return bigNumber.toString()
  }
}
