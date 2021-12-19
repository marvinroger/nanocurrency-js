/*!
 * nanocurrency-js: A toolkit for the Nano cryptocurrency.
 * Copyright (c) 2021 Marvin ROGER <bonjour+code at marvinroger dot fr>
 * Licensed under GPL-3.0 (https://git.io/vAZsK)
 */

/** @hidden */
export async function getRandomBytes(count: number): Promise<Uint8Array> {
  const bytes = new Uint8Array(count)

  if (process.env.TARGET === 'node') {
    const { promisify } = await import('util')
    const { randomFill } = await import('crypto')
    await promisify(randomFill)(bytes)
    return bytes
  }

  if (process.env.TARGET === 'browser') {
    crypto.getRandomValues(bytes)
    return bytes
  }

  throw new Error('The target is not supported')
}

/** @hidden */
export function byteArrayToHex(byteArray: Uint8Array): string {
  if (!byteArray) {
    return ''
  }

  let hexStr = ''
  for (let i = 0; i < byteArray.length; i++) {
    let hex = (byteArray[i] & 0xff).toString(16)
    hex = hex.length === 1 ? `0${hex}` : hex
    hexStr += hex
  }

  return hexStr.toUpperCase()
}

/** @hidden */
export function hexToByteArray(hex: string): Uint8Array {
  if (!hex) {
    return new Uint8Array()
  }

  const a = []
  for (let i = 0; i < hex.length; i += 2) {
    a.push(parseInt(hex.substr(i, 2), 16))
  }

  return new Uint8Array(a)
}

/** @hidden */
export function compareArrays(array1: Uint8Array, array2: Uint8Array): boolean {
  for (let i = 0; i < array1.length; i++) {
    if (array1[i] !== array2[i]) return false
  }

  return true
}
