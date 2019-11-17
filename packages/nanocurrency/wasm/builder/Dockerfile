FROM rust:1.39.0

# Install wasm-pack, wasm-snip and binaryen
RUN cargo install wasm-pack --version 0.8.1 && \
    cargo install wasm-snip --version 0.4.0 && \
    curl -L https://github.com/WebAssembly/binaryen/releases/download/1.39.1/binaryen-1.39.1-x86_64-linux.tar.gz | tar xz -C /usr/local/bin --strip-components 1
