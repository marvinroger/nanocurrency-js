/* eslint-disable @typescript-eslint/no-var-requires */

const nano = require('./dist/nanocurrency.cjs')

async function main() {
  console.time()
  const blockHash =
    '40cdc45899503f25e8ccba26c1df1fad2b046cb3d2c9e45c05fb2127ed2a52bf'
  const work = await nano.computeWork(blockHash)
  console.timeEnd()

  const valid = nano.validateWork({
    blockHash,
    work,
  })
  console.log(`Work ${work} is ${valid ? 'valid' : 'invalid'}`)
}

main()
