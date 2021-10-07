/*!
 * nanocurrency-js: A toolkit for the Nano cryptocurrency.
 * Copyright (c) 2021 Marvin ROGER <bonjour+code at marvinroger dot fr>
 * Licensed under GPL-3.0 (https://git.io/vAZsK)
 */
#include "wasm.h"
#include "ed25519/ed25519.h"
#include "nano.h"
#include "blake2b.c"
#include "ed25519_blake2b.c"

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

WASM_EXPORT
void wasm_derive_public_key_from_secret_key() {
  uint8_t offset = 0;

  uint8_t private_key[32];
  memcpy(private_key, io_buffer + offset, 32);
  offset += 32;

  uint8_t public_key[32];
  derive_public_key_from_private_key(public_key, private_key);

  memcpy(io_buffer + offset, public_key, 32);
  offset += WORK_LENGTH;
}

WASM_EXPORT
void wasm_sign_block_hash() {
  uint8_t offset = 0;


  uint8_t private_key[32];
  memcpy(private_key, io_buffer + offset, 32);
  offset += 32;

  uint8_t block_hash[32];
  memcpy(block_hash, io_buffer + offset, 32);
  offset += 32;

  uint8_t signature[64];
  sign_block_hash(signature, block_hash, private_key);

  memcpy(io_buffer + offset, signature, 64);
  offset += 64;
}
