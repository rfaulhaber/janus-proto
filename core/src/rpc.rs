use serde::{Deserialize, Serialize};
use std::error::Error;
use std::fs;
use std::path::Path;
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
pub struct RpcSignal {
	pub kind: RpcSignalKind,
	pub id: usize,
	pub path: Option<String>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "lowercase")]
#[serde(tag = "type")]
pub enum RpcSignalKind {
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
	pub id: usize,
}

pub fn handle_signal(signal: RpcSignal) -> SignalResult<SignalResponse> {
	match signal.kind {
		RpcSignalKind::Middle(c) => handle_middle(c, signal.id),
		RpcSignalKind::Right(c) => handle_right(c, signal.id, signal.path),
	}
}

pub fn handle_middle(click: Click, id: usize) -> SignalResult<SignalResponse> {
	// TODO let specify default shell

	let input = match click.selected {
		Some(sel) => sel,
		None => click.action,
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
		id,
		stdout: String::from_utf8(output.stdout).unwrap(),
		stderr: String::from_utf8(output.stderr).unwrap(),
	})
}

// TODO this function signature is bad
pub fn handle_right(
	click: Click,
	id: usize,
	prefix: Option<String>,
) -> SignalResult<SignalResponse> {
	let path = match click.selected {
		Some(sel) => sel,
		None => click.action,
	};

	let normalized_path = if path.starts_with("/") {
		let current_dir = std::env::current_dir().unwrap();
		let current_dir_str = current_dir.to_str().unwrap();

		path.replace("./", current_dir_str)
	} else {
		match prefix {
			Some(s) => format!("{}/{}", s, path),
			None => {
				let current_dir = std::env::current_dir().unwrap();
				let current_dir_str = current_dir.to_str().unwrap();

				path.replace("./", current_dir_str)
			}
		}
	};

	let metadata_res = fs::metadata(Path::new(normalized_path.trim()));

	match metadata_res {
		Ok(metadata) => {
			if metadata.is_dir() {
				// sure why not
				let ls_output = Command::new("ls")
					.args(&["-a", normalized_path.as_str()])
					.stdout(Stdio::piped())
					.stderr(Stdio::piped())
					.spawn()?
					.wait_with_output()?;

				Ok(SignalResponse {
					id,
					stdout: String::from_utf8(ls_output.stdout).unwrap(),
					stderr: String::from_utf8(ls_output.stderr).unwrap(),
				})
			} else {
				let contents = fs::read_to_string(path)?;

				Ok(SignalResponse {
					id,
					stdout: contents,
					stderr: String::new(),
				})
			}
		}
		Err(e) => Ok(SignalResponse {
			id,
			stdout: String::new(),
			stderr: format!("cannot open {}: {}", path, e),
		}),
	}
}
