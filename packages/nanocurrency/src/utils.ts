/*!
 * nanocurrency-js: A toolkit for the Nano cryptocurrency.
 * Copyright (c) 2018 Marvin ROGER <dev at marvinroger dot fr>
 * Licensed under GPL-3.0 (https://git.io/vAZsK)
 */
const IS_NODE =
  Object.prototype.toString.call(
    typeof process !== 'undefined' ? process : 0 // tslint:disable-line
  ) === '[object process]';

let fillRandom: (bytes: Uint8Array) => Promise<void>;
if (!IS_NODE) {
  fillRandom = bytes => {
    return new Promise(resolve => {
      // cast as any, otherwise:
      // error TS2339: Property 'crypto' does not exist on type 'WorkerGlobalScope'
      (self as any).crypto.getRandomValues(bytes);
      resolve();
    });
  };
} else {
  const { promisify } = require('util');
  fillRandom = promisify(require('crypto').randomFill);
}

/** @hidden */
export function getRandomBytes(count: number): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    const bytes = new Uint8Array(count);
    fillRandom(bytes)
      .then(() => {
        resolve(bytes);
      })
      .catch(reject);
  });
}

/** @hidden */
export function byteArrayToHex(byteArray: Uint8Array) {
  if (!byteArray) {
    return '';
  }

  let hexStr = '';
  for (let i = 0; i < byteArray.length; i++) {
    let hex = (byteArray[i] & 0xff).toString(16);
    hex = hex.length === 1 ? `0${hex}` : hex;
    hexStr += hex;
  }

  return hexStr.toUpperCase();
}

/** @hidden */
export function hexToByteArray(hex: string) {
  if (!hex) {
    return new Uint8Array();
  }

  const a = [];
  for (let i = 0; i < hex.length; i += 2) {
    a.push(parseInt(hex.substr(i, 2), 16));
  }

  return new Uint8Array(a);
}

/** @hidden */
export function base64ToByteArray(base64: string) {
  if (IS_NODE) {
    return Buffer.from(base64, 'base64');
  } else {
    var raw = atob(base64);
    var rawLength = raw.length;
    var array = new Uint8Array(new ArrayBuffer(rawLength));

    for (let i = 0; i < rawLength; i++) {
      array[i] = raw.charCodeAt(i);
    }

    return array;
  }
}

/** @hidden */
export function compareArrays(array1: Uint8Array, array2: Uint8Array) {
  for (let i = 0; i < array1.length; i++) {
    if (array1[i] !== array2[i]) return false;
  }

  return true;
}
