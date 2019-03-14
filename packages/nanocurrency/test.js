const nano = require('./dist/nanocurrency.cjs')

async function main() {
  console.time()
  const result = await nano.computeWork('e65cf3f83296f1abf0447775168bf08c78e9ec4dbaa83f43d87d1ee5ebd990ac');
  console.timeEnd()

  console.log(result)

}

main()
