<template>
	<div ref="editor" class="menu"></div>
</template>

<script>
import { mapActions } from 'vuex';
import * as CodeMirror from 'codemirror';
import 'codemirror/lib/codemirror.css';

export default {
	name: 'Editor',
	props: {
		value: String,
		columnIndex: Number,
		fileIndex: Number
	},
	mounted() {
		console.log('column, file', this.columnIndex, this.fileIndex);
		const state = {
			middleClick: false
		};

		const handleClick = click => editor => {
			const { word } = getClickedWord(editor);
			const selection = editor.getSelection();
			console.log('word', word);
			console.log('selection', selection);

			this.emit({
				click,
				word,
				selection,
				fileIndex: this.fileIndex,
				columnIndex: this.columnIndex
			});
		};

		const editor = CodeMirror(this.$refs.editor, {
			value: this.value,
			extraKeys: {
				RightClick: handleClick('right'),
				'Alt-LeftClick': handleClick('middle'),
				'Cmd-LeftClick': handleClick('right'),
				MiddleClick: handleClick('middle')
			},
			cursorBlinkRate: 0
		});

		editor.on('beforeChange', function(inst, changeObj) {
			if (state.middleClick) {
				state.middleClick = false;

				changeObj.cancel();
			}
		});

		function getClickedWord(editor) {
			const range = editor.findWordAt(editor.getCursor());
			const word = editor.getRange(range.anchor, range.head);

			console.log('range', range);
			console.log('word', word);

			return {
				word,
				range
			};
		}
	},
	methods: {
		...mapActions(['emit'])
	}
};
</script>

<style>
.menu > div {
	height: auto;
	background: rgb(234, 255, 255);
}

.menu {
	border: 1px solid black;
}
</style>
