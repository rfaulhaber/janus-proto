<template>
	<div id="app">
		<Header value="Newcol Kill Putall Dump Exit" />
		<Columns />
	</div>
</template>

<script>
import Columns from './components/Columns.vue';
import Header from './components/Header.vue';
import { ipcRenderer } from 'electron';

console.log(typeof ipcRenderer);

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
