import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import { ipcRenderer } from 'electron';

Vue.use(Vuex);

const defaultNewFile = {
	name: ''
};

const defaultState = {
	columns: [
		{
			id: 1,
			files: [defaultNewFile]
		}
	]
};

const store = new Store({
	state: defaultState,
	mutations: {
		addColumn(state) {
			state.columns.push({
				id: state.columns.length,
				file: [defaultNewFile]
			});
		},
		removeColumn(state, id) {
			state.columns = state.columns.filter(column => column.id !== id);
		}
	},
	actions: {
		/*eslint no-unused-vars: "off"*/
		emit({ commit }, command) {
			console.log('in store');
			ipcRenderer.send('ipc', command);
		},
		addColumn({ commit }) {
			commit('addColumn');
		}
	}
});

ipcRenderer.on('ipc', (event, arg) => {
	console.log('event, arg', event, arg);
});

export default store;
