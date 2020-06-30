/*!
 * nanocurrency-js: A toolkit for the Nano cryptocurrency.
 * Copyright (c) 2019 Marvin ROGER <dev at marvinroger dot fr>
 * Licensed under GPL-3.0 (https://git.io/vAZsK)
 */
#include <stdint.h>
#include <string.h>
#include <stdlib.h>

#include <emscripten.h>

#include "blake2/ref/blake2.h"

const uint8_t BLOCK_HASH_LENGTH = 32;
const uint8_t WORK_LENGTH = 8;

void hex_to_bytes(const char* const hex, uint8_t* const dst) {
  int byte_index = 0;
  for (unsigned int i = 0; i < strlen(hex); i += 2) {
    char byte_string[3];
    memcpy(byte_string, hex + i, 2);
    byte_string[2] = '\0';
    const uint8_t byte = (uint8_t) strtol(byte_string, NULL, 16);
    dst[byte_index++] = byte;
  }
}

void uint64_to_bytes(const uint64_t src, uint8_t* const dst) {
  memcpy(dst, &src, sizeof(src));
}

uint64_t bytes_to_uint64(const uint8_t* const src) {
  uint64_t ret = 0;

  memcpy(&ret, src, sizeof(ret));

  return ret;
}

const uint8_t HEX_MAP[] = {'0', '1', '2', '3', '4', '5', '6', '7',
                           '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'};
void bytes_to_hex(const uint8_t* const src, const uint8_t length, char* const dst) {
  for (unsigned int i = 0; i < length; ++i) {
    dst[2 * i] = HEX_MAP[(src[i] & 0xF0) >> 4];
    dst[(2 * i) + 1] = HEX_MAP[src[i] & 0x0F];
  }

  dst[2 * length] = '\0';
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
void work(const uint8_t* const block_hash, uint64_t work_threshold, const uint8_t worker_index, const uint8_t worker_count, uint8_t* const dst) {
  const uint64_t interval = (MAX_UINT64 - MIN_UINT64) / worker_count;

  const uint64_t lower_bound = MIN_UINT64 + (worker_index * interval);
  const uint64_t upper_bound = (worker_index != worker_count - 1) ? lower_bound + interval : MAX_UINT64;

  uint64_t work = lower_bound;
  uint8_t work_bytes[WORK_LENGTH];

  for (;;) {
    if (work == upper_bound) return;

    uint64_to_bytes(work, work_bytes);

    if (validate_work(block_hash, work_threshold, work_bytes)) {
      reverse_bytes(work_bytes, WORK_LENGTH);
      dst[0] = 1;
      memcpy(dst + 1, work_bytes, WORK_LENGTH);
      return;
    }

    work++;
  }
}


char stack_string[2 + BLOCK_HASH_LENGTH + 1];

EMSCRIPTEN_KEEPALIVE
const char* emscripten_work(const char* const block_hash_hex, const char* const work_threshold_hex, const uint8_t worker_index, const uint8_t worker_count) {
  uint8_t block_hash_bytes[BLOCK_HASH_LENGTH];
  hex_to_bytes(block_hash_hex, block_hash_bytes);

  uint8_t work_threshold_bytes[WORK_LENGTH];
  hex_to_bytes(work_threshold_hex, work_threshold_bytes);
  reverse_bytes(work_threshold_bytes, WORK_LENGTH);
  uint64_t work_threshold = bytes_to_uint64(work_threshold_bytes);


  uint8_t work_[1 + WORK_LENGTH];
  work_[0] = 0;
  work(block_hash_bytes, work_threshold, worker_index, worker_count, work_);
  bytes_to_hex(work_, 1 + WORK_LENGTH, stack_string);

  return stack_string;
}
