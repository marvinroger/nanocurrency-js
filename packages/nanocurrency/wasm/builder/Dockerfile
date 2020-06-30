FROM rust:1.42.0

# The images are push on Docker Hub as marvinroger/rust-wasm-builder
# Tags
# V2 : rust 1.42.0, wasm-snip 0.4.0, binaryen 91

RUN rustup target add wasm32-unknown-unknown && \
    cargo install wasm-snip --version 0.4.0 && \
    curl -L https://github.com/WebAssembly/binaryen/releases/download/version_91/binaryen-version_91-x86_64-linux.tar.gz | tar xz -C /usr/local/bin --strip-components 1
