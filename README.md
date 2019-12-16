# janus-proto

A text editor based on the Acme editor from Plan 9.
This was built as part of a 10-day hackathon. It's hardly feature-complete
and is very buggy and hacky! Please forgive my garbage code.

## Motivation

The Acme editor even today feels innovative. Rather than being limited by the
functionality any IDE provides, Acme uses the programs that are already on your
system to provide those features. Rather than have a built in "find and
replace" feature for a selection of text, you could just as easily highlight
a segment of text and pipe it through `sed`, and replace the selection with the
output of the text.

If you haven't seen it, [A Tour of Acme](https://www.youtube.com/watch?v=dP1xVpM
Pn8M)
is well worth watching.

Aside for just fun, I wanted to clone Acme because I feel like it needs a
slight upgrade.  I felt that the design of the
[Xi editor](https://github.com/xi-editor/xi-editor) was worthwhile because it
allowed the editor to decouple the functionality of the editor with the UI,
hopefully allowing for a faster editing experience.

## Design

This repo contains code for a Vue app hosted in Electron and a Rust application.

The Vue app handles all the UI interaction, for better or worse. There aren't
many components, just a few editors of different kinds. The Vue app also uses
CodeMirror to provide text editing. I included this with the hope that it'd
make implementing syntax highlighting easier, however I think if I were to
make a more serious effort in making a real text editor, I'd probably use
WebGL (this seems to be how Atom and VSCode work).

The Electron application communicates with a child process written in Rust
which actually runs terminal commands. Although the Electron application itself
could do this, I wanted to write a Rust process to handle a future FUSE
implementation (there didn't seem to be a great way to do this in Node, and if
I was going to have to write a FUSE module for Node, I'd rather just generate
C bindings in Rust and do it that way).