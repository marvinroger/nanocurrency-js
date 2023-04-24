/*!
 * nanocurrency-js: A toolkit for the Nano cryptocurrency.
 * Copyright (c) 2019 Marvin ROGER <dev at marvinroger dot fr>
 * Licensed under GPL-3.0 (https://git.io/vAZsK)
 */
import BigNumber from 'bignumber.js'
import { checkNumber } from './check'

/** Nano unit. */
export enum Unit {
  /** 10^0 raw in hexadecimal format */
  hex = 'hex',
  /** 10^0 raw */
  raw = 'raw',
  /** 10^30 raw */
  nano = 'nano',
}

const ZEROES: { [unit in keyof typeof Unit]: number } = {
  hex: 0,
  raw: 0,
  nano: 30,
}

const TunedBigNumber = BigNumber.clone({
  EXPONENTIAL_AT: 1e9,
  DECIMAL_PLACES: ZEROES.MNano,
})

/** Convert parameters. */
export interface ConvertParams {
  /** The unit to convert the value from */
  from: Unit
  /** The unit to convert the value to */
  to: Unit
}

/**
 * Convert a value from one Nano unit to another.
 *
 * @param value - The value to convert
 * @param params - Params
 * @returns Converted number
 */
export function convert(value: string, params: ConvertParams): string {
  const paramsNotValid = new Error('From or to is not valid')
  if (!params) throw paramsNotValid

  const fromZeroes: number | undefined = ZEROES[params.from]
  const toZeroes: number | undefined = ZEROES[params.to]

  if (typeof fromZeroes === 'undefined' || typeof toZeroes === 'undefined') {
    throw new Error('From or to is not valid')
  }

  const valueNotValid = new Error('Value is not valid')
  if (params.from === 'hex') {
    if (!/^[0-9a-fA-F]{32}$/.test(value)) throw valueNotValid
  } else {
    if (!checkNumber(value)) throw valueNotValid
  }

  const difference = fromZeroes - toZeroes

  let bigNumber
  if (params.from === 'hex') {
    bigNumber = new TunedBigNumber(`0x${value}`)
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

  if (params.to === 'hex') {
    return bigNumber.toString(16).padStart(32, '0')
  }

  return bigNumber.toString()
}
