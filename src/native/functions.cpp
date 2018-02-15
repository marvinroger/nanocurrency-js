/*!
 * nanocurrency-js: A toolkit for the Nano cryptocurrency.
 * Copyright (c) 2018 Marvin ROGER <dev at marvinroger dot fr>
 * Licensed under GPL-3.0 (https://git.io/vAZsK)
 */
#include <string>
#include <random>

#include <emscripten.h>

#include "blake2/ref/blake2.h"
#include "libsodium/ed25519_ref10.h"

const uint64_t WORK_THRESHOLD = 0xffffffc000000000;
const uint8_t BLOCK_HASH_LENGTH = 32;
const uint8_t SEED_LENGTH = 32;
const uint8_t SECRET_KEY_LENGTH = 32;
const uint8_t PUBLIC_KEY_LENGTH = 32;
const uint8_t ADDRESS_CHECKSUM_LENGTH = 5;
const uint8_t WORK_LENGTH = 8;

std::random_device rnd;
std::mt19937 generator(rnd());
std::uniform_int_distribution<uint8_t> dis;

void hex_to_bytes(const std::string& hex, uint8_t* const dst) {
  int byte_index = 0;
  for (unsigned int i = 0; i < hex.length(); i += 2) {
    const std::string byte_string = hex.substr(i, 2);
    const uint8_t byte = (uint8_t) strtol(byte_string.c_str(), NULL, 16);
    dst[byte_index++] = byte;
  }
}

const uint8_t UINT64_LENGTH = 8;
void uint64_to_bytes(const uint64_t src, uint8_t* const dst) {
  for (unsigned int i = 0; i < UINT64_LENGTH; i++) {
    dst[i] = uint8_t((src >> 8 * ((UINT64_LENGTH - 1) - i)) & 0xFF);
  }
}

uint64_t bytes_to_uint64(const uint8_t* const src) {
  uint64_t ret = 0;
  for (unsigned int i = 0; i < 8; i++) {
    ret |= (((uint64_t)src[i]) << (64 - (8 * (i + 1))));
  }

  return ret;
}

const uint8_t UINT32_LENGTH = 4;
void uint32_to_bytes(const uint32_t src, uint8_t* const dst) {
  for (unsigned int i = 0; i < UINT32_LENGTH; i++) {
    dst[i] = uint8_t((src >> 8 * ((UINT32_LENGTH - 1) - i)) & 0xFF);
  }
}

const uint8_t HEX_MAP[] = {'0', '1', '2', '3', '4', '5', '6', '7',
                           '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'};
std::string bytes_to_hex(const uint8_t* const src, const uint8_t length) {
  std::string s(length * 2, ' ');
  for (unsigned int i = 0; i < length; ++i) {
    s[2 * i] = HEX_MAP[(src[i] & 0xF0) >> 4];
    s[(2 * i) + 1] = HEX_MAP[src[i] & 0x0F];
  }

  return s;
}

void reverse_bytes(uint8_t* const src, const uint8_t length) {
  for (unsigned int i = 0; i < (length / 2); i++) {
    const uint8_t temp = src[i];
    src[i] = src[(length - 1) - i];
    src[(length - 1) - i] = temp;
  }
}

void bytes_to_bit_array(const uint8_t* const src, const uint8_t length, bool* const dst) {
  for (unsigned int byte_index = 0; byte_index < length; byte_index++) {
    for (int bit_index = 0; bit_index < 8; bit_index++) {
      const bool is_bit_set = (src[byte_index] & (1 << (7 - bit_index)));
      dst[(byte_index * 8) + bit_index] = is_bit_set;
    }
  }
}

void fill_random_bytes(uint8_t* const dst, const uint8_t length) {
  for (unsigned int i = 0; i < length; i++) {
    dst[i] = dis(generator);
  }
}

const uint8_t BASE32_MAP[] = {'1', '3', '4', '5', '6', '7', '8', '9',
                              'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h',
                              'i', 'j', 'k', 'm', 'n', 'o', 'p', 'q',
                              'r', 's', 't', 'u', 'w', 'x', 'y', 'z'};
