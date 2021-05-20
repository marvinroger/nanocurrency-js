#!/bin/bash

set -euo pipefail

mkdir -p lib/

CFLAGS="-flto -O3 -nostdlib -fno-builtin -ffreestanding --target=wasm32"
LDFLAGS="-Wl,--strip-all -Wl,--initial-memory=131072 -Wl,--max-memory=131072 -Wl,--no-entry -Wl,--allow-undefined -Wl,--compress-relocations -Wl,--export-dynamic"

# -msimd128 -msign-ext -mmutable-globals -mmultivalue -mbulk-memory -mtail-call -munimplemented-simd128
# -g -fdebug-prefix-map=/app/src=/C:/Projects/hash-wasm/src

clang ${CFLAGS} ${LDFLAGS} -o /app/lib/nanocurrency.wasm /app/src/main.c
