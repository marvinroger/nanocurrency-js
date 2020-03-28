declare module '*.wasm' {
  function rollup(
    importObject: WebAssembly.Imports
  ): Promise<{
    instance: {
      exports: {
        memory: WebAssembly.Memory
        io_ptr_work: () => number
        io_ptr_derive_public: () => number
        io_ptr_derive_secret: () => number
        io_ptr_encode_address: () => number
        io_ptr_test_seed_matches_address_pattern: () => number
        work: () => void
        derive_public: () => void
        derive_secret: () => void
        encode_address: () => void
        test_seed_matches_address_pattern: () => void
      }
    }
  }>

  function rollup(): Promise<WebAssembly.Module>

  export default rollup
}
