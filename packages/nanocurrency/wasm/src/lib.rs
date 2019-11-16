#![no_std]

mod utils;

use blake2::digest::{Input, VariableOutput};
use blake2::VarBlake2b;
use wasm_bindgen::prelude::*;

const WORK_LENGTH: usize = 8;
const WORK_HASH_LENGTH: usize = WORK_LENGTH;

fn validate_work(block_hash: &[u8], work_threshold: u64, work: &[u8]) -> bool {
  let mut hasher = VarBlake2b::new(WORK_HASH_LENGTH).unwrap();
  let mut valid = false;

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
  work_output: &'a mut [u8; WORK_LENGTH],
) -> Option<&'a [u8; WORK_LENGTH]> {
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
      return None;
    };

    utils::transform_u64_to_array_of_u8_be(work, work_output);

    if validate_work(block_hash, work_threshold, work_output) {
      utils::reverse_array(work_output, WORK_LENGTH);
      return Some(work_output);
    }

    work += 1;
  }
}

#[wasm_bindgen]
pub fn work(
  block_hash: &[u8],
  worker_index: u32,
  worker_count: u32,
  work_threshold: &[u8],
) -> Option<js_sys::Uint8Array> {
  let work_threshold_int = utils::transform_array_of_u8_to_u64_le(work_threshold);
  let mut work_output = [0 as u8; WORK_LENGTH];

  return match find_work(
    block_hash,
    worker_index,
    worker_count,
    work_threshold_int,
    &mut work_output,
  ) {
    Some(work) => {
      let array = js_sys::Array::new_with_length(WORK_LENGTH as u32);
      array.set(0, JsValue::from_f64(work[0] as f64));
      array.set(1, JsValue::from_f64(work[1] as f64));
      array.set(2, JsValue::from_f64(work[2] as f64));
      array.set(3, JsValue::from_f64(work[3] as f64));
      array.set(4, JsValue::from_f64(work[4] as f64));
      array.set(5, JsValue::from_f64(work[5] as f64));
      array.set(6, JsValue::from_f64(work[6] as f64));
      array.set(7, JsValue::from_f64(work[7] as f64));

      let typed_array = js_sys::Uint8Array::new(&array);
      return Some(typed_array);
    }
    None => None,
  };
}
