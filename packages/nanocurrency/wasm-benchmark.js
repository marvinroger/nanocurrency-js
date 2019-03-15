/* eslint-disable @typescript-eslint/no-var-requires */

const nano = require('./dist/nanocurrency.cjs')

async function main() {
  console.time()
  const blockHash =
    'b9cb6b51b8eb869af085c4c03e7dc539943d0bdde13b21436b687c9c7ea56cb0'
  const work = await nano.computeWork(blockHash)
  console.timeEnd()

  const valid = nano.validateWork({
    blockHash,
    work,
  })
  console.log(`Work ${work} is ${valid ? 'valid' : 'invalid'}`)
}

main()
