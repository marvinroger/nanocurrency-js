## Functions

<dl>
<dt><a href="#checkBalance">checkBalance(balance)</a> ⇒ <code>boolean</code></dt>
<dd><p>Check if the given balance is valid.
Does not require initialization.</p>
</dd>
<dt><a href="#checkSeed">checkSeed(seed)</a> ⇒ <code>boolean</code></dt>
<dd><p>Check if the given seed is valid.
Does not require initialization.</p>
</dd>
<dt><a href="#checkHash">checkHash(hash)</a> ⇒ <code>boolean</code></dt>
<dd><p>Check if the given hash is valid.
Does not require initialization.</p>
</dd>
<dt><a href="#checkKey">checkKey(key)</a> ⇒ <code>boolean</code></dt>
<dd><p>Check if the given public or secret key is valid.
Does not require initialization.</p>
</dd>
<dt><a href="#checkAddress">checkAddress(address)</a> ⇒ <code>boolean</code></dt>
<dd><p>Check if the given address is valid.
Does not require initialization.</p>
</dd>
<dt><a href="#checkWork">checkWork(work)</a> ⇒ <code>boolean</code></dt>
<dd><p>Check if the given work is valid.
Does not require initialization.</p>
</dd>
<dt><a href="#checkSignature">checkSignature(signature)</a> ⇒ <code>boolean</code></dt>
<dd><p>Check if the given signature is valid.
Does not require initialization.</p>
</dd>
<dt><a href="#convert">convert(value, units)</a> ⇒ <code>string</code></dt>
<dd><p>Convert a value from one Nano unit to another.
Does not require initialization.</p>
</dd>
<dt><a href="#generateSeed">generateSeed()</a> ⇒ <code>Promise.&lt;string&gt;</code></dt>
<dd><p>Generate a cryptographically secure seed.
Does not require initialization.</p>
</dd>
<dt><a href="#deriveSecretKey">deriveSecretKey(seed, index)</a> ⇒ <code>string</code></dt>
<dd><p>Derive a secret key from a seed, given an index.
Does not require initialization.</p>
</dd>
<dt><a href="#derivePublicKey">derivePublicKey(secretKeyOrAddress)</a> ⇒ <code>string</code></dt>
<dd><p>Derive a public key from a secret key.
Does not require initialization.</p>
</dd>
<dt><a href="#deriveAddress">deriveAddress(publicKey)</a> ⇒ <code>string</code></dt>
<dd><p>Derive address from a public key.
Does not require initialization.</p>
</dd>
<dt><a href="#hashReceiveBlock">hashReceiveBlock(previous, source)</a> ⇒ <code>string</code></dt>
<dd><p>Hash a receive block.
Does not require initialization.</p>
</dd>
<dt><a href="#hashOpenBlock">hashOpenBlock(source, representative, account)</a> ⇒ <code>string</code></dt>
<dd><p>Hash an open block.
Does not require initialization.</p>
</dd>
<dt><a href="#hashChangeBlock">hashChangeBlock(previous, representative)</a> ⇒ <code>string</code></dt>
<dd><p>Hash a change block.
Does not require initialization.</p>
</dd>
<dt><a href="#hashSendBlock">hashSendBlock(previous, destination, balance)</a> ⇒ <code>string</code></dt>
<dd><p>Hash a send block.
Does not require initialization.</p>
</dd>
<dt><a href="#signBlock">signBlock(blockHash, secretKey)</a> ⇒ <code>string</code></dt>
<dd><p>Sign a block.
Does not require initialization.</p>
</dd>
<dt><a href="#verifyBlock">verifyBlock(blockHash, signature, publicKey)</a> ⇒ <code>boolean</code></dt>
<dd><p>Verify a block against a public key.
Does not require initialization.</p>
</dd>
<dt><a href="#init">init()</a> ⇒ <code>Promise.&lt;void&gt;</code></dt>
<dd><p>Initialize the library. This basically loads the WebAssembly used by <code>work</code>.</p>
</dd>
<dt><a href="#isReady">isReady()</a> ⇒ <code>boolean</code></dt>
<dd><p>Get whether or not <code>work</code> is ready to be used (<a href="#init">#init</a> has been called).</p>
</dd>
<dt><a href="#work">work(blockHash, [workerIndex], [workerCount])</a> ⇒ <code>string</code></dt>
<dd><p>Find a work value that meets the difficulty for the given hash.
Requires initialization.</p>
</dd>
<dt><a href="#validateWork">validateWork(blockHash, work)</a> ⇒ <code>boolean</code></dt>
<dd><p>Validate whether or not the work value meets the difficulty for the given hash.
Does not require initialization.</p>
</dd>
<dt><a href="#createOpenBlock">createOpenBlock(secretKey, data)</a> ⇒ <code>Object</code></dt>
<dd><p>Create an open block.
Does not require initialization.</p>
</dd>
<dt><a href="#createReceiveBlock">createReceiveBlock(secretKey, data)</a> ⇒ <code>Object</code></dt>
<dd><p>Create a receive block.
Does not require initialization.</p>
</dd>
<dt><a href="#createSendBlock">createSendBlock(secretKey, data)</a> ⇒ <code>Object</code></dt>
<dd><p>Create a send block.
Does not require initialization.</p>
</dd>
<dt><a href="#createChangeBlock">createChangeBlock(secretKey, data)</a> ⇒ <code>Object</code></dt>
<dd><p>Create a change block.
Does not require initialization.</p>
</dd>
</dl>

<a name="checkBalance"></a>

## checkBalance(balance) ⇒ <code>boolean</code>
Check if the given balance is valid.
Does not require initialization.

**Kind**: global function  
**Returns**: <code>boolean</code> - Valid  

| Param | Type | Description |
| --- | --- | --- |
| balance | <code>string</code> | The balance to check |

<a name="checkSeed"></a>

## checkSeed(seed) ⇒ <code>boolean</code>
Check if the given seed is valid.
Does not require initialization.

**Kind**: global function  
**Returns**: <code>boolean</code> - Valid  

| Param | Type | Description |
| --- | --- | --- |
| seed | <code>string</code> | The seed to check |

<a name="checkHash"></a>

## checkHash(hash) ⇒ <code>boolean</code>
Check if the given hash is valid.
Does not require initialization.

**Kind**: global function  
**Returns**: <code>boolean</code> - Valid  

| Param | Type | Description |
| --- | --- | --- |
| hash | <code>string</code> | The hash to check |

<a name="checkKey"></a>

## checkKey(key) ⇒ <code>boolean</code>
Check if the given public or secret key is valid.
Does not require initialization.

**Kind**: global function  
**Returns**: <code>boolean</code> - Valid  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | The key to check |

<a name="checkAddress"></a>

## checkAddress(address) ⇒ <code>boolean</code>
Check if the given address is valid.
Does not require initialization.

**Kind**: global function  
**Returns**: <code>boolean</code> - Valid  

| Param | Type | Description |
| --- | --- | --- |
| address | <code>string</code> | The address to check |

<a name="checkWork"></a>

## checkWork(work) ⇒ <code>boolean</code>
Check if the given work is valid.
Does not require initialization.

**Kind**: global function  
**Returns**: <code>boolean</code> - Valid  

| Param | Type | Description |
| --- | --- | --- |
| work | <code>string</code> | The work to check |

<a name="checkSignature"></a>

## checkSignature(signature) ⇒ <code>boolean</code>
Check if the given signature is valid.
Does not require initialization.

**Kind**: global function  
**Returns**: <code>boolean</code> - Valid  

| Param | Type | Description |
| --- | --- | --- |
| signature | <code>string</code> | The signature to check |

<a name="convert"></a>

## convert(value, units) ⇒ <code>string</code>
Convert a value from one Nano unit to another.
Does not require initialization.

**Kind**: global function  
**Returns**: <code>string</code> - Converted number  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| value | <code>string</code> |  | The value to convert |
| units | <code>Object</code> |  | Units |
| [units.from] | <code>string</code> | <code>&quot;Nano&quot;</code> | The unit to convert the value from. One of 'hex', 'raw', 'nano', 'knano', 'Nano', 'NANO', 'KNano', 'MNano' |
| [units.to] | <code>string</code> | <code>&quot;raw&quot;</code> | The unit to convert the value to. Same units as units.from |

<a name="generateSeed"></a>

## generateSeed() ⇒ <code>Promise.&lt;string&gt;</code>
Generate a cryptographically secure seed.
Does not require initialization.

**Kind**: global function  
**Returns**: <code>Promise.&lt;string&gt;</code> - Seed, in hexadecimal format  
<a name="deriveSecretKey"></a>

## deriveSecretKey(seed, index) ⇒ <code>string</code>
Derive a secret key from a seed, given an index.
Does not require initialization.

**Kind**: global function  
**Returns**: <code>string</code> - Secret key, in hexadecimal format  

| Param | Type | Description |
| --- | --- | --- |
| seed | <code>string</code> | The seed to generate the secret key from, in hexadecimal format |
| index | <code>number</code> | The index to generate the secret key from |

<a name="derivePublicKey"></a>

## derivePublicKey(secretKeyOrAddress) ⇒ <code>string</code>
Derive a public key from a secret key.
Does not require initialization.

**Kind**: global function  
**Returns**: <code>string</code> - Public key, in hexadecimal format  

| Param | Type | Description |
| --- | --- | --- |
| secretKeyOrAddress | <code>string</code> | The secret key or address to generate the public key from, in hexadecimal or address format |

<a name="deriveAddress"></a>

## deriveAddress(publicKey) ⇒ <code>string</code>
Derive address from a public key.
Does not require initialization.

**Kind**: global function  
**Returns**: <code>string</code> - Address  

| Param | Type | Description |
| --- | --- | --- |
| publicKey | <code>string</code> | The public key to generate the address from, in hexadecimal format |

<a name="hashReceiveBlock"></a>

## hashReceiveBlock(previous, source) ⇒ <code>string</code>
Hash a receive block.
Does not require initialization.

**Kind**: global function  
**Returns**: <code>string</code> - Hash, in hexadecimal format  

| Param | Type | Description |
| --- | --- | --- |
| previous | <code>string</code> | The hash of the previous block on the account chain, in hexadecimal format |
| source | <code>string</code> | The hash of the send block that is being received, in hexadecimal format |

<a name="hashOpenBlock"></a>

## hashOpenBlock(source, representative, account) ⇒ <code>string</code>
Hash an open block.
Does not require initialization.

**Kind**: global function  
**Returns**: <code>string</code> - Hash, in hexadecimal format  

| Param | Type | Description |
| --- | --- | --- |
| source | <code>string</code> | The hash of the send block that is being received, in hexadecimal format |
| representative | <code>string</code> | The representative address |
| account | <code>string</code> | The account address |

<a name="hashChangeBlock"></a>

## hashChangeBlock(previous, representative) ⇒ <code>string</code>
Hash a change block.
Does not require initialization.

**Kind**: global function  
**Returns**: <code>string</code> - Hash, in hexadecimal format  

| Param | Type | Description |
| --- | --- | --- |
| previous | <code>string</code> | The hash of the previous block on the account chain, in hexadecimal format |
| representative | <code>string</code> | The representative address |

<a name="hashSendBlock"></a>

## hashSendBlock(previous, destination, balance) ⇒ <code>string</code>
Hash a send block.
Does not require initialization.

**Kind**: global function  
**Returns**: <code>string</code> - Hash, in hexadecimal format  

| Param | Type | Description |
| --- | --- | --- |
| previous | <code>string</code> | The hash of the previous block on the account chain, in hexadecimal format |
| destination | <code>string</code> | The destination address |
| balance | <code>string</code> | The balance, in raw |

<a name="signBlock"></a>

## signBlock(blockHash, secretKey) ⇒ <code>string</code>
Sign a block.
Does not require initialization.

**Kind**: global function  
**Returns**: <code>string</code> - Signature, in hexadecimal format  

| Param | Type | Description |
| --- | --- | --- |
| blockHash | <code>string</code> | The hash of the block to sign |
| secretKey | <code>string</code> | The secret key to sign the block with, in hexadecimal format |

<a name="verifyBlock"></a>

## verifyBlock(blockHash, signature, publicKey) ⇒ <code>boolean</code>
Verify a block against a public key.
Does not require initialization.

**Kind**: global function  
**Returns**: <code>boolean</code> - Valid  

| Param | Type | Description |
| --- | --- | --- |
| blockHash | <code>string</code> | The hash of the block to verify |
| signature | <code>string</code> | The signature of the block to verify, in hexadecimal format |
| publicKey | <code>string</code> | The public key to verify the block against, in hexadecimal format |

<a name="init"></a>

## init() ⇒ <code>Promise.&lt;void&gt;</code>
Initialize the library. This basically loads the WebAssembly used by `work`.

**Kind**: global function  
**Returns**: <code>Promise.&lt;void&gt;</code> - Promise  
<a name="isReady"></a>

## isReady() ⇒ <code>boolean</code>
Get whether or not `work` is ready to be used ([#init](#init) has been called).

**Kind**: global function  
**Returns**: <code>boolean</code> - Ready  
<a name="work"></a>

## work(blockHash, [workerIndex], [workerCount]) ⇒ <code>string</code>
Find a work value that meets the difficulty for the given hash.
Requires initialization.

**Kind**: global function  
**Returns**: <code>string</code> - Work, in hexadecimal format  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| blockHash | <code>string</code> |  | The hash to find a work for |
| [workerIndex] | <code>number</code> | <code>0</code> | The current worker index, starting at 0 |
| [workerCount] | <code>number</code> | <code>1</code> | The count of worker |

<a name="validateWork"></a>

## validateWork(blockHash, work) ⇒ <code>boolean</code>
Validate whether or not the work value meets the difficulty for the given hash.
Does not require initialization.

**Kind**: global function  
**Returns**: <code>boolean</code> - Valid  

| Param | Type | Description |
| --- | --- | --- |
| blockHash | <code>string</code> | The hash to validate the work against |
| work | <code>string</code> | The work to validate |

<a name="createOpenBlock"></a>

## createOpenBlock(secretKey, data) ⇒ <code>Object</code>
Create an open block.
Does not require initialization.

**Kind**: global function  
**Returns**: <code>Object</code> - Block  

| Param | Type | Description |
| --- | --- | --- |
| secretKey | <code>string</code> | The secret key to create the block from, in hexadecimal format |
| data | <code>Object</code> | Block data |
| data.work | <code>string</code> | The PoW |
| data.source | <code>string</code> | The hash of the send block that is being received, in hexadecimal format |
| data.representative | <code>string</code> | The representative address |

<a name="createReceiveBlock"></a>

## createReceiveBlock(secretKey, data) ⇒ <code>Object</code>
Create a receive block.
Does not require initialization.

**Kind**: global function  
**Returns**: <code>Object</code> - Block  

| Param | Type | Description |
| --- | --- | --- |
| secretKey | <code>string</code> | The secret key to create the block from, in hexadecimal format |
| data | <code>Object</code> | Block data |
| data.work | <code>string</code> | The PoW |
| data.previous | <code>string</code> | The hash of the previous block on the account chain, in hexadecimal format |
| data.source | <code>string</code> | The hash of the send block that is being received, in hexadecimal format |

<a name="createSendBlock"></a>

## createSendBlock(secretKey, data) ⇒ <code>Object</code>
Create a send block.
Does not require initialization.

**Kind**: global function  
**Returns**: <code>Object</code> - Block  

| Param | Type | Description |
| --- | --- | --- |
| secretKey | <code>string</code> | The secret key to create the block from, in hexadecimal format |
| data | <code>Object</code> | Block data |
| data.work | <code>string</code> | The PoW |
| data.previous | <code>string</code> | The hash of the previous block on the account chain, in hexadecimal format |
| data.destination | <code>string</code> | The destination address |
| data.balance | <code>string</code> | The balance, in raw |

<a name="createChangeBlock"></a>

## createChangeBlock(secretKey, data) ⇒ <code>Object</code>
Create a change block.
Does not require initialization.

**Kind**: global function  
**Returns**: <code>Object</code> - Block  

| Param | Type | Description |
| --- | --- | --- |
| secretKey | <code>string</code> | The secret key to create the block from, in hexadecimal format |
| data | <code>Object</code> | Block data |
| data.work | <code>string</code> | The PoW |
| data.previous | <code>string</code> | The hash of the previous block on the account chain, in hexadecimal format |
| data.representative | <code>string</code> | The representative address |

