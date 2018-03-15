/* eslint-env jest */

const nano = require('../dist/nanocurrency.cjs')
const INVALID_NUMBERS = [12, '.01', '0.1.', '0..1', 'z']
const INVALID_UNITS = [12, '', 'nona', 'Kanano']

const VALID_CONVERSIONS = [
  {
    value: '1',
    from: 'Nano',
    to: 'raw',
    result: '1000000000000000000000000000000'
  },
  {
    value: '1',
    result: '1000000000000000000000000000000'
  },
  {
    value: '2000000000000000000000000000000',
    from: 'raw',
    to: 'Nano',
    result: '2'
  },
  {
    value: '3',
    from: 'nano',
    to: 'knano',
    result: '0.003'
  },
  {
    value: '0',
    from: 'Nano',
    to: 'KNano',
    result: '0'
  },
  {
    value: '000.000',
    from: 'Nano',
    to: 'KNano',
    result: '0'
  },
  {
    value: '000.00900',
    from: 'KNano',
    to: 'Nano',
    result: '9'
  }
]

describe('conversion', () => {
  test('converts correctly', () => {
    expect.assertions(VALID_CONVERSIONS.length)
    for (let validConversion of VALID_CONVERSIONS) {
      expect(
        nano.convert(validConversion.value, {
          from: validConversion.from,
          to: validConversion.to
        })
      ).toBe(validConversion.result)
    }
  })

  test('throws with invalid numbers', () => {
    expect.assertions(INVALID_NUMBERS.length)
    for (let invalidNumber of INVALID_NUMBERS) {
      expect(() => nano.convert(invalidNumber)).toThrowError(
        'Value is not valid'
      )
    }
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
