/* eslint-env jest */

const nano = require('../dist/nanocurrency.cjs')
const {
  INVALID_HASHES,
  INVALID_ADDRESSES,
  INVALID_HASHES_AND_ADDRESSES,
  INVALID_AMOUNTS
} = require('./data/invalid')

const VALID_SEND_BLOCK = {
  previous: 'A286FD300598BF0C8CCC1196943B9CEB94F268CC89F2010B7F7EE4055CC6AB8C',
  destination:
    'xrb_39bjqkznze3tzhocc485orrpmjufwdyz6kbew4hr18nudhrhrmuw69er6ah9',
  balance: '1907125000000000000000000000000',
  hash: 'DED555CE596E54F783424BA3DEC0B6EEF26E9E865DE1FCA3B58264555FC184E8'
}

const VALID_OPEN_BLOCK = {
  source: '69161915A1715B26BE22C7BD8DBFA4A282D0CDC09AA45552773FB42581263C2A',
  representative:
    'xrb_1anrzcuwe64rwxzcco8dkhpyxpi8kd7zsjc1oeimpc3ppca4mrjtwnqposrs',
  account: 'xrb_1dwmrprcdef8c1343sahnfc17pujbioknu9a6u9fcdeepy1bfnwp3obfh5ri',
  hash: '730BD6921758DFDC889F8155C5C8EB573C6727775E20F3CEE1D414DFC2220637'
}

const VALID_CHANGE_BLOCK = {
  previous: '7605DBF66FBA3A0BD92B81303AE613193F1E8CB990FC3894E6AAEA8E1C83B849',
  representative:
    'xrb_3pczxuorp48td8645bs3m6c3xotxd3idskrenmi65rbrga5zmkemzhwkaznh',
  hash: 'C49B1F932BE6A6319E5789ACE7D4B34F352D69369643442BF7339B898DCD8AC3'
}

const VALID_RECEIVE_BLOCK = {
  previous: '81D04E3188A5E8CF6BD98BBE836156B4CA0E395D3188AAF1BA20A15172E375D2',
  source: 'DED555CE596E54F783424BA3DEC0B6EEF26E9E865DE1FCA3B58264555FC184E8',
  hash: 'AD93AE771E883680C18502A7AEBA7B63465F2FB3830F0833DD49A54A5AE133BB'
}

const VALID_STATE_BLOCKS = require('./data/valid_blocks')
const RANDOM_VALID_STATE_BLOCK = VALID_STATE_BLOCKS[0]

describe('send', () => {
  test('creates correct send hash', () => {
    expect(
      nano.hashSendBlock(
        VALID_SEND_BLOCK.previous,
        VALID_SEND_BLOCK.destination,
        VALID_SEND_BLOCK.balance
      )
    ).toBe(VALID_SEND_BLOCK.hash)
  })

  test('throws with invalid previous', () => {
    expect.assertions(INVALID_HASHES.length)
    for (let invalidHash of INVALID_HASHES) {
      expect(() =>
        nano.hashSendBlock(
          invalidHash,
          VALID_SEND_BLOCK.destination,
          VALID_SEND_BLOCK.balance
        )
      ).toThrowError('Previous is not valid')
    }
  })

  test('throws with invalid destination', () => {
    expect.assertions(INVALID_ADDRESSES.length)
    for (let invalidAddress of INVALID_ADDRESSES) {
      expect(() =>
        nano.hashSendBlock(
          VALID_SEND_BLOCK.previous,
          invalidAddress,
          VALID_SEND_BLOCK.balance
        )
      ).toThrowError('Destination is not valid')
    }
  })

  test('throws with invalid balance', () => {
    expect.assertions(INVALID_AMOUNTS.length)
    for (let invalidAmount of INVALID_AMOUNTS) {
      expect(() =>
        nano.hashSendBlock(
          VALID_SEND_BLOCK.previous,
          VALID_SEND_BLOCK.destination,
          invalidAmount
        )
      ).toThrowError('Balance is not valid')
    }
  })
})

describe('open', () => {
  test('creates correct open hash', () => {
    expect(
      nano.hashOpenBlock(
        VALID_OPEN_BLOCK.source,
        VALID_OPEN_BLOCK.representative,
        VALID_OPEN_BLOCK.account
      )
    ).toBe(VALID_OPEN_BLOCK.hash)
  })

  test('throws with invalid source', () => {
    expect.assertions(INVALID_HASHES.length)
    for (let invalidHash of INVALID_HASHES) {
      expect(() =>
        nano.hashOpenBlock(
          invalidHash,
          VALID_OPEN_BLOCK.representative,
          VALID_OPEN_BLOCK.account
        )
      ).toThrowError('Source is not valid')
    }
  })

  test('throws with invalid representative', () => {
    expect.assertions(INVALID_ADDRESSES.length)
    for (let invalidAddress of INVALID_ADDRESSES) {
      expect(() =>
        nano.hashOpenBlock(
          VALID_OPEN_BLOCK.source,
          invalidAddress,
          VALID_OPEN_BLOCK.account
        )
      ).toThrowError('Representative is not valid')
    }
  })

  test('throws with invalid account', () => {
    expect.assertions(INVALID_ADDRESSES.length)
    for (let invalidAddress of INVALID_ADDRESSES) {
      expect(() =>
        nano.hashOpenBlock(
          VALID_OPEN_BLOCK.source,
          VALID_OPEN_BLOCK.representative,
          invalidAddress
        )
      ).toThrowError('Account is not valid')
    }
  })
})

