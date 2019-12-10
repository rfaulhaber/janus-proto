use serde::{Deserialize, Serialize};
use std::error::Error;
use std::process::{Command, Stdio};

/*
   Signal schema
   {
	   type: middle | right
	   command: String
	   selection: String
   }
*/

#[derive(Debug, Deserialize)]
#[serde(rename_all = "lowercase")]
#[serde(tag = "type")]
pub enum RpcSignal {
	Middle(Click),
	Right(Click),
}

// TODO should be &strs
#[derive(Debug, Deserialize)]
pub struct Click {
	action: String,
	selected: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct EditorAction {
	pub kind: EditorActionType,
	pub column: usize,
	pub file: usize,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum EditorActionType {
	New,
	Cut,
	Paste,
	Del,
	Put,
	Delcol,
	Newcol,
	Exit,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum EditorIOType {
	Pipe,
	In,
	Out,
}

pub type SignalResult<T> = Result<T, RpcError>;

// TODO better errors
#[derive(Debug, Serialize)]
pub struct RpcError {
	// TODO should be &str
	pub msg: String,
}

impl From<std::io::Error> for RpcError {
	fn from(e: std::io::Error) -> RpcError {
		RpcError {
			msg: String::from(e.description()),
		}
	}
}

#[derive(Serialize)]
pub struct SignalResponse {
	pub stdout: String,
	pub stderr: String,
}

pub fn handle_signal(signal: RpcSignal) -> SignalResult<SignalResponse> {
	match signal {
		RpcSignal::Middle(c) => handle_middle(c),
		RpcSignal::Right(c) => handle_right(c),
	}
}

pub fn handle_middle(click: Click) -> SignalResult<SignalResponse> {
	// TODO let specify default shell

	let input = match click.selected {
		Some(selection) => format!("echo {} | {}", selection, click.action).to_owned(),
		None => click.action.to_owned(),
	};

	let args = vec!["-c", input.as_str()];

	let output = Command::new("bash")
		.args(args)
		.stdout(Stdio::piped())
		.stderr(Stdio::piped())
		.spawn()?
		.wait_with_output()?;

	Ok(SignalResponse {
		// TODO don't unwrap
		stdout: String::from_utf8(output.stdout).unwrap(),
		stderr: String::from_utf8(output.stderr).unwrap(),
	})
}

pub fn handle_right(click: Click) -> SignalResult<SignalResponse> {
	unimplemented!();
}
