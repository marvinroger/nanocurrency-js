# nanocurrency-js

[![npm version](https://img.shields.io/npm/v/nanocurrency.svg)](https://www.npmjs.com/package/nanocurrency)
[![build status](https://travis-ci.org/marvinroger/nanocurrency-js.svg?branch=master)](https://travis-ci.org/marvinroger/nanocurrency-js)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

---

A toolkit for the Nano cryptocurrency.

![Code showcase](showcase.png)

The documentation is available in the [DOCUMENTATION.md](DOCUMENTATION.md) file.

---

## Helpful materials

* Article about seed / secret key / public key / address generation: https://medium.com/@benkray/raiblocks-deterministic-keys-8cb869cc6046

* BLAKE2 reference implementation, used for hashing: https://github.com/BLAKE2/BLAKE2

* Ed25519 portable implementation from Orson PETERS, used for keypair/signing: https://github.com/orlp/ed25519. **Note: The library has been modified to use BLAKE2b instead of SHA-512**

* uint128_t from Jason LEE, used for amount representation: https://github.com/calccrypto/uint128_t
