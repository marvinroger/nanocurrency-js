#ifndef HELPERS_H
#define HELPERS_H

void uint64_to_bytes(const uint64_t src, uint8_t* const dst);
uint64_t bytes_to_uint64(const uint8_t* const src);
void reverse_bytes(uint8_t* const src, const uint8_t length);

#endif /* HELPERS_H */
