/* eslint-env jest */
/* eslint-disable @typescript-eslint/no-var-requires */

const nano = require('../dist/nanocurrency.cjs')
const { INVALID_HASHES } = require('./data/invalid')

const VALID_WORK = {
  hash: 'b9cb6b51b8eb869af085c4c03e7dc539943d0bdde13b21436b687c9c7ea56cb0',
  work: '0000000000010600',
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
