#include "ed25519.h"
#include "../../blake2/ref/blake2.h"
#include "ge.h"
#include "sc.h"


void ed25519_sign(unsigned char *signature, const unsigned char *message, size_t message_len, const unsigned char *public_key, const unsigned char *secret_key) {
    blake2b_state hash;
    unsigned char ext_secret_key[64];
    unsigned char hram[64];
    unsigned char r[64];
    ge_p3 R;


    // we need to compute a 64 bytes secret key from the 32 bytes one
    blake2b(ext_secret_key, 64, secret_key, 32, NULL, 0);
  	ext_secret_key[0] &= 248;
  	ext_secret_key[31] &= 127;
  	ext_secret_key[31] |= 64;

    blake2b_init(&hash, 64);
    blake2b_update(&hash, ext_secret_key + 32, 32);
    blake2b_update(&hash, message, message_len);
    blake2b_final(&hash, r, 64);

    sc_reduce(r);
    ge_scalarmult_base(&R, r);
    ge_p3_tobytes(signature, &R);

    blake2b_init(&hash, 64);
    blake2b_update(&hash, signature, 32);
    blake2b_update(&hash, public_key, 32);
    blake2b_update(&hash, message, message_len);
    blake2b_final(&hash, hram, 64);

    sc_reduce(hram);
    sc_muladd(signature + 32, hram, ext_secret_key, r);
}
