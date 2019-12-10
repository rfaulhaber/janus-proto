<template>
	<div class="file-container">
		<Header value="Del Put" />
		<Editor />
	</div>
</template>

<script>
import Header from './Header.vue';
import Editor from './Editor.vue';

export default {
	name: 'File',
	props: {
		index: Number
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