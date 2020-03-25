declare module '*.wasm' {
  function rollup(
    importObject: WebAssembly.Imports
  ): Promise<{
    instance: {
      exports: {
        memory: WebAssembly.Memory
        get_work_memory_pointer: () => number
        work: () => void
      }
    }
  }>

  function rollup(): Promise<WebAssembly.Module>

  export default rollup
}
