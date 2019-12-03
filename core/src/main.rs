use std::io::{self, Read, Write};
use std::process;

fn main() {
	println!("ready to read from stdin");

	let stdin = io::stdin();
	let stdout = io::stdout();
	let mut in_lock = stdin.lock();
	let mut out_lock = stdout.lock();

	let mut e = core::Editor;

	match e.main_loop(&mut in_lock, &mut out_lock) {
		Ok(_) => (),
		Err(err) => {
			eprintln!("received error: {:?}", err);
			process::exit(1);
		}
	}
}
