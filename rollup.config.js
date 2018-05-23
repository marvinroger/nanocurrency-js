import typescript from 'rollup-plugin-typescript2';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import license from 'rollup-plugin-license';
import pkg from './package.json';

const ENV = process.env.NODE_ENV;

const licenseBanner = `
/*!
* nanocurrency-js v${pkg.version}: A toolkit for the Nano cryptocurrency.
* Copyright (c) <%= moment().format('YYYY') %> Marvin ROGER <dev at marvinroger dot fr>
* Licensed under GPL-3.0 (https://git.io/vAZsK)
*/
`.trim();

const globals = { fs: 'fs', path: 'path' };

const config = [
  {
    input: 'src/index.ts',
    external: ['fs', 'path'],
    output: [
      {
        name: 'NanoCurrency',
        file: 'dist/nanocurrency.umd.js',
        format: 'umd',
        globals,
      },
      { file: pkg.main, format: 'cjs', globals },
      { file: pkg.module, format: 'es', globals },
    ],
    plugins: [resolve(), commonjs(), typescript({ useTsconfigDeclarationDir: true })],
  },
];

if (ENV === 'production') {
  config[0].plugins.push(terser());
  config[0].plugins.push(
    license({
      banner: licenseBanner,
    })
  );
}

export default config;
