/* eslint-env jest */

const nano = require('../dist/nanocurrency.cjs')

const VALID_HASH = '7f7122e843b27524f4f1d6bd14aefd1c8f01d36ae8653d37417533c0d4bc2be6'
const VALID_SECRET_KEY = '23b5e95b4c4325ed5af109bfe4acde782dbab0163591d9052963723ae8e72a09'
const VALID_PUBLIC_KEY = '4d312f604f638adf19afac6308ecbbc5881e1b6cd6f53d382775c686bca7535b'
const VALID_SIGNATURE = '4ae39add5ee6d53c81ab8c0281787d6f81b620acca37c24dd4bfdcc85df45db65e86234b2367155382951d52b57d7dc97284b1fc9914db07d5735bd307435300'

beforeAll(nano.init)

test('signs correctly', () => {
  expect(
    nano.computeSignature(
      VALID_HASH,
      VALID_SECRET_KEY,
      VALID_PUBLIC_KEY
    )
  ).toBe(VALID_SIGNATURE)
})
