#ifndef NANO_H
#define NANO_H

uint8_t validate_work(const uint8_t* const block_hash, uint64_t work_threshold, uint8_t* const work);
int work(uint8_t* const dst, const uint8_t* const block_hash, uint64_t work_threshold, const uint8_t worker_index, const uint8_t worker_count);
void derive_public_key_from_private_key(uint8_t *public_key, const uint8_t* const private_key);
void sign_block_hash(uint8_t *signature, const uint8_t* const block_hash, const uint8_t* const private_key);
uint8_t verify_block_hash(const uint8_t* const block_hash, const uint8_t* const signature, const uint8_t* const public_key);

#endif /* NANO_H */
