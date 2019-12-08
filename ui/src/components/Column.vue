<template>
	<div class="column">
		<Header value="New Cut Paste Snarf Sort Zerox Delcol" />
		<File />
	</div>
</template>

<script>
import { mapState } from 'vuex';
import Header from './Header.vue';
import File from './File';

export default {
	name: 'Tile',
	props: {
		index: Number
	},
	components: {
		Header,
		File
	},
	computed: mapState({
		files: 'columns'
	})
};
</script>

<style scoped>
.column {
	border-left: 1px solid black;
	border-right: 1px solid black;
}
</style>
