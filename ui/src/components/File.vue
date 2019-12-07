<template>
	<div>
		<Header value="Del Snarf | Look" />
		<Editor />
	</div>
</template>

<script>
import Header from './Header.vue';
import Editor from './Editor.vue';

export default {
	name: 'File',
	components: {
		Header,
		Editor
	}
};
</script>