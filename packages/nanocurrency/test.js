const NanoCurrency = require('./dist/bundles/nanocurrency.cjs-node')

async function main() {
  const publicKey = await NanoCurrency.derivePublicFromSecret(
    'A0F4C1C282923A1EA9ED4595E9794EC28B7F64A6FA537039729723CC068902C0'
  )
  // 907CA173F56EFBB12FAE23DED297E9945FBD1EE669CCC246718889AC9FAA41D7
  console.log(publicKey)
}

main()
