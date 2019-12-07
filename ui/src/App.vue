<template>
	<div id="app">
		<Header value="Newcol Kill Putall Dump Exit" />
		<Column />
	</div>
</template>

<script>
import Column from './components/Column.vue';
import Header from './components/Header.vue';
import { ipcRenderer } from 'electron';

console.log(typeof ipcRenderer);

export default {
	name: 'app',
	components: {
		Column,
		Header
	}
};
</script>

<style>
.app {
	height: 100;
}
</style>
