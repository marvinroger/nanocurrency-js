/*!
 * nanocurrency-js: A toolkit for the Nano cryptocurrency.
 * Copyright (c) 2018 Marvin ROGER <dev at marvinroger dot fr>
 * Licensed under GPL-3.0 (https://git.io/vAZsK)
 */
/**
 * @module NanoCurrency
 */
export {
  checkAmount,
  checkSeed,
  checkHash,
  checkKey,
  checkAddress,
  checkWork,
  checkSignature,
} from './check';

export { convert } from './conversion';

export { generateSeed, deriveSecretKey, derivePublicKey, deriveAddress } from './keys';

export { hashBlock } from './hash';

export { signBlock, verifyBlock } from './signature';

export { validateWork } from './work';

export { createBlock } from './block';

export { computeWork } from './accelerated';
