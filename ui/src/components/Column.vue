<template>
	<div class="column-container">
		<Header value="New Cut Paste Delcol" />
		<div class="files" v-for="(file, index) in files" v-bind:key="index">
			<File v-bind:index="index" />
		</div>
	</div>
</template>

<script>
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
	computed: {
		files() {
			return this.$store.state.columns[this.index].files;
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
