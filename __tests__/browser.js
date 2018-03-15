/* eslint-env jest */

const fs = require('fs')
const {promisify} = require('util')
const puppeteer = require('puppeteer')

const readFile = promisify(fs.readFile)

let browser = null
let page = null
let umdScript = null
beforeAll(async () => {
  browser = await puppeteer.launch()
  page = await browser.newPage()
  umdScript = await readFile('./dist/nanocurrency.umd.js' ,'utf8')
})

afterAll(() => browser.close())

describe('browser', () => {
  test('works in browser', async () => {
    expect.assertions(3)

    // load NanoCurrency
    await page.evaluate(umdScript)

    let result = null

    // init
    result = await page.evaluate(async function () {
      await NanoCurrency.init()
      return true
    })
    expect(result).toBe(true)

    // seed generation
    result = await page.evaluate(async function () {
      const a = await NanoCurrency.generateSeed()
      const b = await NanoCurrency.generateSeed()
      return { a, b }
    })
    expect(result.a).not.toBe(result.b)

    // webassembly test
    result = await page.evaluate(async function () {
      const publicKey = NanoCurrency.derivePublicKey('23B5E95B4C4325ED5AF109BFE4ACDE782DBAB0163591D9052963723AE8E72A09')
      return publicKey
    })
    expect(result).toBe('4D312F604F638ADF19AFAC6308ECBBC5881E1B6CD6F53D382775C686BCA7535B')
  })
})
