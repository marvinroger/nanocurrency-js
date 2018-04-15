/* eslint-env jest */

const nano = require('../dist/nanocurrency.cjs')
const {
  INVALID_HASHES,
  INVALID_SECRET_KEYS,
  INVALID_AMOUNTS,
  INVALID_ADDRESSES,
  INVALID_HASHES_AND_ADDRESSES
} = require('./common/data')

const SECRET_KEY =
  '0000000000000000000000000000000000000000000000000000000000000001'

const SECRET_KEY_STATE_BLOCK =
  'B61AEB236B0C8A2DFDD71C06F1F3544C524801E4B45B7A34DFDEC6F74F177927'

const VALID_OPEN_BLOCK = {
  params: {
    work: '4ec76c9bda2325ed',
    source: '19D3D919475DEED4696B5D13018151D1AF88B2BD3BCFF048B45031C1F36D1858',
    representative:
      'xrb_1hza3f7wiiqa7ig3jczyxj5yo86yegcmqk3criaz838j91sxcckpfhbhhra1'
  },
  result: {
    hash: 'F47B23107E5F34B2CE06F562B5C435DF72A533251CB414C51B2B62A8F63A00E4',
    block: {
      type: 'open',
      source:
        '19D3D919475DEED4696B5D13018151D1AF88B2BD3BCFF048B45031C1F36D1858',
      representative:
        'xrb_1hza3f7wiiqa7ig3jczyxj5yo86yegcmqk3criaz838j91sxcckpfhbhhra1',
      account:
        'xrb_3kdbxitaj7f6mrir6miiwtw4muhcc58e6tn5st6rfaxsdnb7gr4roudwn951',
      work: '4ec76c9bda2325ed',
      signature:
        '5974324F8CC42DA56F62FC212A17886BDCB18DE363D04DA84EEDC99CB4A33919D14A2CF9DE9D534FAA6D0B91D01F0622205D898293525E692586C84F2DCF9208'
    }
  }
}

const VALID_RECEIVE_BLOCK = {
  params: {
    work: '6acb5dd43a38d76a',
    previous:
      'F47B23107E5F34B2CE06F562B5C435DF72A533251CB414C51B2B62A8F63A00E4',
    source: '19D3D919475DEED4696B5D13018151D1AF88B2BD3BCFF048B45031C1F36D1858'
  },
  result: {
    hash: '314BA8D9057678C1F53371C2DB3026C1FAC01EC8E7802FD9A2E8130FC523429E',
    block: {
      type: 'receive',
      previous:
        'F47B23107E5F34B2CE06F562B5C435DF72A533251CB414C51B2B62A8F63A00E4',
      source:
        '19D3D919475DEED4696B5D13018151D1AF88B2BD3BCFF048B45031C1F36D1858',
      work: '6acb5dd43a38d76a',
      signature:
        'A13FD22527771667D5DFF33D69787D734836A3561D8A490C1F4917A05D77EA09860461D5FBFC99246A4EAB5627F119AD477598E22EE021C4711FACF4F3C80D0E'
    }
  }
}

const VALID_SEND_BLOCK = {
  params: {
    work: '478563b2d9facfd4',
    previous:
      '314BA8D9057678C1F53371C2DB3026C1FAC01EC8E7802FD9A2E8130FC523429E',
    destination:
      'xrb_18gmu6engqhgtjnppqam181o5nfhj4sdtgyhy36dan3jr9spt84rzwmktafc',
    balance: '10000000000000000000000000000000'
  },
  result: {
    hash: 'F958305C0FF0551421D4ABEDCCF302079D020A0A3833E33F185E2B0415D4567A',
    block: {
      type: 'send',
      previous:
        '314BA8D9057678C1F53371C2DB3026C1FAC01EC8E7802FD9A2E8130FC523429E',
      destination:
        'xrb_18gmu6engqhgtjnppqam181o5nfhj4sdtgyhy36dan3jr9spt84rzwmktafc',
      balance: '0000007e37be2022c0914b2680000000',
      work: '478563b2d9facfd4',
      signature:
        'F19CA177EFA8692C8CBF7478CE3213F56E4A85DF760DA7A9E69141849831F8FD79BA9ED89CEC807B690FB4AA42D5008F9DBA7115E63C935401F1F0EFA547BC00'
    }
  }
}

