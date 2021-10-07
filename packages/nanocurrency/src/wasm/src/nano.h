#ifndef NANO_H
#define NANO_H

uint8_t validate_work(const uint8_t* const block_hash, uint64_t work_threshold, uint8_t* const work);
int work(const uint8_t* const block_hash, uint64_t work_threshold, const uint8_t worker_index, const uint8_t worker_count, uint8_t* const dst);
void derive_public_key_from_private_key(unsigned char *public_key, const unsigned char *private_key);
void sign_block_hash(unsigned char *signature, const unsigned char *block_hash, const unsigned char *private_key);

#endif /* NANO_H */
