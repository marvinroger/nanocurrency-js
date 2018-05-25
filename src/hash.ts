/*!
 * nanocurrency-js: A toolkit for the Nano cryptocurrency.
 * Copyright (c) 2018 Marvin ROGER <dev at marvinroger dot fr>
 * Licensed under GPL-3.0 (https://git.io/vAZsK)
 */
import { blake2bFinal, blake2bInit, blake2bUpdate } from 'blakejs';

import { checkAddress, checkAmount, checkHash } from './check';

import { convert, Unit } from './conversion';

import { byteArrayToHex, hexToByteArray } from './utils';

import { derivePublicKey } from './keys';

const STATE_BLOCK_PREAMBLE_BYTES = new Uint8Array(32);
STATE_BLOCK_PREAMBLE_BYTES[31] = 6;

/**
 * Hash a state block.
 * Does not require initialization.
 *
 * @param account - The account address
 * @param previous - The hash of the previous block on the account chain, in hexadecimal format
 * @param representative - The representative address
 * @param balance - The balance, in raw
 * @param link - The account or block hash meant as a link, in address or hexadecimal format
 * @returns Hash, in hexadecimal format
 */
export function hashBlock(
  account: string,
  previous: string,
  representative: string,
  balance: string,
  link: string
) {
  if (!checkAddress(account)) throw new Error('Account is not valid');
  if (!checkHash(previous)) throw new Error('Previous is not valid');
  if (!checkAddress(representative)) {
    throw new Error('Representative is not valid');
  }
  if (!checkAmount(balance)) throw new Error('Balance is not valid');
  let linkIsAddress = false;
  let linkIsBlockHash = false;
  if (checkAddress(link)) linkIsAddress = true;
  else if (checkHash(link)) linkIsBlockHash = true;
  else throw new Error('Link is not valid');

  const accountBytes = hexToByteArray(derivePublicKey(account));
  const previousBytes = hexToByteArray(previous);
  const representativeBytes = hexToByteArray(derivePublicKey(representative));
  const balanceHex = convert(balance, { from: Unit.raw, to: Unit.hex });
  const balanceBytes = hexToByteArray(balanceHex);
  let linkBytes;
  if (linkIsAddress) {
    linkBytes = hexToByteArray(derivePublicKey(link));
  } else if (linkIsBlockHash) {
    linkBytes = hexToByteArray(link);
  }

  const context = blake2bInit(32);
  blake2bUpdate(context, STATE_BLOCK_PREAMBLE_BYTES);
  blake2bUpdate(context, accountBytes);
  blake2bUpdate(context, previousBytes);
  blake2bUpdate(context, representativeBytes);
  blake2bUpdate(context, balanceBytes);
  blake2bUpdate(context, linkBytes);
  const hashBytes = blake2bFinal(context);

  return byteArrayToHex(hashBytes);
}
