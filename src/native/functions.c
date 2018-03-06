/*!
 * nanocurrency-js: A toolkit for the Nano cryptocurrency.
 * Copyright (c) 2018 Marvin ROGER <dev at marvinroger dot fr>
 * Licensed under GPL-3.0 (https://git.io/vAZsK)
 */
#include <stdint.h>
#include <stdbool.h>
#include <string.h>
#include <stdlib.h>

#include <emscripten.h>

#include "tiny-bignum-c/bn.h"
#include "blake2/ref/blake2.h"
#include "ed25519/src/ed25519.h"

const uint64_t WORK_THRESHOLD = 0xffffffc000000000;
const uint8_t BLOCK_HASH_LENGTH = 32;
const uint8_t SIGNATURE_LENGTH = 64;
const uint8_t SEED_LENGTH = 32;
const uint8_t SECRET_KEY_LENGTH = 32;
const uint8_t PUBLIC_KEY_LENGTH = 32;
const uint8_t AMOUNT_LENGTH = 16;
const uint8_t ACCOUNT_LENGTH = 32;
const uint8_t ADDRESS_PREFIX_LENGTH = 4; // xrb_
const uint8_t ADDRESS_CHECKSUM_LENGTH = 5;
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

const uint8_t UINT128_LENGTH = 16;
void uint128_to_bytes(struct bn* src, uint8_t* const dst) {
  char buf[8192];
  bignum_to_string(src, buf, sizeof(buf));

  for (unsigned int i = 0; i < UINT128_LENGTH; i++) {
    dst[i] = 0;
  }
  hex_to_bytes(buf, dst + (UINT128_LENGTH - (strlen(buf) / 2)));
}

