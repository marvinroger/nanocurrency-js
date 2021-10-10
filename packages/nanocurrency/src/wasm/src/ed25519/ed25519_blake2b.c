#include "ed25519.h"
#include "ge.h"
#include "sc.h"

#include "../blake2b/blake2b.h"

// ed25519_create_keypair modified
// seed is secret_key, and we don't need the private key on the calling side
void ed25519_create_keypair_blake2b(unsigned char *public_key, const unsigned char *secret_key) {
    blake2b_state hash;
    ge_p3 A;

    uint8_t private_key[64];
    blake2b_init(&hash, 64);
    blake2b_update(&hash, secret_key, 32);
    blake2b_final(&hash, private_key, 64);
    private_key[0] &= 248;
    private_key[31] &= 63; // 127 ?
    private_key[31] |= 64;

    ge_scalarmult_base(&A, private_key);
    ge_p3_tobytes(public_key, &A);
}


void ed25519_sign_blake2b(unsigned char *signature, const unsigned char *message, size_t message_len, const unsigned char *public_key, const unsigned char *private_key) {
    blake2b_state hash;
    unsigned char hram[64];
    unsigned char r[64];
    ge_p3 R;

    blake2b_init(&hash, 32);
    blake2b_update(&hash, private_key + 32, 32);
    blake2b_update(&hash, message, message_len);
    blake2b_final(&hash, r, 32);

    sc_reduce(r);
    ge_scalarmult_base(&R, r);
    ge_p3_tobytes(signature, &R);

    blake2b_init(&hash, 32);
    blake2b_update(&hash, signature, 32);
    blake2b_update(&hash, public_key, 32);
    blake2b_update(&hash, message, message_len);
    blake2b_final(&hash, hram, 32);

    sc_reduce(hram);
    sc_muladd(signature + 32, hram, private_key, r);
}

static int consttime_equal(const unsigned char *x, const unsigned char *y) {
    unsigned char r = 0;

    r = x[0] ^ y[0];
    #define F(i) r |= x[i] ^ y[i]
    F(1);
    F(2);
    F(3);
    F(4);
    F(5);
    F(6);
    F(7);
    F(8);
    F(9);
    F(10);
    F(11);
    F(12);
    F(13);
    F(14);
    F(15);
    F(16);
    F(17);
    F(18);
    F(19);
    F(20);
    F(21);
    F(22);
    F(23);
    F(24);
    F(25);
    F(26);
    F(27);
    F(28);
    F(29);
    F(30);
    F(31);
    #undef F

    return !r;
}

int ed25519_verify_blake2b(const unsigned char *signature, const unsigned char *message, size_t message_len, const unsigned char *public_key) {
    unsigned char h[64];
    unsigned char checker[32];
    blake2b_state hash;
    ge_p3 A;
    ge_p2 R;

    if (signature[63] & 224) {
        return 0;
    }

    if (ge_frombytes_negate_vartime(&A, public_key) != 0) {
        return 0;
    }

    blake2b_init(&hash, 32);
    blake2b_update(&hash, signature, 32);
    blake2b_update(&hash, public_key, 32);
    blake2b_update(&hash, message, message_len);
    blake2b_final(&hash, h, 32);

    sc_reduce(h);
    ge_double_scalarmult_vartime(&R, h, &A, signature + 32);
    ge_tobytes(checker, &R);

    if (!consttime_equal(checker, signature)) {
        return 0;
    }

    return 1;
}
