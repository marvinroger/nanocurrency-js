#include "ed25519.h"
#include "../../blake2/ref/blake2.h"
#include "ge.h"


void ed25519_derive_public_from_secret(const unsigned char *private_key, unsigned char *public_key) {
    ge_p3 A;
    unsigned char hash[64];

    blake2b(hash, 64, private_key, 32, NULL, 0);
    hash[0] &= 248;
    hash[31] &= 127; // hash[31] &= 67; in default ed25519?
    hash[31] |= 64;

    ge_scalarmult_base(&A, hash);
    ge_p3_tobytes(public_key, &A);
}
