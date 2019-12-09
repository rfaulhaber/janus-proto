use super::rpc::*;
use ropey::Rope;
use serde::ser::SerializeStruct;
use serde::{Serialize, Serializer};
use std::io::{self, BufRead, Write};

#[derive(Debug)]
pub struct Editor {
	state: State,
}

#[derive(Debug, Serialize)]
pub struct State {
	pub columns: Vec<Vec<EditorFile>>,
}

#[derive(Debug, Serialize)]
pub struct EditorFile {
	pub path: String,
}

impl Default for Editor {
	fn default() -> Self {
		Editor {
			state: State {
				columns: Vec::new(),
			},
		}
	}
}

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

			let resp = handle_signal(signal);

			// TODO don't unwrap
			let resp_json = serde_json::to_string(&resp).unwrap();

			writer.write_all(resp_json.as_bytes())?;
			writer.flush()?;
		}
	}
}
