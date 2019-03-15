/* eslint-env jest */
/* eslint-disable @typescript-eslint/no-var-requires */

const nano = require('../dist/nanocurrency.cjs')
const {
  INVALID_HASHES,
  INVALID_SECRET_KEYS,
  INVALID_AMOUNTS,
  INVALID_ADDRESSES,
  INVALID_HASHES_AND_ADDRESSES,
  INVALID_BLOCK_COMBINATIONS,
} = require('./data/invalid')

const VALID_STATE_BLOCKS = require('./data/valid_blocks')
const RANDOM_VALID_STATE_BLOCK = VALID_STATE_BLOCKS[0]

describe('state', () => {
  test('creates correct state block', async () => {
    expect.assertions(VALID_STATE_BLOCKS.length)
    for (let validStateBlock of VALID_STATE_BLOCKS) {
      const result = nano.createBlock(validStateBlock.secretKey, {
        work: validStateBlock.block.data.work,
        previous: validStateBlock.block.data.previous,
        representative: validStateBlock.block.data.representative,
        balance: validStateBlock.block.data.balance,
        link: validStateBlock.originalLink,
      })
      expect(result).toEqual({
        hash: validStateBlock.block.hash,
        block: validStateBlock.block.data,
      })
    }
  })

  test('throws with invalid secret key', () => {
    expect.assertions(INVALID_SECRET_KEYS.length)
    for (let invalidSecretKey of INVALID_SECRET_KEYS) {
      expect(() => {
        nano.createBlock(invalidSecretKey, {
          work: RANDOM_VALID_STATE_BLOCK.block.data.work,
          previous: RANDOM_VALID_STATE_BLOCK.block.data.previous,
          representative: RANDOM_VALID_STATE_BLOCK.block.data.representative,
          balance: RANDOM_VALID_STATE_BLOCK.block.data.balance,
          link: RANDOM_VALID_STATE_BLOCK.originalLink,
        })
      }).toThrowError('Secret key is not valid')
    }
  })

  test('throws with unset work', () => {
    expect(() => {
      nano.createBlock(RANDOM_VALID_STATE_BLOCK.secretKey, {
        previous: RANDOM_VALID_STATE_BLOCK.block.data.previous,
        representative: RANDOM_VALID_STATE_BLOCK.block.data.representative,
        balance: RANDOM_VALID_STATE_BLOCK.block.data.balance,
        link: RANDOM_VALID_STATE_BLOCK.originalLink,
      })
    }).toThrowError('Work is not set')
  })

  test('throws with invalid previous', () => {
    expect.assertions(INVALID_HASHES.length)
    for (let invalidPrevious of INVALID_HASHES) {
      expect(() => {
        nano.createBlock(RANDOM_VALID_STATE_BLOCK.secretKey, {
          work: RANDOM_VALID_STATE_BLOCK.block.data.work,
          previous: invalidPrevious,
          representative: RANDOM_VALID_STATE_BLOCK.block.data.representative,
          balance: RANDOM_VALID_STATE_BLOCK.block.data.balance,
          link: RANDOM_VALID_STATE_BLOCK.originalLink,
        })
      }).toThrowError('Previous is not valid')
    }
  })

  test('throws with invalid previous', () => {
    expect.assertions(INVALID_ADDRESSES.length)
    for (let invalidRepresentative of INVALID_ADDRESSES) {
      expect(() => {
        nano.createBlock(RANDOM_VALID_STATE_BLOCK.secretKey, {
          work: RANDOM_VALID_STATE_BLOCK.block.data.work,
          previous: RANDOM_VALID_STATE_BLOCK.block.data.previous,
          representative: invalidRepresentative,
          balance: RANDOM_VALID_STATE_BLOCK.block.data.balance,
          link: RANDOM_VALID_STATE_BLOCK.originalLink,
        })
      }).toThrowError('Representative is not valid')
    }
  })

  test('throws with invalid balance', () => {
    expect.assertions(INVALID_AMOUNTS.length)
    for (let invalidBalance of INVALID_AMOUNTS) {
      expect(() => {
        nano.createBlock(RANDOM_VALID_STATE_BLOCK.secretKey, {
          work: RANDOM_VALID_STATE_BLOCK.block.data.work,
          previous: RANDOM_VALID_STATE_BLOCK.block.data.previous,
          representative: RANDOM_VALID_STATE_BLOCK.block.data.representative,
          balance: invalidBalance,
          link: RANDOM_VALID_STATE_BLOCK.originalLink,
        })
      }).toThrowError('Balance is not valid')
    }
  })

  test('throws with invalid link', () => {
    expect.assertions(INVALID_HASHES_AND_ADDRESSES.length)
    for (let invalidLink of INVALID_HASHES_AND_ADDRESSES) {
      expect(() => {
        nano.createBlock(RANDOM_VALID_STATE_BLOCK.secretKey, {
          work: RANDOM_VALID_STATE_BLOCK.block.data.work,
          previous: RANDOM_VALID_STATE_BLOCK.block.data.previous,
          representative: RANDOM_VALID_STATE_BLOCK.block.data.representative,
          balance: RANDOM_VALID_STATE_BLOCK.block.data.balance,
          link: invalidLink,
        })
      }).toThrowError('Link is not valid')
    }
  })

  test('throws with invalid combination', () => {
    expect.assertions(INVALID_BLOCK_COMBINATIONS.length)
    for (let invalidBlockCombination of INVALID_BLOCK_COMBINATIONS) {
      expect(() => {
        nano.createBlock(invalidBlockCombination.secretKey, {
          work: invalidBlockCombination.work,
          previous: invalidBlockCombination.previous,
          representative: invalidBlockCombination.representative,
          balance: invalidBlockCombination.balance,
          link: invalidBlockCombination.link,
        })
      }).toThrowError('Block is impossible')
    }
  })
})
