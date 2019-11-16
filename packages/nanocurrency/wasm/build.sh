#!/bin/bash

curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh
cargo install wasm-snip
wasm-pack build "$WASM_PACK_MODE" --target web
wasm-snip --snip-rust-fmt-code --snip-rust-panicking-code -o pkg/nanocurrency_wasm_bg_snip.wasm pkg/nanocurrency_wasm_bg.wasm 

printf '%s\n%s' "$(cat patches/prelude.js)" "$(cat pkg/nanocurrency_wasm.js)" > pkg/nanocurrency_wasm.js
