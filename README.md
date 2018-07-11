# nanocurrency-js

[![npm version](https://img.shields.io/npm/v/nanocurrency.svg)](https://www.npmjs.com/package/nanocurrency)
[![build status](https://travis-ci.org/marvinroger/nanocurrency-js.svg?branch=master)](https://travis-ci.org/marvinroger/nanocurrency-js)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

---

A [battle-tested](__tests__) toolkit for the Nano cryptocurrency.

If you are looking for legacy blocks, you will want the `^1.0.0` versions.

![Code showcase](showcase.png)

The documentation is available locally in [docs/](docs/) or online at [https://marvinroger.github.io/nanocurrency-js](https://marvinroger.github.io/nanocurrency-js).

---

## Features

- Generate seeds
- Derive secret keys, public keys and addresses
- Hash blocks
- Sign and verify blocks
- Compute and test proofs of work
- Check the format of seeds, secret keys, public keys, addresses, amounts, etc.
- Convert Nano units
- **CLI doing all of the above**

---

## Usage

To install the library:

```
npm install nanocurrency
# or yarn add nanocurrency
```

```js
import * as nanocurrency from 'nanocurrency';
```

To install the CLI:

```
npm install -g nanocurrency
# or yarn global add nanocurrency
```

```bash
nanocurrency --help
```

---

## Performance

You might be wondering how fast is the work generation. There's a `pow-benchmark` example in the `examples/` directory.
On an Intel Core i7-8550U CPU, with 100 iterations, [the average computation time is 18.5s per work](https://gist.github.com/marvinroger/5181d213df1306fe2f7af0578d365aa3).

Considering you can pre-compute and cache the work prior to an actual transaction, this should be satisfying for a smooth user experience.

---

## Contribute

Contributions are very welcome. To develop, make use of the following commands (using [Yarn](https://yarnpkg.com)):

- `yarn build:dev`: build the C++ code to WebAssembly and bundle the files into the `dist` directory, without optimization so that it is fast while developing. Note that you'll need to have Docker installed

- `yarn test`: test the code

- `yarn lint`: lint the code against [JavaScript Standard Style](https://standardjs.com)

- `yarn format`: format the code with [Prettier](https://prettier.io)

- `yarn generate-docs`: generate the `DOCUMENTATION.md` file from the [JSDoc](http://usejsdoc.org) annotations

---

## Donations

If you like the project, feel free to donate some nano:

`xrb_3mrogerjhkdyj6mzf4e7aatf3xs3gp4stwc9yt9ymgasw7kr7g17t4jwwwy8`
