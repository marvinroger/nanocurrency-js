const fs = require('fs')
const path = require('path')
const binaryen = require('binaryen')

const WASM_PATH = path.resolve(__dirname, '../lib/nanocurrency.wasm')

const wasmBinary = fs.readFileSync(WASM_PATH)

const wasmModule = binaryen.readBinary(wasmBinary)
wasmModule.optimize()

const optimiwedWasmBinary = wasmModule.emitBinary()
fs.writeFileSync(WASM_PATH + '.opt', optimiwedWasmBinary)
