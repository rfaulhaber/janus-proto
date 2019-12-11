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
					value: ''
				}
			]
		}
	]
};

const pendingActions = [];

const editorCommands = ['New', 'Del', 'Newcol', 'Delcol'];

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
		addFileFromCore(state, stdout, stderr) {
			console.log('stdout, stderr', stdout, stderr);
			state.columns[state.columns.length - 1].files.push({
				value: (stdout || '').concat(stderr || '')
			});
		},
		addFileFromEditor(state, { fileIndex, columnIndex }) {
			console.log('fileIndex, columnIndex', fileIndex, columnIndex);
			state.columns[columnIndex].files.push({
				value: ''
			});
		},
		closeFile(state, { fileIndex, columnIndex }) {
			console.log(
				'closeFile -- fileIndex, columnIndex',
				fileIndex,
				columnIndex
			);

			state.columns[columnIndex].files.splice(fileIndex, 1);
		}
	},
	actions: {
		emit({ commit }, command) {
			console.log('in store', command);

			if (editorCommands.includes(command.word)) {
				console.log('editor command!');

				const { fileIndex, columnIndex } = command;

				switch (command.word) {
					case 'New':
						commit('addFileFromEditor', { fileIndex, columnIndex });
						break;
					case 'Del':
						commit('closeFile', { fileIndex, columnIndex });
						break;
				}
			} else {
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
			}
		},
		addColumn({ commit }) {
			commit('addColumn');
		},
		addFileFromCore({ commit }, stdout, stderr) {
			commit('addFileFromCore', stdout, stderr);
		},
		addFileFromEditor({ commit }, fileIndex, columnIndex) {
			commit('addFileFromEditor', fileIndex, columnIndex);
		}
	}
});

ipcRenderer.on('ipc', (event, arg) => {
	console.log('event, arg', event, arg);
	const { stdout, stderr } = arg;

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
			store.dispatch('addFileFromCore', stdout || '', stderr || '');
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
