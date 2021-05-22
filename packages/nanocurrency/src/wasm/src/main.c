/*!
 * nanocurrency-js: A toolkit for the Nano cryptocurrency.
 * Copyright (c) 2021 Marvin ROGER <bonjour+code at marvinroger dot fr>
 * Licensed under GPL-3.0 (https://git.io/vAZsK)
 */
#include "wasm.h"
#include "blake2b.c"

const uint8_t BLOCK_HASH_LENGTH = 32;
const uint8_t WORK_LENGTH = 8;

void uint64_to_bytes(const uint64_t src, uint8_t* const dst) {
  memcpy(dst, &src, sizeof(src));
}

uint64_t bytes_to_uint64(const uint8_t* const src) {
  uint64_t ret = 0;

  memcpy(&ret, src, sizeof(ret));

  return ret;
}

void reverse_bytes(uint8_t* const src, const uint8_t length) {
  for (unsigned int i = 0; i < (length / 2); i++) {
    const uint8_t temp = src[i];
    src[i] = src[(length - 1) - i];
    src[(length - 1) - i] = temp;
  }
}

const uint8_t WORK_HASH_LENGTH = 8;
uint8_t validate_work(const uint8_t* const block_hash, uint64_t work_threshold, uint8_t* const work) {
  blake2b_state hash;
  uint8_t output[WORK_HASH_LENGTH];

  blake2b_init(&hash, WORK_HASH_LENGTH);
  blake2b_update(&hash, work, WORK_LENGTH);
  blake2b_update(&hash, block_hash, BLOCK_HASH_LENGTH);
  blake2b_final(&hash, output, WORK_HASH_LENGTH);

  const uint64_t output_int = bytes_to_uint64(output);

  return output_int >= work_threshold;
}

const uint64_t MIN_UINT64 = 0x0000000000000000;
const uint64_t MAX_UINT64 = 0xffffffffffffffff;
int work(const uint8_t* const block_hash, uint64_t work_threshold, const uint8_t worker_index, const uint8_t worker_count, uint8_t* const dst) {
  const uint64_t interval = (MAX_UINT64 - MIN_UINT64) / worker_count;

  const uint64_t lower_bound = MIN_UINT64 + (worker_index * interval);
  const uint64_t upper_bound = (worker_index != worker_count - 1) ? lower_bound + interval : MAX_UINT64;

  uint64_t work = lower_bound;
  uint8_t work_bytes[WORK_LENGTH];

  for (;;) {
    if (work == upper_bound) return -1;

    uint64_to_bytes(work, work_bytes);

    if (validate_work(block_hash, work_threshold, work_bytes)) {
      reverse_bytes(work_bytes, WORK_LENGTH);
      memcpy(dst, work_bytes, WORK_LENGTH);
      return 0;
    }

    work++;
  }
}

// API surface

uint8_t io_buffer[1024];

WASM_EXPORT
uint8_t* wasm_get_io_buffer() {
  return io_buffer;
}

WASM_EXPORT
void wasm_work() {
  uint8_t offset = 0;

  uint8_t block_hash[BLOCK_HASH_LENGTH];
  memcpy(block_hash, io_buffer + offset, BLOCK_HASH_LENGTH);
  offset += BLOCK_HASH_LENGTH;
  uint8_t work_threshold[WORK_LENGTH];
  memcpy(work_threshold, io_buffer + offset, WORK_LENGTH);
  offset += WORK_LENGTH;
  uint8_t worker_index;
  memcpy(&worker_index, io_buffer + offset, 1);
  offset += 1;
  uint8_t worker_count;
  memcpy(&worker_count, io_buffer + offset, 1);
  offset += 1;

  reverse_bytes(work_threshold, WORK_LENGTH);
  uint64_t work_threshold_int = bytes_to_uint64(work_threshold);

  uint8_t work_[WORK_LENGTH];
  int work_result = work(block_hash, work_threshold_int, worker_index, worker_count, work_);

  io_buffer[offset] = work_result < 0 ? 0 : 1;
  offset += 1;
  memcpy(io_buffer + offset, work_, WORK_LENGTH);
  offset += WORK_LENGTH;
}