const VALID_CHANGE_BLOCK = {
  params: {
    work: '55e5b7a83edc3f4f',
    previous:
      'F958305C0FF0551421D4ABEDCCF302079D020A0A3833E33F185E2B0415D4567A',
    representative:
      'xrb_18gmu6engqhgtjnppqam181o5nfhj4sdtgyhy36dan3jr9spt84rzwmktafc'
  },
  result: {
    hash: '654FA425CEBFC9E7726089E4EDE7A105462D93DBC915FFB70B50909920A7D286',
    block: {
      type: 'change',
      previous:
        'F958305C0FF0551421D4ABEDCCF302079D020A0A3833E33F185E2B0415D4567A',
      representative:
        'xrb_18gmu6engqhgtjnppqam181o5nfhj4sdtgyhy36dan3jr9spt84rzwmktafc',
      work: '55e5b7a83edc3f4f',
      signature:
        '98B4D56881D9A88B170A6B2976AE21900C26A27F0E2C338D93FDED56183B73D19AA5BEB48E43FCBB8FF8293FDD368CEF50600FECEFD490A0855ED702ED209E04'
    }
  }
}

const VALID_STATE_BLOCKS = [
  {
    params: {
      work: '0000000000000000',
      previous:
        'FC5A7FB777110A858052468D448B2DF22B648943C097C0608D1E2341007438B0',
      representative:
        'xrb_3p1asma84n8k84joneka776q4egm5wwru3suho9wjsfyuem8j95b3c78nw8j',
      balance: '5000000000000000000000000000001',
      link: 'B2EC73C1F503F47E051AD72ECB512C63BA8E1A0ACC2CEE4EA9A22FE1CBDB693F' // block hash
    },
    result: {
      hash: '597395E83BD04DF8EF30AF04234EAAFE0606A883CF4AEAD2DB8196AAF5C4444F',
      block: {
        type: 'state',
        account:
          'xrb_3igf8hd4sjshoibbbkeitmgkp1o6ug4xads43j6e4gqkj5xk5o83j8ja9php',
        previous:
          'FC5A7FB777110A858052468D448B2DF22B648943C097C0608D1E2341007438B0',
        representative:
          'xrb_3p1asma84n8k84joneka776q4egm5wwru3suho9wjsfyuem8j95b3c78nw8j',
        balance: '5000000000000000000000000000001',
        link:
          'B2EC73C1F503F47E051AD72ECB512C63BA8E1A0ACC2CEE4EA9A22FE1CBDB693F',
        work: '0000000000000000',
        signature:
          '90CBD62F5466E35DB3BFE5EFDBC6283BD30C0591A3787C9458D11F2AF6188E45E6E71B5F4A8E3598B1C80080D6024867878E355161AD1935CD757477991D3B0B'
      }
    }
  },
  {
    params: {
      work: '0000000000000000',
      previous:
        '597395E83BD04DF8EF30AF04234EAAFE0606A883CF4AEAD2DB8196AAF5C4444F',
      representative:
        'xrb_3p1asma84n8k84joneka776q4egm5wwru3suho9wjsfyuem8j95b3c78nw8j',
      balance: '3000000000000000000000000000001',
      link: 'xrb_1q3hqecaw15cjt7thbtxu3pbzr1eihtzzpzxguoc37bj1wc5ffoh7w74gi6p' // block hash
    },
    result: {
      hash: '128106287002E595F479ACD615C818117FCB3860EC112670557A2467386249D4',
      block: {
        type: 'state',
        account:
          'xrb_3igf8hd4sjshoibbbkeitmgkp1o6ug4xads43j6e4gqkj5xk5o83j8ja9php',
        previous:
          '597395E83BD04DF8EF30AF04234EAAFE0606A883CF4AEAD2DB8196AAF5C4444F',
        representative:
          'xrb_3p1asma84n8k84joneka776q4egm5wwru3suho9wjsfyuem8j95b3c78nw8j',
        balance: '3000000000000000000000000000001',
        link:
          'xrb_1q3hqecaw15cjt7thbtxu3pbzr1eihtzzpzxguoc37bj1wc5ffoh7w74gi6p',
        work: '0000000000000000',
        signature:
          'D7975EE2F6FAE1FC7DA336FB9DD5F7E30FC1A6825021194E614F0588073D1A4901E34E3CAE8739F1DE2FD85A73D2A0B26F8BE6539E0548C9A45E1C1887BFFC05'
      }
    }
  }
]

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
      expect(() => {
        nano.createOpenBlock(invalidSecretKey, {
          work: VALID_OPEN_BLOCK.params.work,
          source: VALID_OPEN_BLOCK.params.source,
          representative: VALID_OPEN_BLOCK.params.representative
        })
      }).toThrowError('Secret key is not valid')
    }
  })

  test('throws with invalid source', () => {
    expect.assertions(INVALID_HASHES.length)
    for (let invalidSource of INVALID_HASHES) {
      expect(() => {
        nano.createOpenBlock(SECRET_KEY, {
          work: VALID_OPEN_BLOCK.params.work,
          source: invalidSource,
          representative: VALID_OPEN_BLOCK.params.representative
        })
      }).toThrowError('Source is not valid')
    }
  })

  test('throws with invalid representative', () => {
    expect.assertions(INVALID_ADDRESSES.length)
    for (let invalidAddress of INVALID_ADDRESSES) {
      expect(() => {
        nano.createOpenBlock(SECRET_KEY, {
          work: VALID_OPEN_BLOCK.params.work,
          source: VALID_OPEN_BLOCK.params.source,
          representative: invalidAddress
        })
      }).toThrowError('Representative is not valid')
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
      expect(() => {
        nano.createReceiveBlock(invalidSecretKey, {
          work: VALID_RECEIVE_BLOCK.params.work,
          previous: VALID_RECEIVE_BLOCK.params.previous,
          source: VALID_RECEIVE_BLOCK.params.source
        })
      }).toThrowError('Secret key is not valid')
    }
  })

  test('throws with invalid previous', () => {
    expect.assertions(INVALID_HASHES.length)
    for (let invalidPrevious of INVALID_HASHES) {
      expect(() => {
        nano.createReceiveBlock(SECRET_KEY, {
          work: VALID_RECEIVE_BLOCK.params.work,
          previous: invalidPrevious,
          source: VALID_RECEIVE_BLOCK.params.source
        })
      }).toThrowError('Previous is not valid')
    }
  })

  test('throws with invalid source', () => {
    expect.assertions(INVALID_HASHES.length)
    for (let invalidSource of INVALID_HASHES) {
      expect(() => {
        nano.createReceiveBlock(SECRET_KEY, {
          work: VALID_RECEIVE_BLOCK.params.work,
          previous: VALID_RECEIVE_BLOCK.params.previous,
          source: invalidSource
        })
      }).toThrowError('Source is not valid')
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
      expect(() => {
        nano.createSendBlock(invalidSecretKey, {
          work: VALID_SEND_BLOCK.params.work,
          previous: VALID_SEND_BLOCK.params.previous,
          destination: VALID_SEND_BLOCK.params.destination,
          balance: VALID_SEND_BLOCK.params.balance
        })
      }).toThrowError('Secret key is not valid')
    }
  })

  test('throws with invalid previous', () => {
    expect.assertions(INVALID_HASHES.length)
    for (let invalidPrevious of INVALID_HASHES) {
      expect(() => {
        nano.createSendBlock(SECRET_KEY, {
          work: VALID_SEND_BLOCK.params.work,
          previous: invalidPrevious,
          destination: VALID_SEND_BLOCK.params.destination,
          balance: VALID_SEND_BLOCK.params.balance
        })
      }).toThrowError('Previous is not valid')
    }
  })

  test('throws with invalid destination', () => {
    expect.assertions(INVALID_ADDRESSES.length)
    for (let invalidDestination of INVALID_ADDRESSES) {
      expect(() => {
        nano.createSendBlock(SECRET_KEY, {
          work: VALID_SEND_BLOCK.params.work,
          previous: VALID_SEND_BLOCK.params.previous,
          destination: invalidDestination,
          balance: VALID_SEND_BLOCK.params.balance
        })
      }).toThrowError('Destination is not valid')
    }
  })

  test('throws with invalid balance', () => {
    expect.assertions(INVALID_AMOUNTS.length)
    for (let invalidBalance of INVALID_AMOUNTS) {
      expect(() => {
        nano.createSendBlock(SECRET_KEY, {
          work: VALID_SEND_BLOCK.params.work,
          previous: VALID_SEND_BLOCK.params.previous,
          destination: VALID_SEND_BLOCK.params.destination,
          balance: invalidBalance
        })
      }).toThrowError('Balance is not valid')
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
      expect(() => {
        nano.createChangeBlock(invalidSecretKey, {
          work: VALID_CHANGE_BLOCK.params.work,
          previous: VALID_CHANGE_BLOCK.params.previous,
          representative: VALID_CHANGE_BLOCK.params.representative
        })
      }).toThrowError('Secret key is not valid')
    }
  })

  test('throws with invalid previous', () => {
    expect.assertions(INVALID_HASHES.length)
    for (let invalidPrevious of INVALID_HASHES) {
      expect(() => {
        nano.createChangeBlock(SECRET_KEY, {
          work: VALID_CHANGE_BLOCK.params.work,
          previous: invalidPrevious,
          representative: VALID_CHANGE_BLOCK.params.representative
        })
      }).toThrowError('Previous is not valid')
    }
  })

  test('throws with invalid representative', () => {
    expect.assertions(INVALID_ADDRESSES.length)
    for (let invalidRepresentative of INVALID_ADDRESSES) {
      expect(() => {
        nano.createChangeBlock(SECRET_KEY, {
          work: VALID_CHANGE_BLOCK.params.work,
          previous: VALID_CHANGE_BLOCK.params.previous,
          representative: invalidRepresentative
        })
      }).toThrowError('Representative is not valid')
    }
  })
})

