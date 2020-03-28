static ALPHABET: [u8; 32] = [
    b'1', b'3', b'4', b'5', b'6', b'7', b'8', b'9', b'a', b'b', b'c', b'd', b'e', b'f', b'g', b'h',
    b'i', b'j', b'k', b'm', b'n', b'o', b'p', b'q', b'r', b's', b't', b'u', b'w', b'x', b'y', b'z',
];

#[allow(exceeding_bitshifts)]
pub fn encode(input: &[u8], output: &mut [u8]) {
    let length = input.len();
    let leftover = (length * 8) % 5;
    let offset = if leftover == 0 { 0 } else { 5 - leftover };

    let mut value: u32 = 0;
    let mut bits = 0;
    let mut counter = 0;
    for byte in input {
        value = (value << 8) | *byte as u32;
        bits += 8;

        while bits >= 5 {
            output[counter] = ALPHABET[((value >> (bits + offset - 5)) & 31) as usize];
            bits -= 5;
            counter += 1;
        }
    }

    if bits > 0 {
        output[counter] = ALPHABET[((value << (5 - (bits + offset))) & 31) as usize];
    }
}
