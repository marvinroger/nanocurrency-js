/* eslint-env jest */
/* eslint-disable @typescript-eslint/no-var-requires */
/* global NanoCurrency */

import { promises as fs } from 'fs'
import puppeteer, { Browser, Page } from 'puppeteer'

let browser: Browser
let page: Page
let umdScript: string
beforeAll(async () => {
  browser = await puppeteer.launch()
  page = await browser.newPage()
  umdScript = await fs.readFile('./dist/nanocurrency.umd.js', 'utf8')
})

afterAll(() => browser.close())

describe('browser', () => {
  test('works in browser', async () => {
    // load NanoCurrency
    await page.evaluate(umdScript)

    // seed generation
    const result1 = await page.evaluate(async function() {
      // @ts-expect-error in global browser scope
      const a = await NanoCurrency.generateSeed()
      // @ts-expect-error in global browser scope
      const b = await NanoCurrency.generateSeed()
      return { a, b }
    })
    expect(result1.a).not.toBe(result1.b)

    // webassembly test (test in worker)
    const result2 = await page.evaluate(
      function(passed) {
        return new Promise((resolve, reject) => {
          const blobURL = URL.createObjectURL(
            new Blob(
              [
                passed.umdScript,
                '(',
                function() {
                  postMessage('lol')
                  // @ts-expect-error in global browser scope
                  return NanoCurrency.computeWork(
                    'b9cb6b51b8eb869af085c4c03e7dc539943d0bdde13b21436b687c9c7ea56cb0'
                  ).then((work: string) => {
                    postMessage(work)
                    return
                  })
                }.toString(),
                ')()',
              ],
              {
                type: 'application/javascript',
              }
            )
          )

          const worker = new Worker(blobURL)
          worker.onmessage = function(e) {
            const work = e.data

            resolve(work)
          }
          worker.onerror = function(err) {
            reject(err)
          }

          URL.revokeObjectURL(blobURL)
        })
      },
      { umdScript }
    )
    expect(result2).toBe('0000000000010600')
  })
})