std::string compute_base32(const bool* const bit_array, const uint16_t length) {
  const uint16_t base32_length = length / 5;

  std::string s(base32_length, ' ');

  for (unsigned int chunk_index = 0; chunk_index < base32_length; chunk_index++) {
    uint8_t chunk_int = 0;
    for (unsigned int i = 0; i < 5; i++) {
      if (bit_array[(chunk_index * 5) + i]) {
        chunk_int |= 1 << (4 - i);
      }
    }

    s[chunk_index] = BASE32_MAP[chunk_int];
  }

  return s;
}

const uint8_t WORK_HASH_LENGTH = 8;
bool validate_work(const uint8_t* const block_hash, uint8_t* const work) {
  blake2b_state hash;
  uint8_t output[WORK_HASH_LENGTH];

  blake2b_init(&hash, WORK_HASH_LENGTH);
  blake2b_update(&hash, work, WORK_LENGTH);
  blake2b_update(&hash, block_hash, BLOCK_HASH_LENGTH);
  blake2b_final(&hash, output, WORK_HASH_LENGTH);

  reverse_bytes(output, WORK_HASH_LENGTH);
  const uint64_t output_int = bytes_to_uint64(output);

  return output_int >= WORK_THRESHOLD;
}

const uint64_t MIN_UINT64 = 0x0000000000000000;
const uint64_t MAX_UINT64 = 0xffffffffffffffff;
void generate_work(const uint8_t* const block_hash, const uint8_t worker_number, const uint8_t worker_count, uint8_t* const dst) {
  const uint64_t interval = (MAX_UINT64 - MIN_UINT64) / worker_count;

  const uint64_t lower_bound = MIN_UINT64 + (worker_number * interval);
  const uint64_t upper_bound = (worker_number != worker_count - 1) ? lower_bound + interval : MAX_UINT64;

  uint64_t work = lower_bound;
  uint8_t work_bytes[WORK_LENGTH];

  while (true) {
    if (work == upper_bound) return;

    uint64_to_bytes(work, work_bytes);
    reverse_bytes(work_bytes, WORK_LENGTH);

    if (validate_work(block_hash, work_bytes)) {
      reverse_bytes(work_bytes, WORK_LENGTH);
      memcpy(dst, work_bytes, WORK_LENGTH);
      return;
    }

    work++;
  }
}

void compute_secret_key(const uint8_t* const seed, const uint32_t index, uint8_t* const dst) {
  blake2b_state hash;

  uint8_t index_bytes[4];
  uint32_to_bytes(index, index_bytes);

  blake2b_init(&hash, SECRET_KEY_LENGTH);
  blake2b_update(&hash, seed, SEED_LENGTH);
  blake2b_update(&hash, index_bytes, sizeof (index));
  blake2b_final(&hash, dst, SECRET_KEY_LENGTH);
}

void compute_public_key(const uint8_t* const secret_key, uint8_t* const dst) {
  ge25519_p3 A;
  blake2b_state hash;
  uint8_t output[64];

  blake2b_init(&hash, 64);
  blake2b_update(&hash, secret_key, SECRET_KEY_LENGTH);
  blake2b_final(&hash, output, 64);

  output[0] &= 248;
  output[31] &= 127;
  output[31] |= 64;
  ge25519_scalarmult_base(&A, output);
  ge25519_p3_tobytes(dst, &A);
}

const uint16_t PUBLIC_KEY_BIT_LENGTH = PUBLIC_KEY_LENGTH * 8;
const uint8_t PUBLIC_KEY_BIT_PADDING_LENGTH = 4;
const uint16_t PUBLIC_KEY_BIT_LENGTH_WITH_PADDING = PUBLIC_KEY_BIT_LENGTH + PUBLIC_KEY_BIT_PADDING_LENGTH;
const uint8_t ADDRESS_CHECKSUM_BIT_LENGTH = ADDRESS_CHECKSUM_LENGTH * 8;
std::string compute_address(const uint8_t* const public_key) {
  bool public_key_bit_array[PUBLIC_KEY_BIT_LENGTH_WITH_PADDING];

  for (unsigned int i = 0; i < PUBLIC_KEY_BIT_PADDING_LENGTH; i++) {
    public_key_bit_array[i] = 0;
  }

  bytes_to_bit_array(public_key, PUBLIC_KEY_LENGTH, public_key_bit_array + PUBLIC_KEY_BIT_PADDING_LENGTH);

  const std::string base32_public_key = compute_base32(public_key_bit_array, PUBLIC_KEY_BIT_LENGTH_WITH_PADDING);

  blake2b_state hash;
  uint8_t address_checksum[ADDRESS_CHECKSUM_LENGTH];

  blake2b_init(&hash, ADDRESS_CHECKSUM_LENGTH);
  blake2b_update(&hash, public_key, PUBLIC_KEY_LENGTH);
  blake2b_final(&hash, address_checksum, ADDRESS_CHECKSUM_LENGTH);

  reverse_bytes(address_checksum, ADDRESS_CHECKSUM_LENGTH);

  bool address_checksum_bit_array[ADDRESS_CHECKSUM_BIT_LENGTH];
  bytes_to_bit_array(address_checksum, ADDRESS_CHECKSUM_LENGTH, address_checksum_bit_array);

  const std::string base32_checksum = compute_base32(address_checksum_bit_array, ADDRESS_CHECKSUM_BIT_LENGTH);

  const std::string address = "xrb_" + base32_public_key + base32_checksum;

  return address;
}

