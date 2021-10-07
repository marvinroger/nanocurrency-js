/*!
 * nanocurrency-js: A toolkit for the Nano cryptocurrency.
 * Copyright (c) 2021 Marvin ROGER <bonjour+code at marvinroger dot fr>
 * Licensed under GPL-3.0 (https://git.io/vAZsK)
 */
import BigNumber from 'bignumber.js'

import { checkNumber } from './check'

/** Nano unit. */
export enum Unit {
  /** 10^0 raw */
  raw = 'raw',
  /** 10^24 raw */
  nano = 'nano',
  /** 10^27 raw */
  knano = 'knano',
  /** 10^30 raw */
  Nano = 'Nano',
  /** 10^30 raw */
  NANO = 'NANO',
  /** 10^33 raw */
  KNano = 'KNano',
  /** 10^36 raw */
  MNano = 'MNano',
}

export enum Base {
  Decimal = 10,
  Hex = 16,
}

const ZEROES_MAP: { [unit in keyof typeof Unit]: number } = {
  raw: 0,
  nano: 24,
  knano: 27,
  Nano: 30,
  NANO: 30,
  KNano: 33,
  MNano: 36,
}

const TunedBigNumber = BigNumber.clone({
  DECIMAL_PLACES: ZEROES_MAP.MNano,
  EXPONENTIAL_AT: 1e9,
})

/** Convert parameters. */
export interface ConvertParams {
  from: {
    /** The unit to convert the value from */
    unit: Unit
    /** The base the input value is represented in. Defaults to 10 */
    base?: Base
  }

  to: {
    /** The unit to convert the value to */
    unit: Unit
    /** The base the output value must be represented in. Defaults to 10 */
    base?: Base
  }
}

/**
 * Convert a value from one Nano unit to another.
 *
 * @param value - The value to convert
 * @param params - Params
 *
 * @returns Converted number
 */
export function convert(value: string, params: ConvertParams): string {
  const valueNotValid = new Error('Value is not valid')
  if (params.from.base === Base.Hex) {
    if (!/^[0-9a-fA-F]{32}$/.test(value)) throw valueNotValid
  } else {
    if (!checkNumber(value)) throw valueNotValid
  }

  const fromZeroes: number | undefined = ZEROES_MAP[params.from.unit]
  const toZeroes: number | undefined = ZEROES_MAP[params.to.unit]

  let bigNumberValue = new TunedBigNumber(value, params.from.base)

  const difference = fromZeroes - toZeroes

  if (difference < 0) {
    for (let i = 0; i < -difference; i++) {
      bigNumberValue = bigNumberValue.dividedBy(10)
    }
  } else if (difference > 0) {
    for (let i = 0; i < difference; i++) {
      bigNumberValue = bigNumberValue.multipliedBy(10)
    }
  }

  if (params.to.base === Base.Hex) {
    return bigNumberValue.toString(Base.Hex).padStart(32, '0')
  }

  return bigNumberValue.toString()
}
