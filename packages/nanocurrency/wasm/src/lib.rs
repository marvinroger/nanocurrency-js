#![no_std]

mod utils;

use blake2::digest::{Input, VariableOutput};
use blake2::VarBlake2b;

const WORK_LENGTH: usize = 8;
const WORK_HASH_LENGTH: usize = WORK_LENGTH;

// 32 for hash, 4 for worker index, 4 for worker count
// 8 for threshold, 1 for success, 8 for work
static mut SHARED_MEMORY: [u8; 32 + 4 + 4 + 8 + 1 + 8] = [0; 57];

fn validate_work(block_hash: &[u8], work_threshold: u64, work: &[u8]) -> bool {
  let mut hasher = VarBlake2b::new(WORK_HASH_LENGTH).unwrap();
  let mut valid = false;

  // hasher.input(work.to_be_bytes())
  hasher.input(work);
  hasher.input(block_hash);
  hasher.variable_result(|hash| {
    let output_int = utils::transform_array_of_u8_to_u64_be(hash);
    valid = output_int >= work_threshold;
  });

  return valid;
}

fn find_work<'a>(
  block_hash: &[u8],
  worker_index: u32,
  worker_count: u32,
  work_threshold: u64,
  work_output: &'a mut &mut [u8],
) -> bool {
  let interval: u64 = (u64::max_value() - u64::min_value()) / worker_count as u64;

  let lower_bound: u64 = u64::min_value() + (worker_index as u64 * interval);
  let upper_bound: u64 = if worker_index != worker_count - 1 {
    lower_bound + interval
  } else {
    u64::max_value()
  };

  let mut work: u64 = lower_bound;

  loop {
    if work == upper_bound {
      return false;
    };

    utils::transform_u64_to_array_of_u8_be(work, work_output);

    if validate_work(block_hash, work_threshold, work_output) {
      utils::reverse_array(work_output, WORK_LENGTH);
      return true;
    }

    work += 1;
  }
}

#[no_mangle]
pub extern "C" fn get_shared_memory_pointer() -> *const u8 {
  let pointer: *const u8;

  unsafe {
    pointer = SHARED_MEMORY.as_ptr();
  }

  return pointer;
}

#[no_mangle]
pub unsafe extern "C" fn work() -> () {
  let block_hash = &SHARED_MEMORY[0..32];
  let worker_index = &SHARED_MEMORY[32..36];
  let worker_count = &SHARED_MEMORY[36..40];
  let work_threshold = &SHARED_MEMORY[40..48];

  let work_success = &mut SHARED_MEMORY[48..49];
  let mut work_output = &mut SHARED_MEMORY[49..57];

  let worker_index_int = utils::transform_array_of_u8_to_u32_le(worker_index);
  let worker_count_int = utils::transform_array_of_u8_to_u32_le(worker_count);
  let work_threshold_int = utils::transform_array_of_u8_to_u64_le(work_threshold);

  match find_work(
    block_hash,
    worker_index_int,
    worker_count_int,
    work_threshold_int,
    &mut work_output,
  ) {
    true => work_success[0] = 1,
    _ => work_success[0] = 0,
  }
}