extern "C" {
  EMSCRIPTEN_KEEPALIVE
  uint8_t emscripten_validate_work(const char* const block_hash_hex, const char* const work_hex) {
    const std::string block_hash_hex_string(block_hash_hex);
    uint8_t block_hash_bytes[BLOCK_HASH_LENGTH];
    hex_to_bytes(block_hash_hex_string, block_hash_bytes);

    const std::string work_hex_string(work_hex);
    uint8_t work_bytes[WORK_LENGTH];
    hex_to_bytes(work_hex_string, work_bytes);
    reverse_bytes(work_bytes, WORK_LENGTH);

    const bool valid = validate_work(block_hash_bytes, work_bytes);

    return valid ? 1 : 0;
  }

  EMSCRIPTEN_KEEPALIVE
  char* emscripten_generate_work(const char* const block_hash_hex, const uint8_t worker_number, const uint8_t worker_count) {
    const std::string block_hash_hex_string(block_hash_hex);
    uint8_t block_hash_bytes[BLOCK_HASH_LENGTH];
    hex_to_bytes(block_hash_hex_string, block_hash_bytes);

    uint8_t work[WORK_LENGTH];
    for (unsigned int i = 0; i < WORK_LENGTH; i++) {
      work[i] = 0;
    }
    generate_work(block_hash_bytes, worker_number, worker_count, work);
    const std::string work_string = bytes_to_hex(work, WORK_LENGTH);

    return strdup(work_string.c_str());
  }

  EMSCRIPTEN_KEEPALIVE
  char* emscripten_generate_seed() {
    uint8_t seed[SEED_LENGTH];
    fill_random_bytes(seed, SEED_LENGTH);
    const std::string seed_string = bytes_to_hex(seed, SEED_LENGTH);

    return strdup(seed_string.c_str());
  }

  EMSCRIPTEN_KEEPALIVE
  char* emscripten_compute_secret_key(const char* const seed_hex, const uint32_t index) {
    const std::string seed_hex_string(seed_hex);
    uint8_t seed_bytes[SEED_LENGTH];
    hex_to_bytes(seed_hex_string, seed_bytes);

    uint8_t secret_key[SECRET_KEY_LENGTH];
    compute_secret_key(seed_bytes, index, secret_key);
    const std::string secret_key_string = bytes_to_hex(secret_key, SECRET_KEY_LENGTH);

    return strdup(secret_key_string.c_str());
  }

  EMSCRIPTEN_KEEPALIVE
  char* emscripten_compute_public_key(const char* const secret_key_hex) {
    const std::string secret_key_hex_string(secret_key_hex);
    uint8_t secret_key_bytes[SECRET_KEY_LENGTH];
    hex_to_bytes(secret_key_hex_string, secret_key_bytes);

    uint8_t public_key[PUBLIC_KEY_LENGTH];
    compute_public_key(secret_key_bytes, public_key);
    const std::string public_key_string = bytes_to_hex(public_key, PUBLIC_KEY_LENGTH);

    return strdup(public_key_string.c_str());
  }

  EMSCRIPTEN_KEEPALIVE
  char* emscripten_compute_address(const char* const public_key_hex) {
    const std::string public_key_hex_string(public_key_hex);
    uint8_t public_key_bytes[PUBLIC_KEY_LENGTH];
    hex_to_bytes(public_key_hex_string, public_key_bytes);

    const std::string address_string = compute_address(public_key_bytes);

    return strdup(address_string.c_str());
  }
}
