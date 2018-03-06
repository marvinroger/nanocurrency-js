const IS_NODE = Object.prototype.toString.call(typeof process !== 'undefined' ? process : 0) === '[object process]'

let fillRandom = null
if (!IS_NODE) {
  fillRandom = () => {
    return new Promise(resolve => {
      self.crypto.getRandomValues.bind(self.crypto) // eslint-disable-line
      resolve()
    })
  }
} else {
  const {promisify} = require('util')
  fillRandom = promisify(require('crypto').randomFill)
}

export function getRandomBytes (count) {
  return new Promise((resolve, reject) => {
    const bytes = new Uint8Array(count)
    fillRandom(bytes)
      .then(() => {
        resolve(bytes)
      })
      .catch(reject)
  })
}
