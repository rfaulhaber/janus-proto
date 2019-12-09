use serde::{Deserialize, Serialize};
use std::error::Error;
use std::process::{Command, Stdio};

#[derive(Debug, Deserialize)]
pub struct RpcSignal<'e> {
	pub click: Click,
	pub term: &'e str,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum Click {
	Middle,
	Right,
}

pub type SignalResult<'e, T> = Result<T, RpcError>;

// TODO better errors
#[derive(Debug, Serialize)]
pub struct RpcError {
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
	unimplemented!();
}

pub fn handle_middle(input: &str) -> SignalResult<SignalResponse> {
	// TODO let specify default shell

	let cmd = vec!["-c", input];

	let output = Command::new("bash")
		.args(cmd)
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

pub fn handle_right(input: &str) -> SignalResult<SignalResponse> {
	unimplemented!();
}
