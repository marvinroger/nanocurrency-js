pub trait ToBigEndian<T> {
    fn to_big_endian(self) -> T;
}

pub trait ToLittleEndian<T> {
    fn to_little_endian(self) -> T;
}

impl ToBigEndian<[u8; 8]> for u64 {
    fn to_big_endian(self) -> [u8; 8] {
        let mut dst = [0u8; 8];
        dst[7] = ((self >> 56) & 0xff) as u8;
        dst[6] = ((self >> 48) & 0xff) as u8;
        dst[5] = ((self >> 40) & 0xff) as u8;
        dst[4] = ((self >> 32) & 0xff) as u8;
        dst[3] = ((self >> 24) & 0xff) as u8;
        dst[2] = ((self >> 16) & 0xff) as u8;
        dst[1] = ((self >> 8) & 0xff) as u8;
        dst[0] = (self & 0xff) as u8;
        dst
    }
}

impl ToBigEndian<[u8; 4]> for u32 {
    fn to_big_endian(self) -> [u8; 4] {
        let mut dst = [0u8; 4];
        dst[3] = ((self >> 24) & 0xff) as u8;
        dst[2] = ((self >> 16) & 0xff) as u8;
        dst[1] = ((self >> 8) & 0xff) as u8;
        dst[0] = (self & 0xff) as u8;
        dst
    }
}

impl ToLittleEndian<[u8; 8]> for u64 {
    fn to_little_endian(self) -> [u8; 8] {
        let mut dst = [0u8; 8];
        dst[0] = ((self >> 56) & 0xff) as u8;
        dst[1] = ((self >> 48) & 0xff) as u8;
        dst[2] = ((self >> 40) & 0xff) as u8;
        dst[3] = ((self >> 32) & 0xff) as u8;
        dst[4] = ((self >> 24) & 0xff) as u8;
        dst[5] = ((self >> 16) & 0xff) as u8;
        dst[6] = ((self >> 8) & 0xff) as u8;
        dst[7] = (self & 0xff) as u8;
        dst
    }
}

pub trait FromBigEndian<T> {
    fn from_big_endian(self) -> T;
}

pub trait FromLittleEndian<T> {
    fn from_little_endian(self) -> T;
}

impl FromBigEndian<u64> for [u8; 8] {
    fn from_big_endian(self) -> u64 {
        ((self[7] as u64) << 56)
            + ((self[6] as u64) << 48)
            + ((self[5] as u64) << 40)
            + ((self[4] as u64) << 32)
            + ((self[3] as u64) << 24)
            + ((self[2] as u64) << 16)
            + ((self[1] as u64) << 8)
            + self[0] as u64
    }
}

impl FromLittleEndian<u64> for [u8; 8] {
    fn from_little_endian(self) -> u64 {
        ((self[0] as u64) << 56)
            + ((self[1] as u64) << 48)
            + ((self[2] as u64) << 40)
            + ((self[3] as u64) << 32)
            + ((self[4] as u64) << 24)
            + ((self[5] as u64) << 16)
            + ((self[6] as u64) << 8)
            + self[7] as u64
    }
}

impl FromLittleEndian<u32> for [u8; 4] {
    fn from_little_endian(self) -> u32 {
        ((self[0] as u32) << 24)
            + ((self[1] as u32) << 16)
            + ((self[2] as u32) << 8)
            + self[3] as u32
    }
}

pub trait ToPointer {
    fn to_pointer(self) -> *const u8;
}

impl ToPointer for &[u8] {
    fn to_pointer(self) -> *const u8 {
        self.as_ptr() as *const u8
    }
}
