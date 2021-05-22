import babel from '@rollup/plugin-babel'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import replace from '@rollup/plugin-replace'
import wasm from '@rollup/plugin-wasm'
import { terser } from 'rollup-plugin-terser'
import license from 'rollup-plugin-license'

import pkg from './package.json'

const LICENSE_BANNER = `
/*!
* nanocurrency-js v${pkg.version}: A toolkit for the Nano cryptocurrency.
* Copyright (c) <%= moment().format('YYYY') %> Marvin ROGER <bonjour+code at marvinroger dot fr>
* Licensed under GPL-3.0 (https://git.io/vAZsK)
*/
`.trim()

const extensions = ['.js', '.ts']

const buildConfig = ({ file, target, format }) => {
  const config = {
    input: 'src/index.ts',
    output: {
      file,
      format,
      name: 'NanoCurrency',
    },
    plugins: [
      replace({
        preventAssignment: true,
        values: { 'process.env.TARGET': JSON.stringify(target) },
      }),
      resolve({ extensions }),
      commonjs(),
      babel({
        presets: [
          [
            '@babel/preset-env',
            {
              targets:
                target === 'node'
                  ? { node: '12.0.0' }
                  : { browsers: 'chrome 90' },
              shippedProposals: true,
            },
          ],
          '@babel/preset-typescript',
        ],
        extensions,
        babelHelpers: 'bundled',
      }),
      wasm({ maxFileSize: Infinity }),
      terser({ output: { comments: false } }),
      license({
        banner: LICENSE_BANNER,
      }),
    ],
  }

  return config
}

const configs = [
  buildConfig({
    target: 'browser',
    file: 'dist/bundles/nanocurrency.umd.js',
    format: 'umd',
  }),
  buildConfig({
    target: 'node',
    file: 'dist/bundles/nanocurrency.cjs-node.js',
    format: 'cjs',
  }),
  buildConfig({
    target: 'browser',
    file: 'dist/bundles/nanocurrency.cjs-browser.js',
    format: 'cjs',
  }),
  buildConfig({
    target: 'node',
    file: 'dist/bundles/nanocurrency.esm-node.js',
    format: 'esm',
  }),
  buildConfig({
    target: 'browser',
    file: 'dist/bundles/nanocurrency.esm-browser.js',
    format: 'esm',
  }),
]

export default configs
