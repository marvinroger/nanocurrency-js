/* eslint-env jest */

const nano = require('../dist/nanocurrency.cjs');
const { INVALID_HASHES } = require('./data/invalid');

const VALID_BLOCKS = require('./data/valid_blocks');
const RANDOM_VALID_BLOCK = VALID_BLOCKS[0];

const VALID_WORK = {
  hash: '7f7122e843b27524f4f1d6bd14aefd1c8f01d36ae8653d37417533c0d4bc2be6',
  work: '0000000000995bc3',
};

describe('computeWork', () => {
  test('computes deterministic work', async () => {
    const result = await nano.computeWork(VALID_WORK.hash);
    expect(result).toBe(VALID_WORK.work);
  });

  test('throws with invalid hashes', () => {
    expect.assertions(INVALID_HASHES.length);
    for (let invalidHash of INVALID_HASHES) {
      expect(nano.computeWork(invalidHash)).rejects.toThrow('Hash is not valid');
    }
  });

  test('throws with invalid worker parameters', () => {
    const INVALID_WORKER_PARAMETERS = [
      ['p', 1],
      [1.1, 1],
      [-1, 1],
      [0, 'p'],
      [0, 1.1],
      [0, -1],
      [1, 1],
    ];
    expect.assertions(INVALID_WORKER_PARAMETERS.length);
    for (let invalidWorkerParameters of INVALID_WORKER_PARAMETERS) {
      expect(
        nano.computeWork(VALID_WORK.hash, {
          workerIndex: invalidWorkerParameters[0],
          workerCount: invalidWorkerParameters[1],
        })
      ).rejects.toThrow('Worker parameters are not valid');
    }
  });
});
