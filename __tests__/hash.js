/* eslint-env jest */

const nano = require('../dist/nanocurrency.cjs')
const {
  INVALID_HASHES,
  INVALID_ADDRESSES,
  INVALID_BALANCES
} = require('./common/data')

const VALID_SEND_BLOCK = {
  previous: 'a286fd300598bf0c8ccc1196943b9ceb94f268cc89f2010b7f7ee4055cc6ab8c',
  destination: 'xrb_39bjqkznze3tzhocc485orrpmjufwdyz6kbew4hr18nudhrhrmuw69er6ah9',
  balance: '1907125000000000000000000000000',
  hash: 'ded555ce596e54f783424ba3dec0b6eef26e9e865de1fca3b58264555fc184e8'
}

const VALID_OPEN_BLOCK = {
  source: '69161915a1715b26be22c7bd8dbfa4a282d0cdc09aa45552773fb42581263c2a',
  representative: 'xrb_1anrzcuwe64rwxzcco8dkhpyxpi8kd7zsjc1oeimpc3ppca4mrjtwnqposrs',
  account: 'xrb_1dwmrprcdef8c1343sahnfc17pujbioknu9a6u9fcdeepy1bfnwp3obfh5ri',
  hash: '730bd6921758dfdc889f8155c5c8eb573c6727775e20f3cee1d414dfc2220637'
}

const VALID_CHANGE_BLOCK = {
  previous: '7605dbf66fba3a0bd92b81303ae613193f1e8cb990fc3894e6aaea8e1c83b849',
  representative: 'xrb_3pczxuorp48td8645bs3m6c3xotxd3idskrenmi65rbrga5zmkemzhwkaznh',
  hash: 'c49b1f932be6a6319e5789ace7d4b34f352d69369643442bf7339b898dcd8ac3'
}

const VALID_RECEIVE_BLOCK = {
  previous: '81d04e3188a5e8cf6bd98bbe836156b4ca0e395d3188aaf1ba20a15172e375d2',
  source: 'ded555ce596e54f783424ba3dec0b6eef26e9e865de1fca3b58264555fc184e8',
  hash: 'ad93ae771e883680c18502a7aeba7b63465f2fb3830f0833dd49a54a5ae133bb'
}

beforeAll(nano.init)

describe('send', () => {
  test('creates correct send block', () => {
    expect(
      nano.computeSendBlockHash(
        VALID_SEND_BLOCK.previous,
        VALID_SEND_BLOCK.destination,
        VALID_SEND_BLOCK.balance
      )
    ).toBe(VALID_SEND_BLOCK.hash)
  })
})

describe('open', () => {
  test('creates correct open block', () => {
    expect(
      nano.computeOpenBlockHash(
        VALID_OPEN_BLOCK.source,
        VALID_OPEN_BLOCK.representative,
        VALID_OPEN_BLOCK.account
      )
    ).toBe(VALID_OPEN_BLOCK.hash)
  })
})

describe('change', () => {
  test('creates correct change block', () => {
    expect(
      nano.computeChangeBlockHash(
        VALID_CHANGE_BLOCK.previous,
        VALID_CHANGE_BLOCK.representative
      )
    ).toBe(VALID_CHANGE_BLOCK.hash)
  })
})

describe('receive', () => {
  test('creates correct receive block', () => {
    expect(
      nano.computeReceiveBlockHash(
        VALID_RECEIVE_BLOCK.previous,
        VALID_RECEIVE_BLOCK.source
      )
    ).toBe(VALID_RECEIVE_BLOCK.hash)
  })
})
