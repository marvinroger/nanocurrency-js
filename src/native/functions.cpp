#include <string>

#include <emscripten.h>

#include "blake2/ref/blake2.h"

const uint64_t WORK_THRESHOLD = 0xffffffc000000000;
const uint8_t BLOCK_HASH_LENGTH = 32;
const uint8_t WORK_LENGTH = 8;
const uint64_t MIN_UINT64 = 0x0000000000000000;
const uint64_t MAX_UINT64 = 0xffffffffffffffff;

void hex_to_bytes(const std::string& hex, uint8_t* bytes) {
    int byte_index = 0;
    for (unsigned int i = 0; i < hex.length(); i += 2) {
        std::string byte_string = hex.substr(i, 2);
        uint8_t byte = (uint8_t) strtol(byte_string.c_str(), NULL, 16);
        bytes[byte_index++] = byte;
    }
}

void reverse_bytes(uint8_t* bytes, uint8_t length) {
    for (int i = 0; i < (length / 2); i++) {
        uint8_t temp = bytes[i];
        bytes[i] = bytes[(length - 1) - i];
        bytes[(length - 1) - i] = temp;
    }
}

bool validate_work(uint8_t* block_hash, uint8_t* work) {
  blake2b_state hash;
  uint64_t output = 0;

  blake2b_init(&hash, sizeof (output));
  blake2b_update(&hash, work, WORK_LENGTH);
  blake2b_update(&hash, block_hash, BLOCK_HASH_LENGTH);
  blake2b_final(&hash, reinterpret_cast <uint8_t*> (&output), sizeof (output));

  return output >= WORK_THRESHOLD;
}

uint64_t generate_work(uint8_t* block_hash, uint8_t worker_number, uint8_t worker_count) {
  const uint64_t interval = (MAX_UINT64 - MIN_UINT64) / worker_count;

  const uint64_t lower_bound = MIN_UINT64 + (worker_number * interval);
  const uint64_t upper_bound = (worker_number != worker_count - 1) ? lower_bound + interval : MAX_UINT64;

  uint64_t work = lower_bound;

  while (true) {
    if (work == upper_bound) return 0;

    if (validate_work(block_hash, reinterpret_cast <uint8_t*> (&work))) return work;

    work++;
  }
}

extern "C" {
  EMSCRIPTEN_KEEPALIVE
  uint8_t emscripten_validate_work(char* block_hash_hex, char* work_hex) {
      std::string block_hash_hex_string(block_hash_hex);
      uint8_t block_hash_bytes[BLOCK_HASH_LENGTH];
      hex_to_bytes(block_hash_hex_string, block_hash_bytes);

      std::string work_hex_string(work_hex);
      uint8_t work_bytes[WORK_LENGTH];
      hex_to_bytes(work_hex_string, work_bytes);
      reverse_bytes(work_bytes, WORK_LENGTH);

      bool valid = validate_work(block_hash_bytes, work_bytes);

      return valid ? 1 : 0;
  }

  EMSCRIPTEN_KEEPALIVE
  char* emscripten_generate_work(char* block_hash_hex, uint8_t worker_number, uint8_t worker_count) {
      std::string block_hash_hex_string(block_hash_hex);
      uint8_t block_hash_bytes[BLOCK_HASH_LENGTH];
      hex_to_bytes(block_hash_hex_string, block_hash_bytes);

      uint64_t work = generate_work(block_hash_bytes, worker_number, worker_count);
      char work_hex[16 + 1];
      sprintf(work_hex, "%016llx", work);

      return strdup(work_hex);
  }
}
