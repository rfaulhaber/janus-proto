<template>
	<div class="file-container">
		<Header
			value="Del Put"
			v-bind:columnIndex="columnIndex"
			v-bind:fileIndex="fileIndex"
			v-bind:title="fileTitle"
		/>
		<Editor
			v-bind:text="fileText"
			v-bind:columnIndex="columnIndex"
			v-bind:fileIndex="fileIndex"
		/>
	</div>
</template>

<script>
import Header from './Header.vue';
import Editor from './Editor.vue';

export default {
	name: 'File',
	props: {
		columnIndex: Number,
		fileIndex: Number,
		value: String
	},
	components: {
		Header,
		Editor
	},
	computed: {
		file() {
			return this.$store.state.columns[this.columnIndex].files[
				this.fileIndex
			];
		},
		fileText() {
			return this.file.value;
		},
		fileTitle() {
			return this.file.title;
		}
	}
};
</script>

<style scoped>
.file-container {
	border-left: 1px solid black;
	border-bottom: 1px solid black;
	border-right: 1px solid black;
}
</style>
