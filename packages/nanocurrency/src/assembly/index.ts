import 'allocator/arena';

import { logs } from './external';
import { utoa64 } from 'internal/number';

import { blake2bInit, blake2bUpdate, blake2bFinal } from './blake2b';
import { bytesToUint64, uint64ToBytes, reverseBytes } from './utils';

const WORK_THRESHOLD: u64 = 0xffffffc000000000;

function validateWork(blockHash: Uint8Array, work: Uint8Array): boolean {
  blake2bInit();
  blake2bUpdate(work);
  blake2bUpdate(blockHash);
  let hash = blake2bFinal();
  reverseBytes(hash);

  let hashInt: u64 = bytesToUint64(hash);

  return hashInt >= WORK_THRESHOLD;
}

let failure = new Uint8Array(0);
let workBytes = new Uint8Array(8);
function work(blockHash: Uint8Array, workerIndex: u32, workerCount: u32): Uint8Array {
  let interval: u64 = (u64.MAX_VALUE - u64.MIN_VALUE) / workerCount;

  let lowerBound: u64 = u64.MIN_VALUE + workerIndex * interval;
  let upperBound: u64 = workerIndex !== workerCount - 1 ? lowerBound + interval : u64.MAX_VALUE;

  let work: u64 = lowerBound;

  for (;;) {
    if (work === upperBound) return failure;

    uint64ToBytes(work, workBytes);
    reverseBytes(workBytes);

    if (validateWork(blockHash, workBytes)) {
      reverseBytes(workBytes);
      return workBytes;
    }

    work++;
  }

  // needed, otherwise does not compile
  return failure;
}

export function findWork(
  blockHash: Uint8Array,
  workerIndex: u32 = 0,
  workerCount: u32 = 1
): Uint8Array {
  let pow = work(blockHash, workerIndex, workerCount);

  return pow;
}

export { memory };
