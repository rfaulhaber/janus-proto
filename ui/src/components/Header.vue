<template>
	<div ref="editor" class="menu"></div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex';
import * as CodeMirror from 'codemirror';
import 'codemirror/lib/codemirror.css';

let editor;

export default {
	name: 'Editor',
	props: {
		value: String,
		columnIndex: Number,
		fileIndex: Number,
		title: String
	},
	watch: {
		text(val) {
			console.log('setting value', val);
			editor.setValue(val);
		}
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
				selection,
				fileIndex: this.fileIndex,
				columnIndex: this.columnIndex
			});
		};

		console.log('title', this.title);
		const headerTitle = this.title
			? `${this.title} ${this.value}`
			: this.value;

		editor = CodeMirror(this.$refs.editor, {
			value: headerTitle,
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

			if (origin === '+input') {
				changeObj.cancel();

				this.updateText({
					fileIndex: this.fileIndex,
					columnIndex: this.columnIndex,
					newValue: inst.getValue().concat(changeObj.text[0])
				});
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
		...mapActions(['emit']),
		...mapMutations(['updateText'])
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
