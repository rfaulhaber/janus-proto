<template>
	<div class="column-container">
		<Header value="New Cut Paste Delcol" v-bind:columnIndex="columnIndex" />
		<div class="files" v-for="(file, index) in files" v-bind:key="index">
			<File v-bind:fileIndex="index" v-bind:value="file.value" v-bind:columnIndex="columnIndex" />
		</div>
	</div>
</template>

<script>
import Header from './Header.vue';
import File from './File';

export default {
	name: 'Tile',
	props: {
		columnIndex: Number
	},
	components: {
		Header,
		File
	},
	computed: {
		files() {
			return this.$store.state.columns[this.columnIndex].files;
		}
	}
};
</script>

<style scoped>
.column-container {
	display: flex;
	flex-flow: column;
	width: 100%;
}
</style>
