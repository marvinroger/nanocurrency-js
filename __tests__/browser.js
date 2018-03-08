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
      const publicKey = NanoCurrency.derivePublicKey('23b5e95b4c4325ed5af109bfe4acde782dbab0163591d9052963723ae8e72a09')
      return publicKey
    })
    expect(result).toBe('4d312f604f638adf19afac6308ecbbc5881e1b6cd6f53d382775c686bca7535b')
  })
})
