import Native from '../native'

let instance = null
let _generateWork = null
let _validateWork = null
export function init () {
  return new Promise((resolve, reject) => {
    try {
      Native().then(native => {
        instance = native
        _generateWork = instance.cwrap('emscripten_generate_work', 'string', ['string', 'number', 'number'])
        _validateWork = instance.cwrap('emscripten_validate_work', 'number', ['string', 'string'])
        resolve()
      })
    } catch (err) {
      reject(err)
    }
  })
}

const checkNotInitialized = () => {
  if (instance === null) throw new Error('NanoCurrency is not initialized')
}

export function generateWork (blockHash, workerNumber = 0, workerCount = 1) {
  checkNotInitialized()

  const work = _generateWork(blockHash, workerNumber, workerCount)

  return work !== '0000000000000000' ? work : null
}

export function validateWork (blockHash, work) {
  checkNotInitialized()

  const valid = _validateWork(blockHash, work) === 1

  return valid
}
