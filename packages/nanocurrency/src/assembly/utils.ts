const UINT64_LENGTH: u32 = 8;
export function uint64ToBytes(input: u64, output: Uint8Array): void {
  for (let i: u32 = 0; i < UINT64_LENGTH; i++) {
    output[i] = <u8>((input >> (8 * (UINT64_LENGTH - 1 - i))) & 0xff);
  }
}

export function bytesToUint64(input: Uint8Array): u64 {
  return ((<u64>input[0]) << 56) |
  ((<u64>input[1]) << 48) |
  ((<u64>input[2]) << 40) |
  ((<u64>input[3]) << 32) |
  ((<u64>input[4]) << 24) |
  ((<u64>input[5]) << 16) |
  ((<u64>input[6]) << 8) |
  ((<u64>input[7]) << 0);
}
