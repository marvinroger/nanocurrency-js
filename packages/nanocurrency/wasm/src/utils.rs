pub trait ToPointer {
    fn to_pointer(self) -> *const u8;
}

impl ToPointer for &[u8] {
    fn to_pointer(self) -> *const u8 {
        self.as_ptr() as *const u8
    }
}
