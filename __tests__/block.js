/* eslint-env jest */

const nano = require('../dist/nanocurrency.cjs')
const {
  INVALID_HASHES,
  INVALID_SECRET_KEYS,
  INVALID_AMOUNTS,
  INVALID_ADDRESSES
} = require('./common/data')

const SECRET_KEY = '0000000000000000000000000000000000000000000000000000000000000001'

const VALID_OPEN_BLOCK = {
  params: {
    work: '4ec76c9bda2325ed',
    source: '19d3d919475deed4696b5d13018151d1af88b2bd3bcff048b45031c1f36d1858',
    representative: 'xrb_1hza3f7wiiqa7ig3jczyxj5yo86yegcmqk3criaz838j91sxcckpfhbhhra1'
  },
  result: {
    hash: 'f47b23107e5f34b2ce06f562b5c435df72a533251cb414c51b2b62a8f63a00e4',
    block: {
      type: 'open',
      source: '19d3d919475deed4696b5d13018151d1af88b2bd3bcff048b45031c1f36d1858',
      representative: 'xrb_1hza3f7wiiqa7ig3jczyxj5yo86yegcmqk3criaz838j91sxcckpfhbhhra1',
      account: 'xrb_3kdbxitaj7f6mrir6miiwtw4muhcc58e6tn5st6rfaxsdnb7gr4roudwn951',
      work: '4ec76c9bda2325ed',
      signature: '5974324f8cc42da56f62fc212a17886bdcb18de363d04da84eedc99cb4a33919d14a2cf9de9d534faa6d0b91d01f0622205d898293525e692586c84f2dcf9208'
    }
  }
}

const VALID_RECEIVE_BLOCK = {
  params: {
    work: '6acb5dd43a38d76a',
    previous: 'f47b23107e5f34b2ce06f562b5c435df72a533251cb414c51b2b62a8f63a00e4',
    source: '19d3d919475deed4696b5d13018151d1af88b2bd3bcff048b45031c1f36d1858'
  },
  result: {
    hash: '314ba8d9057678c1f53371c2db3026c1fac01ec8e7802fd9a2e8130fc523429e',
    block: {
      type: 'receive',
      previous: 'f47b23107e5f34b2ce06f562b5c435df72a533251cb414c51b2b62a8f63a00e4',
      source: '19d3d919475deed4696b5d13018151d1af88b2bd3bcff048b45031c1f36d1858',
      work: '6acb5dd43a38d76a',
      signature: 'a13fd22527771667d5dff33d69787d734836a3561d8a490c1f4917a05d77ea09860461d5fbfc99246a4eab5627f119ad477598e22ee021c4711facf4f3c80d0e'
    }
  }
}

const VALID_SEND_BLOCK = {
  params: {
    work: '478563b2d9facfd4',
    previous: '314ba8d9057678c1f53371c2db3026c1fac01ec8e7802fd9a2e8130fc523429e',
    destination: 'xrb_18gmu6engqhgtjnppqam181o5nfhj4sdtgyhy36dan3jr9spt84rzwmktafc',
    balance: '10000000000000000000000000000000'
  },
  result: {
    hash: 'f958305c0ff0551421d4abedccf302079d020a0a3833e33f185e2b0415d4567a',
    block: {
      type: 'send',
      previous: '314ba8d9057678c1f53371c2db3026c1fac01ec8e7802fd9a2e8130fc523429e',
      destination: 'xrb_18gmu6engqhgtjnppqam181o5nfhj4sdtgyhy36dan3jr9spt84rzwmktafc',
      balance: '0000007e37be2022c0914b2680000000',
      work: '478563b2d9facfd4',
      signature: 'f19ca177efa8692c8cbf7478ce3213f56e4a85df760da7a9e69141849831f8fd79ba9ed89cec807b690fb4aa42d5008f9dba7115e63c935401f1f0efa547bc00'
    }
  }
}

const VALID_CHANGE_BLOCK = {
  params: {
    work: '55e5b7a83edc3f4f',
    previous: 'f958305c0ff0551421d4abedccf302079d020a0a3833e33f185e2b0415d4567a',
    representative: 'xrb_18gmu6engqhgtjnppqam181o5nfhj4sdtgyhy36dan3jr9spt84rzwmktafc'
  },
  result: {
    hash: '654fa425cebfc9e7726089e4ede7a105462d93dbc915ffb70b50909920a7d286',
    block: {
      type: 'change',
      previous: 'f958305c0ff0551421d4abedccf302079d020a0a3833e33f185e2b0415d4567a',
      representative: 'xrb_18gmu6engqhgtjnppqam181o5nfhj4sdtgyhy36dan3jr9spt84rzwmktafc',
      work: '55e5b7a83edc3f4f',
      signature: '98b4d56881d9a88b170a6b2976ae21900c26a27f0e2c338d93fded56183b73d19aa5beb48e43fcbb8ff8293fdd368cef50600fecefd490a0855ed702ed209e04'
    }
  }
}

