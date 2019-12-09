use core::editor::Editor;
use std::io;
use std::process;

fn main() {
	let stdin = io::stdin();
	let mut stdout = io::stdout();
	let mut in_lock = stdin.lock();

	let mut e = Editor::default();

	match e.main_loop(&mut in_lock, &mut stdout) {
		Ok(_) => (),
		Err(err) => {
			eprintln!("received error: {:?}", err);
			process::exit(1);
		}
	}
}
