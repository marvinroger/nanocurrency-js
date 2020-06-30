const nano = require('./dist/nanocurrency.cjs')

async function main() {
  const blockHash =
    '7f7122e843b27524f4f1d6bd14aefd1c8f01d36ae8653d37417533c0d4bc2be6'
  const pow = await nano.computeWork(blockHash)
  // 0000000000995bc3
  const isWorkValid = nano.validateWork({ blockHash, work: pow })
  // true

  console.log(pow)
}

main()
