import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import uglify from 'rollup-plugin-uglify'
import license from 'rollup-plugin-license'
import pkg from './package.json'

const licenseBanner = `
/*!
* nanocurrency-js: A toolkit for the Nano cryptocurrency.
* Copyright (c) <%= moment().format('YYYY') %> Marvin ROGER <dev at marvinroger dot fr>
* Licensed under GPL-3.0 (https://git.io/vAZsK)
*/
`.trim()

export default [
  {
    input: 'src/index.js',
    external: ['greenlet'],
    output: [
      { name: 'NanoCurrency', file: pkg.browser, format: 'umd' },
      { file: pkg.main, format: 'cjs' },
      { file: pkg.module, format: 'es' }
    ],
    plugins: [
      resolve(),
      commonjs(),
      uglify(),
      license({
        banner: licenseBanner
      })
    ]
  }
]
