/* eslint-env jest */
/* eslint-disable @typescript-eslint/no-var-requires */

const nano = require('../dist/nanocurrency.cjs')
const { INVALID_HASHES } = require('./data/invalid')

const VALID_WORK = {
  hash: 'e65cf3f83296f1abf0447775168bf08c78e9ec4dbaa83f43d87d1ee5ebd990ac',
  work: '0000000000059600',
}

describe('computeWork', () => {
  test('computes deterministic work', async () => {
    const result = await nano.computeWork(VALID_WORK.hash)
    expect(result).toBe(VALID_WORK.work)
  })

  test('throws with invalid hashes', () => {
    expect.assertions(INVALID_HASHES.length)
    for (let invalidHash of INVALID_HASHES) {
      expect(nano.computeWork(invalidHash)).rejects.toThrow('Hash is not valid')
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
      [1, 1],
    ]
    expect.assertions(INVALID_WORKER_PARAMETERS.length)
    for (let invalidWorkerParameters of INVALID_WORKER_PARAMETERS) {
      expect(
        nano.computeWork(VALID_WORK.hash, {
          workerIndex: invalidWorkerParameters[0],
          workerCount: invalidWorkerParameters[1],
        })
      ).rejects.toThrow('Worker parameters are not valid')
    }
  })
})
