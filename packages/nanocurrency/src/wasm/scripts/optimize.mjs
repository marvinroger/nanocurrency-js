/* eslint-disable */
import { fileURLToPath } from 'node:url'
import fs from 'node:fs'
import path from 'node:path'

import binaryen from 'binaryen'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const WASM_PATH = path.resolve(__dirname, '../lib/nanocurrency.wasm')

const wasmBinary = fs.readFileSync(WASM_PATH)

const wasmModule = binaryen.readBinary(wasmBinary)
wasmModule.optimize()

const optimizedWasmBinary = wasmModule.emitBinary()
fs.writeFileSync(WASM_PATH, optimizedWasmBinary)
