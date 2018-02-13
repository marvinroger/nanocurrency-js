const assert = require('assert')

const nano = require('../dist/nanocurrency.cjs')

const VALID = {
  hash: '7f7122e843b27524f4f1d6bd14aefd1c8f01d36ae8653d37417533c0d4bc2be6',
  work: '0000000000995bc3'
}

const INVALID = {
  hash: '3ed191ec702f384514ba35e1f9081148df5a9ab48fe0f604b6e5b9f7177cee32',
  work: 'bb6737f2daf01a2c'
}

async function test () {
  await nano.init()

  const work = nano.generateWork(VALID.hash)
  assert.deepEqual(work, VALID.work)

  const valid = nano.validateWork(VALID.hash, VALID.work)
  assert.deepEqual(valid, true)

  const invalid = nano.validateWork(INVALID.hash, INVALID.work)
  assert.deepEqual(invalid, false)
}

test()
