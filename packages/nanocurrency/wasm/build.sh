#!/bin/bash

cargo build --target wasm32-unknown-unknown --release
wasm-snip --snip-rust-fmt-code --snip-rust-panicking-code -o target/wasm32-unknown-unknown/release/nanocurrency_wasm_snip.wasm target/wasm32-unknown-unknown/release/nanocurrency_wasm.wasm
wasm-opt -O3 -o target/wasm32-unknown-unknown/release/nanocurrency_wasm_snip_opt.wasm target/wasm32-unknown-unknown/release/nanocurrency_wasm_snip.wasm
mkdir -p bin
cp target/wasm32-unknown-unknown/release/nanocurrency_wasm_snip_opt.wasm bin/nanocurrency.wasm
