/*!
 * nanocurrency-js: A toolkit for the Nano cryptocurrency.
 * Copyright (c) 2019 Marvin ROGER <bonjour+code at marvinroger dot fr>
 * Licensed under GPL-3.0 (https://git.io/JvSg6)
 */
/**
 * @module NanoCurrency
 */
export {
  computeWork,
  ComputeWorkParams,
  derivePrivate,
  derivePublic,
  encodeAddress,
  testSeedMatchesAddressPattern,
} from './accelerated'
export {
  Block,
  BlockData,
  BlockRepresentation,
  ChangeBlockData,
  CommonBlockData,
  createBlock,
  OpenBlockData,
  ReceiveBlockData,
  SendBlockData,
} from './block'
export {
  checkAddress,
  checkAmount,
  checkHash,
  checkIndex,
  checkKey,
  checkSeed,
  checkSignature,
  checkThreshold,
  checkWork,
} from './check'
export { convert, ConvertParams, Unit } from './conversion'
export { hashBlock, HashBlockParams } from './hash'
export {
  deriveAddress,
  DeriveAddressParams,
  derivePublicKey,
  deriveSecretKey,
  generateSeed,
} from './keys'
export {
  signBlock,
  SignBlockParams,
  verifyBlock,
  VerifyBlockParams,
} from './signature'
export { validateWork, ValidateWorkParams } from './work'
