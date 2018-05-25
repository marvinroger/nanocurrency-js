/*!
 * nanocurrency-js: A toolkit for the Nano cryptocurrency.
 * Copyright (c) 2018 Marvin ROGER <dev at marvinroger dot fr>
 * Licensed under GPL-3.0 (https://git.io/vAZsK)
 */
import { signDetached, verifyDetached } from './nacl';

import { checkHash, checkKey, checkSignature } from './check';

import { byteArrayToHex, hexToByteArray } from './utils';

/**
 * Sign a block.
 *
 * @param blockHash - The hash of the block to sign
 * @param secretKey - The secret key to sign the block with, in hexadecimal format
 * @returns Signature, in hexadecimal format
 */
export function signBlock(blockHash: string, secretKey: string) {
  if (!checkHash(blockHash)) throw new Error('Hash is not valid');
  if (!checkKey(secretKey)) throw new Error('Secret key is not valid');

  const blockHashBytes = hexToByteArray(blockHash);
  const secretKeyBytes = hexToByteArray(secretKey);

  const signatureBytes = signDetached(blockHashBytes, secretKeyBytes);

  return byteArrayToHex(signatureBytes);
}

/**
 * Verify a block against a public key.
 *
 * @param blockHash - The hash of the block to verify
 * @param signature - The signature of the block to verify, in hexadecimal format
 * @param publicKey - The public key to verify the block against, in hexadecimal format
 * @returns Valid
 */
export function verifyBlock(blockHash: string, signature: string, publicKey: string) {
  if (!checkHash(blockHash)) throw new Error('Hash is not valid');
  if (!checkSignature(signature)) throw new Error('Signature is not valid');
  if (!checkKey(publicKey)) throw new Error('Public key is not valid');

  const blockHashBytes = hexToByteArray(blockHash);
  const signatureBytes = hexToByteArray(signature);
  const publicKeyBytes = hexToByteArray(publicKey);

  return verifyDetached(blockHashBytes, signatureBytes, publicKeyBytes);
}
