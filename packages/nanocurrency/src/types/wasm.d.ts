declare module '*.wasm' {
  function rollup(
    importObject: WebAssembly.Imports
  ): Promise<{
    instance: {
      exports: {
        memory: WebAssembly.Memory
        wasm_get_io_buffer: () => number
        wasm_work: () => void
        wasm_derive_public_key_from_secret_key: () => void
      }
    }
  }>

  function rollup(): Promise<WebAssembly.Module>

  export default rollup
}
