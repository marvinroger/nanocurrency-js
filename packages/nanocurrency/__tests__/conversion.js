/* eslint-env jest */
/* eslint-disable @typescript-eslint/no-var-requires */

const nano = require('../dist/nanocurrency.cjs')
const INVALID_NUMBERS = [12, '.01', '0.1.', '0..1', 'z']
const INVALID_UNITS = [12, '', 'nona', 'Kanano']

const VALID_CONVERSIONS = [
  {
    value: '1',
    from: 'Nano',
    to: 'raw',
    result: '1000000000000000000000000000000',
  },
  {
    value: '2000000000000000000000000000000',
    from: 'raw',
    to: 'Nano',
    result: '2',
  },
  {
    value: '3',
    from: 'nano',
    to: 'knano',
    result: '0.003',
  },
  {
    value: '3.3',
    from: 'nano',
    to: 'knano',
    result: '0.0033',
  },
  {
    value: '0',
    from: 'Nano',
    to: 'KNano',
    result: '0',
  },
  {
    value: '000.000',
    from: 'Nano',
    to: 'KNano',
    result: '0',
  },
  {
    value: '000.00900',
    from: 'KNano',
    to: 'Nano',
    result: '9',
  },
  {
    value: '10000000000000000000000000000000',
    from: 'raw',
    to: 'hex',
    result: '0000007e37be2022c0914b2680000000',
  },
  {
    value: '0000007e37be2022c0914b2680000000',
    from: 'hex',
    to: 'raw',
    result: '10000000000000000000000000000000',
  },
]

describe('conversion', () => {
  test('converts correctly', () => {
    expect.assertions(VALID_CONVERSIONS.length)
    for (let validConversion of VALID_CONVERSIONS) {
      expect(
        nano.convert(validConversion.value, {
          from: validConversion.from,
          to: validConversion.to,
        })
      ).toBe(validConversion.result)
    }
  })

  test('throws with no explicit from and to units', () => {
    expect.assertions(3)
    const errorMsg = 'From or to is not valid'
    expect(() => nano.convert('1')).toThrowError(errorMsg)
    expect(() => nano.convert('1', { from: 'raw' })).toThrowError(errorMsg)
    expect(() => nano.convert('1', { to: 'Nano' })).toThrowError(errorMsg)
  })

  test('throws with invalid numbers', () => {
    expect.assertions(INVALID_NUMBERS.length)
    for (let invalidNumber of INVALID_NUMBERS) {
      expect(() =>
        nano.convert(invalidNumber, { from: 'raw', to: 'Nano' })
      ).toThrowError('Value is not valid')
    }
  })

  test('throws with invalid hex', () => {
    expect(() =>
      nano.convert('0000007e37be2022c0914b268000000', {
        from: 'hex',
        to: 'Nano',
      })
    ).toThrowError('Value is not valid')
  })

  test('throws with invalid from unit', () => {
    expect.assertions(INVALID_UNITS.length)
    for (let invalidUnit of INVALID_UNITS) {
      expect(() =>
        nano.convert('1', { from: invalidUnit, to: 'Nano' })
      ).toThrowError('From or to is not valid')
    }
  })

  test('throws with invalid to unit', () => {
    expect.assertions(INVALID_UNITS.length)
    for (let invalidUnit of INVALID_UNITS) {
      expect(() =>
        nano.convert('1', { from: 'Nano', to: invalidUnit })
      ).toThrowError('From or to is not valid')
    }
  })
})
