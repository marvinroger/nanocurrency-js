/* eslint-env jest */

const nano = require('../dist/nanocurrency.cjs')
const {
  INVALID_HASHES,
  INVALID_ADDRESSES,
  INVALID_HASHES_AND_ADDRESSES,
  INVALID_AMOUNTS
} = require('./common/data')

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

const VALID_STATE_BLOCKS = [
  {
    account: 'xrb_3igf8hd4sjshoibbbkeitmgkp1o6ug4xads43j6e4gqkj5xk5o83j8ja9php',
    previous:
      'FC5A7FB777110A858052468D448B2DF22B648943C097C0608D1E2341007438B0',
    representative:
      'xrb_3p1asma84n8k84joneka776q4egm5wwru3suho9wjsfyuem8j95b3c78nw8j',
    balance: '5000000000000000000000000000001',
    link: 'B2EC73C1F503F47E051AD72ECB512C63BA8E1A0ACC2CEE4EA9A22FE1CBDB693F', // block hash
    hash: '597395E83BD04DF8EF30AF04234EAAFE0606A883CF4AEAD2DB8196AAF5C4444F'
  },
  {
    account: 'xrb_3igf8hd4sjshoibbbkeitmgkp1o6ug4xads43j6e4gqkj5xk5o83j8ja9php',
    previous:
      '597395E83BD04DF8EF30AF04234EAAFE0606A883CF4AEAD2DB8196AAF5C4444F',
    representative:
      'xrb_3p1asma84n8k84joneka776q4egm5wwru3suho9wjsfyuem8j95b3c78nw8j',
    balance: '3000000000000000000000000000001',
    link: 'xrb_1q3hqecaw15cjt7thbtxu3pbzr1eihtzzpzxguoc37bj1wc5ffoh7w74gi6p', // address
    hash: '128106287002E595F479ACD615C818117FCB3860EC112670557A2467386249D4'
  }
]

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
          validStateBlock.account,
          validStateBlock.previous,
          validStateBlock.representative,
          validStateBlock.balance,
          validStateBlock.link
        )
      ).toBe(validStateBlock.hash)
    }
  })

  test('throws with invalid account', () => {
    expect.assertions(INVALID_ADDRESSES.length)
    for (let invalidAddress of INVALID_ADDRESSES) {
      expect(() =>
        nano.hashStateBlock(
          invalidAddress,
          VALID_STATE_BLOCKS[0].previous,
          VALID_STATE_BLOCKS[0].representative,
          VALID_STATE_BLOCKS[0].balance,
          VALID_STATE_BLOCKS[0].link
        )
      ).toThrowError('Account is not valid')
    }
  })

  test('throws with invalid previous', () => {
    expect.assertions(INVALID_HASHES.length)
    for (let invalidHash of INVALID_HASHES) {
      expect(() =>
        nano.hashStateBlock(
          VALID_STATE_BLOCKS[0].account,
          invalidHash,
          VALID_STATE_BLOCKS[0].representative,
          VALID_STATE_BLOCKS[0].balance,
          VALID_STATE_BLOCKS[0].link
        )
      ).toThrowError('Previous is not valid')
    }
  })

  test('throws with invalid representative', () => {
    expect.assertions(INVALID_ADDRESSES.length)
    for (let invalidAddress of INVALID_ADDRESSES) {
      expect(() =>
        nano.hashStateBlock(
          VALID_STATE_BLOCKS[0].account,
          VALID_STATE_BLOCKS[0].previous,
          invalidAddress,
          VALID_STATE_BLOCKS[0].balance,
          VALID_STATE_BLOCKS[0].link
        )
      ).toThrowError('Representative is not valid')
    }
  })

  test('throws with invalid balance', () => {
    expect.assertions(INVALID_AMOUNTS.length)
    for (let invalidAmount of INVALID_AMOUNTS) {
      expect(() =>
        nano.hashStateBlock(
          VALID_STATE_BLOCKS[0].account,
          VALID_STATE_BLOCKS[0].previous,
          VALID_STATE_BLOCKS[0].representative,
          invalidAmount,
          VALID_STATE_BLOCKS[0].link
        )
      ).toThrowError('Balance is not valid')
    }
  })

  test('throws with invalid link', () => {
    expect.assertions(INVALID_HASHES_AND_ADDRESSES.length)
    for (let invalidLink of INVALID_HASHES_AND_ADDRESSES) {
      expect(() =>
        nano.hashStateBlock(
          VALID_STATE_BLOCKS[0].account,
          VALID_STATE_BLOCKS[0].previous,
          VALID_STATE_BLOCKS[0].representative,
          VALID_STATE_BLOCKS[0].balance,
          invalidLink
        )
      ).toThrowError('Link is not valid')
    }
  })
})
