#ifndef ED25519_BLAKE2B_H
#define ED25519_BLAKE2B_H

#include "../wasm.h"

void ed25519_create_keypair_blake2b(unsigned char *public_key, const unsigned char *secret_key);
int ed25519_verify_blake2b(const unsigned char *signature, const unsigned char *message, size_t message_len, const unsigned char *public_key);
void ed25519_sign_blake2b(unsigned char *signature, const unsigned char *message, size_t message_len, const unsigned char *public_key, const unsigned char *private_key);

#endif /* ED25519_BLAKE2B_H */
