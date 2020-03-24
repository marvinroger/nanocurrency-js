#!/bin/bash

# WASM_MODE : debug | release

mkdir -p bin

if [ "$WASM_MODE" == "release" ]; then
    cargo build --target wasm32-unknown-unknown --release
    wasm-snip --snip-rust-fmt-code --snip-rust-panicking-code -o target/wasm32-unknown-unknown/release/nanocurrency_wasm_snip.wasm target/wasm32-unknown-unknown/release/nanocurrency_wasm.wasm
    wasm-opt -O3 -o target/wasm32-unknown-unknown/release/nanocurrency_wasm_snip_opt.wasm target/wasm32-unknown-unknown/release/nanocurrency_wasm_snip.wasm
    cp target/wasm32-unknown-unknown/release/nanocurrency_wasm_snip_opt.wasm bin/nanocurrency.wasm
else
    cargo build --target wasm32-unknown-unknown
    cp target/wasm32-unknown-unknown/debug/nanocurrency_wasm.wasm bin/nanocurrency.wasm
fi
