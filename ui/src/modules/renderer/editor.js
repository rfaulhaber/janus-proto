export const handleClick = click => editor => {
	console.log('this', this);
	console.log('which', click);

	const { word } = getClickedWord(editor);
	const selection = editor.getSelection();
	console.log('word', word);
	console.log('selection', selection);

	let term;

	if (selection) {
		term = selection;
	} else {
		term = word;
	}

	this.emit({
		click,
		term
	});
};

function getClickedWord(editor) {
	const range = editor.findWordAt(editor.getCursor());
	const word = editor.getRange(range.anchor, range.head);

	return {
		word,
		range
	};
}
