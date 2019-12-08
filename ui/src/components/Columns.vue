<template>
	<div class="columns">
		<div class="column" v-for="column in columns" v-bind:key="column.id">
			<Column v-bind:index="column.id" />
		</div>
	</div>
</template>

<script>
import { mapState } from 'vuex';
import Column from './Column.vue';

export default {
	name: 'Columns',
	components: {
		Column
	},
	computed: mapState({
		columns: 'columns'
	})
};
</script>

<style>
.columns {
	display: grid;
	columns: auto;
	grid-auto-flow: column;
	grid-auto-columns: auto;
}
</style>