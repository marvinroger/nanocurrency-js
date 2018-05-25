/* eslint-env jest */

const nano = require('../dist/nanocurrency.cjs');
const {
  INVALID_HASHES,
  INVALID_ADDRESSES,
  INVALID_HASHES_AND_ADDRESSES,
  INVALID_AMOUNTS,
} = require('./data/invalid');

const VALID_STATE_BLOCKS = require('./data/valid_blocks');
const RANDOM_VALID_STATE_BLOCK = VALID_STATE_BLOCKS[0];

describe('state', () => {
  test('creates correct state hash', () => {
    expect.assertions(VALID_STATE_BLOCKS.length);
    for (let validStateBlock of VALID_STATE_BLOCKS) {
      expect(
        nano.hashBlock(
          validStateBlock.block.data.account,
          validStateBlock.block.data.previous,
          validStateBlock.block.data.representative,
          validStateBlock.block.data.balance,
          validStateBlock.originalLink
        )
      ).toBe(validStateBlock.block.hash);
    }
  });

  test('throws with invalid account', () => {
    expect.assertions(INVALID_ADDRESSES.length);
    for (let invalidAddress of INVALID_ADDRESSES) {
      expect(() =>
        nano.hashBlock(
          invalidAddress,
          RANDOM_VALID_STATE_BLOCK.block.data.previous,
          RANDOM_VALID_STATE_BLOCK.block.data.representative,
          RANDOM_VALID_STATE_BLOCK.block.data.balance,
          RANDOM_VALID_STATE_BLOCK.originalLink
        )
      ).toThrowError('Account is not valid');
    }
  });

  test('throws with invalid previous', () => {
    expect.assertions(INVALID_HASHES.length);
    for (let invalidHash of INVALID_HASHES) {
      expect(() =>
        nano.hashBlock(
          RANDOM_VALID_STATE_BLOCK.block.data.account,
          invalidHash,
          RANDOM_VALID_STATE_BLOCK.block.data.representative,
          RANDOM_VALID_STATE_BLOCK.block.data.balance,
          RANDOM_VALID_STATE_BLOCK.originalLink
        )
      ).toThrowError('Previous is not valid');
    }
  });

  test('throws with invalid representative', () => {
    expect.assertions(INVALID_ADDRESSES.length);
    for (let invalidAddress of INVALID_ADDRESSES) {
      expect(() =>
        nano.hashBlock(
          RANDOM_VALID_STATE_BLOCK.block.data.account,
          RANDOM_VALID_STATE_BLOCK.block.data.previous,
          invalidAddress,
          RANDOM_VALID_STATE_BLOCK.block.data.balance,
          RANDOM_VALID_STATE_BLOCK.originalLink
        )
      ).toThrowError('Representative is not valid');
    }
  });

  test('throws with invalid balance', () => {
    expect.assertions(INVALID_AMOUNTS.length);
    for (let invalidAmount of INVALID_AMOUNTS) {
      expect(() =>
        nano.hashBlock(
          RANDOM_VALID_STATE_BLOCK.block.data.account,
          RANDOM_VALID_STATE_BLOCK.block.data.previous,
          RANDOM_VALID_STATE_BLOCK.block.data.representative,
          invalidAmount,
          RANDOM_VALID_STATE_BLOCK.originalLink
        )
      ).toThrowError('Balance is not valid');
    }
  });

  test('throws with invalid link', () => {
    expect.assertions(INVALID_HASHES_AND_ADDRESSES.length);
    for (let invalidLink of INVALID_HASHES_AND_ADDRESSES) {
      expect(() =>
        nano.hashBlock(
          RANDOM_VALID_STATE_BLOCK.block.data.account,
          RANDOM_VALID_STATE_BLOCK.block.data.previous,
          RANDOM_VALID_STATE_BLOCK.block.data.representative,
          RANDOM_VALID_STATE_BLOCK.block.data.balance,
          invalidLink
        )
      ).toThrowError('Link is not valid');
    }
  });
});
