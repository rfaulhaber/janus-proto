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