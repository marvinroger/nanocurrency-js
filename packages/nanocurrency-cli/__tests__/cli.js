/* eslint-env jest */

const path = require('path')
const util = require('util')
const exec = util.promisify(require('child_process').exec)
const nano = require('nanocurrency')

const cli = async args => {
  try {
    const { stdout, stderr } = await exec(
      'node ' + path.join(__dirname, '../dist/index.js') + ' ' + args
    )

    return {
      code: 0,
      stdout,
      stderr,
    }
  } catch (err) {
    return {
      code: err.code,
      stdout: err.stdout,
      stderr: err.stderr,
    }
  }
}

describe('check', () => {
  test('seed', async () => {
    expect.assertions(6)
    {
      const { stdout, stderr, code } = await cli(
        'check seed --candidate 005f22e2dcc064196bb712dd6412762be85d1fce22e43c842d2ad17354e4216a'
      )
      expect(code).toBe(0)
      expect(stdout.trimRight()).toBe('true')
      expect(stderr).toBe('')
    }

    {
      const { stdout, stderr, code } = await cli('check seed --candidate foo')
      expect(code).toBe(0)
      expect(stdout.trimRight()).toBe('false')
      expect(stderr).toBe('')
    }
  })

  test('index', async () => {
    expect.assertions(6)
    {
      const { stdout, stderr, code } = await cli('check index --candidate 1234')
      expect(code).toBe(0)
      expect(stdout.trimRight()).toBe('true')
      expect(stderr).toBe('')
    }

    {
      const { stdout, stderr, code } = await cli('check index --candidate foo')
      expect(code).toBe(0)
      expect(stdout.trimRight()).toBe('false')
      expect(stderr).toBe('')
    }
  })

  test('amount', async () => {
    expect.assertions(6)
    {
      const { stdout, stderr, code } = await cli('check amount --candidate 1')
      expect(code).toBe(0)
      expect(stdout.trimRight()).toBe('true')
      expect(stderr).toBe('')
    }

    {
      const { stdout, stderr, code } = await cli('check amount --candidate foo')
      expect(code).toBe(0)
      expect(stdout.trimRight()).toBe('false')
      expect(stderr).toBe('')
    }
  })

  test('hash', async () => {
    expect.assertions(6)
    {
      const { stdout, stderr, code } = await cli(
        'check hash --candidate 005f22e2dcc064196bb712dd6412762be85d1fce22e43c842d2ad17354e4216a'
      )
      expect(code).toBe(0)
      expect(stdout.trimRight()).toBe('true')
      expect(stderr).toBe('')
    }

    {
      const { stdout, stderr, code } = await cli('check hash --candidate foo')
      expect(code).toBe(0)
      expect(stdout.trimRight()).toBe('false')
      expect(stderr).toBe('')
    }
  })

  test('key', async () => {
    expect.assertions(6)
    {
      const { stdout, stderr, code } = await cli(
        'check key --candidate 005f22e2dcc064196bb712dd6412762be85d1fce22e43c842d2ad17354e4216a'
      )
      expect(code).toBe(0)
      expect(stdout.trimRight()).toBe('true')
      expect(stderr).toBe('')
    }

    {
      const { stdout, stderr, code } = await cli('check key --candidate foo')
      expect(code).toBe(0)
      expect(stdout.trimRight()).toBe('false')
      expect(stderr).toBe('')
    }
  })

  test('address', async () => {
    expect.assertions(6)
    {
      const { stdout, stderr, code } = await cli(
        'check address --candidate xrb_114z6djfsi5657oug6pxeib9eczadnhwwaq69k44tcpjgfcgaadcusoda5xf'
      )
      expect(code).toBe(0)
      expect(stdout.trimRight()).toBe('true')
      expect(stderr).toBe('')
    }

    {
      const { stdout, stderr, code } = await cli(
        'check address --candidate foo'
      )
      expect(code).toBe(0)
      expect(stdout.trimRight()).toBe('false')
      expect(stderr).toBe('')
    }
  })

  test('work', async () => {
    expect.assertions(6)
    {
      const { stdout, stderr, code } = await cli(
        'check work --candidate b2ff948c874e7d62'
      )
      expect(code).toBe(0)
      expect(stdout.trimRight()).toBe('true')
      expect(stderr).toBe('')
    }

    {
      const { stdout, stderr, code } = await cli(
        'check address --candidate foo'
      )
      expect(code).toBe(0)
      expect(stdout.trimRight()).toBe('false')
      expect(stderr).toBe('')
    }
  })

  test('signature', async () => {
    expect.assertions(6)
    {
      const { stdout, stderr, code } = await cli(
        'check signature --candidate 005f22e2dcc064196bb712dd6412762be85d1fce22e43c842d2ad17354e4216a005f22e2dcc064196bb712dd6412762be85d1fce22e43c842d2ad17354e4216a'
      )
      expect(code).toBe(0)
      expect(stdout.trimRight()).toBe('true')
      expect(stderr).toBe('')
    }

    {
      const { stdout, stderr, code } = await cli(
        'check signature --candidate foo'
      )
      expect(code).toBe(0)
      expect(stdout.trimRight()).toBe('false')
      expect(stderr).toBe('')
    }
  })
})

