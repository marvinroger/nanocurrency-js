/* eslint-env worker */
/* global NanoCurrency:false */

importScripts('https://cdn.jsdelivr.net/npm/nanocurrency@2/dist/nanocurrency.umd.js');

onmessage = async function({ data }) {
  const { blockHash, workerIndex, workerCount } = data;

  postMessage({ type: 'started' });

  const work = await NanoCurrency.computeWork(blockHash, { workerIndex, workerCount });

  postMessage({ type: 'done', work });
};
