<a name="module_NanoCurrency"></a>

## NanoCurrency

* [NanoCurrency](#module_NanoCurrency)
    * _static_
        * [.init()](#module_NanoCurrency.init) ⇒ <code>Promise.&lt;void&gt;</code>
        * [.isReady()](#module_NanoCurrency.isReady) ⇒ <code>boolean</code>
        * [.checkSeed(seed)](#module_NanoCurrency.checkSeed) ⇒ <code>boolean</code>
        * [.checkHash(hash)](#module_NanoCurrency.checkHash) ⇒ <code>boolean</code>
        * [.checkKey(key)](#module_NanoCurrency.checkKey) ⇒ <code>boolean</code>
        * [.checkAddress(address)](#module_NanoCurrency.checkAddress) ⇒ <code>boolean</code>
        * [.checkWork(work)](#module_NanoCurrency.checkWork) ⇒ <code>boolean</code>
        * [.checkSignature(signature)](#module_NanoCurrency.checkSignature) ⇒ <code>boolean</code>
        * [.work(blockHash, [workerIndex], [workerCount])](#module_NanoCurrency.work) ⇒ <code>string</code>
        * [.validateWork(blockHash, work)](#module_NanoCurrency.validateWork) ⇒ <code>boolean</code>
        * [.generateSeed()](#module_NanoCurrency.generateSeed) ⇒ <code>Promise.&lt;string&gt;</code>
        * [.deriveSecretKey(seed, index)](#module_NanoCurrency.deriveSecretKey) ⇒ <code>string</code>
        * [.derivePublicKey(secretKey)](#module_NanoCurrency.derivePublicKey) ⇒ <code>string</code>
        * [.deriveAddress(publicKey)](#module_NanoCurrency.deriveAddress) ⇒ <code>string</code>
        * [.hashReceiveBlock(previous, source)](#module_NanoCurrency.hashReceiveBlock) ⇒ <code>string</code>
        * [.hashOpenBlock(source, representative, account)](#module_NanoCurrency.hashOpenBlock) ⇒ <code>string</code>
        * [.hashChangeBlock(previous, representative)](#module_NanoCurrency.hashChangeBlock) ⇒ <code>string</code>
        * [.hashSendBlock(previous, destination, balance)](#module_NanoCurrency.hashSendBlock) ⇒ <code>string</code>
        * [.signBlock(blockHash, secretKey)](#module_NanoCurrency.signBlock) ⇒ <code>string</code>
        * [.verifyBlock(blockHash, signature, publicKey)](#module_NanoCurrency.verifyBlock) ⇒ <code>boolean</code>
        * [.createOpenBlock(secretKey, data)](#module_NanoCurrency.createOpenBlock) ⇒ <code>Object</code>
        * [.createReceiveBlock(secretKey, data)](#module_NanoCurrency.createReceiveBlock) ⇒ <code>Object</code>
        * [.createSendBlock(secretKey, data)](#module_NanoCurrency.createSendBlock) ⇒ <code>Object</code>
        * [.createChangeBlock(secretKey, data)](#module_NanoCurrency.createChangeBlock) ⇒ <code>Object</code>
    * _inner_
        * [~checkBalance(balance)](#module_NanoCurrency..checkBalance) ⇒ <code>boolean</code>

<a name="module_NanoCurrency.init"></a>

### NanoCurrency.init() ⇒ <code>Promise.&lt;void&gt;</code>
Initialize the library.

**Kind**: static method of [<code>NanoCurrency</code>](#module_NanoCurrency)  
<a name="module_NanoCurrency.isReady"></a>

### NanoCurrency.isReady() ⇒ <code>boolean</code>
Get whether or not the library is ready to be used ([#module_NanoCurrency.init](#module_NanoCurrency.init) has been called).

**Kind**: static method of [<code>NanoCurrency</code>](#module_NanoCurrency)  
<a name="module_NanoCurrency.checkSeed"></a>

### NanoCurrency.checkSeed(seed) ⇒ <code>boolean</code>
Check if the given seed is valid.
Does not require initialization.

**Kind**: static method of [<code>NanoCurrency</code>](#module_NanoCurrency)  
**Returns**: <code>boolean</code> - Valid  

| Param | Type | Description |
| --- | --- | --- |
| seed | <code>string</code> | The seed to check |

<a name="module_NanoCurrency.checkHash"></a>

### NanoCurrency.checkHash(hash) ⇒ <code>boolean</code>
Check if the given hash is valid.
Does not require initialization.

**Kind**: static method of [<code>NanoCurrency</code>](#module_NanoCurrency)  
**Returns**: <code>boolean</code> - Valid  

| Param | Type | Description |
| --- | --- | --- |
| hash | <code>string</code> | The hash to check |

<a name="module_NanoCurrency.checkKey"></a>

### NanoCurrency.checkKey(key) ⇒ <code>boolean</code>
Check if the given public or secret key is valid.
Does not require initialization.

**Kind**: static method of [<code>NanoCurrency</code>](#module_NanoCurrency)  
**Returns**: <code>boolean</code> - Valid  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | The key to check |

<a name="module_NanoCurrency.checkAddress"></a>

### NanoCurrency.checkAddress(address) ⇒ <code>boolean</code>
Check if the given address is valid.
Does not require initialization.

**Kind**: static method of [<code>NanoCurrency</code>](#module_NanoCurrency)  
**Returns**: <code>boolean</code> - Valid  

| Param | Type | Description |
| --- | --- | --- |
| address | <code>string</code> | The address to check |

<a name="module_NanoCurrency.checkWork"></a>

### NanoCurrency.checkWork(work) ⇒ <code>boolean</code>
Check if the given work is valid.
Does not require initialization.

**Kind**: static method of [<code>NanoCurrency</code>](#module_NanoCurrency)  
**Returns**: <code>boolean</code> - Valid  

| Param | Type | Description |
| --- | --- | --- |
| work | <code>string</code> | The work to check |

<a name="module_NanoCurrency.checkSignature"></a>

### NanoCurrency.checkSignature(signature) ⇒ <code>boolean</code>
Check if the given signature is valid.
Does not require initialization.

**Kind**: static method of [<code>NanoCurrency</code>](#module_NanoCurrency)  
**Returns**: <code>boolean</code> - Valid  

| Param | Type | Description |
| --- | --- | --- |
| signature | <code>string</code> | The signature to check |

<a name="module_NanoCurrency.work"></a>

### NanoCurrency.work(blockHash, [workerIndex], [workerCount]) ⇒ <code>string</code>
Find a work value that meets the difficulty for the given hash.
Requires initialization.

**Kind**: static method of [<code>NanoCurrency</code>](#module_NanoCurrency)  
**Returns**: <code>string</code> - Work, in hexadecimal format  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| blockHash | <code>string</code> |  | The hash to find a work for |
| [workerIndex] | <code>number</code> | <code>0</code> | The current worker index, starting at 0 |
| [workerCount] | <code>number</code> | <code>1</code> | The count of worker |

<a name="module_NanoCurrency.validateWork"></a>

### NanoCurrency.validateWork(blockHash, work) ⇒ <code>boolean</code>
Validate whether or not the work value meets the difficulty for the given hash.
Requires initialization.

**Kind**: static method of [<code>NanoCurrency</code>](#module_NanoCurrency)  
**Returns**: <code>boolean</code> - Valid  

| Param | Type | Description |
| --- | --- | --- |
| blockHash | <code>string</code> | The hash to validate the work against |
| work | <code>string</code> | The work to validate |

<a name="module_NanoCurrency.generateSeed"></a>

### NanoCurrency.generateSeed() ⇒ <code>Promise.&lt;string&gt;</code>
Generate a cryptographically secure seed.
Does not require initialization.

**Kind**: static method of [<code>NanoCurrency</code>](#module_NanoCurrency)  
**Returns**: <code>Promise.&lt;string&gt;</code> - Seed, in hexadecimal format  
<a name="module_NanoCurrency.deriveSecretKey"></a>

### NanoCurrency.deriveSecretKey(seed, index) ⇒ <code>string</code>
Derive a secret key from a seed, given an index.
Requires initialization.

**Kind**: static method of [<code>NanoCurrency</code>](#module_NanoCurrency)  
**Returns**: <code>string</code> - Secret key, in hexadecimal format  

| Param | Type | Description |
| --- | --- | --- |
| seed | <code>string</code> | The seed to generate the secret key from, in hexadecimal format |
| index | <code>number</code> | The index to generate the secret key from |

<a name="module_NanoCurrency.derivePublicKey"></a>

### NanoCurrency.derivePublicKey(secretKey) ⇒ <code>string</code>
Derive a public key from a secret key.
Requires initialization.

**Kind**: static method of [<code>NanoCurrency</code>](#module_NanoCurrency)  
**Returns**: <code>string</code> - Public key, in hexadecimal format  

| Param | Type | Description |
| --- | --- | --- |
| secretKey | <code>string</code> | The secret key to generate the secret key from, in hexadecimal format |

<a name="module_NanoCurrency.deriveAddress"></a>

### NanoCurrency.deriveAddress(publicKey) ⇒ <code>string</code>
Derive address from a public key.
Requires initialization.

**Kind**: static method of [<code>NanoCurrency</code>](#module_NanoCurrency)  
**Returns**: <code>string</code> - Address  

| Param | Type | Description |
| --- | --- | --- |
| publicKey | <code>string</code> | The public key to generate the address from, in hexadecimal format |

<a name="module_NanoCurrency.hashReceiveBlock"></a>

### NanoCurrency.hashReceiveBlock(previous, source) ⇒ <code>string</code>
Hash a receive block.
Requires initialization.

**Kind**: static method of [<code>NanoCurrency</code>](#module_NanoCurrency)  
**Returns**: <code>string</code> - Hash, in hexadecimal format  

| Param | Type | Description |
| --- | --- | --- |
| previous | <code>string</code> | The hash of the previous block on the account chain, in hexadecimal format |
| source | <code>string</code> | The hash of the send block that is being received, in hexadecimal format |

<a name="module_NanoCurrency.hashOpenBlock"></a>

### NanoCurrency.hashOpenBlock(source, representative, account) ⇒ <code>string</code>
Hash an open block.
Requires initialization.

**Kind**: static method of [<code>NanoCurrency</code>](#module_NanoCurrency)  
**Returns**: <code>string</code> - Hash, in hexadecimal format  

| Param | Type | Description |
| --- | --- | --- |
| source | <code>string</code> | The hash of the send block that is being received, in hexadecimal format |
| representative | <code>string</code> | The representative address |
| account | <code>string</code> | The account address |

<a name="module_NanoCurrency.hashChangeBlock"></a>

### NanoCurrency.hashChangeBlock(previous, representative) ⇒ <code>string</code>
Hash a change block.
Requires initialization.

**Kind**: static method of [<code>NanoCurrency</code>](#module_NanoCurrency)  
**Returns**: <code>string</code> - Hash, in hexadecimal format  

| Param | Type | Description |
| --- | --- | --- |
| previous | <code>string</code> | The hash of the previous block on the account chain, in hexadecimal format |
| representative | <code>string</code> | The representative address |

<a name="module_NanoCurrency.hashSendBlock"></a>

### NanoCurrency.hashSendBlock(previous, destination, balance) ⇒ <code>string</code>
Hash a send block.
Requires initialization.

**Kind**: static method of [<code>NanoCurrency</code>](#module_NanoCurrency)  
**Returns**: <code>string</code> - Hash, in hexadecimal format  

| Param | Type | Description |
| --- | --- | --- |
| previous | <code>string</code> | The hash of the previous block on the account chain, in hexadecimal format |
| destination | <code>string</code> | The destination address |
| balance | <code>string</code> | The balance, in raw |

<a name="module_NanoCurrency.signBlock"></a>

### NanoCurrency.signBlock(blockHash, secretKey) ⇒ <code>string</code>
Sign a block.
Requires initialization.

**Kind**: static method of [<code>NanoCurrency</code>](#module_NanoCurrency)  
**Returns**: <code>string</code> - Signature, in hexadecimal format  

| Param | Type | Description |
| --- | --- | --- |
| blockHash | <code>string</code> | The hash of the block to sign |
| secretKey | <code>string</code> | The secret key to sign the block with, in hexadecimal format |

<a name="module_NanoCurrency.verifyBlock"></a>

### NanoCurrency.verifyBlock(blockHash, signature, publicKey) ⇒ <code>boolean</code>
Verify a block against a public key.
Requires initialization.

**Kind**: static method of [<code>NanoCurrency</code>](#module_NanoCurrency)  
**Returns**: <code>boolean</code> - Valid  

| Param | Type | Description |
| --- | --- | --- |
| blockHash | <code>string</code> | The hash of the block to verify |
| signature | <code>string</code> | The signature of the block to verify, in hexadecimal format |
| publicKey | <code>string</code> | The public key to verify the block against, in hexadecimal format |

<a name="module_NanoCurrency.createOpenBlock"></a>

### NanoCurrency.createOpenBlock(secretKey, data) ⇒ <code>Object</code>
Create an open block.
Requires initialization.

**Kind**: static method of [<code>NanoCurrency</code>](#module_NanoCurrency)  
**Returns**: <code>Object</code> - Block  

| Param | Type | Description |
| --- | --- | --- |
| secretKey | <code>string</code> | The secret key to create the block from, in hexadecimal format |
| data | <code>Object</code> | Block data |
| data.work | <code>string</code> | The PoW |
| data.source | <code>string</code> | The hash of the send block that is being received, in hexadecimal format |
| data.representative | <code>string</code> | The representative address |

<a name="module_NanoCurrency.createReceiveBlock"></a>

### NanoCurrency.createReceiveBlock(secretKey, data) ⇒ <code>Object</code>
Create a receive block.
Requires initialization.

**Kind**: static method of [<code>NanoCurrency</code>](#module_NanoCurrency)  
**Returns**: <code>Object</code> - Block  

| Param | Type | Description |
| --- | --- | --- |
| secretKey | <code>string</code> | The secret key to create the block from, in hexadecimal format |
| data | <code>Object</code> | Block data |
| data.work | <code>string</code> | The PoW |
| data.previous | <code>string</code> | The hash of the previous block on the account chain, in hexadecimal format |
| data.source | <code>string</code> | The hash of the send block that is being received, in hexadecimal format |

<a name="module_NanoCurrency.createSendBlock"></a>

### NanoCurrency.createSendBlock(secretKey, data) ⇒ <code>Object</code>
Create a send block.
Requires initialization.

**Kind**: static method of [<code>NanoCurrency</code>](#module_NanoCurrency)  
**Returns**: <code>Object</code> - Block  

| Param | Type | Description |
| --- | --- | --- |
| secretKey | <code>string</code> | The secret key to create the block from, in hexadecimal format |
| data | <code>Object</code> | Block data |
| data.work | <code>string</code> | The PoW |
| data.previous | <code>string</code> | The hash of the previous block on the account chain, in hexadecimal format |
| data.destination | <code>string</code> | The destination address |
| data.balance | <code>string</code> | The balance, in raw |

<a name="module_NanoCurrency.createChangeBlock"></a>

### NanoCurrency.createChangeBlock(secretKey, data) ⇒ <code>Object</code>
Create a change block.
Requires initialization.

**Kind**: static method of [<code>NanoCurrency</code>](#module_NanoCurrency)  
**Returns**: <code>Object</code> - Block  

| Param | Type | Description |
| --- | --- | --- |
| secretKey | <code>string</code> | The secret key to create the block from, in hexadecimal format |
| data | <code>Object</code> | Block data |
| data.work | <code>string</code> | The PoW |
| data.previous | <code>string</code> | The hash of the previous block on the account chain, in hexadecimal format |
| data.representative | <code>string</code> | The representative address |

<a name="module_NanoCurrency..checkBalance"></a>

### NanoCurrency~checkBalance(balance) ⇒ <code>boolean</code>
Check if the given balance is valid.
Does not require initialization.

**Kind**: inner method of [<code>NanoCurrency</code>](#module_NanoCurrency)  
**Returns**: <code>boolean</code> - Valid  

| Param | Type | Description |
| --- | --- | --- |
| balance | <code>string</code> | The balance to check |

