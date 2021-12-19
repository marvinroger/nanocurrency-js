#ifndef BLAKE2B_H
#define BLAKE2B_H

#include "../wasm.h"

enum blake2b_constant
  {
    BLAKE2B_BLOCKBYTES = 128,
    BLAKE2B_OUTBYTES   = 64,
    BLAKE2B_KEYBYTES   = 64,
    BLAKE2B_SALTBYTES  = 16,
    BLAKE2B_PERSONALBYTES = 16
  };

typedef struct blake2b_state__
  {
    uint64_t h[8];
    uint64_t t[2];
    uint64_t f[2];
    uint8_t  buf[BLAKE2B_BLOCKBYTES];
    size_t   buflen;
    size_t   outlen;
    uint8_t  last_node;
  } blake2b_state;

int blake2b_init( blake2b_state *S, unsigned long outlen );
int blake2b_update( blake2b_state *S, const void *pin, unsigned long inlen );
int blake2b_final( blake2b_state *S, void *out, unsigned long outlen );

#endif /* BLAKE2B_H */
