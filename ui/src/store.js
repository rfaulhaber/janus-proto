import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import { ipcRenderer } from 'electron';

Vue.use(Vuex);

const defaultState = {
	columns: [
		{
			files: [
				{
					id: new Date().getTime(),
					// TODO rename to path!
					title: '/Users/rfaulhaber',
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
				file: [
					{
						title: '',
						value: ''
					}
				]
			});
		},
		removeColumn(state, id) {
			state.columns = state.columns.filter(column => column.id !== id);
		},
		addFileFromCore(state, { stdout, stderr }) {
			console.log('stdout, stderr', stdout, stderr);
			state.columns[state.columns.length - 1].files.push({
				value: (stdout || '').concat(stderr || ''),
				title: '+Errors',
				id: new Date().getTime()
			});
		},
		addFileFromEditor(state, { columnIndex }) {
			state.columns[columnIndex].files.push({
				value: '',
				title: '',
				id: new Date().getTime()
			});
		},
		closeFile(state, { fileIndex, columnIndex }) {
			state.columns[columnIndex].files.splice(fileIndex, 1);
		},
		updateText(state, { fileIndex, columnIndex, newValue }) {
			console.log('updating text: ', fileIndex, columnIndex, newValue);
			state.columns[columnIndex].files[fileIndex].value = newValue;
		}
	},
	actions: {
		emit({ commit, state }, command) {
			console.log('in store', command);

			const { fileIndex, columnIndex } = command;

			if (
				editorCommands.includes(command.word) &&
				command.click === 'middle'
			) {
				console.log('editor command!');

				switch (command.word) {
					case 'New':
						commit('addFileFromEditor', { fileIndex, columnIndex });
						break;
					case 'Del':
						commit('closeFile', { fileIndex, columnIndex });
						break;
				}
			} else {
				if (!editorCommands.includes(command.word)) {
					const { redirectionType, ...rest } = transformCommand(
						command
					);

					const transformedCommand = {
						kind: rest,
						id: pendingActions.length,
						path: state.columns[columnIndex].files[fileIndex].title
					};

					pendingActions.push({
						redirectionType,
						...transformedCommand
					});

					ipcRenderer.send('ipc', transformedCommand);
				}
			}
		},
		addColumn({ commit }) {
			commit('addColumn');
		},
		addFileFromCore({ commit }, { stdout, stderr }) {
			commit('addFileFromCore', { stdout, stderr });
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
			store.dispatch('addFileFromCore', { stdout, stderr });
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