beforeAll(nano.init)

describe('open', () => {
  test('creates correct open block', async () => {
    const result = nano.createOpenBlock(SECRET_KEY, {
      work: VALID_OPEN_BLOCK.params.work,
      source: VALID_OPEN_BLOCK.params.source,
      representative: VALID_OPEN_BLOCK.params.representative
    })
    expect(result).toEqual(VALID_OPEN_BLOCK.result)
  })

  // TODO(breaking): add work test

  test('throws with invalid secret key', () => {
    expect.assertions(INVALID_SECRET_KEYS.length)
    for (let invalidSecretKey of INVALID_SECRET_KEYS) {
      expect(
        () => {
          nano.createOpenBlock(invalidSecretKey, {
            work: VALID_OPEN_BLOCK.params.work,
            source: VALID_OPEN_BLOCK.params.source,
            representative: VALID_OPEN_BLOCK.params.representative
          })
        }
      ).toThrowError('Secret key is not valid')
    }
  })

  test('throws with invalid source', () => {
    expect.assertions(INVALID_HASHES.length)
    for (let invalidSource of INVALID_HASHES) {
      expect(
        () => {
          nano.createOpenBlock(SECRET_KEY, {
            work: VALID_OPEN_BLOCK.params.work,
            source: invalidSource,
            representative: VALID_OPEN_BLOCK.params.representative
          })
        }
      ).toThrowError('Source is not valid')
    }
  })

  test('throws with invalid representative', () => {
    expect.assertions(INVALID_ADDRESSES.length)
    for (let invalidAddress of INVALID_ADDRESSES) {
      expect(
        () => {
          nano.createOpenBlock(SECRET_KEY, {
            work: VALID_OPEN_BLOCK.params.work,
            source: VALID_OPEN_BLOCK.params.source,
            representative: invalidAddress
          })
        }
      ).toThrowError('Representative is not valid')
    }
  })
})

describe('receive', () => {
  test('creates correct receive block', async () => {
    const result = nano.createReceiveBlock(SECRET_KEY, {
      work: VALID_RECEIVE_BLOCK.params.work,
      previous: VALID_RECEIVE_BLOCK.params.previous,
      source: VALID_RECEIVE_BLOCK.params.source
    })
    expect(result).toEqual(VALID_RECEIVE_BLOCK.result)
  })

  // TODO(breaking): add work test

  test('throws with invalid secret key', () => {
    expect.assertions(INVALID_SECRET_KEYS.length)
    for (let invalidSecretKey of INVALID_SECRET_KEYS) {
      expect(
        () => {
          nano.createReceiveBlock(invalidSecretKey, {
            work: VALID_RECEIVE_BLOCK.params.work,
            previous: VALID_RECEIVE_BLOCK.params.previous,
            source: VALID_RECEIVE_BLOCK.params.source
          })
        }
      ).toThrowError('Secret key is not valid')
    }
  })

  test('throws with invalid previous', () => {
    expect.assertions(INVALID_HASHES.length)
    for (let invalidPrevious of INVALID_HASHES) {
      expect(
        () => {
          nano.createReceiveBlock(SECRET_KEY, {
            work: VALID_RECEIVE_BLOCK.params.work,
            previous: invalidPrevious,
            source: VALID_RECEIVE_BLOCK.params.source
          })
        }
      ).toThrowError('Previous is not valid')
    }
  })

  test('throws with invalid source', () => {
    expect.assertions(INVALID_HASHES.length)
    for (let invalidSource of INVALID_HASHES) {
      expect(
        () => {
          nano.createReceiveBlock(SECRET_KEY, {
            work: VALID_RECEIVE_BLOCK.params.work,
            previous: VALID_RECEIVE_BLOCK.params.previous,
            source: invalidSource
          })
        }
      ).toThrowError('Source is not valid')
    }
  })
})

