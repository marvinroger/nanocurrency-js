//! Test suite for the Web and headless browsers.

#![cfg(target_arch = "wasm32")]

extern crate wasm_bindgen_test;
use wasm_bindgen_test::*;

extern crate nanocurrency_wasm;
use nanocurrency_wasm::work;

#[wasm_bindgen_test]
fn compute_work() {
    let result = work(
        "b9cb6b51b8eb869af085c4c03e7dc539943d0bdde13b21436b687c9c7ea56cb0".to_string(),
        0,
        1,
        "ffffffc000000000".to_string(),
    )
    .unwrap();

    assert_eq!(result, "0000000000010600");
}
