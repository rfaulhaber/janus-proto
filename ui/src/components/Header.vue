<template>
	<div ref="editor" class="menu" rows="1"></div>
</template>

<script>
import * as CodeMirror from 'codemirror';
import 'codemirror/lib/codemirror.css';

export default {
	name: 'Editor',
	props: {
		value: String
	},
	mounted: function() {
		CodeMirror(this.$refs.editor, {
			value: this.value
		});

		// this.$refs.editor.style.height = 'auto';
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
