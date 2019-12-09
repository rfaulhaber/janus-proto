extern crate serde;
extern crate serde_json;

mod rpc;

use rpc::*;
use std::io::{self, BufRead, Write};

pub struct Editor;

impl Editor {
	pub fn main_loop<R, W>(&mut self, reader: &mut R, writer: &mut W) -> io::Result<()>
	where
		R: BufRead,
		W: Write,
	{
		loop {
			let mut buf = String::new();
			reader.read_line(&mut buf)?;

			let signal: RpcSignal = serde_json::from_str(buf.as_str())?;

			let resp = match signal.click {
				// TODO don't unwrap
				Click::Middle => handle_middle(signal.term).unwrap(),
				Click::Right => handle_right(signal.term).unwrap(),
			};

			// TODO don't unwrap
			let resp_json = serde_json::to_string(&resp).unwrap();

			writer.write_all(resp_json.as_bytes())?;
			writer.flush()?;
		}
	}
}
