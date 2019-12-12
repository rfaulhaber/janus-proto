import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import { ipcRenderer } from 'electron';

Vue.use(Vuex);

console.log('typeof env', typeof process);

const defaultState = {
	columns: [
		{
			files: [
				{
					id: new Date().getTime(),
					// TODO rename to path!
					title: require('os').homedir(),
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
		addFileFromCore(state, { stdout, stderr, path }) {
			console.log('addFileFromCore - path', path);
			state.columns[state.columns.length - 1].files.push({
				value: (stdout || '').concat(stderr || ''),
				title: path || '',
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
		},
		insertResultToEditor(state, { fileIndex, columnIndex, stdout }) {
			console.log(
				'inserting result to editor: ',
				fileIndex,
				columnIndex,
				stdout
			);
			const value = state.columns[columnIndex].files[fileIndex].value;

			state.columns[columnIndex].files[fileIndex].value = value.concat(
				stdout
			);
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
						fileIndex,
						columnIndex,
						...transformedCommand
					});

					ipcRenderer.send('ipc', transformedCommand);
				}
			}
		},
		addColumn({ commit }) {
			commit('addColumn');
		},
		addFileFromCore({ commit }, obj) {
			commit('addFileFromCore', obj);
		},
		addFileFromEditor({ commit }, fileIndex, columnIndex) {
			commit('addFileFromEditor', fileIndex, columnIndex);
		},
		insertResultToEditor({ commit }, { stdout, stderr, ...rest }) {
			commit('insertResultToEditor', { stdout, stderr, ...rest });
			if (stderr) {
				commit('addFileFromCore', { stderr });
			}
		}
	}
});

ipcRenderer.on('ipc', (event, arg) => {
	console.log('event, arg', event, arg);
	const { stdout, stderr } = arg;

	const lastEvent = pendingActions[arg.id];
	console.log('lastEvent', lastEvent);
	console.log(pendingActions);

	const { path, fileIndex, columnIndex } = lastEvent;

	switch (lastEvent.redirectionType) {
		case '>':
			break;
		case '<':
		case '|':
			store.dispatch('insertResultToEditor', {
				stdout,
				stderr,
				fileIndex,
				columnIndex
			});
			break;
		default:
			store.dispatch('addFileFromCore', { stdout, stderr, path });
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
		action = word.trim() || null;
	}

	let selected;
	if (!!selection && isRedirection(selection)) {
		redirectionType = selection[0];
		selected = selection.slice(1);
	} else {
		selected = (selection && selection.trim()) || null;
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
