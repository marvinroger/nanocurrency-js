#![no_std]
#![warn(clippy::all)]

mod pow;
mod utils;

// 32 for hash, 4 for worker index, 4 for worker count
// 8 for threshold, 1 for success, 8 for work
static mut SHARED_MEMORY: [u8; 32 + 4 + 4 + 8 + 1 + 8] = [0; 57];

#[no_mangle]
pub extern "C" fn get_shared_memory_pointer() -> *const u8 {
  let pointer: *const u8;

  unsafe {
    pointer = SHARED_MEMORY.as_ptr();
  }

  pointer
}

#[no_mangle]
pub extern "C" fn work() {
  let block_hash: &[u8];
  let worker_index: &[u8];
  let worker_count: &[u8];
  let work_threshold: &[u8];
  let work_success: &mut [u8];
  let mut work_output: &mut [u8];

  unsafe {
    block_hash = &SHARED_MEMORY[0..32];
    worker_index = &SHARED_MEMORY[32..36];
    worker_count = &SHARED_MEMORY[36..40];
    work_threshold = &SHARED_MEMORY[40..48];
    work_success = &mut SHARED_MEMORY[48..49];
    work_output = &mut SHARED_MEMORY[49..57];
  }

  let worker_index_int = utils::transform_array_of_u8_to_u32_le(worker_index);
  let worker_count_int = utils::transform_array_of_u8_to_u32_le(worker_count);
  let work_threshold_int = utils::transform_array_of_u8_to_u64_le(work_threshold);

  let work_result = pow::find_work(
    block_hash,
    worker_index_int,
    worker_count_int,
    work_threshold_int,
  );

  match work_result {
    Some(work) => {
      work_success[0] = 1;
      utils::transform_u64_to_array_of_u8_le(work, &mut work_output);
    }
    None => work_success[0] = 0,
  }
}
