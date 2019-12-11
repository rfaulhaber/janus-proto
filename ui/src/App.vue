<template>
	<div id="app">
		<Header value="Newcol Exit" />
		<Columns />
	</div>
</template>

<script>
import Columns from './components/Columns.vue';
import Header from './components/Header.vue';

export default {
	name: 'app',
	components: {
		Columns,
		Header
	}
};
</script>

<style>
.app {
	height: 100%;
}
</style>
