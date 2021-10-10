/*!
 * nanocurrency-js: A toolkit for the Nano cryptocurrency.
 * Copyright (c) 2021 Marvin ROGER <bonjour+code at marvinroger dot fr>
 * Licensed under GPL-3.0 (https://git.io/vAZsK)
 */
/**
 * @module NanoCurrency
 */
export { computeWork, derivePublicFromSecret, signBlockHash } from './accelerated'
export type { ComputeWorkParams } from './accelerated'
export { createBlock } from './block'
export type {
  Block,
  BlockData,
  BlockRepresentation,
  ChangeBlockData,
  CommonBlockData,
  OpenBlockData,
  ReceiveBlockData,
  SendBlockData,
} from './block'
export {
  checkAmount,
  checkHash,
  checkIndex,
  checkKey,
  checkSeed,
  checkSignature,
  checkThreshold,
  checkWork,
} from './check'
export { checkAddress } from './address'
export { convert, Unit } from './conversion'
export type { ConvertParams } from './conversion'
export { hashBlock } from './hash'
export type { HashBlockParams } from './hash'
export {
  deriveAddress,
  derivePublicKey,
  deriveSecretKey,
  generateSeed,
} from './keys'
export type {
  DeriveAddressParams,
} from './keys'
export {
  signBlock,
  verifyBlock,
} from './signature'
export type {
  SignBlockParams,
  VerifyBlockParams,
} from './signature'
export { validateWork } from './work'
export type { ValidateWorkParams } from './work'
