use crate::custom_ed25519;
use crate::keys::{PrivateKey, PublicKey};

/// A Nano block hash
pub struct BlockHash(pub [u8; 32]);

impl BlockHash {
    /// Sign a block
    pub fn sign(&self, private_key: &PrivateKey) -> [u8; 64] {
        custom_ed25519::sign(&self.0, &private_key.0)
    }

    /// Verify a signature
    pub fn verify_signature(&self, public_key: &PublicKey, signature: &[u8; 64]) -> bool {
        custom_ed25519::verify(&self.0, &public_key.0, signature)
    }
}
