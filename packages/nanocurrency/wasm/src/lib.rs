#![no_std]
#![warn(clippy::all)]

#[macro_use]
extern crate arrayref;

#[cfg(test)]
#[macro_use]
extern crate data_encoding_macro;

mod base32;
mod custom_ed25519;
mod keys;
mod pow;
mod signature;
mod utils;

use keys::{Address, AddressPattern, PrivateKey, PublicKey, Seed};
use utils::ToPointer;

macro_rules! io {
  ($name:ident, $target:expr) => {
    #[no_mangle]
    pub extern "C" fn $name() -> *const u8 {
      unsafe { $target.to_pointer() }
    }
  };
}

// 32 for hash, 4 for worker index, 4 for worker count
// 8 for threshold, 1 for success, 8 for work
static mut WORK_IO: [u8; 32 + 4 + 4 + 8 + 1 + 8] = [0; 57];
io!(io_ptr_work, &WORK_IO);

#[no_mangle]
pub extern "C" fn work() {
  let block_hash: &[u8];
  let worker_index: &[u8];
  let worker_count: &[u8];
  let work_threshold: &[u8];
  let work_success: &mut [u8];
  let work_output: &mut [u8];

  unsafe {
    block_hash = &WORK_IO[0..32];
    worker_index = &WORK_IO[32..36];
    worker_count = &WORK_IO[36..40];
    work_threshold = &WORK_IO[40..48];
    work_success = &mut WORK_IO[48..49];
    work_output = &mut WORK_IO[49..57];
  }

  let worker_index_int = u32::from_le_bytes(*array_ref!(worker_index, 0, 4));
  let worker_count_int = u32::from_le_bytes(*array_ref!(worker_count, 0, 4));
  let work_threshold_int = u64::from_le_bytes(*array_ref!(work_threshold, 0, 8));

  let work_result = pow::find_work(
    block_hash,
    worker_index_int,
    worker_count_int,
    work_threshold_int,
  );

  match work_result {
    Some(work) => {
      work_success[0] = 1;
      let work_bytes = work.to_le_bytes();
      work_output.copy_from_slice(&work_bytes);
    }
    None => work_success[0] = 0,
  }
}

static mut DERIVE_PUBLIC_KEY_IO: [u8; 32 + 32] = [0; 64];
io!(io_ptr_derive_public_key, &DERIVE_PUBLIC_KEY_IO);

#[no_mangle]
pub extern "C" fn derive_public_key() {
  let in_private_key: PrivateKey;
  let out_public_key: &mut [u8; 32];

  unsafe {
    in_private_key = PrivateKey(*array_ref!(DERIVE_PRIVATE_KEY_IO, 0, 32));
    out_public_key = array_mut_ref!(DERIVE_PRIVATE_KEY_IO, 32, 32);
  }

  let public_key = in_private_key.derive_public_key();
  out_public_key.copy_from_slice(&public_key.0);
}

static mut DERIVE_PRIVATE_KEY_IO: [u8; 32 + 4 + 32] = [0u8; 68];
io!(io_ptr_derive_private_key, &DERIVE_PRIVATE_KEY_IO);

#[no_mangle]
pub extern "C" fn derive_private_key() {
  let in_seed: Seed;
  let in_index: u32;
  let out_private_key: &mut [u8; 32];

  unsafe {
    in_seed = Seed(*array_ref!(DERIVE_PRIVATE_KEY_IO, 0, 32));
    in_index = u32::from_le_bytes(*array_ref!(DERIVE_PRIVATE_KEY_IO, 32, 4));
    out_private_key = array_mut_ref!(DERIVE_PRIVATE_KEY_IO, 36, 32);
  }

  let private_key = in_seed.derive_private_key(in_index);
  out_private_key.copy_from_slice(&private_key.0);
}

static mut ENCODE_ADDRESS_IO: [u8; 32 + 60] = [0u8; 92];
io!(io_ptr_encode_address, &ENCODE_ADDRESS_IO);

#[no_mangle]
pub extern "C" fn encode_address() {
  let in_public_key: PublicKey;
  let out_address: &mut [u8; 60];

  unsafe {
    in_public_key = PublicKey(*array_ref!(ENCODE_ADDRESS_IO, 0, 32));
    out_address = array_mut_ref!(ENCODE_ADDRESS_IO, 32, 60);
  }

  let address = in_public_key.encode_address();
  out_address.copy_from_slice(&address.0);
}

static mut DECODE_ADDRESS_IO: [u8; 60 + 1 + 32] = [0u8; 93];
io!(io_ptr_decode_address, &DECODE_ADDRESS_IO);

#[no_mangle]
pub extern "C" fn decode_address() {
  let in_address: Address;
  let out_valid: &mut [u8; 1];
  let out_public_key: &mut [u8; 32];

  unsafe {
    in_address = Address(*array_ref!(DECODE_ADDRESS_IO, 0, 60));
    out_valid = array_mut_ref!(DECODE_ADDRESS_IO, 60, 1);
    out_public_key = array_mut_ref!(DECODE_ADDRESS_IO, 61, 32);
  }

  match in_address.decode() {
    Ok(public_key) => {
      out_valid[0] = 1;
      out_public_key.copy_from_slice(&public_key.0);
    }
    Err(_) => out_valid[0] = 0,
  }
}

static mut TEST_SEED_MATCHES_ADDRESS_PATTERN_IO: [u8; 32 + 60 + 1] = [0u8; 93];
io!(
  io_ptr_test_seed_matches_address_pattern,
  &TEST_SEED_MATCHES_ADDRESS_PATTERN_IO
);

#[no_mangle]
pub extern "C" fn test_seed_matches_address_pattern() {
  let in_seed: Seed;
  let in_pattern: AddressPattern;
  let out_matches: &mut [u8; 1];

  unsafe {
    in_seed = Seed(*array_ref!(TEST_SEED_MATCHES_ADDRESS_PATTERN_IO, 0, 32));
    in_pattern = AddressPattern(*array_ref!(TEST_SEED_MATCHES_ADDRESS_PATTERN_IO, 32, 60));
    out_matches = array_mut_ref!(TEST_SEED_MATCHES_ADDRESS_PATTERN_IO, 92, 1);
  }

  let private_key = in_seed.derive_private_key(0);
  let public_key = private_key.derive_public_key();
  let address = public_key.encode_address();

  out_matches[0] = if address.match_pattern(&in_pattern) {
    1
  } else {
    0
  };
}

// TODO sign block
// verify block
