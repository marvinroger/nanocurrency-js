import Native from '../native'

let instance = null
let _generateWork = null
export function init () {
  return new Promise((resolve, reject) => {
    try {
      Native().then(native => {
        instance = native
        _generateWork = instance.cwrap('emscripten_generate_work', 'string', ['string', 'number', 'number'])
        resolve()
      })
    } catch (err) {
      reject(err)
    }
  })
}

export function generateWork (blockHash, workerNumber = 0, workerCount = 1) {
  if (instance === null) throw new Error('Nano is not initialized')

  const work = _generateWork(blockHash, workerNumber, workerCount)

  return work !== '0000000000000000' ? work : null
}
