/* eslint-env worker */
/* global NanoCurrency:false */

importScripts('https://cdn.jsdelivr.net/npm/nanocurrency@^1.3.0/dist/nanocurrency.umd.js')

onmessage = async function ({data}) {
  const {blockHash, workerNumber, workerCount} = data

  postMessage({ type: 'started' })

  await NanoCurrency.init()
  const work = NanoCurrency.work(blockHash, workerNumber, workerCount)

  postMessage({ type: 'done', work })
}
