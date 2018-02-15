/*!
 * nanocurrency-js: A toolkit for the Nano cryptocurrency.
 * Copyright (c) 2018 Marvin ROGER <dev at marvinroger dot fr>
 * Licensed under GPL-3.0 (https://git.io/vAZsK)
 */
const assert = require('assert')

const nano = require('../dist/nanocurrency.cjs')

const VALID_WORK = {
  hash: '7f7122e843b27524f4f1d6bd14aefd1c8f01d36ae8653d37417533c0d4bc2be6',
  work: '0000000000995bc3'
}

const INVALID_WORK = {
  hash: '3ed191ec702f384514ba35e1f9081148df5a9ab48fe0f604b6e5b9f7177cee32',
  work: 'bb6737f2daf01a2c'
}

const VALID_SEED = 'b947ee0115014a4d49a804e7fc7248e31690b80033ce7a6e3a07bdf93b2584ff'
const VALID_SECRET_KEY_0 = '23b5e95b4c4325ed5af109bfe4acde782dbab0163591d9052963723ae8e72a09'
const VALID_PUBLIC_KEY_0 = '4d312f604f638adf19afac6308ecbbc5881e1b6cd6f53d382775c686bca7535b'
const VALID_ADDRESS_0 = 'xrb_1mbj7xi6yrwcuwetzd5535pdqjea5rfpsoqo9nw4gxg8itycgntucp49i1nz'
const VALID_SECRET_KEY_1 = 'feb6959738d43f9b0e6cdcc778bcd2f3384e6f1255510db6f48e2b99ba059f0f'
const VALID_PUBLIC_KEY_1 = 'fffadbb9e15d553101e1db0c67f20f6984836dc1bb513ff1d0e4a0af89ce5291'
const VALID_ADDRESS_1 = 'xrb_3zztugwy4qco861y5preezs1yte6ifpw5gtj9zrx3s71oy6wwnnj5en5oo5a'

async function test () {
  await nano.init()

  /*
   * Seed, keys and addresses
   */

  console.log('Testing seed generation...')
  const seed1 = nano.generateSeed()
  const seed2 = nano.generateSeed()
  assert.notStrictEqual(seed1, seed2)

  console.log('Testing secret key #0 generation from known seed...')
  const secretKey0 = nano.computeSecretKey(VALID_SEED, 0)
  assert.strictEqual(secretKey0, VALID_SECRET_KEY_0)

  console.log('Testing secret key #1 generation from known seed...')
  const secretKey1 = nano.computeSecretKey(VALID_SEED, 1)
  assert.strictEqual(secretKey1, VALID_SECRET_KEY_1)

  console.log('Testing public key #0 generation from known secret key...')
  const publicKey0 = nano.computePublicKey(VALID_SECRET_KEY_0)
  assert.strictEqual(publicKey0, VALID_PUBLIC_KEY_0)

  console.log('Testing public key #1 generation from known secret key...')
  const publicKey1 = nano.computePublicKey(VALID_SECRET_KEY_1)
  assert.strictEqual(publicKey1, VALID_PUBLIC_KEY_1)

  console.log('Testing address #0 generation from known public key...')
  const address0 = nano.computeAddress(VALID_PUBLIC_KEY_0)
  assert.strictEqual(address0, VALID_ADDRESS_0)

  console.log('Testing address #1 generation from known public key...')
  const address1 = nano.computeAddress(VALID_PUBLIC_KEY_1)
  assert.strictEqual(address1, VALID_ADDRESS_1)

  /*
   * Work
   */

  console.log('Testing valid work...')
  const valid = nano.validateWork(VALID_WORK.hash, VALID_WORK.work)
  assert.strictEqual(valid, true)

  console.log('Testing invalid work...')
  const invalid = nano.validateWork(INVALID_WORK.hash, INVALID_WORK.work)
  assert.strictEqual(invalid, false)

  console.log('Generating work from known hash...')
  const work = nano.generateWork(VALID_WORK.hash)
  assert.strictEqual(work, VALID_WORK.work)
}

test()
  .then(() => {
    console.log('OK')
  })
  .catch(err => {
    console.error(`Error: ${err}`)
    process.exit(1)
  })
