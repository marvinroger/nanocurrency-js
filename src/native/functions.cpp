#include <string>

#include <emscripten.h>

#include "blake2/ref/blake2.h"

const uint64_t MIN_UINT64 = 0x0000000000000000;
const uint64_t MAX_UINT64 = 0xffffffffffffffff;
const uint64_t WORK_THRESHOLD = 0xffffffc000000000;

void hex_to_bytes(const std::string& hex, uint8_t* bytes) {
    int byte_index = 0;
    for (unsigned int i = 0; i < hex.length(); i += 2) 
    {
        std::string byte_string = hex.substr(i, 2);
        uint8_t byte = (uint8_t) strtol(byte_string.c_str(), NULL, 16);
        bytes[byte_index++] = byte;
    }
}

uint64_t generate_work(uint8_t* block_hash, uint8_t worker_number, uint8_t worker_count) {
  const uint64_t interval = (MAX_UINT64 - MIN_UINT64) / worker_count;
  
  const uint64_t lower_bound = MIN_UINT64 + (worker_number * interval);
  const uint64_t upper_bound = (worker_number != worker_count - 1) ? lower_bound + interval : MAX_UINT64;

  blake2b_state hash;
  uint64_t work = lower_bound;
  uint64_t output = 0;

  while(output < WORK_THRESHOLD) {
    if (work == upper_bound) return 0;
    blake2b_init(&hash, sizeof (output));
    blake2b_update(&hash, reinterpret_cast <uint8_t*> (&work), sizeof (work));
    blake2b_update(&hash, block_hash, sizeof (block_hash));
    blake2b_final(&hash, reinterpret_cast <uint8_t*> (&output), sizeof (output));
    work++;
  }
  
  work--;

  return work;
}

uint64_t swap_uint64(uint64_t val)
{
    val = ((val << 8) & 0xFF00FF00FF00FF00ULL ) | ((val >> 8) & 0x00FF00FF00FF00FFULL );
    val = ((val << 16) & 0xFFFF0000FFFF0000ULL ) | ((val >> 16) & 0x0000FFFF0000FFFFULL );
    return (val << 32) | (val >> 32);
}

extern "C" {
  EMSCRIPTEN_KEEPALIVE
  char* emscripten_generate_work(char* block_hash_hex, uint8_t worker_number, uint8_t worker_count)
  {
      std::string block_hash_hex_string(block_hash_hex);
      uint8_t block_hash_bytes[32];
      hex_to_bytes(block_hash_hex_string, block_hash_bytes);
      
      uint64_t work = generate_work(block_hash_bytes, worker_number, worker_count);
      char work_hex[16 + 1];
      sprintf(work_hex, "%016llx", swap_uint64(work));

      return strdup(work_hex);
  }
}