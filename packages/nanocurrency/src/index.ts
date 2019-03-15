/*!
 * nanocurrency-js: A toolkit for the Nano cryptocurrency.
 * Copyright (c) 2019 Marvin ROGER <dev at marvinroger dot fr>
 * Licensed under GPL-3.0 (https://git.io/vAZsK)
 */
/**
 * @module NanoCurrency
 */
export {
  checkAddress,
  checkAmount,
  checkHash,
  checkIndex,
  checkKey,
  checkSeed,
  checkSignature,
  checkWork,
} from './check'

export { ConvertParams, Unit, convert } from './conversion'

export {
  DeriveAddressParams,
  deriveAddress,
  derivePublicKey,
  deriveSecretKey,
  generateSeed,
} from './keys'

export { HashBlockParams, hashBlock } from './hash'

export {
  SignBlockParams,
  VerifyBlockParams,
  signBlock,
  verifyBlock,
} from './signature'

export { ValidateWorkParams, validateWork } from './work'

export { Block, BlockData, BlockRepresentation, createBlock } from './block'

export { ComputeWorkParams, computeWork } from './accelerated'
