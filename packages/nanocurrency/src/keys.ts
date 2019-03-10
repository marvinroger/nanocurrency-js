/*!
 * nanocurrency-js: A toolkit for the Nano cryptocurrency.
 * Copyright (c) 2018 Marvin ROGER <dev at marvinroger dot fr>
 * Licensed under GPL-3.0 (https://git.io/vAZsK)
 */
import { blake2b, blake2bFinal, blake2bInit, blake2bUpdate } from 'blakejs';

import { checkKey, checkSeed } from './check';
import { derivePublicFromSecret } from './nacl';
import { byteArrayToHex, getRandomBytes, hexToByteArray } from './utils';
import { parseAddress } from './parse';
import { encodeNanoBase32 } from './nano-base32';

/**
 * Generate a cryptographically secure seed.
 *
 * @returns Promise fulfilled with seed, in hexadecimal format
 */
export function generateSeed(): Promise<string> {
  return new Promise((resolve, reject) => {
    getRandomBytes(32)
      .then(seed => {
        const seedHex = seed.reduce((hex, i) => {
          return hex + ('0' + i.toString(16)).slice(-2);
        }, '');

        resolve(seedHex);
      })
      .catch(reject);
  });
}

/**
 * Derive a secret key from a seed, given an index.
 *
 * @param seed - The seed to generate the secret key from, in hexadecimal format
 * @param index - The index to generate the secret key from
 * @returns Secret key, in hexadecimal format
 */
export function deriveSecretKey(seed: string, index: number) {
  if (!checkSeed(seed)) throw new Error('Seed is not valid');
  if (!Number.isInteger(index) || index < 0) {
    throw new Error('Index is not valid');
  }

  const seedBytes = hexToByteArray(seed);
  const indexBuffer = new ArrayBuffer(4);
  const indexView = new DataView(indexBuffer);
  indexView.setUint32(0, index);
  const indexBytes = new Uint8Array(indexBuffer);

  const context = blake2bInit(32);
  blake2bUpdate(context, seedBytes);
  blake2bUpdate(context, indexBytes);
  const secretKeyBytes = blake2bFinal(context);

  return byteArrayToHex(secretKeyBytes);
}

/**
 * Derive a public key from a secret key.
 *
 * @param secretKeyOrAddress - The secret key or address to generate the public key from, in hexadecimal or address format
 * @returns Public key, in hexadecimal format
 */
export function derivePublicKey(secretKeyOrAddress: string) {
  const isSecretKey = checkKey(secretKeyOrAddress);
  const addressParseResult = parseAddress(secretKeyOrAddress);
  const isAddress = addressParseResult.valid;
  if (!isSecretKey && !isAddress) {
    throw new Error('Secret key or address is not valid');
  }

  let publicKeyBytes: Uint8Array | null;
  if (isSecretKey) {
    const secretKeyBytes = hexToByteArray(secretKeyOrAddress);
    publicKeyBytes = derivePublicFromSecret(secretKeyBytes);
  } else if (isAddress) {
    publicKeyBytes = addressParseResult.publicKeyBytes;
  }

  return byteArrayToHex(publicKeyBytes!);
}

/** Derive address params. */
export interface DeriveAddressParams {
  /** Whether to use nano_ instead of xrb_ */
  useNanoPrefix?: boolean;
}

/**
 * Derive address from a public key.
 *
 * @param publicKey - The public key to generate the address from, in hexadecimal format
 * @param params - Parameters
 * @returns Address
 */
export function deriveAddress(publicKey: string, params: DeriveAddressParams = {}) {
  if (!checkKey(publicKey)) throw new Error('Public key is not valid');

  const publicKeyBytes = hexToByteArray(publicKey);
  const paddedPublicKeyBytes = hexToByteArray(publicKey);

  let prefix = 'xrb_';
  if (params.useNanoPrefix === true) prefix = 'nano_';

  const encodedPublicKey = encodeNanoBase32(paddedPublicKeyBytes);

  const checksum = blake2b(publicKeyBytes, null, 5).reverse();

  const encodedChecksum = encodeNanoBase32(checksum);

  return prefix + encodedPublicKey + encodedChecksum;
}
