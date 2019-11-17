#!/bin/bash

wasm-pack build "$WASM_PACK_MODE" --target web
wasm-snip --snip-rust-fmt-code --snip-rust-panicking-code -o pkg/nanocurrency_wasm_snip.wasm pkg/nanocurrency_wasm_bg.wasm 
wasm-opt -O3 -o pkg/nanocurrency.wasm pkg/nanocurrency_wasm_snip.wasm

printf '%s\n%s' "$(cat patches/prelude.js)" "$(cat pkg/nanocurrency_wasm.js)" > pkg/nanocurrency_wasm.js
