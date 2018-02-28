const IS_NODE = Object.prototype.toString.call(typeof process !== 'undefined' ? process : 0) === '[object process]'

let fillRandom = null
if (!IS_NODE) {
  fillRandom = self.crypto.getRandomValues.bind(self.crypto) // eslint-disable-line
} else {
  const {promisify} = require('util')
  fillRandom = promisify(require('crypto').randomFill)
}

export async function getRandomBytes (count) {
  const bytes = new Uint8Array(count)
  await fillRandom(bytes)

  return bytes
}
