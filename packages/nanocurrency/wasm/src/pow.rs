use crate::utils::{FromBigEndian, ToBigEndian};
use crypto::blake2b;
use crypto::digest::Digest;

const WORK_LENGTH: usize = 8;
const WORK_HASH_LENGTH: usize = WORK_LENGTH;

fn validate_work(block_hash: &[u8], work_threshold: u64, work: u64) -> bool {
    let work_bytes = work.to_big_endian();

    let mut buffer = [0u8; WORK_HASH_LENGTH];
    let mut hasher = blake2b::Blake2b::new(WORK_HASH_LENGTH);
    hasher.input(&work_bytes);
    hasher.input(block_hash);
    hasher.result(&mut buffer);

    let output_int = buffer.from_big_endian();
    output_int >= work_threshold
}

pub fn find_work(
    block_hash: &[u8],
    worker_index: u32,
    worker_count: u32,
    work_threshold: u64,
) -> Option<u64> {
    let interval: u64 = (u64::max_value() - u64::min_value()) / worker_count as u64;
    let lower_bound: u64 = u64::min_value() + (worker_index as u64 * interval);
    let upper_bound: u64 = if worker_index != worker_count - 1 {
        lower_bound + interval
    } else {
        u64::max_value()
    };

    for work in lower_bound..upper_bound {
        if validate_work(block_hash, work_threshold, work) {
            return Some(work);
        }
    }

    None
}
