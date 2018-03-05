import * as NanoCurrency from 'nanocurrency'

async function showcase () {
  await NanoCurrency.init()

  const seed = await NanoCurrency.generateSeed()
  // 03314c18bd30204dc7dceb057b499e1ed2dfa039d01bfcca7421e245a5a40328
  const secretKey = NanoCurrency.deriveSecretKey(seed, 0)
  // 98d8003a8c16d9c2ffaecfa3215ff0d2e5e7b99ade686d7f16e724c5ec65e813
  const publicKey = NanoCurrency.derivePublicKey(secretKey)
  // cca632ec92d9e2c85079669818aa76f41027fab26753c42a55f195329fe2f5be
  const address = NanoCurrency.deriveAddress(publicKey)
  // xrb_3m788dpb7ph4s3a9ksnr54o9fx1i6zxd6stmrio7dweo8chy7xfy6mm5ohcj

  const blockHash = '7f7122e843b27524f4f1d6bd14aefd1c8f01d36ae8653d37417533c0d4bc2be6'
  const pow = NanoCurrency.work(blockHash)
  // 0000000000995bc3
  const isWorkValid = NanoCurrency.validateWork(blockHash, pow)
  // true
}
