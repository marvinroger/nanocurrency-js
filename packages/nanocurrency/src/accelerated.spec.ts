/* eslint-disable @typescript-eslint/no-var-requires */

import * as nano from '../'

import { INVALID_HASHES } from './test-data/invalid'

const VALID_WORK = {
  hash: 'b9cb6b51b8eb869af085c4c03e7dc539943d0bdde13b21436b687c9c7ea56cb0',
  work: '0000000000010600',
}

describe('computeWork', () => {
  test('computes deterministic work', async () => {
    const result = await nano.computeWork(VALID_WORK.hash)
    expect(result).toBe(VALID_WORK.work)
  })

  test('throws with invalid hashes', async () => {
    expect.assertions(INVALID_HASHES.length)
    for (const invalidHash of INVALID_HASHES) {
      await expect(nano.computeWork(invalidHash)).rejects.toThrow(
        'Hash is not valid'
      )
    }
  })

  test('throws with invalid worker parameters', async () => {
    const INVALID_WORKER_PARAMETERS = [
      [1.1, 1],
      [-1, 1],
      [0, 1.1],
      [0, -1],
      [1, 1],
    ]
    expect.assertions(INVALID_WORKER_PARAMETERS.length)
    for (const invalidWorkerParameters of INVALID_WORKER_PARAMETERS) {
      await expect(
        nano.computeWork(VALID_WORK.hash, {
          workerIndex: invalidWorkerParameters[0],
          workerCount: invalidWorkerParameters[1],
        })
      ).rejects.toThrow('Worker parameters are not valid')
    }
  })
})
