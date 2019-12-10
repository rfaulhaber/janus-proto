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
			files: [
				{
					value: 'default text'
				}
			]
		}
	]
};

const pendingActions = [];

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
		},
		addFile(state, stdout, stderr) {
			console.log('stdout, stderr', stdout, stderr);
			state.columns[state.columns.length - 1].files.push({
				value: (stdout || '').concat(stderr || '')
			});
		}
	},
	actions: {
		/*eslint no-unused-vars: "off"*/
		emit({ commit }, command) {
			console.log('in store', command);

			const { redirectionType, ...rest } = transformCommand(command);

			const transformedCommand = {
				kind: rest,
				id: pendingActions.length
			};

			pendingActions.push({
				redirectionType,
				...transformedCommand
			});

			ipcRenderer.send('ipc', transformedCommand);
		},
		addColumn({ commit }) {
			commit('addColumn');
		},
		addFile({ commit }, stdout, stderr) {
			commit('addFile', stdout, stderr);
		}
	}
});

ipcRenderer.on('ipc', (event, arg) => {
	console.log('event, arg', event, arg);
	const { stdout, stderr, id } = arg;

	const lastEvent = pendingActions[arg.id];
	console.log('lastEvent', lastEvent);
	console.log(pendingActions);

	switch (lastEvent.redirectionType) {
		case '<':
			break;
		case '>':
			break;
		case '|':
			break;
		default:
			store.dispatch('addFile', stdout || '', stderr || '');
	}
});

export default store;

function transformCommand(command) {
	const { click, word, selection } = command;

	let redirectionType = null;
	let action;

	if (isRedirection(word)) {
		redirectionType = word[0];
		action = word.slice(1);
	} else {
		action = word;
	}

	let selected;
	if (!!selection && isRedirection(selection)) {
		redirectionType = selection[0];
		selected = selection.slice(1);
	} else {
		selected = selection || null;
	}

	return {
		type: click,
		action,
		selected,
		redirectionType
	};
}

function isRedirection(command) {
	const first = command[0];
	return first === '|' || first === '<' || first === '>';
}