describe('convert', () => {
  test('amount', async () => {
    expect.assertions(3)
    const { stdout, stderr, code } = await cli(
      'convert amount --input 1 --from Nano --to raw'
    )
    expect(code).toBe(0)
    expect(stdout.trimRight()).toBe('1000000000000000000000000000000')
    expect(stderr).toBe('')
  })
})

describe('sign', () => {
  test('block', async () => {
    expect.assertions(3)
    const { stdout, stderr, code } = await cli(
      'sign block --secret 005f22e2dcc064196bb712dd6412762be85d1fce22e43c842d2ad17354e4216a --hash 005f22e2dcc064196bb712dd6412762be85d1fce22e43c842d2ad17354e4216a'
    )
    expect(code).toBe(0)
    expect(stdout.trimRight()).toBe(
      '735795B9A646AFB2589145F13C19B8698AF99AD4CE7E8252D14B00AC9BD4F1FEC829713F70439D02D05FF0B71842AE135EACD90617CCF1C6AB37A68679CBAE06'
    )
    expect(stderr).toBe('')
  })
})

describe('verify', () => {
  test('block', async () => {
    expect.assertions(6)
    {
      const { stdout, stderr, code } = await cli(
        'verify block --public 4E8FE000C14158AF66F87C33541C6ABF9EF524E721CFA2A77E83C1C852D8EDA2 --hash 005f22e2dcc064196bb712dd6412762be85d1fce22e43c842d2ad17354e4216a --signature 735795B9A646AFB2589145F13C19B8698AF99AD4CE7E8252D14B00AC9BD4F1FEC829713F70439D02D05FF0B71842AE135EACD90617CCF1C6AB37A68679CBAE06'
      )
      expect(code).toBe(0)
      expect(stdout.trimRight()).toBe('true')
      expect(stderr).toBe('')
    }

    {
      const { stdout, stderr, code } = await cli(
        'verify block --public 5E8FE000C14158AF66F87C33541C6ABF9EF524E721CFA2A77E83C1C852D8EDA2 --hash 005f22e2dcc064196bb712dd6412762be85d1fce22e43c842d2ad17354e4216a --signature 735795B9A646AFB2589145F13C19B8698AF99AD4CE7E8252D14B00AC9BD4F1FEC829713F70439D02D05FF0B71842AE135EACD90617CCF1C6AB37A68679CBAE06'
      )
      expect(code).toBe(0)
      expect(stdout.trimRight()).toBe('false')
      expect(stderr).toBe('')
    }
  })
})

describe('validate', () => {
  test('work', async () => {
    expect.assertions(6)
    {
      const { stdout, stderr, code } = await cli(
        'validate work --hash 9DB2961B2D01D49C53AE6C9E513BC51AC04273CD4DAC4277F82B44B4F084A91A --work b2ff948c874e7d62'
      )
      expect(code).toBe(0)
      expect(stdout.trimRight()).toBe('true')
      expect(stderr).toBe('')
    }

    {
      const { stdout, stderr, code } = await cli(
        'validate work --hash 9DB2961B2D01D49C53AE6C9E513BC51AC04273CD4DAC4277F82B44B4F084A91B --work b2ff948c874e7d62'
      )
      expect(code).toBe(0)
      expect(stdout.trimRight()).toBe('false')
      expect(stderr).toBe('')
    }
  })
})

describe('generate', () => {
  test('seed', async () => {
    expect.assertions(3)
    const { stdout, stderr, code } = await cli('generate seed')
    expect(code).toBe(0)
    expect(nano.checkSeed(stdout.trimRight())).toBe(true)
    expect(stderr).toBe('')
  })
})

describe('derive', () => {
  test('secret', async () => {
    expect.assertions(3)
    const { stdout, stderr, code } = await cli(
      'derive secret --from 005f22e2dcc064196bb712dd6412762be85d1fce22e43c842d2ad17354e4216a'
    )
    expect(code).toBe(0)
    expect(stdout.trimRight()).toBe(
      '8211AFAB03BA059C8225DE515BEAEF91E4F629BB7906915698D51AA0992257B5'
    )
    expect(stderr).toBe('')
  })

  test('public', async () => {
    expect.assertions(3)
    const { stdout, stderr, code } = await cli(
      'derive public --from 005f22e2dcc064196bb712dd6412762be85d1fce22e43c842d2ad17354e4216a'
    )
    expect(code).toBe(0)
    expect(stdout.trimRight()).toBe(
      '4E8FE000C14158AF66F87C33541C6ABF9EF524E721CFA2A77E83C1C852D8EDA2'
    )
    expect(stderr).toBe('')
  })

  test('address', async () => {
    expect.assertions(3)
    const { stdout, stderr, code } = await cli(
      'derive address --from 005f22e2dcc064196bb712dd6412762be85d1fce22e43c842d2ad17354e4216a'
    )
    expect(code).toBe(0)
    expect(stdout.trimRight()).toBe(
      'xrb_114z6djfsi5657oug6pxeib9eczadnhwwaq69k44tcpjgfcgaadcusoda5xf'
    )
    expect(stderr).toBe('')
  })
})
