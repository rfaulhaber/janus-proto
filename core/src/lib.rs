extern crate ropey;
use std::io::{self, BufRead, Read, Write};

pub struct Editor;

impl Editor {
	pub fn main_loop<R, W>(&mut self, reader: &mut R, writer: &mut W) -> io::Result<()>
	where
		R: BufRead,
		W: Write,
	{
		loop {
			let mut buf = String::new();
			reader.read_to_string(&mut buf)?;

			writer.write_all(buf.as_bytes())?;
		}
	}
}
