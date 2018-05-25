/* eslint-env jest */

const nano = require('../dist/nanocurrency.cjs');
const { INVALID_HASHES, INVALID_WORKS } = require('./data/invalid');

const VALID_BLOCKS = require('./data/valid_blocks');
const RANDOM_VALID_BLOCK = VALID_BLOCKS[0];

const INVALID_WORK = {
  hash: '3ed191ec702f384514ba35e1f9081148df5a9ab48fe0f604b6e5b9f7177cee32',
  work: 'bb6737f2daf01a2c',
};

describe('validation', () => {
  test('validates correct work', () => {
    expect.assertions(VALID_BLOCKS.length);
    for (let block of VALID_BLOCKS) {
      let hash = block.block.data.previous;
      // if it's an open block
      if (hash === '0000000000000000000000000000000000000000000000000000000000000000') {
        hash = nano.derivePublicKey(block.block.data.account);
      }
      expect(nano.validateWork({ blockHash: hash, work: block.block.data.work })).toBe(true);
    }
  });

  test('does not validate incorrect work', () => {
    expect(nano.validateWork({ blockHash: INVALID_WORK.hash, work: INVALID_WORK.work })).toBe(
      false
    );
  });

  test('throws with invalid hashes', () => {
    expect.assertions(INVALID_HASHES.length);
    for (let invalidHash of INVALID_HASHES) {
      expect(() =>
        nano.validateWork({ blockHash: invalidHash, work: RANDOM_VALID_BLOCK.block.data.work })
      ).toThrowError('Hash is not valid');
    }
  });

  test('throws with invalid works', () => {
    expect.assertions(INVALID_WORKS.length);
    for (let invalidWork of INVALID_WORKS) {
      expect(() =>
        nano.validateWork({ blockHash: RANDOM_VALID_BLOCK.block.hash, work: invalidWork })
      ).toThrowError('Work is not valid');
    }
  });
});
