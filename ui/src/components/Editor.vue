<template>
	<div ref="editor" class="pane"></div>
</template>

<script>
import * as CodeMirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/addon/display/fullscreen.css';
import 'codemirror/addon/display/fullscreen.js';

export default {
	name: 'Editor',
	props: {
		text: String
	},
	mounted: function() {
		const state = {
			middleClick: false
		};

		const editorElement = this.$refs.editor;
		const editor = CodeMirror(editorElement, {
			value: 'foo',
			extraKeys: {
				RightClick: function() {
					console.log('right click');
				},
				MiddleClick: function() {
					console.log('middle click');
					state.middleClick = true;
				}
			}
		});

		editor.on('mousedown', function() {
			console.log('clicked');
		});

		editor.on('beforeChange', function(inst, changeObj) {
			console.log('e', inst, changeObj);

			if (state.middleClick) {
				state.middleClick = false;

				changeObj.cancel();
			}
		});
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
