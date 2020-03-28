#![no_std]
#![warn(clippy::all)]

#[macro_use]
extern crate arrayref;

mod base32;
mod keys;
mod pow;
mod utils;

use keys::{AddressPattern, PrivateKey, PublicKey, Seed};
use utils::{FromLittleEndian, ToLittleEndian, ToPointer};

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

  let worker_index_int = (*array_ref!(worker_index, 0, 4)).from_little_endian();
  let worker_count_int = (*array_ref!(worker_count, 0, 4)).from_little_endian();
  let work_threshold_int = (*array_ref!(work_threshold, 0, 8)).from_little_endian();

  let work_result = pow::find_work(
    block_hash,
    worker_index_int,
    worker_count_int,
    work_threshold_int,
  );

  match work_result {
    Some(work) => {
      work_success[0] = 1;
      let work_bytes = work.to_little_endian();
      work_output.copy_from_slice(&work_bytes);
    }
    None => work_success[0] = 0,
  }
}

static mut DERIVE_PUBLIC_IO: [u8; 32 + 32] = [0; 64];
io!(io_ptr_derive_public, &DERIVE_PUBLIC_IO);

#[no_mangle]
pub extern "C" fn derive_public() {
  let private: PrivateKey;
  let public: &mut [u8];

  unsafe {
    private = PrivateKey(*array_ref!(DERIVE_SECRET_IO, 0, 32));
    public = &mut DERIVE_PUBLIC_IO[32..64];
  }

  let public_key = private.derive_public_key();
  public.copy_from_slice(&public_key.0);
}

static mut DERIVE_SECRET_IO: [u8; 32 + 4 + 32] = [0u8; 68];
io!(io_ptr_derive_secret, &DERIVE_SECRET_IO);

#[no_mangle]
pub extern "C" fn derive_secret() {
  let seed: Seed;
  let index: &[u8];
  let private: &mut [u8];

  unsafe {
    seed = Seed(*array_ref!(DERIVE_SECRET_IO, 0, 32));
    index = &DERIVE_SECRET_IO[32..36];
    private = &mut DERIVE_SECRET_IO[36..68];
  }

  let index_int = (*array_ref!(index, 0, 4)).from_little_endian();

  let private_key = seed.derive_private_key(index_int);
  private.copy_from_slice(&private_key.0);
}

static mut ENCODE_ADDRESS_IO: [u8; 32 + 60] = [0u8; 92];
io!(io_ptr_encode_address, &ENCODE_ADDRESS_IO);

#[no_mangle]
pub extern "C" fn encode_address() {
  let public: PublicKey;
  let address: &mut [u8; 60];

  unsafe {
    public = PublicKey(*array_ref!(ENCODE_ADDRESS_IO, 0, 32));
    address = array_mut_ref!(ENCODE_ADDRESS_IO, 32, 60);
  }

  let address_result = public.encode_address();
  address.copy_from_slice(&address_result.0);
}

static mut TEST_SEED_MATCHES_ADDRESS_PATTERN_IO: [u8; 32 + 60 + 1] = [0u8; 93];
io!(
  io_ptr_test_seed_matches_address_pattern,
  &TEST_SEED_MATCHES_ADDRESS_PATTERN_IO
);

#[no_mangle]
pub extern "C" fn test_seed_matches_address_pattern() {
  let seed: Seed;
  let pattern: AddressPattern;
  let matches: &mut [u8; 1];

  unsafe {
    seed = Seed(*array_ref!(TEST_SEED_MATCHES_ADDRESS_PATTERN_IO, 0, 32));
    pattern = AddressPattern(*array_ref!(TEST_SEED_MATCHES_ADDRESS_PATTERN_IO, 32, 60));
    matches = array_mut_ref!(TEST_SEED_MATCHES_ADDRESS_PATTERN_IO, 92, 1);
  }

  let private_key = seed.derive_private_key(0);
  let public_key = private_key.derive_public_key();
  let address = public_key.encode_address();

  matches[0] = if address.match_pattern(&pattern) {
    1
  } else {
    0
  };
}
