use crate::base32;
use crate::utils::ToBigEndian;
use crypto::blake2b;
use crypto::curve25519;
use crypto::digest::Digest;

pub struct Seed(pub [u8; 32]);
pub struct PrivateKey(pub [u8; 32]);
pub struct PublicKey(pub [u8; 32]);
pub struct Address(pub [u8; 60]);
pub struct AddressPattern(pub [u8; 60]);

impl Seed {
    pub fn derive_private_key(&self, index: u32) -> PrivateKey {
        let index_bytes = index.to_big_endian();

        let mut buffer = [0u8; 32];
        let mut hasher = blake2b::Blake2b::new(32);
        hasher.input(&self.0);
        hasher.input(&index_bytes);
        hasher.result(&mut buffer);

        PrivateKey(buffer)
    }
}

impl PrivateKey {
    pub fn derive_public_key(&self) -> PublicKey {
        let mut buffer = [0u8; 64];

        let mut hasher = blake2b::Blake2b::new(64);
        hasher.input(&self.0);
        hasher.result(&mut buffer);
        buffer[0] &= 248;
        buffer[31] &= 127;
        buffer[31] |= 64;

        PublicKey(curve25519::ge_scalarmult_base(&buffer).to_bytes())
    }
}

impl PublicKey {
    pub fn encode_address(&self) -> Address {
        let mut address = [0u8; 60];
        base32::encode(&self.0, &mut address[..52]);
        let mut checksum = [0u8; 5];
        let mut hasher = blake2b::Blake2b::new(5);
        hasher.input(&self.0);
        hasher.result(&mut checksum);
        checksum.reverse();
        base32::encode(&checksum, &mut address[52..]);

        Address(address)
    }
}

impl Address {
    pub fn match_pattern(&self, pattern: &AddressPattern) -> bool {
        pattern
            .0
            .iter()
            .enumerate()
            .all(|(i, &c)| c == b'*' || c == self.0[i])
    }
}
