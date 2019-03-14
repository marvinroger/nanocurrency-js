/* eslint-env jest */
/* eslint-disable @typescript-eslint/no-var-requires */

const path = require('path')
const util = require('util')
const exec = util.promisify(require('child_process').exec)
const jsonStableStringify = require('json-stable-stringify-without-jsonify')
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

describe('create', () => {
  test('block', async () => {
    expect.assertions(3)
    const { stdout, stderr, code } = await cli(
      'create block --secret E5A523DF83DC3A79F9DD29940500F605D51C4FA14EF56BE5CE8299082CD8A4BD --balance 3829201371931432594706 --link xrb_3koo957rgp3qixffgygq7851ae9wsfimh58ssnezcsepdb3kku4qbnwx8ozp --previous 242B05CEBCBFE2A564C356E1A62F78240D67B33880B543C743E18AF67E460B16 --representative xrb_3dxd4z89ihf3rgxcgib4caodrw7uykwhuumwnqgk7bra5tf63xnms8jofpbn --work 66ea8c8c632b7849'
    )
    expect(code).toBe(0)
    expect(jsonStableStringify(JSON.parse(stdout.trimRight()))).toBe(
      '{"block":{"account":"xrb_1sryfjr4q7pitn7cu5z6pyy1fzpk4di8fb7ihb3dwkqn1b5st7wsd7ey7c9s","balance":"3829201371931432594706","link":"CAB538CB875837875AD779D729860430FCCB61378CD9CD19F565965A43296C57","link_as_account":"xrb_3koo957rgp3qixffgygq7851ae9wsfimh58ssnezcsepdb3kku4qbnwx8ozp","previous":"242B05CEBCBFE2A564C356E1A62F78240D67B33880B543C743E18AF67E460B16","representative":"xrb_3dxd4z89ihf3rgxcgib4caodrw7uykwhuumwnqgk7bra5tf63xnms8jofpbn","signature":"047AC2BD8D811E81F32F176083B9E9260D9AC50FA91E25E6EE1652344D17E8F934E8882A8829D7F77774576623D9C4CE1EBBB053ED7510A6E64EB45DA4677F0E","type":"state","work":"66ea8c8c632b7849"},"hash":"FA5EA85833EB7D2618DE2898C15E9812A9F2395F83A49E6086AD701565506CE6"}'
    )
    expect(stderr).toBe('')
  })
})
