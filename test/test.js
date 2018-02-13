const assert = require('assert')

const nano = require('../dist/nanocurrency.cjs')

async function test () {
  await nano.init()
  
  const work = nano.generateWork('7f7122e843b27524f4f1d6bd14aefd1c8f01d36ae8653d37417533c0d4bc2be6')
  assert.deepEqual(work, '81df2c0600000000')
}

test()
