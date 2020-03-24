use crate::utils;
use blake2b_simd::Params;

const WORK_LENGTH: usize = 8;
const WORK_HASH_LENGTH: usize = WORK_LENGTH;

fn validate_work(hash_params: &Params, block_hash: &[u8], work_threshold: u64, work: u64) -> bool {
    let mut work_bytes = [0u8; WORK_LENGTH];
    utils::transform_u64_to_array_of_u8_be(work, &mut work_bytes);

    let hash = hash_params
        .to_state()
        .update(&work_bytes)
        .update(block_hash)
        .finalize();
    let output_int = utils::transform_array_of_u8_to_u64_be(hash.as_bytes());
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
    let mut hash_params = Params::new();
    hash_params.hash_length(WORK_HASH_LENGTH);

    for work in lower_bound..upper_bound {
        if validate_work(&hash_params, block_hash, work_threshold, work) {
            return Some(work);
        }
    }

    None
}
