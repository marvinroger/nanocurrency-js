#include "wasm.h"
#include "helpers.h"

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
