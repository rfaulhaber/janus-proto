<template>
	<div class="columns">
		<div class="column-iter" v-for="(column, index) in columns" v-bind:key="index">
			<Column v-bind:index="index" />
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
	display: flex;
	flex-basis: fit-content;
}

.column-iter {
	display: flex;
	flex: 1;
}
</style>