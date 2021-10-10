#include "wasm.h"
#include "nano.h"
#include "blake2b/blake2b.h"
#include "ed25519/ed25519_blake2b.h"
#include "constants.h"
#include "helpers.h"

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
int work(uint8_t* const dst, const uint8_t* const block_hash, uint64_t work_threshold, const uint8_t worker_index, const uint8_t worker_count) {
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

void derive_public_key_from_private_key(uint8_t *public_key, const uint8_t* const private_key) {
  ed25519_create_keypair_blake2b(public_key, private_key);
}

void sign_block_hash(uint8_t *signature, const uint8_t* const block_hash, const uint8_t* const private_key) {
  uint8_t public_key[32];
  derive_public_key_from_private_key(public_key, private_key);

  ed25519_sign_blake2b(signature, block_hash, 32, public_key, private_key);
}

uint8_t verify_block_hash(const uint8_t* const block_hash, const uint8_t* const signature, const uint8_t* const public_key) {
  return ed25519_verify_blake2b(signature, block_hash, 32, public_key);
}
