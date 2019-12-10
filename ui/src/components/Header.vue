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
		value: String
	},
	mounted() {
		const state = {
			middleClick: false
		};

		const handleClick = click => editor => {
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

		const editor = CodeMirror(this.$refs.editor, {
			value: this.value,
			extraKeys: {
				RightClick: handleClick('right'),
				'Option-LeftClick': handleClick('middle'),
				'Cmd-LeftClick': handleClick('right'),
				MiddleClick: handleClick('middle')
			}
		});

		editor.on('mousedown', function() {
			console.log('clicked');
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
