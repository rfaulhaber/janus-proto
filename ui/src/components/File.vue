<template>
	<div class="file-container">
		<Header value="Del Put" v-bind:columnIndex="columnIndex" v-bind:fileIndex="fileIndex" />
		<Editor v-bind:text="value" v-bind:columnIndex="columnIndex" v-bind:fileIndex="fileIndex" />
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