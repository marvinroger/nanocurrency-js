import * as nano from '../'

const INVALID_NUMBERS = ['.01', '0.1.', '0..1', '0...1', 'z']

const VALID_CONVERSIONS = [
  {
    value: '1',
    from: { unit: 'Nano' },
    to: { unit: 'raw' },
    result: '1000000000000000000000000000000',
  },
  {
    value: '1',
    from: { unit: 'raw' },
    to: { unit: 'Nano' },
    result: '0.000000000000000000000000000001',
  },
  {
    value: '9',
    from: { unit: 'raw' },
    to: { unit: 'MNano' },
    result: '0.000000000000000000000000000000000009',
  },
  {
    value: '2000000000000000000000000000000',
    from: { unit: 'raw' },
    to: { unit: 'Nano' },
    result: '2',
  },
  {
    value: '3',
    from: { unit: 'nano' },
    to: { unit: 'knano' },
    result: '0.003',
  },
  {
    value: '3.3',
    from: { unit: 'nano' },
    to: { unit: 'knano' },
    result: '0.0033',
  },
  {
    value: '0',
    from: { unit: 'Nano' },
    to: { unit: 'KNano' },
    result: '0',
  },
  {
    value: '000.000',
    from: { unit: 'Nano' },
    to: { unit: 'KNano' },
    result: '0',
  },
  {
    value: '000.00900',
    from: { unit: 'KNano' },
    to: { unit: 'Nano' },
    result: '9',
  },
  {
    value: '10000000000000000000000000000000',
    from: { unit: 'raw' },
    to: { unit: 'raw', base: 16 },
    result: '0000007e37be2022c0914b2680000000',
  },
  {
    value: '0000007e37be2022c0914b2680000000',
    from: { unit: 'raw', base: 16 },
    to: { unit: 'raw' },
    result: '10000000000000000000000000000000',
  },
] as const

describe('conversion', () => {
  test('converts correctly', () => {
    expect.assertions(VALID_CONVERSIONS.length)
    for (const validConversion of VALID_CONVERSIONS) {
      expect(
        nano.convert(validConversion.value, {
          from: validConversion.from,
          to: validConversion.to,
        })
      ).toBe(validConversion.result)
    }
  })

  test('throws with invalid numbers', () => {
    expect.assertions(INVALID_NUMBERS.length)
    for (const invalidNumber of INVALID_NUMBERS) {
      expect(() =>
        nano.convert(invalidNumber, {
          from: { unit: 'raw' },
          to: { unit: 'Nano' },
        })
      ).toThrowError('Value is not valid')
    }
  })

  test('throws with invalid hex', () => {
    expect(() =>
      nano.convert('0000007e37be2022c0914b268000000', {
        from: { unit: 'raw', base: 16 },
        to: { unit: 'Nano' },
      })
    ).toThrowError('Value is not valid')
  })
})
