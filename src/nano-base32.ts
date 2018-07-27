/*
MIT License

Copyright (c) 2018 Gray Olson

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

const alphabet = '13456789abcdefghijkmnopqrstuwxyz';

/**
 * Encode provided Uint8Array using the Nano-specific Base-32 implementeation.
 * @param view Input buffer formatted as a Uint8Array
 * @returns
 */
export function encodeNanoBase32(view: Uint8Array) {
  const length = view.length;
  const leftover = (length * 8) % 5;
  const offset = leftover === 0 ? 0 : 5 - leftover;

  let value = 0;
  let output = '';
  let bits = 0;

  for (let i = 0; i < length; i++) {
    value = (value << 8) | view[i];
    bits += 8;

    while (bits >= 5) {
      output += alphabet[(value >>> (bits + offset - 5)) & 31];
      bits -= 5;
    }
  }

  if (bits > 0) {
    output += alphabet[(value << (5 - (bits + offset))) & 31];
  }

  return output;
}

function readChar(char: string) {
  const idx = alphabet.indexOf(char);

  if (idx === -1) {
    throw new Error('Invalid character found: ' + char);
  }

  return idx;
}

/**
 * Decodes a Nano-implementation Base32 encoded string into a Uint8Array
 * @param input A Nano-Base32 encoded string
 * @returns
 */
export function decodeNanoBase32(input: string) {
  const length = input.length;
  const leftover = (length * 5) % 8;
  const offset = leftover === 0 ? 0 : 8 - leftover;

  let bits = 0;
  let value = 0;

  let index = 0;
  let output = new Uint8Array(Math.ceil(length * 5 / 8));

  for (let i = 0; i < length; i++) {
    value = (value << 5) | readChar(input[i]);
    bits += 5;

    if (bits >= 8) {
      output[index++] = (value >>> (bits + offset - 8)) & 255;
      bits -= 8;
    }
  }
  if (bits > 0) {
    output[index++] = (value << (bits + offset - 8)) & 255;
  }

  if (leftover !== 0) {
    output = output.slice(1);
  }
  return output;
}
