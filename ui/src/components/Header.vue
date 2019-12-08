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

		const editor = CodeMirror(this.$refs.editor, {
			value: this.value,
			extraKeys: {
				RightClick: function() {
					console.log('right click');

					const { word } = getClickedWord();
					console.log('word', word);
					console.log('selection', editor.getSelection());
				},
				MiddleClick: () => {
					console.log('middle click');
					state.middleClick = true;

					const { word } = getClickedWord();
					console.log('word', word);
					console.log('selection', editor.getSelection());

					this.emit(word);
				}
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

		function getClickedWord() {
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
	border-top: 1px solid black;
	border-bottom: 1px solid black;
	background: rgb(234, 255, 255);
}
</style>