describe('state', () => {
  test('creates correct state block', async () => {
    expect.assertions(VALID_STATE_BLOCKS.length)
    for (let validStateBlock of VALID_STATE_BLOCKS) {
      const result = nano.createStateBlock(SECRET_KEY_STATE_BLOCK, {
        work: validStateBlock.params.work,
        previous: validStateBlock.params.previous,
        representative: validStateBlock.params.representative,
        balance: validStateBlock.params.balance,
        link: validStateBlock.params.link
      })
      expect(result).toEqual(validStateBlock.result)
    }
  })

  // TODO(breaking): add work test

  test('throws with invalid secret key', () => {
    expect.assertions(INVALID_SECRET_KEYS.length)
    for (let invalidSecretKey of INVALID_SECRET_KEYS) {
      expect(() => {
        nano.createStateBlock(invalidSecretKey, {
          work: VALID_STATE_BLOCKS[0].params.work,
          previous: VALID_STATE_BLOCKS[0].params.previous,
          representative: VALID_STATE_BLOCKS[0].params.representative,
          balance: VALID_STATE_BLOCKS[0].params.balance,
          link: VALID_STATE_BLOCKS[0].params.link
        })
      }).toThrowError('Secret key is not valid')
    }
  })

  test('throws with invalid previous', () => {
    expect.assertions(INVALID_HASHES.length)
    for (let invalidPrevious of INVALID_HASHES) {
      expect(() => {
        nano.createStateBlock(SECRET_KEY_STATE_BLOCK, {
          work: VALID_STATE_BLOCKS[0].params.work,
          previous: invalidPrevious,
          representative: VALID_STATE_BLOCKS[0].params.representative,
          balance: VALID_STATE_BLOCKS[0].params.balance,
          link: VALID_STATE_BLOCKS[0].params.link
        })
      }).toThrowError('Previous is not valid')
    }
  })

  test('throws with invalid previous', () => {
    expect.assertions(INVALID_ADDRESSES.length)
    for (let invalidRepresentative of INVALID_ADDRESSES) {
      expect(() => {
        nano.createStateBlock(SECRET_KEY_STATE_BLOCK, {
          work: VALID_STATE_BLOCKS[0].params.work,
          previous: VALID_STATE_BLOCKS[0].params.previous,
          representative: invalidRepresentative,
          balance: VALID_STATE_BLOCKS[0].params.balance,
          link: VALID_STATE_BLOCKS[0].params.link
        })
      }).toThrowError('Representative is not valid')
    }
  })

  test('throws with invalid balance', () => {
    expect.assertions(INVALID_AMOUNTS.length)
    for (let invalidBalance of INVALID_AMOUNTS) {
      expect(() => {
        nano.createStateBlock(SECRET_KEY_STATE_BLOCK, {
          work: VALID_STATE_BLOCKS[0].params.work,
          previous: VALID_STATE_BLOCKS[0].params.previous,
          representative: VALID_STATE_BLOCKS[0].params.representative,
          balance: invalidBalance,
          link: VALID_STATE_BLOCKS[0].params.link
        })
      }).toThrowError('Balance is not valid')
    }
  })

  test('throws with invalid link', () => {
    expect.assertions(INVALID_HASHES_AND_ADDRESSES.length)
    for (let invalidLink of INVALID_HASHES_AND_ADDRESSES) {
      expect(() => {
        nano.createStateBlock(SECRET_KEY_STATE_BLOCK, {
          work: VALID_STATE_BLOCKS[0].params.work,
          previous: VALID_STATE_BLOCKS[0].params.previous,
          representative: VALID_STATE_BLOCKS[0].params.representative,
          balance: VALID_STATE_BLOCKS[0].params.balance,
          link: invalidLink
        })
      }).toThrowError('Link is not valid')
    }
  })
})
