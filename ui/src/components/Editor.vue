<template>
	<div ref="editor" class="pane"></div>
</template>

<script>
import { mapActions } from 'vuex';
import * as CodeMirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/addon/display/fullscreen.css';
import 'codemirror/addon/display/fullscreen.js';

export default {
	name: 'Editor',
	props: {
		text: String
	},
	mounted() {
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
				selection
			});
		};

		const editor = CodeMirror(this.$refs.editor, {
			value: this.text,
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
.pane > div {
	background: rgb(255, 255, 234);
}

.editor {
	height: 100%;
}
</style>
