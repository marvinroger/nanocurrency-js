FROM rust:1.41.1

# Install wasm-pack, wasm-snip and binaryen
RUN cargo install wasm-pack --version 0.9.1 && \
    cargo install wasm-snip --version 0.4.0 && \
    curl -L https://github.com/WebAssembly/binaryen/releases/download/version_91/binaryen-version_91-x86_64-linux.tar.gz | tar xz -C /usr/local/bin --strip-components 1
