/* eslint-env worker */
/* global NanoCurrency:false */

importScripts('https://cdn.jsdelivr.net/npm/nanocurrency@2.0.0/dist/nanocurrency.umd.js');

onmessage = async function({ data }) {
  const { blockHash, workerNumber, workerCount } = data;

  postMessage({ type: 'started' });

  const work = await NanoCurrency.computeWork(blockHash, workerNumber, workerCount);

  postMessage({ type: 'done', work });
};
