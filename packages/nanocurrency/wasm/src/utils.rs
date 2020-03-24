pub fn transform_u64_to_array_of_u8_be(x: u64, dst: &mut [u8]) {
    dst[7] = ((x >> 56) & 0xff) as u8;
    dst[6] = ((x >> 48) & 0xff) as u8;
    dst[5] = ((x >> 40) & 0xff) as u8;
    dst[4] = ((x >> 32) & 0xff) as u8;
    dst[3] = ((x >> 24) & 0xff) as u8;
    dst[2] = ((x >> 16) & 0xff) as u8;
    dst[1] = ((x >> 8) & 0xff) as u8;
    dst[0] = (x & 0xff) as u8;
}

pub fn transform_array_of_u8_to_u64_be(x: &[u8]) -> u64 {
    ((x[7] as u64) << 56)
        + ((x[6] as u64) << 48)
        + ((x[5] as u64) << 40)
        + ((x[4] as u64) << 32)
        + ((x[3] as u64) << 24)
        + ((x[2] as u64) << 16)
        + ((x[1] as u64) << 8)
        + x[0] as u64
}

pub fn transform_array_of_u8_to_u64_le(x: &[u8]) -> u64 {
    ((x[0] as u64) << 56)
        + ((x[1] as u64) << 48)
        + ((x[2] as u64) << 40)
        + ((x[3] as u64) << 32)
        + ((x[4] as u64) << 24)
        + ((x[5] as u64) << 16)
        + ((x[6] as u64) << 8)
        + x[7] as u64
}

pub fn transform_array_of_u8_to_u32_le(x: &[u8]) -> u32 {
    ((x[0] as u32) << 24) + ((x[1] as u32) << 16) + ((x[2] as u32) << 8) + x[3] as u32
}

pub fn reverse_array(x: &mut [u8], length: usize) {
    for i in 0..length / 2 {
        x.swap(i, length - 1 - i);
    }
}
