/* eslint-env jest */

const nano = require('../dist/nanocurrency.cjs')

const VALID_WORK = {
  hash: '7f7122e843b27524f4f1d6bd14aefd1c8f01d36ae8653d37417533c0d4bc2be6',
  work: '0000000000995bc3'
}

const INVALID_WORK = {
  hash: '3ed191ec702f384514ba35e1f9081148df5a9ab48fe0f604b6e5b9f7177cee32',
  work: 'bb6737f2daf01a2c'
}

beforeAll(nano.init)

test('validates correct block', () => {
  expect(nano.validateWork(VALID_WORK.hash, VALID_WORK.work))
    .toBe(true)
})

test('does not validate incorrect block', () => {
  expect(nano.validateWork(INVALID_WORK.hash, INVALID_WORK.work))
    .toBe(false)
})

test('computes deterministic work', () => {
  expect(nano.generateWork(VALID_WORK.hash))
    .toBe(VALID_WORK.work)
})
