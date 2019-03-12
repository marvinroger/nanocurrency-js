const UINT64_LENGTH: u32 = 8;
export function uint64ToBytes(input: u64, output: Uint8Array): void {
  for (let i: u32 = 0; i < UINT64_LENGTH; i++) {
    output[i] = <u8>((input >> (8 * (UINT64_LENGTH - 1 - i))) & 0xff);
  }
}

export function bytesToUint64(input: Uint8Array): u64 {
  let ret: u64 = 0;

  for (let i: u64 = 0; i < 8; i++) {
    ret |= (<u64>input[<i32>i]) << (64 - 8 * (i + 1));
  }

  return ret;
}

export function reverseBytes(input: Uint8Array): void {
  let i = input.length - 1;
  let j = 0;
  while (i > j) {
    let tmp = input[i];
    input[i] = input[j];
    input[j] = tmp;
    i--;
    j++;
  }
}