const uint8_t UINT64_LENGTH = 8;
void uint64_to_bytes(const uint64_t src, uint8_t* const dst) {
  for (unsigned int i = 0; i < UINT64_LENGTH; i++) {
    dst[i] = (uint8_t)((src >> 8 * ((UINT64_LENGTH - 1) - i)) & 0xFF);
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
    dst[i] = (uint8_t)((src >> 8 * ((UINT32_LENGTH - 1) - i)) & 0xFF);
  }
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

void byte_to_bit_array3(const uint8_t src, bool* const dst, const uint8_t bit_length) {
  for (int bit_index = 0; bit_index < bit_length; bit_index++) {
    const bool is_bit_set = (src & (1 << ((bit_length - 1) - bit_index)));
    dst[bit_index] = is_bit_set;
  }
}

void byte_to_bit_array2(const uint8_t src, bool* const dst) {
  byte_to_bit_array3(src, dst, 8);
}

void bytes_to_bit_array(const uint8_t* const src, const uint8_t length, bool* const dst) {
  for (unsigned int byte_index = 0; byte_index < length; byte_index++) {
    byte_to_bit_array2(src[byte_index], dst + (byte_index * 8));
  }
}

void bit_array_to_bytes(const bool* const src, const uint16_t length, uint8_t* const dst) {
  const uint16_t byte_length = length / 8;
  for (unsigned int byte_index = 0; byte_index < byte_length; byte_index++) {
    uint8_t byte = 0;
    for (int bit_index = 0; bit_index < 8; bit_index++) {
      byte += src[(byte_index * 8) + bit_index];
      if (bit_index != 7) byte <<= 1;
    }

    dst[byte_index] = byte;
  }
}

const uint8_t BASE32_MAP[] = {'1', '3', '4', '5', '6', '7', '8', '9',
                              'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h',
                              'i', 'j', 'k', 'm', 'n', 'o', 'p', 'q',
                              'r', 's', 't', 'u', 'w', 'x', 'y', 'z'};
void bit_array_to_base32(const bool* const bit_array, const uint16_t length, char* const dst) {
  unsigned int chunk_index = 0;
  while (chunk_index < length / 5) {
    uint8_t chunk_value = 0;
    for (unsigned int i = 0; i < 5; i++) {
      if (bit_array[(chunk_index * 5) + i]) {
        chunk_value |= 1 << (4 - i);
      }
    }

    dst[chunk_index] = BASE32_MAP[chunk_value];
    chunk_index++;
  }

  dst[chunk_index] = '\0';
}

void base32_to_bit_array(const char* const base32, bool* const dst) {
  for (unsigned int i = 0; i < strlen(base32); i++) {
    const uint8_t character = base32[i];
    uint8_t chunk_value = 0;
    for (unsigned int j = 0; j < 32; j++) {
      if (BASE32_MAP[j] == character) {
        chunk_value = j;
        break;
      }
    }

    byte_to_bit_array3(chunk_value, dst + (i * 5), 5);
  }
}

void amount_to_bytes(const char* const amount, uint8_t* const dst) {
  struct bn value;
  struct bn ten;
  struct bn to_add;
  struct bn tmp;
  bignum_init(&value);
  bignum_from_int(&ten, 10);
  bignum_init(&to_add);

  for (unsigned int i = 0; i < strlen(amount); i++) {
    bignum_mul(&value, &ten, &tmp);
    bignum_from_int(&to_add, amount[i] - '0');
    bignum_add(&tmp, &to_add, &value);
  }

  uint128_to_bytes(&value, dst);
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
void work(const uint8_t* const block_hash, const uint8_t worker_index, const uint8_t worker_count, uint8_t* const dst) {
  const uint64_t interval = (MAX_UINT64 - MIN_UINT64) / worker_count;

  const uint64_t lower_bound = MIN_UINT64 + (worker_index * interval);
  const uint64_t upper_bound = (worker_index != worker_count - 1) ? lower_bound + interval : MAX_UINT64;

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

void derive_secret_key(const uint8_t* const seed, const uint32_t index, uint8_t* const dst) {
  blake2b_state hash;

  uint8_t index_bytes[4];
  uint32_to_bytes(index, index_bytes);

  blake2b_init(&hash, SECRET_KEY_LENGTH);
  blake2b_update(&hash, seed, SEED_LENGTH);
  blake2b_update(&hash, index_bytes, sizeof (index));
  blake2b_final(&hash, dst, SECRET_KEY_LENGTH);
}

void derive_public_key(const uint8_t* const secret_key, uint8_t* const dst) {
  ed25519_derive_public_from_secret(secret_key, dst);
}

const uint16_t PUBLIC_KEY_BIT_LENGTH = PUBLIC_KEY_LENGTH * 8;
const uint8_t PUBLIC_KEY_BIT_PADDING_LENGTH = 4;
const uint16_t PUBLIC_KEY_BIT_LENGTH_WITH_PADDING = PUBLIC_KEY_BIT_LENGTH + PUBLIC_KEY_BIT_PADDING_LENGTH;
void derive_public_key_from_address(const char* const address, uint8_t* const dst) {
  uint8_t public_key_base_32_length = strlen(address) - (ADDRESS_PREFIX_LENGTH + ADDRESS_CHECKSUM_LENGTH);
  char public_key_base_32[public_key_base_32_length + 1];
  memcpy(public_key_base_32, address + ADDRESS_PREFIX_LENGTH, public_key_base_32_length);
  public_key_base_32[public_key_base_32_length] = '\0';

  bool public_key_with_padding_bit_array[PUBLIC_KEY_BIT_LENGTH_WITH_PADDING];
  base32_to_bit_array(public_key_base_32, public_key_with_padding_bit_array);
  bool* public_key_bit_array = public_key_with_padding_bit_array + PUBLIC_KEY_BIT_PADDING_LENGTH;

  bit_array_to_bytes(public_key_bit_array, PUBLIC_KEY_BIT_LENGTH, dst);
}

const uint8_t ADDRESS_CHECKSUM_BIT_LENGTH = ADDRESS_CHECKSUM_LENGTH * 8;
void derive_address(const uint8_t* const public_key, char* const dst) {
  bool public_key_bit_array[PUBLIC_KEY_BIT_LENGTH_WITH_PADDING];

  for (unsigned int i = 0; i < PUBLIC_KEY_BIT_PADDING_LENGTH; i++) {
    public_key_bit_array[i] = 0;
  }

  bytes_to_bit_array(public_key, PUBLIC_KEY_LENGTH, public_key_bit_array + PUBLIC_KEY_BIT_PADDING_LENGTH);

  char base32_public_key[(PUBLIC_KEY_BIT_LENGTH_WITH_PADDING / 5) + 1];
  bit_array_to_base32(public_key_bit_array, PUBLIC_KEY_BIT_LENGTH_WITH_PADDING, base32_public_key);

  blake2b_state hash;
  uint8_t address_checksum[ADDRESS_CHECKSUM_LENGTH];

  blake2b_init(&hash, ADDRESS_CHECKSUM_LENGTH);
  blake2b_update(&hash, public_key, PUBLIC_KEY_LENGTH);
  blake2b_final(&hash, address_checksum, ADDRESS_CHECKSUM_LENGTH);

  reverse_bytes(address_checksum, ADDRESS_CHECKSUM_LENGTH);

  bool address_checksum_bit_array[ADDRESS_CHECKSUM_BIT_LENGTH];
  bytes_to_bit_array(address_checksum, ADDRESS_CHECKSUM_LENGTH, address_checksum_bit_array);

  char base32_checksum[(ADDRESS_CHECKSUM_BIT_LENGTH / 5) + 1];
  bit_array_to_base32(address_checksum_bit_array, ADDRESS_CHECKSUM_BIT_LENGTH, base32_checksum);

  strcpy(dst, "xrb_");
  strcat(dst, base32_public_key);
  strcat(dst, base32_checksum);
}

void hash_open_block(const uint8_t* const source, const uint8_t* const representative, const uint8_t* const account, uint8_t* const dst) {
  blake2b_state hash;

  blake2b_init(&hash, BLOCK_HASH_LENGTH);
  blake2b_update(&hash, source, BLOCK_HASH_LENGTH);
  blake2b_update(&hash, representative, ACCOUNT_LENGTH);
  blake2b_update(&hash, account, ACCOUNT_LENGTH);
  blake2b_final(&hash, dst, BLOCK_HASH_LENGTH);
}

void hash_change_block(const uint8_t* const previous, const uint8_t* const representative, uint8_t* const dst) {
  blake2b_state hash;

  blake2b_init(&hash, BLOCK_HASH_LENGTH);
  blake2b_update(&hash, previous, BLOCK_HASH_LENGTH);
  blake2b_update(&hash, representative, ACCOUNT_LENGTH);
  blake2b_final(&hash, dst, BLOCK_HASH_LENGTH);
}

void hash_send_block(const uint8_t* const previous, const uint8_t* const destination, const uint8_t* const balance, uint8_t* const dst) {
  blake2b_state hash;

  blake2b_init(&hash, BLOCK_HASH_LENGTH);
  blake2b_update(&hash, previous, BLOCK_HASH_LENGTH);
  blake2b_update(&hash, destination, ACCOUNT_LENGTH);
  blake2b_update(&hash, balance, AMOUNT_LENGTH);
  blake2b_final(&hash, dst, BLOCK_HASH_LENGTH);
}

void hash_receive_block(const uint8_t* const previous, const uint8_t* const source, uint8_t* const dst) {
  blake2b_state hash;

  blake2b_init(&hash, BLOCK_HASH_LENGTH);
  blake2b_update(&hash, previous, BLOCK_HASH_LENGTH);
  blake2b_update(&hash, source, BLOCK_HASH_LENGTH);
  blake2b_final(&hash, dst, BLOCK_HASH_LENGTH);
}

void sign_block(const uint8_t* const block_hash, const uint8_t* const secret_key, uint8_t* const dst) {
  uint8_t public_key[PUBLIC_KEY_LENGTH];
  derive_public_key(secret_key, public_key);

  ed25519_sign(dst, block_hash, BLOCK_HASH_LENGTH, public_key, secret_key);
}

bool verify_block(const uint8_t* const block_hash, const uint8_t* const signature, const uint8_t* const public_key) {
  return ed25519_verify(signature, block_hash, BLOCK_HASH_LENGTH, public_key);
}


char stack_string[SIGNATURE_LENGTH + 1];

EMSCRIPTEN_KEEPALIVE
uint8_t emscripten_validate_work(const char* const block_hash_hex, const char* const work_hex) {
  uint8_t block_hash_bytes[BLOCK_HASH_LENGTH];
  hex_to_bytes(block_hash_hex, block_hash_bytes);

  uint8_t work_bytes[WORK_LENGTH];
  hex_to_bytes(work_hex, work_bytes);
  reverse_bytes(work_bytes, WORK_LENGTH);

  const bool valid = validate_work(block_hash_bytes, work_bytes);

  return valid ? 1 : 0;
}

EMSCRIPTEN_KEEPALIVE
const char* emscripten_work(const char* const block_hash_hex, const uint8_t worker_index, const uint8_t worker_count) {
  uint8_t block_hash_bytes[BLOCK_HASH_LENGTH];
  hex_to_bytes(block_hash_hex, block_hash_bytes);

  uint8_t work_[WORK_LENGTH];
  for (unsigned int i = 0; i < WORK_LENGTH; i++) {
    work_[i] = 0;
  }
  work(block_hash_bytes, worker_index, worker_count, work_);
  bytes_to_hex(work_, WORK_LENGTH, stack_string);

  return stack_string;
}

EMSCRIPTEN_KEEPALIVE
const char* emscripten_derive_secret_key(const char* const seed_hex, const uint32_t index) {
  uint8_t seed_bytes[SEED_LENGTH];
  hex_to_bytes(seed_hex, seed_bytes);

  uint8_t secret_key[SECRET_KEY_LENGTH];
  derive_secret_key(seed_bytes, index, secret_key);
  bytes_to_hex(secret_key, SECRET_KEY_LENGTH, stack_string);

  return stack_string;
}

EMSCRIPTEN_KEEPALIVE
const char* emscripten_derive_public_key(const char* const secret_key_hex) {
  uint8_t secret_key_bytes[SECRET_KEY_LENGTH];
  hex_to_bytes(secret_key_hex, secret_key_bytes);

  uint8_t public_key[PUBLIC_KEY_LENGTH];
  derive_public_key(secret_key_bytes, public_key);
  bytes_to_hex(public_key, PUBLIC_KEY_LENGTH, stack_string);

  return stack_string;
}

EMSCRIPTEN_KEEPALIVE
const char* emscripten_derive_address(const char* const public_key_hex) {
  uint8_t public_key_bytes[PUBLIC_KEY_LENGTH];
  hex_to_bytes(public_key_hex, public_key_bytes);

  derive_address(public_key_bytes, stack_string);

  return stack_string;
}

EMSCRIPTEN_KEEPALIVE
const char* emscripten_hash_receive_block(const char* const previous_hex, const char* const source_hex) {
  uint8_t previous_bytes[BLOCK_HASH_LENGTH];
  hex_to_bytes(previous_hex, previous_bytes);

  uint8_t source_bytes[BLOCK_HASH_LENGTH];
  hex_to_bytes(source_hex, source_bytes);

  uint8_t block_hash[BLOCK_HASH_LENGTH];
  hash_receive_block(previous_bytes, source_bytes, block_hash);
  bytes_to_hex(block_hash, BLOCK_HASH_LENGTH, stack_string);

  return stack_string;
}

EMSCRIPTEN_KEEPALIVE
const char* emscripten_hash_open_block(const char* const source_hex, const char* const representative_address, const char* const account_address) {
  uint8_t source_bytes[BLOCK_HASH_LENGTH];
  hex_to_bytes(source_hex, source_bytes);

  uint8_t representative_public_key[PUBLIC_KEY_LENGTH];
  derive_public_key_from_address(representative_address, representative_public_key);

  uint8_t account_public_key[PUBLIC_KEY_LENGTH];
  derive_public_key_from_address(account_address, account_public_key);

  uint8_t block_hash[BLOCK_HASH_LENGTH];
  hash_open_block(source_bytes, representative_public_key, account_public_key, block_hash);
  bytes_to_hex(block_hash, BLOCK_HASH_LENGTH, stack_string);

  return stack_string;
}

EMSCRIPTEN_KEEPALIVE
const char* emscripten_hash_change_block(const char* const previous_hex, const char* const representative_address) {
  uint8_t previous_bytes[BLOCK_HASH_LENGTH];
  hex_to_bytes(previous_hex, previous_bytes);

  uint8_t representative_public_key[PUBLIC_KEY_LENGTH];
  derive_public_key_from_address(representative_address, representative_public_key);

  uint8_t block_hash[BLOCK_HASH_LENGTH];
  hash_change_block(previous_bytes, representative_public_key, block_hash);
  bytes_to_hex(block_hash, BLOCK_HASH_LENGTH, stack_string);

  return stack_string;
}

EMSCRIPTEN_KEEPALIVE
const char* emscripten_hash_send_block(const char* const previous_hex, const char* const destination_address, const char* const balance) {
  uint8_t previous_bytes[BLOCK_HASH_LENGTH];
  hex_to_bytes(previous_hex, previous_bytes);

  uint8_t destination_public_key[PUBLIC_KEY_LENGTH];
  derive_public_key_from_address(destination_address, destination_public_key);

  uint8_t balance_bytes[AMOUNT_LENGTH];
  amount_to_bytes(balance, balance_bytes);

  uint8_t block_hash[BLOCK_HASH_LENGTH];
  hash_send_block(previous_bytes, destination_public_key, balance_bytes, block_hash);
  bytes_to_hex(block_hash, BLOCK_HASH_LENGTH, stack_string);

  return stack_string;
}

EMSCRIPTEN_KEEPALIVE
const char* emscripten_sign_block(const char* const block_hash_hex, const char* const secret_key_hex) {
  uint8_t block_hash_bytes[BLOCK_HASH_LENGTH];
  hex_to_bytes(block_hash_hex, block_hash_bytes);

  uint8_t secret_key_bytes[SECRET_KEY_LENGTH];
  hex_to_bytes(secret_key_hex, secret_key_bytes);

  uint8_t signature[SIGNATURE_LENGTH];
  sign_block(block_hash_bytes, secret_key_bytes, signature);
  bytes_to_hex(signature, SIGNATURE_LENGTH, stack_string);

  return stack_string;
}

EMSCRIPTEN_KEEPALIVE
uint8_t emscripten_verify_block(const char* const block_hash_hex, const char* const signature_hex, const char* const public_key_hex) {
  uint8_t block_hash_bytes[BLOCK_HASH_LENGTH];
  hex_to_bytes(block_hash_hex, block_hash_bytes);

  uint8_t signature_bytes[SIGNATURE_LENGTH];
  hex_to_bytes(signature_hex, signature_bytes);

  uint8_t public_key_bytes[PUBLIC_KEY_LENGTH];
  hex_to_bytes(public_key_hex, public_key_bytes);

  const bool valid = verify_block(block_hash_bytes, signature_bytes, public_key_bytes);

  return valid ? 1 : 0;
}

EMSCRIPTEN_KEEPALIVE
const char* emscripten_convert_amount_decimal_integer_to_hex(const char* const amount) {
  uint8_t amount_bytes[AMOUNT_LENGTH];
  amount_to_bytes(amount, amount_bytes);

  bytes_to_hex(amount_bytes, AMOUNT_LENGTH, stack_string);

  return stack_string;
}
