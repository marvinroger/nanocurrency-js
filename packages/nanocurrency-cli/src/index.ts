#!/usr/bin/env node
import * as yargs from 'yargs'
import * as nanocurrency from 'nanocurrency'

const wrapSubcommand = (yargs: yargs.Argv): yargs.Argv =>
  yargs
    .updateStrings({
      'Commands:': 'item:',
    })
    .demandCommand(1, 'Please specify an item')
    .help()
    .version(false)
    .wrap(null)

yargs
  .usage('usage: $0 <command>')
  .command(
    'check',
    'check a [seed|amount|hash|key|address|work|signature]',
    yargs => {
      return wrapSubcommand(
        yargs
          .usage('usage: $0 check <item>')
          .command(
            'seed',
            'check a seed',
            yargs => {
              return yargs
                .usage('usage: $0 check seed [options]')
                .option('candidate', {
                  demandOption: true,
                  describe: 'candidate to check',
                  type: 'string',
                })
            },
            argv => {
              const valid = nanocurrency.checkSeed(argv.candidate)
              console.log(valid)
            }
          )
          .command(
            'amount',
            'check an amount',
            yargs => {
              return yargs
                .usage('usage: $0 check amount [options]')
                .option('candidate', {
                  demandOption: true,
                  describe: 'candidate to check',
                  type: 'string',
                })
            },
            argv => {
              const valid = nanocurrency.checkAmount(argv.candidate)
              console.log(valid)
            }
          )
          .command(
            'hash',
            'check an hash',
            yargs => {
              return yargs
                .usage('usage: $0 check hash [options]')
                .option('candidate', {
                  demandOption: true,
                  describe: 'candidate to check',
                  type: 'string',
                })
            },
            argv => {
              const valid = nanocurrency.checkHash(argv.candidate)
              console.log(valid)
            }
          )
          .command(
            'key',
            'check a public or private key',
            yargs => {
              return yargs
                .usage('usage: $0 check key [options]')
                .option('candidate', {
                  demandOption: true,
                  describe: 'candidate to check',
                  type: 'string',
                })
            },
            argv => {
              const valid = nanocurrency.checkKey(argv.candidate)
              console.log(valid)
            }
          )
          .command(
            'address',
            'check an address',
            yargs => {
              return yargs
                .usage('usage: $0 check address [options]')
                .option('candidate', {
                  demandOption: true,
                  describe: 'candidate to check',
                  type: 'string',
                })
            },
            argv => {
              const valid = nanocurrency.checkAddress(argv.candidate)
              console.log(valid)
            }
          )
          .command(
            'work',
            'check a work',
            yargs => {
              return yargs
                .usage('usage: $0 check work [options]')
                .option('candidate', {
                  demandOption: true,
                  describe: 'candidate to check',
                  type: 'string',
                })
            },
            argv => {
              const valid = nanocurrency.checkWork(argv.candidate)
              console.log(valid)
            }
          )
          .command(
            'signature',
            'check a signature',
            yargs => {
              return yargs
                .usage('usage: $0 check signature [options]')
                .option('candidate', {
                  demandOption: true,
                  describe: 'candidate to check',
                  type: 'string',
                })
            },
            argv => {
              const valid = nanocurrency.checkSignature(argv.candidate)
              console.log(valid)
            }
          )
      )
    }
  )
  .command('convert', 'convert an [amount]', yargs => {
    return wrapSubcommand(
      yargs.usage('usage: $0 convert <item>').command(
        'amount',
        'convert an amount',
        yargs => {
          return yargs
            .usage('usage: $0 convert amount [options]')
            .option('input', {
              demandOption: true,
              describe: 'input to convert',
              type: 'string',
            })
            .option('from', {
              demandOption: true,
              describe: 'source unit',
              type: 'string',
            })
            .option('to', {
              demandOption: true,
              describe: 'destination unit',
              type: 'string',
            })
        },
        async argv => {
          const converted = await nanocurrency.convert(argv.input, {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            from: argv.from as any,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            to: argv.to as any,
          })
          console.log(converted)
        }
      )
    )
  })
  .command('compute', 'compute a [work]', yargs => {
    return wrapSubcommand(
      yargs.usage('usage: $0 compute <item>').command(
        'work',
        'compute a work',
        yargs => {
          return yargs
            .usage('usage: $0 compute work [options]')
            .option('hash', {
              demandOption: true,
              describe: 'block hash to compute a work for',
              type: 'string',
            })
        },
        async argv => {
          const work = await nanocurrency.computeWork(argv.hash)
          console.log(work)
        }
      )
    )
  })
  .command('sign', 'sign a [block]', yargs => {
    return wrapSubcommand(
      yargs.usage('usage: $0 sign <item>').command(
        'block',
        'sign a block',
        yargs => {
          return yargs
            .usage('usage: $0 sign block [options]')
            .option('secret', {
              demandOption: true,
              describe: 'secret key to sign the block with',
              type: 'string',
            })
            .option('hash', {
              demandOption: true,
              describe: 'hash of the block to sign',
              type: 'string',
            })
        },
        async argv => {
          const signature = await nanocurrency.signBlock({
            hash: argv.hash,
            secretKey: argv.secret,
          })
          console.log(signature)
        }
      )
    )
  })
  .command('verify', 'verify a [block]', yargs => {
    return wrapSubcommand(
      yargs.usage('usage: $0 verify <item>').command(
        'block',
        'verify a block',
        yargs => {
          return yargs
            .usage('usage: $0 verify block [options]')
            .option('public', {
              demandOption: true,
              describe: 'public key to verify the signature against',
              type: 'string',
            })
            .option('hash', {
              demandOption: true,
              describe: 'hash of the block to verify',
              type: 'string',
            })
            .option('signature', {
              demandOption: true,
              describe: 'signature to verify',
              type: 'string',
            })
        },
        async argv => {
          const valid = await nanocurrency.verifyBlock({
            hash: argv.hash,
            publicKey: argv.public,
            signature: argv.signature,
          })
          console.log(valid)
        }
      )
    )
  })
  .command('validate', 'validate a [work]', yargs => {
    return wrapSubcommand(
      yargs.usage('usage: $0 validate <item>').command(
        'work',
        'validate a work',
        yargs => {
          return yargs
            .usage('usage: $0 validate work [options]')
            .option('hash', {
              demandOption: true,
              describe: 'hash to validate the work against',
              type: 'string',
            })
            .option('work', {
              demandOption: true,
              describe: 'work to validate',
              type: 'string',
            })
        },
        async argv => {
          const valid = await nanocurrency.validateWork({
            blockHash: argv.hash,
            work: argv.work,
          })
          console.log(valid)
        }
      )
    )
  })
  .command('generate', 'generate a [seed]', yargs => {
    return wrapSubcommand(
      yargs
        .usage('usage: $0 generate <item>')
        .command('seed', 'generate a seed', {}, async () => {
          const seed = await nanocurrency.generateSeed()
          console.log(seed)
        })
    )
  })
  .command('derive', 'derive a [secret|public|address]', yargs => {
    return wrapSubcommand(
      yargs
        .usage('usage: $0 derive <item>')
        .command(
          'secret',
          'derive a secret key from a seed and an index',
          yargs => {
            return yargs
              .usage('usage: $0 derive secret [options]')
              .option('from', {
                demandOption: true,
                describe: 'seed to derive from',
                type: 'string',
              })
              .option('index', {
                demandOption: true,
                default: 0,
                describe: 'index to derive',
                type: 'number',
              })
          },
          argv => {
            const secretKey = nanocurrency.deriveSecretKey(
              argv.from,
              argv.index
            )
            console.log(secretKey)
          }
        )
        .command(
          'public',
          'derive a public key from a secret key or an address',
          yargs => {
            return yargs
              .usage('usage: $0 derive public [options]')
              .option('from', {
                demandOption: true,
                describe: 'secret key or address to derive from',
                type: 'string',
              })
          },
          argv => {
            const publicKey = nanocurrency.derivePublicKey(argv.from)
            console.log(publicKey)
          }
        )
        .command(
          'address',
          'derive an address from a public key',
          yargs => {
            return yargs
              .usage('usage: $0 derive address [options]')
              .option('from', {
                demandOption: true,
                describe: 'public key to derive from',
                type: 'string',
              })
          },
          argv => {
            const address = nanocurrency.deriveAddress(argv.from)
            console.log(address)
          }
        )
    )
  })
  .demandCommand(1, 'Please specify a command')
  .strict()
  .help()
  .epilogue(
    'for more information, find the sources at http://git.io/nanocurrency-js'
  )
  .wrap(null).argv
