/* eslint-env jest */
/* eslint-disable @typescript-eslint/no-var-requires */

const nano = require('../dist/bundles/nanocurrency.cjs-node')
import {
  INVALID_HASHES,
  INVALID_ADDRESSES,
  INVALID_HASHES_AND_ADDRESSES,
  INVALID_AMOUNTS,
} from './test-data/invalid'

import VALID_STATE_BLOCKS from './test-data/valid_blocks.json'
const RANDOM_VALID_STATE_BLOCK = VALID_STATE_BLOCKS[0]

describe('state', () => {
  test('creates correct state hash', () => {
    expect.assertions(VALID_STATE_BLOCKS.length)
    for (const validStateBlock of VALID_STATE_BLOCKS) {
      expect(
        nano.hashBlock({
          account: validStateBlock.block.data.account,
          previous: validStateBlock.block.data.previous,
          representative: validStateBlock.block.data.representative,
          balance: validStateBlock.block.data.balance,
          link: validStateBlock.originalLink,
        })
      ).toBe(validStateBlock.block.hash)
    }
  })

  test('throws with invalid account', () => {
    expect.assertions(INVALID_ADDRESSES.length)
    for (const invalidAddress of INVALID_ADDRESSES) {
      expect(() =>
        nano.hashBlock({
          account: invalidAddress,
          previous: RANDOM_VALID_STATE_BLOCK.block.data.previous,
          representative: RANDOM_VALID_STATE_BLOCK.block.data.representative,
          balance: RANDOM_VALID_STATE_BLOCK.block.data.balance,
          link: RANDOM_VALID_STATE_BLOCK.originalLink,
        })
      ).toThrowError('Account is not valid')
    }
  })

  test('throws with invalid previous', () => {
    expect.assertions(INVALID_HASHES.length)
    for (const invalidHash of INVALID_HASHES) {
      expect(() =>
        nano.hashBlock({
          account: RANDOM_VALID_STATE_BLOCK.block.data.account,
          previous: invalidHash,
          representative: RANDOM_VALID_STATE_BLOCK.block.data.representative,
          balance: RANDOM_VALID_STATE_BLOCK.block.data.balance,
          link: RANDOM_VALID_STATE_BLOCK.originalLink,
        })
      ).toThrowError('Previous is not valid')
    }
  })

  test('throws with invalid representative', () => {
    expect.assertions(INVALID_ADDRESSES.length)
    for (const invalidAddress of INVALID_ADDRESSES) {
      expect(() =>
        nano.hashBlock({
          account: RANDOM_VALID_STATE_BLOCK.block.data.account,
          previous: RANDOM_VALID_STATE_BLOCK.block.data.previous,
          representative: invalidAddress,
          balance: RANDOM_VALID_STATE_BLOCK.block.data.balance,
          link: RANDOM_VALID_STATE_BLOCK.originalLink,
        })
      ).toThrowError('Representative is not valid')
    }
  })

  test('throws with invalid balance', () => {
    expect.assertions(INVALID_AMOUNTS.length)
    for (const invalidAmount of INVALID_AMOUNTS) {
      expect(() =>
        nano.hashBlock({
          account: RANDOM_VALID_STATE_BLOCK.block.data.account,
          previous: RANDOM_VALID_STATE_BLOCK.block.data.previous,
          representative: RANDOM_VALID_STATE_BLOCK.block.data.representative,
          balance: invalidAmount,
          link: RANDOM_VALID_STATE_BLOCK.originalLink,
        })
      ).toThrowError('Balance is not valid')
    }
  })

  test('throws with invalid link', () => {
    expect.assertions(INVALID_HASHES_AND_ADDRESSES.length)
    for (const invalidLink of INVALID_HASHES_AND_ADDRESSES) {
      expect(() =>
        nano.hashBlock({
          account: RANDOM_VALID_STATE_BLOCK.block.data.account,
          previous: RANDOM_VALID_STATE_BLOCK.block.data.previous,
          representative: RANDOM_VALID_STATE_BLOCK.block.data.representative,
          balance: RANDOM_VALID_STATE_BLOCK.block.data.balance,
          link: invalidLink,
        })
      ).toThrowError('Link is not valid')
    }
  })
})