describe('change', () => {
  test('creates correct change hash', () => {
    expect(
      nano.hashChangeBlock(
        VALID_CHANGE_BLOCK.previous,
        VALID_CHANGE_BLOCK.representative
      )
    ).toBe(VALID_CHANGE_BLOCK.hash)
  })

  test('throws with invalid previous', () => {
    expect.assertions(INVALID_HASHES.length)
    for (let invalidHash of INVALID_HASHES) {
      expect(() =>
        nano.hashChangeBlock(invalidHash, VALID_CHANGE_BLOCK.representative)
      ).toThrowError('Previous is not valid')
    }
  })

  test('throws with invalid representative', () => {
    expect.assertions(INVALID_ADDRESSES.length)
    for (let invalidAddress of INVALID_ADDRESSES) {
      expect(() =>
        nano.hashChangeBlock(VALID_CHANGE_BLOCK.previous, invalidAddress)
      ).toThrowError('Representative is not valid')
    }
  })
})

describe('receive', () => {
  test('creates correct receive hash', () => {
    expect(
      nano.hashReceiveBlock(
        VALID_RECEIVE_BLOCK.previous,
        VALID_RECEIVE_BLOCK.source
      )
    ).toBe(VALID_RECEIVE_BLOCK.hash)
  })

  test('throws with invalid previous', () => {
    expect.assertions(INVALID_HASHES.length)
    for (let invalidHash of INVALID_HASHES) {
      expect(() =>
        nano.hashReceiveBlock(invalidHash, VALID_RECEIVE_BLOCK.source)
      ).toThrowError('Previous is not valid')
    }
  })

  test('throws with invalid source', () => {
    expect.assertions(INVALID_HASHES.length)
    for (let invalidHash of INVALID_HASHES) {
      expect(() =>
        nano.hashReceiveBlock(VALID_RECEIVE_BLOCK.previous, invalidHash)
      ).toThrowError('Source is not valid')
    }
  })
})

describe('state', () => {
  test('creates correct state hash', () => {
    expect.assertions(VALID_STATE_BLOCKS.length)
    for (let validStateBlock of VALID_STATE_BLOCKS) {
      expect(
        nano.hashStateBlock(
          validStateBlock.block.data.account,
          validStateBlock.block.data.previous,
          validStateBlock.block.data.representative,
          validStateBlock.block.data.balance,
          validStateBlock.originalLink
        )
      ).toBe(validStateBlock.block.hash)
    }
  })

  test('throws with invalid account', () => {
    expect.assertions(INVALID_ADDRESSES.length)
    for (let invalidAddress of INVALID_ADDRESSES) {
      expect(() =>
        nano.hashStateBlock(
          invalidAddress,
          RANDOM_VALID_STATE_BLOCK.block.data.previous,
          RANDOM_VALID_STATE_BLOCK.block.data.representative,
          RANDOM_VALID_STATE_BLOCK.block.data.balance,
          RANDOM_VALID_STATE_BLOCK.originalLink
        )
      ).toThrowError('Account is not valid')
    }
  })

  test('throws with invalid previous', () => {
    expect.assertions(INVALID_HASHES.length)
    for (let invalidHash of INVALID_HASHES) {
      expect(() =>
        nano.hashStateBlock(
          RANDOM_VALID_STATE_BLOCK.block.data.account,
          invalidHash,
          RANDOM_VALID_STATE_BLOCK.block.data.representative,
          RANDOM_VALID_STATE_BLOCK.block.data.balance,
          RANDOM_VALID_STATE_BLOCK.originalLink
        )
      ).toThrowError('Previous is not valid')
    }
  })

  test('throws with invalid representative', () => {
    expect.assertions(INVALID_ADDRESSES.length)
    for (let invalidAddress of INVALID_ADDRESSES) {
      expect(() =>
        nano.hashStateBlock(
          RANDOM_VALID_STATE_BLOCK.block.data.account,
          RANDOM_VALID_STATE_BLOCK.block.data.previous,
          invalidAddress,
          RANDOM_VALID_STATE_BLOCK.block.data.balance,
          RANDOM_VALID_STATE_BLOCK.originalLink
        )
      ).toThrowError('Representative is not valid')
    }
  })

  test('throws with invalid balance', () => {
    expect.assertions(INVALID_AMOUNTS.length)
    for (let invalidAmount of INVALID_AMOUNTS) {
      expect(() =>
        nano.hashStateBlock(
          RANDOM_VALID_STATE_BLOCK.block.data.account,
          RANDOM_VALID_STATE_BLOCK.block.data.previous,
          RANDOM_VALID_STATE_BLOCK.block.data.representative,
          invalidAmount,
          RANDOM_VALID_STATE_BLOCK.originalLink
        )
      ).toThrowError('Balance is not valid')
    }
  })

  test('throws with invalid link', () => {
    expect.assertions(INVALID_HASHES_AND_ADDRESSES.length)
    for (let invalidLink of INVALID_HASHES_AND_ADDRESSES) {
      expect(() =>
        nano.hashStateBlock(
          RANDOM_VALID_STATE_BLOCK.block.data.account,
          RANDOM_VALID_STATE_BLOCK.block.data.previous,
          RANDOM_VALID_STATE_BLOCK.block.data.representative,
          RANDOM_VALID_STATE_BLOCK.block.data.balance,
          invalidLink
        )
      ).toThrowError('Link is not valid')
    }
  })
})
