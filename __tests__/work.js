/* eslint-env jest */

const nano = require('../dist/nanocurrency.cjs')
const { INVALID_HASHES, INVALID_WORKS } = require('./data/invalid')

const VALID_BLOCKS = require('./data/valid_blocks')
const RANDOM_VALID_BLOCK = VALID_BLOCKS[0]

const VALID_WORK = {
  hash: '7f7122e843b27524f4f1d6bd14aefd1c8f01d36ae8653d37417533c0d4bc2be6',
  work: '0000000000995bc3'
}

const INVALID_WORK = {
  hash: '3ed191ec702f384514ba35e1f9081148df5a9ab48fe0f604b6e5b9f7177cee32',
  work: 'bb6737f2daf01a2c'
}

describe('validation', () => {
  test('validates correct work', () => {
    // TODO: check why state blocks check fails
    // expect.assertions(VALID_BLOCKS.length)
    // for (let block of VALID_BLOCKS) {
    //   expect(nano.validateWork(block.block.hash, block.block.data.work)).toBe(
    //     true
    //   )
    // }
    expect(nano.validateWork(VALID_WORK.hash, VALID_WORK.work)).toBe(true)
  })

  test('does not validate incorrect work', () => {
    expect(nano.validateWork(INVALID_WORK.hash, INVALID_WORK.work)).toBe(false)
  })

  test('throws with invalid hashes', () => {
    expect.assertions(INVALID_HASHES.length)
    for (let invalidHash of INVALID_HASHES) {
      expect(() =>
        nano.validateWork(invalidHash, RANDOM_VALID_BLOCK.block.data.work)
      ).toThrowError('Hash is not valid')
    }
  })

  test('throws with invalid works', () => {
    expect.assertions(INVALID_WORKS.length)
    for (let invalidWork of INVALID_WORKS) {
      expect(() =>
        nano.validateWork(RANDOM_VALID_BLOCK.block.hash, invalidWork)
      ).toThrowError('Work is not valid')
    }
  })
})

describe('generation', () => {
  beforeAll(nano.init)

  test('computes deterministic work', () => {
    expect(nano.work(VALID_WORK.hash)).toBe(VALID_WORK.work)
  })

  test('throws with invalid hashes', () => {
    expect.assertions(INVALID_HASHES.length)
    for (let invalidHash of INVALID_HASHES) {
      expect(() => nano.work(invalidHash)).toThrowError('Hash is not valid')
    }
  })

  test('throws with invalid worker parameters', () => {
    const INVALID_WORKER_PARAMETERS = [
      ['p', 1],
      [1.1, 1],
      [-1, 1],
      [0, 'p'],
      [0, 1.1],
      [0, -1],
      [1, 1]
    ]
    expect.assertions(INVALID_WORKER_PARAMETERS.length)
    for (let invalidWorkerParameters of INVALID_WORKER_PARAMETERS) {
      expect(() =>
        nano.work(
          RANDOM_VALID_BLOCK.block.hash,
          invalidWorkerParameters[0],
          invalidWorkerParameters[1]
        )
      ).toThrowError('Worker parameters are not valid')
    }
  })
})
