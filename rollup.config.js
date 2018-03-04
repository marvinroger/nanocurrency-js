import wasm from 'rollup-plugin-wasm'
import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import uglify from 'rollup-plugin-uglify'
import license from 'rollup-plugin-license'
import pkg from './package.json'

const ENV = process.env.NODE_ENV

const licenseBanner = `
/*!
* nanocurrency-js v${pkg.version}: A toolkit for the Nano cryptocurrency.
* Copyright (c) <%= moment().format('YYYY') %> Marvin ROGER <dev at marvinroger dot fr>
* Licensed under GPL-3.0 (https://git.io/vAZsK)
*/
`.trim()

const globals = { fs: 'fs', path: 'path' }

const config = [
  {
    input: 'src/index.js',
    external: ['fs', 'path'],
    output: [
      { name: 'NanoCurrency', file: 'dist/nanocurrency.umd.js', format: 'umd', globals },
      { file: pkg.main, format: 'cjs', globals },
      { file: pkg.module, format: 'es', globals }
    ],
    plugins: [
      // wasm(),
      resolve(),
      commonjs(),
      babel({
        exclude: 'node_modules/**',
        plugins: ['external-helpers']
      })
    ]
  }
]

if (ENV === 'production') {
  config[0].plugins.push(uglify())
  config[0].plugins.push(license({
    banner: licenseBanner
  }))
}

export default config
