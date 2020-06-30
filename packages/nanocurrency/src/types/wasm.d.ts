declare module '*.wasm' {
  function rollup(
    importObject: WebAssembly.Imports
  ): Promise<{
    instance: {
      exports: {
        memory: WebAssembly.Memory
        io_ptr_work: () => number
        io_ptr_derive_public_key: () => number
        io_ptr_derive_private_key: () => number
        io_ptr_encode_address: () => number
        io_ptr_decode_address: () => number
        io_ptr_test_seed_matches_address_pattern: () => number
        work: () => void
        derive_public_key: () => void
        derive_private_key: () => void
        encode_address: () => void
        decode_address: () => void
        test_seed_matches_address_pattern: () => void
      }
    }
  }>

  function rollup(): Promise<WebAssembly.Module>

  export default rollup
}
