/*!
 * nanocurrency-js: A toolkit for the Nano cryptocurrency.
 * Copyright (c) 2019 Marvin ROGER <bonjour+code at marvinroger dot fr>
 * Licensed under GPL-3.0 (https://git.io/JvSg6)
 */
import { checkHash, checkKey, checkSignature } from './check'
import { signDetached, verifyDetached } from './nacl'
import { byteArrayToHex, hexToByteArray } from './utils'

/** Sign block parameters. */
export interface SignBlockParams {
  /** The hash of the block to sign */
  hash: string
  /** The secret key to sign the block with, in hexadecimal format */
  secretKey: string
}

/**
 * Sign a block.
 *
 * @param params - Parameters
 * @returns Signature, in hexadecimal format
 */
export function signBlock(params: SignBlockParams): string {
  if (!checkHash(params.hash)) throw new Error('Hash is not valid')
  if (!checkKey(params.secretKey)) throw new Error('Secret key is not valid')

  const blockHashBytes = hexToByteArray(params.hash)
  const secretKeyBytes = hexToByteArray(params.secretKey)

  const signatureBytes = signDetached(blockHashBytes, secretKeyBytes)

  return byteArrayToHex(signatureBytes)
}

/** Verify block parameters. */
export interface VerifyBlockParams {
  /** The hash of the block to verify */
  hash: string
  /** The signature of the block to verify, in hexadecimal format */
  signature: string
  /** The public key to verify the block against, in hexadecimal format */
  publicKey: string
}

/**
 * Verify a block against a public key.
 *
 * @param params Parameters
 * @returns Valid
 */
export function verifyBlock(params: VerifyBlockParams): boolean {
  if (!checkHash(params.hash)) throw new Error('Hash is not valid')
  if (!checkSignature(params.signature))
    throw new Error('Signature is not valid')
  if (!checkKey(params.publicKey)) throw new Error('Public key is not valid')

  const blockHashBytes = hexToByteArray(params.hash)
  const signatureBytes = hexToByteArray(params.signature)
  const publicKeyBytes = hexToByteArray(params.publicKey)

  return verifyDetached(blockHashBytes, signatureBytes, publicKeyBytes)
}
