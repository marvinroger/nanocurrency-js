use crate::custom_ed25519;
use crate::keys::{PrivateKey, PublicKey};
use core::fmt;

/// A Nano block hash
#[derive(Debug, PartialEq)]
pub struct BlockHash(pub [u8; 32]);

/// A Nano signature
pub struct Signature(pub [u8; 64]);

impl BlockHash {
    /// Sign a block
    pub fn sign(&self, private_key: &PrivateKey) -> Signature {
        let private_key_bytes = array_ref!(private_key.0, 0, 32);
        let public_key = private_key.derive_public_key();
        let public_key_bytes = array_ref!(public_key.0, 0, 32);

        Signature(custom_ed25519::sign(
            &self.0,
            private_key_bytes,
            public_key_bytes,
        ))
    }

    /// Verify a signature
    pub fn verify_signature(&self, public_key: &PublicKey, signature: &Signature) -> bool {
        custom_ed25519::verify(&self.0, &public_key.0, &signature.0)
    }
}

impl PartialEq for Signature {
    fn eq(&self, other: &Self) -> bool {
        self.0.iter().zip(other.0.iter()).all(|(&a, &b)| a == b)
    }
}

impl fmt::Debug for Signature {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.debug_list().entries(self.0.iter()).finish()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_sign() {
        let block_hash = BlockHash(hexupper!(
            "C159993439E87B26511775BC9F85BACC0A06FED3A9CE6661748440EF28FBAA74"
        ));

        let private_key = PrivateKey(hexupper!(
            "19622D20FBC8AAA9E45CF016FAC7EF7D85908EE898A670B4D6A2C8AA272828D0"
        ));

        assert_eq!(block_hash.sign(&private_key), Signature(hexupper!("771FB995C7C08D193A19630BA86FF4B5B76B5D4EA60FAFAD72BE391607D834B83D81E557D9481D02D04A6BFCC9F2A68DC0930745D4C204C9204962E33A61C00A")));
    }

    #[test]
    fn test_verify_signature() {
        let block_hash = BlockHash(hexupper!(
            "C159993439E87B26511775BC9F85BACC0A06FED3A9CE6661748440EF28FBAA74"
        ));

        let public_key = PublicKey(hexupper!(
            "9795E63D9242D8C6E00FA5D95587B2E5262B1E15001A24D2F6D803DE577A0574"
        ));

        let good_signature = Signature(hexupper!("771FB995C7C08D193A19630BA86FF4B5B76B5D4EA60FAFAD72BE391607D834B83D81E557D9481D02D04A6BFCC9F2A68DC0930745D4C204C9204962E33A61C00A"));
        let bad_signature = Signature(hexupper!("881FB995C7C08D193A19630BA86FF4B5B76B5D4EA60FAFAD72BE391607D834B83D81E557D9481D02D04A6BFCC9F2A68DC0930745D4C204C9204962E33A61C00A"));

        assert!(block_hash.verify_signature(&public_key, &good_signature));
        assert!(!block_hash.verify_signature(&public_key, &bad_signature));
    }
}
