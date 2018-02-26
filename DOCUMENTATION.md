<a name="module_nanoCurrency"></a>

## nanoCurrency

* [nanoCurrency](#module_nanoCurrency)
    * [.init()](#module_nanoCurrency.init) ⇒ <code>Promise.&lt;void&gt;</code>
    * [.isReady()](#module_nanoCurrency.isReady) ⇒ <code>boolean</code>
    * [.checkSeed(seed)](#module_nanoCurrency.checkSeed) ⇒ <code>boolean</code>
    * [.checkHash(hash)](#module_nanoCurrency.checkHash) ⇒ <code>boolean</code>
    * [.checkKey(key)](#module_nanoCurrency.checkKey) ⇒ <code>boolean</code>
    * [.checkAddress(address)](#module_nanoCurrency.checkAddress) ⇒ <code>boolean</code>
    * [.checkWork(work)](#module_nanoCurrency.checkWork) ⇒ <code>boolean</code>
    * [.checkSignature(signature)](#module_nanoCurrency.checkSignature) ⇒ <code>boolean</code>
    * [.work(blockHash, [workerIndex], [workerCount])](#module_nanoCurrency.work) ⇒ <code>string</code>
    * [.validateWork(blockHash, work)](#module_nanoCurrency.validateWork) ⇒ <code>boolean</code>
    * [.generateSeed()](#module_nanoCurrency.generateSeed) ⇒ <code>Promise.&lt;string&gt;</code>
    * [.computeSecretKey(seed, index)](#module_nanoCurrency.computeSecretKey) ⇒ <code>string</code>
    * [.computePublicKey(secretKey)](#module_nanoCurrency.computePublicKey) ⇒ <code>string</code>
    * [.computeAddress(publicKey)](#module_nanoCurrency.computeAddress) ⇒ <code>string</code>
    * [.hashReceiveBlock(previous, source)](#module_nanoCurrency.hashReceiveBlock) ⇒ <code>string</code>
    * [.hashOpenBlock(source, representative, account)](#module_nanoCurrency.hashOpenBlock) ⇒ <code>string</code>
    * [.hashChangeBlock(previous, representative)](#module_nanoCurrency.hashChangeBlock) ⇒ <code>string</code>
    * [.hashSendBlock(previous, destination, balance)](#module_nanoCurrency.hashSendBlock) ⇒ <code>string</code>
    * [.signBlock(blockHash, secretKey)](#module_nanoCurrency.signBlock) ⇒ <code>string</code>
    * [.verifyBlock(blockHash, signature, publicKey)](#module_nanoCurrency.verifyBlock) ⇒ <code>boolean</code>
    * [.createOpenBlock(secretKey, data)](#module_nanoCurrency.createOpenBlock) ⇒ <code>Object</code>
    * [.createReceiveBlock(secretKey, data)](#module_nanoCurrency.createReceiveBlock) ⇒ <code>Object</code>
    * [.createSendBlock(secretKey, data)](#module_nanoCurrency.createSendBlock) ⇒ <code>Object</code>
    * [.createChangeBlock(secretKey, data)](#module_nanoCurrency.createChangeBlock) ⇒ <code>Object</code>

<a name="module_nanoCurrency.init"></a>

### nanoCurrency.init() ⇒ <code>Promise.&lt;void&gt;</code>
Initialize the library.

**Kind**: static method of [<code>nanoCurrency</code>](#module_nanoCurrency)  
<a name="module_nanoCurrency.isReady"></a>

### nanoCurrency.isReady() ⇒ <code>boolean</code>
Get whether or not the library is ready to be used ([#module_nanoCurrency.init](#module_nanoCurrency.init) has been called).

**Kind**: static method of [<code>nanoCurrency</code>](#module_nanoCurrency)  
<a name="module_nanoCurrency.checkSeed"></a>

### nanoCurrency.checkSeed(seed) ⇒ <code>boolean</code>
Check if the given seed is valid.

**Kind**: static method of [<code>nanoCurrency</code>](#module_nanoCurrency)  
**Returns**: <code>boolean</code> - Valid  

| Param | Type | Description |
| --- | --- | --- |
| seed | <code>string</code> | The seed to check |

<a name="module_nanoCurrency.checkHash"></a>

### nanoCurrency.checkHash(hash) ⇒ <code>boolean</code>
Check if the given hash is valid.

**Kind**: static method of [<code>nanoCurrency</code>](#module_nanoCurrency)  
**Returns**: <code>boolean</code> - Valid  

| Param | Type | Description |
| --- | --- | --- |
| hash | <code>string</code> | The hash to check |

<a name="module_nanoCurrency.checkKey"></a>

### nanoCurrency.checkKey(key) ⇒ <code>boolean</code>
Check if the given public or secret key is valid.

**Kind**: static method of [<code>nanoCurrency</code>](#module_nanoCurrency)  
**Returns**: <code>boolean</code> - Valid  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | The key to check |

<a name="module_nanoCurrency.checkAddress"></a>

### nanoCurrency.checkAddress(address) ⇒ <code>boolean</code>
Check if the given address is valid.

**Kind**: static method of [<code>nanoCurrency</code>](#module_nanoCurrency)  
**Returns**: <code>boolean</code> - Valid  

| Param | Type | Description |
| --- | --- | --- |
| address | <code>string</code> | The address to check |

<a name="module_nanoCurrency.checkWork"></a>

### nanoCurrency.checkWork(work) ⇒ <code>boolean</code>
Check if the given work is valid.

**Kind**: static method of [<code>nanoCurrency</code>](#module_nanoCurrency)  
**Returns**: <code>boolean</code> - Valid  

| Param | Type | Description |
| --- | --- | --- |
| work | <code>string</code> | The work to check |

<a name="module_nanoCurrency.checkSignature"></a>

### nanoCurrency.checkSignature(signature) ⇒ <code>boolean</code>
Check if the given signature is valid.

**Kind**: static method of [<code>nanoCurrency</code>](#module_nanoCurrency)  
**Returns**: <code>boolean</code> - Valid  

| Param | Type | Description |
| --- | --- | --- |
| signature | <code>string</code> | The signature to check |

<a name="module_nanoCurrency.work"></a>

### nanoCurrency.work(blockHash, [workerIndex], [workerCount]) ⇒ <code>string</code>
Find a work value that meets the difficulty for the given hash.

**Kind**: static method of [<code>nanoCurrency</code>](#module_nanoCurrency)  
**Returns**: <code>string</code> - Work, in hexadecimal format  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| blockHash | <code>string</code> |  | The hash to find a work for |
| [workerIndex] | <code>number</code> | <code>0</code> | The current worker index, starting at 0 |
| [workerCount] | <code>number</code> | <code>1</code> | The count of worker |

<a name="module_nanoCurrency.validateWork"></a>

### nanoCurrency.validateWork(blockHash, work) ⇒ <code>boolean</code>
Validate whether or not the work value meets the difficulty for the given hash.

**Kind**: static method of [<code>nanoCurrency</code>](#module_nanoCurrency)  
**Returns**: <code>boolean</code> - Valid  

| Param | Type | Description |
| --- | --- | --- |
| blockHash | <code>string</code> | The hash to validate the work against |
| work | <code>string</code> | The work to validate |

<a name="module_nanoCurrency.generateSeed"></a>

### nanoCurrency.generateSeed() ⇒ <code>Promise.&lt;string&gt;</code>
Generate a cryptographically secure seed.

**Kind**: static method of [<code>nanoCurrency</code>](#module_nanoCurrency)  
**Returns**: <code>Promise.&lt;string&gt;</code> - Seed, in hexadecimal format  
<a name="module_nanoCurrency.computeSecretKey"></a>

### nanoCurrency.computeSecretKey(seed, index) ⇒ <code>string</code>
Compute a secret key from a seed, given an index.

**Kind**: static method of [<code>nanoCurrency</code>](#module_nanoCurrency)  
**Returns**: <code>string</code> - Secret key, in hexadecimal format  

| Param | Type | Description |
| --- | --- | --- |
| seed | <code>string</code> | The seed to generate the secret key from, in hexadecimal format |
| index | <code>number</code> | The index to generate the secret key from |

<a name="module_nanoCurrency.computePublicKey"></a>

### nanoCurrency.computePublicKey(secretKey) ⇒ <code>string</code>
Compute a public key from a secret key.

**Kind**: static method of [<code>nanoCurrency</code>](#module_nanoCurrency)  
**Returns**: <code>string</code> - Public key, in hexadecimal format  

| Param | Type | Description |
| --- | --- | --- |
| secretKey | <code>string</code> | The secret key to generate the secret key from, in hexadecimal format |

<a name="module_nanoCurrency.computeAddress"></a>

### nanoCurrency.computeAddress(publicKey) ⇒ <code>string</code>
Compute address from a public key.

**Kind**: static method of [<code>nanoCurrency</code>](#module_nanoCurrency)  
**Returns**: <code>string</code> - Address  

| Param | Type | Description |
| --- | --- | --- |
| publicKey | <code>string</code> | The public key to generate the address from, in hexadecimal format |

<a name="module_nanoCurrency.hashReceiveBlock"></a>

### nanoCurrency.hashReceiveBlock(previous, source) ⇒ <code>string</code>
Hash a receive block.

**Kind**: static method of [<code>nanoCurrency</code>](#module_nanoCurrency)  
**Returns**: <code>string</code> - Hash, in hexadecimal format  

| Param | Type | Description |
| --- | --- | --- |
| previous | <code>string</code> | The previous hash of the block, in hexadecimal format |
| source | <code>string</code> | The source hash of the block, in hexadecimal format |

<a name="module_nanoCurrency.hashOpenBlock"></a>

### nanoCurrency.hashOpenBlock(source, representative, account) ⇒ <code>string</code>
Hash an open block.

**Kind**: static method of [<code>nanoCurrency</code>](#module_nanoCurrency)  
**Returns**: <code>string</code> - Hash, in hexadecimal format  

| Param | Type | Description |
| --- | --- | --- |
| source | <code>string</code> | The source hash of the block, in hexadecimal format |
| representative | <code>string</code> | The representative address of the block |
| account | <code>string</code> | The account address of the block |

<a name="module_nanoCurrency.hashChangeBlock"></a>

### nanoCurrency.hashChangeBlock(previous, representative) ⇒ <code>string</code>
Hash a change block.

**Kind**: static method of [<code>nanoCurrency</code>](#module_nanoCurrency)  
**Returns**: <code>string</code> - Hash, in hexadecimal format  

| Param | Type | Description |
| --- | --- | --- |
| previous | <code>string</code> | The previous hash of the block, in hexadecimal format |
| representative | <code>string</code> | The representative address of the block |

<a name="module_nanoCurrency.hashSendBlock"></a>

### nanoCurrency.hashSendBlock(previous, destination, balance) ⇒ <code>string</code>
Hash a send block.

**Kind**: static method of [<code>nanoCurrency</code>](#module_nanoCurrency)  
**Returns**: <code>string</code> - Hash, in hexadecimal format  

| Param | Type | Description |
| --- | --- | --- |
| previous | <code>string</code> | The previous hash of the block, in hexadecimal format |
| destination | <code>string</code> | The destination address of the block |
| balance | <code>string</code> | The balance of the block, in raw |

<a name="module_nanoCurrency.signBlock"></a>

### nanoCurrency.signBlock(blockHash, secretKey) ⇒ <code>string</code>
Sign a block.

**Kind**: static method of [<code>nanoCurrency</code>](#module_nanoCurrency)  
**Returns**: <code>string</code> - Signature, in hexadecimal format  

| Param | Type | Description |
| --- | --- | --- |
| blockHash | <code>string</code> | The hash of the block to sign |
| secretKey | <code>string</code> | The secret key to sign the block with, in hexadecimal format |

<a name="module_nanoCurrency.verifyBlock"></a>

### nanoCurrency.verifyBlock(blockHash, signature, publicKey) ⇒ <code>boolean</code>
Verify a block against a public key.

**Kind**: static method of [<code>nanoCurrency</code>](#module_nanoCurrency)  
**Returns**: <code>boolean</code> - Valid  

| Param | Type | Description |
| --- | --- | --- |
| blockHash | <code>string</code> | The hash of the block to verify |
| signature | <code>string</code> | The signature of the block to verify, in hexadecimal format |
| publicKey | <code>string</code> | The public key to verify the block against, in hexadecimal format |

<a name="module_nanoCurrency.createOpenBlock"></a>

### nanoCurrency.createOpenBlock(secretKey, data) ⇒ <code>Object</code>
Create an open block. You will have to inject the PoW.

**Kind**: static method of [<code>nanoCurrency</code>](#module_nanoCurrency)  
**Returns**: <code>Object</code> - Block  

| Param | Type | Description |
| --- | --- | --- |
| secretKey | <code>string</code> | The secret key to create the block from, in hexadecimal format |
| data | <code>Object</code> | Block data |
| data.source | <code>string</code> | The source hash of the block, in hexadecimal format |
| data.representative | <code>string</code> | The representative address of the block |
| data.account | <code>string</code> | The account address of the block |

<a name="module_nanoCurrency.createReceiveBlock"></a>

### nanoCurrency.createReceiveBlock(secretKey, data) ⇒ <code>Object</code>
Create a receive block. You will have to inject the PoW.

**Kind**: static method of [<code>nanoCurrency</code>](#module_nanoCurrency)  
**Returns**: <code>Object</code> - Block  

| Param | Type | Description |
| --- | --- | --- |
| secretKey | <code>string</code> | The secret key to create the block from, in hexadecimal format |
| data | <code>Object</code> | Block data |
| data.previous | <code>string</code> | The previous hash of the block, in hexadecimal format |
| data.source | <code>string</code> | The source hash of the block, in hexadecimal format |

<a name="module_nanoCurrency.createSendBlock"></a>

### nanoCurrency.createSendBlock(secretKey, data) ⇒ <code>Object</code>
Create a send block. You will have to inject the PoW.

**Kind**: static method of [<code>nanoCurrency</code>](#module_nanoCurrency)  
**Returns**: <code>Object</code> - Block  

| Param | Type | Description |
| --- | --- | --- |
| secretKey | <code>string</code> | The secret key to create the block from, in hexadecimal format |
| data | <code>Object</code> | Block data |
| data.previous | <code>string</code> | The previous hash of the block, in hexadecimal format |
| data.destination | <code>string</code> | The destination address of the block |
| data.balance | <code>string</code> | The balance of the block, in raw |

<a name="module_nanoCurrency.createChangeBlock"></a>

### nanoCurrency.createChangeBlock(secretKey, data) ⇒ <code>Object</code>
Create a change block. You will have to inject the PoW.

**Kind**: static method of [<code>nanoCurrency</code>](#module_nanoCurrency)  
**Returns**: <code>Object</code> - Block  

| Param | Type | Description |
| --- | --- | --- |
| secretKey | <code>string</code> | The secret key to create the block from, in hexadecimal format |
| data | <code>Object</code> | Block data |
| data.previous | <code>string</code> | The previous hash of the block, in hexadecimal format |
| data.representative | <code>string</code> | The representative address of the block |