describe('send', () => {
  test('creates correct send block', async () => {
    const result = nano.createSendBlock(SECRET_KEY, {
      work: VALID_SEND_BLOCK.params.work,
      previous: VALID_SEND_BLOCK.params.previous,
      destination: VALID_SEND_BLOCK.params.destination,
      balance: VALID_SEND_BLOCK.params.balance
    })
    expect(result).toEqual(VALID_SEND_BLOCK.result)
  })

  // TODO(breaking): add work test

  test('throws with invalid secret key', () => {
    expect.assertions(INVALID_SECRET_KEYS.length)
    for (let invalidSecretKey of INVALID_SECRET_KEYS) {
      expect(
        () => {
          nano.createSendBlock(invalidSecretKey, {
            work: VALID_SEND_BLOCK.params.work,
            previous: VALID_SEND_BLOCK.params.previous,
            destination: VALID_SEND_BLOCK.params.destination,
            balance: VALID_SEND_BLOCK.params.balance
          })
        }
      ).toThrowError('Secret key is not valid')
    }
  })

  test('throws with invalid previous', () => {
    expect.assertions(INVALID_HASHES.length)
    for (let invalidPrevious of INVALID_HASHES) {
      expect(
        () => {
          nano.createSendBlock(SECRET_KEY, {
            work: VALID_SEND_BLOCK.params.work,
            previous: invalidPrevious,
            destination: VALID_SEND_BLOCK.params.destination,
            balance: VALID_SEND_BLOCK.params.balance
          })
        }
      ).toThrowError('Previous is not valid')
    }
  })

  test('throws with invalid destination', () => {
    expect.assertions(INVALID_ADDRESSES.length)
    for (let invalidDestination of INVALID_ADDRESSES) {
      expect(
        () => {
          nano.createSendBlock(SECRET_KEY, {
            work: VALID_SEND_BLOCK.params.work,
            previous: VALID_SEND_BLOCK.params.previous,
            destination: invalidDestination,
            balance: VALID_SEND_BLOCK.params.balance
          })
        }
      ).toThrowError('Destination is not valid')
    }
  })

  test('throws with invalid balance', () => {
    expect.assertions(INVALID_AMOUNTS.length)
    for (let invalidBalance of INVALID_AMOUNTS) {
      expect(
        () => {
          nano.createSendBlock(SECRET_KEY, {
            work: VALID_SEND_BLOCK.params.work,
            previous: VALID_SEND_BLOCK.params.previous,
            destination: VALID_SEND_BLOCK.params.destination,
            balance: invalidBalance
          })
        }
      ).toThrowError('Balance is not valid')
    }
  })
})

describe('change', () => {
  test('creates correct change block', async () => {
    const result = nano.createChangeBlock(SECRET_KEY, {
      work: VALID_CHANGE_BLOCK.params.work,
      previous: VALID_CHANGE_BLOCK.params.previous,
      representative: VALID_CHANGE_BLOCK.params.representative
    })
    expect(result).toEqual(VALID_CHANGE_BLOCK.result)
  })

  // TODO(breaking): add work test

  test('throws with invalid secret key', () => {
    expect.assertions(INVALID_SECRET_KEYS.length)
    for (let invalidSecretKey of INVALID_SECRET_KEYS) {
      expect(
        () => {
          nano.createChangeBlock(invalidSecretKey, {
            work: VALID_CHANGE_BLOCK.params.work,
            previous: VALID_CHANGE_BLOCK.params.previous,
            representative: VALID_CHANGE_BLOCK.params.representative
          })
        }
      ).toThrowError('Secret key is not valid')
    }
  })

  test('throws with invalid previous', () => {
    expect.assertions(INVALID_HASHES.length)
    for (let invalidPrevious of INVALID_HASHES) {
      expect(
        () => {
          nano.createChangeBlock(SECRET_KEY, {
            work: VALID_CHANGE_BLOCK.params.work,
            previous: invalidPrevious,
            representative: VALID_CHANGE_BLOCK.params.representative
          })
        }
      ).toThrowError('Previous is not valid')
    }
  })

  test('throws with invalid representative', () => {
    expect.assertions(INVALID_ADDRESSES.length)
    for (let invalidRepresentative of INVALID_ADDRESSES) {
      expect(
        () => {
          nano.createChangeBlock(SECRET_KEY, {
            work: VALID_CHANGE_BLOCK.params.work,
            previous: VALID_CHANGE_BLOCK.params.previous,
            representative: invalidRepresentative
          })
        }
      ).toThrowError('Representative is not valid')
    }
  })
})
