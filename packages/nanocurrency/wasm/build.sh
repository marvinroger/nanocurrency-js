#!/bin/bash

cargo build --target wasm32-unknown-unknown --release
wasm-snip --snip-rust-fmt-code --snip-rust-panicking-code -o target/wasm32-unknown-unknown/release/nanocurrency_wasm_snip.wasm target/wasm32-unknown-unknown/release/nanocurrency_wasm.wasm
mkdir -p bin
cp target/wasm32-unknown-unknown/release/nanocurrency_wasm_snip.wasm bin/nanocurrency.wasm
# wasm-opt -O3 -o pkg/nanocurrency.wasm pkg/nanocurrency_wasm_snip.wasm
